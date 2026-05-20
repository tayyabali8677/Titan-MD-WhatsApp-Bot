/**
 * Titan MD session generator — web service.
 *
 * Mirrors scripts/getSession.js as a deployable Express + SSE server.
 * Each visitor gets an isolated tmp session dir; once Baileys reports
 * `connection.open`, the encoded SESSION_ID is streamed back over SSE.
 *
 * Run locally:   npm run web
 * Deploy:        any Node host (Render web service, Koyeb web, Railway, VPS+pm2).
 *
 * Routes:
 *   GET  /                        — UI
 *   POST /api/session/start       — body: {method:'qr'|'pair', phone?:string}
 *                                   returns: {sessionId}
 *   GET  /api/session/:id/events  — SSE stream of status updates
 *   POST /api/session/:id/cancel  — abort an in-progress session
 */
const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = parseInt(process.env.PORT || '3000', 10);
const TMP_ROOT = path.join(__dirname, '.tmp-sessions');
// Long-term storage for completed credsJSON keyed by short ID
// — lets us hand out a short SESSION_ID instead of a 1500-char base64 string.
const STORE_ROOT = path.join(__dirname, '.stored-sessions');
const SESSION_TTL_MS = 5 * 60 * 1000;     // 5 min — abort if not paired
const STORE_TTL_MS = 7 * 24 * 3600 * 1000; // 7 days — keep delivered creds fetchable

try { fs.mkdirSync(TMP_ROOT, { recursive: true }); } catch (_) {}
try { fs.mkdirSync(STORE_ROOT, { recursive: true }); } catch (_) {}

// Periodic GC of expired stored creds
setInterval(() => {
  const cutoff = Date.now() - STORE_TTL_MS;
  try {
    for (const name of fs.readdirSync(STORE_ROOT)) {
      const file = path.join(STORE_ROOT, name);
      try {
        const stat = fs.statSync(file);
        if (stat.mtimeMs < cutoff) fs.unlinkSync(file);
      } catch (_) {}
    }
  } catch (_) {}
}, 60 * 60 * 1000); // hourly

const app = express();
app.use(express.json({ limit: '256kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Pino-shaped no-op logger so Baileys never crashes calling `logger.child(...)`.
function silentLogger() {
  const noop = () => {};
  const lg = {
    level: 'silent',
    trace: noop, debug: noop, info: noop, warn: noop, error: noop, fatal: noop,
    child: () => silentLogger(),
  };
  return lg;
}

// In-memory registry of active pairings.
const sessions = new Map();

function pushEvent(session, payload) {
  for (const res of session.sseClients) {
    try { res.write(`data: ${JSON.stringify(payload)}\n\n`); } catch (_) {}
  }
}

function setStatus(session, status, extra = {}) {
  session.status = status;
  Object.assign(session, extra);
  pushEvent(session, { status, ...extra });
}

async function teardown(session, delayMs = 0) {
  if (session._tornDown) return;
  session._tornDown = true;
  setTimeout(() => {
    try { session.sock && session.sock.ws && session.sock.ws.close(); } catch (_) {}
    try { fs.rmSync(session.tmpDir, { recursive: true, force: true }); } catch (_) {}
    for (const res of session.sseClients) { try { res.end(); } catch (_) {} }
    sessions.delete(session.sessionId);
  }, delayMs);
}

/**
 * Boot (or re-boot) a Baileys socket for a session.
 * Called once on POST /api/session/start, and again every time WA tells us
 * to restart (DisconnectReason.restartRequired = 515 — which fires AFTER a
 * successful pair/QR scan and is the signal that we should re-handshake
 * with the new creds).
 */
async function startSocket(session) {
  const baileys = require('@whiskeysockets/baileys');
  const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, Browsers } = baileys;

  // Fetch current WA Web protocol version. Falls back to baileys default.
  let waVersion;
  try { waVersion = (await fetchLatestBaileysVersion()).version; } catch (_) {}

  const { state, saveCreds } = await useMultiFileAuthState(session.tmpDir);

  const sock = makeWASocket({
    version: waVersion,
    auth: state,
    printQRInTerminal: false,
    browser: Browsers ? Browsers.macOS('Safari') : ['Mac OS', 'Safari', '17.0'],
    logger: silentLogger(),
    markOnlineOnConnect: false,
  });
  session.sock = sock;

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    // QR push
    if (update.qr && session.method === 'qr' && !session.sessionString) {
      setStatus(session, 'qr_ready', { qr: update.qr });
    }

    if (update.connection === 'open') {
      // Success!  Wait for saveCreds to flush, then encode + deliver.
      setTimeout(async () => {
        if (session.status === 'success') return; // guard against duplicate fires
        const credsPath = path.join(session.tmpDir, 'creds.json');
        if (!fs.existsSync(credsPath)) {
          setStatus(session, 'error', { error: 'creds.json was not produced' });
          teardown(session, 1000);
          return;
        }
        const json = fs.readFileSync(credsPath, 'utf8');
        // Save full creds keyed by either the user-chosen custom ID or a
        // random 16-hex ID. SESSION_ID handed back is "TITAN~<id>".
        const shortId = session.customId || crypto.randomBytes(8).toString('hex');
        try { fs.writeFileSync(path.join(STORE_ROOT, shortId + '.json'), json, 'utf8'); }
        catch (e) { console.warn('failed to persist creds:', e.message); }
        const sessionString = 'TITAN~' + shortId;
        setStatus(session, 'success', { sessionString });

        // Best-effort: DM the SESSION_ID to the user's own WA as a backup.
        try {
          const ownerJid = sock?.user?.id;
          if (ownerJid) {
            await sock.sendMessage(ownerJid, {
              text:
                '*⚡ Titan MD — your SESSION_ID*\n\n' +
                'Paste this string into your deploy env var:\n\n' +
                '```' + sessionString + '```\n\n' +
                '⚠️ Treat this like a password — anyone with it controls this WhatsApp account.\n' +
                'Do not share or commit it to git.',
            });
          }
        } catch (_) { /* DM is best-effort */ }

        teardown(session, 30 * 1000);
      }, 1000);
    }

    if (update.connection === 'close') {
      if (session.status === 'success' || session._tornDown) return;

      const code = update.lastDisconnect?.error?.output?.statusCode;
      const reason = update.lastDisconnect?.error?.message || `code ${code}`;

      // 515 (restartRequired) fires AFTER a successful pair/QR scan.
      // Baileys does NOT auto-reconnect on this code — we must re-create the
      // socket using the now-saved creds, which will then fire `connection:open`
      // and complete the flow. THIS is the fix for "QR/pair worked but bot
      // never returned the SESSION_ID".
      if (code === DisconnectReason?.restartRequired) {
        if (session._restartCount >= 3) {
          setStatus(session, 'error', { error: 'Restart loop — aborting.' });
          teardown(session, 1000);
          return;
        }
        session._restartCount = (session._restartCount || 0) + 1;
        // Tell the UI we're finishing up.
        setStatus(session, 'finalizing');
        try { await startSocket(session); } catch (e) {
          setStatus(session, 'error', { error: 'Restart failed: ' + e.message });
          teardown(session, 1000);
        }
        return;
      }

      // Other transient codes — Baileys auto-reconnects, do nothing.
      if (code === DisconnectReason?.connectionClosed ||
          code === DisconnectReason?.connectionLost ||
          code === DisconnectReason?.timedOut) {
        return;
      }

      if (code === DisconnectReason?.loggedOut) {
        setStatus(session, 'error', { error: 'Logged out before pairing completed. Try again.' });
      } else if (code === DisconnectReason?.badSession) {
        setStatus(session, 'error', { error: 'Bad session — please restart pairing.' });
      } else if (code === DisconnectReason?.connectionReplaced) {
        setStatus(session, 'error', { error: 'Another device replaced this session.' });
      } else {
        setStatus(session, 'error', { error: 'Connection closed: ' + reason });
      }
      teardown(session, 1000);
    }
  });

  // Pair-code: only on the first socket boot, only if not already registered.
  if (session.method === 'pair' && !sock.authState?.creds?.registered && !session.pairCode) {
    setTimeout(async () => {
      if (session.status === 'success' || session._tornDown) return;
      if (sock.authState?.creds?.registered) return;
      try {
        const code = await sock.requestPairingCode(session.phone);
        const formatted = code.length === 8 ? `${code.slice(0,4)}-${code.slice(4)}` : code;
        setStatus(session, 'pair_ready', { pairCode: formatted, rawCode: code });
      } catch (e) {
        setStatus(session, 'error', { error: 'Pair-code request failed: ' + e.message });
        teardown(session, 2000);
      }
    }, 3000);
  }

  return sock;
}

// Custom IDs: 3-32 chars, letters/digits/underscore/hyphen. Random IDs: 16 hex.
const CUSTOM_ID_RE = /^[a-zA-Z0-9_-]{3,32}$/;
const FETCH_ID_RE  = /^[a-zA-Z0-9_-]{3,32}$/; // matches both custom + random

app.post('/api/session/start', async (req, res) => {
  const { method, phone, customId } = req.body || {};
  if (method !== 'qr' && method !== 'pair') {
    return res.status(400).json({ error: 'method must be "qr" or "pair"' });
  }
  if (method === 'pair' && !phone) {
    return res.status(400).json({ error: 'phone required for pair method' });
  }

  // Validate + reserve custom ID up-front. If it's already taken, fail fast.
  let storeId = null;
  if (customId !== undefined && customId !== null && customId !== '') {
    if (!CUSTOM_ID_RE.test(String(customId))) {
      return res.status(400).json({ error: 'custom ID must be 3-32 chars: letters, digits, _ or -' });
    }
    const existing = path.join(STORE_ROOT, customId + '.json');
    if (fs.existsSync(existing)) {
      return res.status(409).json({ error: 'that custom ID is already taken — pick a different one' });
    }
    storeId = String(customId);
  }

  try { require('@whiskeysockets/baileys'); }
  catch (e) { return res.status(500).json({ error: 'baileys not installed; run npm install' }); }

  const sessionId = crypto.randomBytes(16).toString('hex');
  const tmpDir = path.join(TMP_ROOT, sessionId);
  fs.mkdirSync(tmpDir, { recursive: true });

  const session = {
    sessionId,
    method,
    phone: phone ? String(phone).replace(/\D/g, '') : null,
    customId: storeId, // null = use random hex id, otherwise the user's chosen name
    sock: null,
    tmpDir,
    sseClients: [],
    status: 'starting',
    qr: null,
    pairCode: null,
    sessionString: null,
    error: null,
    createdAt: Date.now(),
    _restartCount: 0,
    _tornDown: false,
  };
  sessions.set(sessionId, session);

  try { await startSocket(session); }
  catch (e) {
    return res.status(500).json({ error: 'failed to start socket: ' + e.message });
  }

  // TTL — abandon if not paired in 5 min
  setTimeout(() => {
    if (sessions.has(sessionId) && session.status !== 'success') {
      setStatus(session, 'error', { error: 'Pairing timed out (5 min).' });
      teardown(session, 1000);
    }
  }, SESSION_TTL_MS);

  res.json({ sessionId });
});

app.get('/api/session/:id/events', (req, res) => {
  const session = sessions.get(req.params.id);
  if (!session) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'session not found' }));
  }
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.write('\n');
  session.sseClients.push(res);

  res.write(`data: ${JSON.stringify({
    status: session.status,
    qr: session.qr,
    pairCode: session.pairCode,
    sessionString: session.sessionString,
    error: session.error,
  })}\n\n`);

  const hb = setInterval(() => {
    try { res.write(':heartbeat\n\n'); } catch (_) {}
  }, 20000);

  req.on('close', () => {
    clearInterval(hb);
    session.sseClients = session.sseClients.filter((c) => c !== res);
  });
});

app.post('/api/session/:id/cancel', (req, res) => {
  const session = sessions.get(req.params.id);
  if (!session) return res.status(404).json({ error: 'session not found' });
  teardown(session, 100);
  res.json({ ok: true });
});

// Endpoint the bot calls on boot to materialize creds.json from the short ID.
// Accepts either a random hex ID or a user-chosen custom ID.
app.get('/api/session/fetch/:id', (req, res) => {
  const id = String(req.params.id || '');
  if (!FETCH_ID_RE.test(id)) {
    return res.status(400).json({ error: 'invalid id format' });
  }
  const file = path.join(STORE_ROOT, id + '.json');
  if (!fs.existsSync(file)) {
    return res.status(404).json({ error: 'session not found or expired (>7 days old)' });
  }
  try { fs.utimesSync(file, new Date(), new Date()); } catch (_) {}
  res.setHeader('Content-Type', 'application/json');
  res.sendFile(file);
});

app.get('/healthz', (_req, res) => res.json({ ok: true, sessions: sessions.size, uptime: process.uptime() }));

app.listen(PORT, () => {
  console.log(`[titan-md-web] session generator listening on :${PORT}`);
});
