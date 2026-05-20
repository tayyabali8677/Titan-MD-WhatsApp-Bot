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
const SESSION_TTL_MS = 5 * 60 * 1000; // 5 min — abort if not paired

try { fs.mkdirSync(TMP_ROOT, { recursive: true }); } catch (_) {}

const app = express();
app.use(express.json({ limit: '256kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// In-memory registry of active pairings.
// sessionId -> { sock, status, qr, pairCode, sessionString, error, sseClients[], tmpDir, createdAt }
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
  setTimeout(() => {
    try { session.sock && session.sock.ws && session.sock.ws.close(); } catch (_) {}
    try { fs.rmSync(session.tmpDir, { recursive: true, force: true }); } catch (_) {}
    // close all SSE clients
    for (const res of session.sseClients) { try { res.end(); } catch (_) {} }
    sessions.delete(session.sessionId);
  }, delayMs);
}

app.post('/api/session/start', async (req, res) => {
  const { method, phone } = req.body || {};
  if (method !== 'qr' && method !== 'pair') {
    return res.status(400).json({ error: 'method must be "qr" or "pair"' });
  }
  if (method === 'pair' && !phone) {
    return res.status(400).json({ error: 'phone required for pair method' });
  }

  let baileys;
  try { baileys = require('@whiskeysockets/baileys'); }
  catch (e) { return res.status(500).json({ error: 'baileys not installed; run npm install' }); }
  const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, Browsers } = baileys;

  const sessionId = crypto.randomBytes(16).toString('hex');
  const tmpDir = path.join(TMP_ROOT, sessionId);
  fs.mkdirSync(tmpDir, { recursive: true });

  const { state, saveCreds } = await useMultiFileAuthState(tmpDir);

  // Fetch current WhatsApp Web protocol version — without this, an older
  // hard-coded version triggers "Connection Failure" the moment WA bumps protocol.
  let waVersion;
  try {
    const v = await fetchLatestBaileysVersion();
    waVersion = v.version;
  } catch (_) { /* fall back to baileys default */ }

  // NB: keep this config minimal — extra options (markOnlineOnConnect: false,
  // syncFullHistory: false, custom timeouts) have been observed to interfere
  // with the pair-code handshake. Match the reference impls (Safari fingerprint,
  // defaults for everything else).
  const sock = makeWASocket({
    version: waVersion,
    auth: state,
    printQRInTerminal: false,
    browser: Browsers ? Browsers.macOS('Safari') : ['Mac OS', 'Safari', '17.0'],
    logger: { level: 'silent', child: () => ({ level: 'silent', child: () => ({}), trace(){}, debug(){}, info(){}, warn(){}, error(){}, fatal(){} }), trace(){}, debug(){}, info(){}, warn(){}, error(){}, fatal(){} },
  });

  const session = {
    sessionId,
    method,
    phone: phone ? String(phone).replace(/\D/g, '') : null,
    sock,
    tmpDir,
    sseClients: [],
    status: 'starting',
    qr: null,
    pairCode: null,
    sessionString: null,
    error: null,
    createdAt: Date.now(),
  };
  sessions.set(sessionId, session);

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    if (update.qr && method === 'qr' && !session.sessionString) {
      setStatus(session, 'qr_ready', { qr: update.qr });
    }
    if (update.connection === 'open') {
      // Give saveCreds a moment to flush.
      setTimeout(async () => {
        const credsPath = path.join(tmpDir, 'creds.json');
        if (!fs.existsSync(credsPath)) {
          setStatus(session, 'error', { error: 'creds.json was not produced' });
          teardown(session, 1000);
          return;
        }
        const json = fs.readFileSync(credsPath, 'utf8');
        const b64 = Buffer.from(json).toString('base64');
        const sessionString = 'TITAN~' + b64;
        setStatus(session, 'success', { sessionString });

        // Also DM the SESSION_ID to the user's own WhatsApp number as a backup,
        // so they never lose it even if they close the browser.
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

        teardown(session, 30 * 1000); // 30s grace window
      }, 800);
    }
    if (update.connection === 'close') {
      const code = update.lastDisconnect?.error?.output?.statusCode;
      const reason = update.lastDisconnect?.error?.message || `code ${code}`;
      // If we already succeeded, the close is just the cleanup — ignore.
      if (session.status === 'success') return;

      // Some Baileys disconnect codes are transient — the socket reconnects on
      // its own. Don't bubble those to the user as errors; just keep waiting.
      const transient = new Set([
        DisconnectReason?.connectionClosed,
        DisconnectReason?.connectionLost,
        DisconnectReason?.restartRequired,
        DisconnectReason?.timedOut,
      ].filter(Boolean));
      if (transient.has(code)) {
        // Baileys will reconnect automatically — keep the session alive.
        return;
      }

      if (code === DisconnectReason?.loggedOut) {
        setStatus(session, 'error', { error: 'Logged out before pairing completed. Try again.' });
      } else if (code === DisconnectReason?.badSession) {
        setStatus(session, 'error', { error: 'Bad session — please restart pairing.' });
      } else if (code === DisconnectReason?.connectionReplaced) {
        setStatus(session, 'error', { error: 'Connection replaced — another session took over.' });
      } else {
        setStatus(session, 'error', { error: 'Connection closed: ' + reason });
      }
      teardown(session, 1000);
    }
  });

  if (method === 'pair') {
    // Defer pair-code request until WS handshake finishes. Standard guard:
    // only request if creds aren't already registered.
    setTimeout(async () => {
      if (sessions.get(sessionId)?.status === 'success') return;
      if (sock.authState?.creds?.registered) return; // already paired somehow
      try {
        const code = await sock.requestPairingCode(session.phone);
        // Display with hyphen for readability; the hyphen is purely visual.
        // WhatsApp's "Link with phone number" input accepts the code with or
        // without the hyphen.
        const formatted = code.length === 8 ? `${code.slice(0,4)}-${code.slice(4)}` : code;
        setStatus(session, 'pair_ready', { pairCode: formatted, rawCode: code });
      } catch (e) {
        setStatus(session, 'error', { error: 'Pair-code request failed: ' + e.message });
        teardown(session, 2000);
      }
    }, 3000);
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

  // Send current state immediately
  const snapshot = {
    status: session.status,
    qr: session.qr,
    pairCode: session.pairCode,
    sessionString: session.sessionString,
    error: session.error,
  };
  res.write(`data: ${JSON.stringify(snapshot)}\n\n`);

  // Heartbeat to keep proxies from killing the stream
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

app.get('/healthz', (_req, res) => res.json({ ok: true, sessions: sessions.size, uptime: process.uptime() }));

app.listen(PORT, () => {
  console.log(`[titan-md-web] session generator listening on :${PORT}`);
});
