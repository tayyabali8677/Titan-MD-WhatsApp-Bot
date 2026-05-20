const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');
const config = require('../config');

/**
 * If SESSION_ID is set, materialize ./session/creds.json before Baileys boots.
 * Accepted formats:
 *   1. `TITAN~<16-hex-id>`       — short ID, fetched from SESSION_SERVER_URL  ← preferred
 *   2. `TITAN~<base64>`          — legacy inline base64
 *   3. `<raw base64 of creds>`   — bare base64 (no prefix)
 *   4. `{"noiseKey":...}`        — raw JSON (no encoding)
 */
async function materializeSession() {
  const sid = String(config.SESSION_ID || '').trim();
  if (!sid) return false;

  const dir = path.join(process.cwd(), 'session');
  const target = path.join(dir, 'creds.json');
  try { fs.mkdirSync(dir, { recursive: true }); } catch (_) {}

  // Skip if creds.json already exists (preserve hot session across restarts)
  if (fs.existsSync(target)) return true;

  // Format 1: short ID — fetch full creds from session server
  if (/^TITAN~[0-9a-f]{16}$/.test(sid)) {
    const id = sid.slice(6);
    const baseUrl = (config.SESSION_SERVER_URL || 'https://titan-md-session.onrender.com').replace(/\/+$/, '');
    const url = `${baseUrl}/api/session/fetch/${id}`;
    console.log('[titan-md] fetching session creds from', url);
    try {
      const res = await fetch(url);
      if (!res.ok) {
        const body = await res.text().catch(() => '');
        console.error('[titan-md] session fetch failed:', res.status, body);
        return false;
      }
      const creds = await res.text();
      try { JSON.parse(creds); }
      catch (e) { console.error('[titan-md] fetched session is not valid JSON:', e.message); return false; }
      fs.writeFileSync(target, creds, 'utf8');
      console.log('[titan-md] session creds materialized → ./session/creds.json');
      return true;
    } catch (e) {
      console.error('[titan-md] session fetch error:', e.message);
      return false;
    }
  }

  // Formats 2-4: inline payload
  let payload = sid;
  if (sid.startsWith('TITAN~')) payload = sid.slice(6);

  let creds;
  if (payload.trim().startsWith('{')) {
    creds = payload;
  } else {
    try { creds = Buffer.from(payload, 'base64').toString('utf8'); }
    catch (e) { console.error('[titan-md] SESSION_ID base64 decode failed:', e.message); return false; }
  }
  try { JSON.parse(creds); }
  catch (e) { console.error('[titan-md] SESSION_ID is not valid JSON creds:', e.message); return false; }

  fs.writeFileSync(target, creds, 'utf8');
  console.log('[titan-md] SESSION_ID decoded → ./session/creds.json');
  return true;
}

class MockSocket extends EventEmitter {
  constructor() {
    super();
    this.user = { id: 'mock@s.whatsapp.net', name: 'TitanMockUser' };
    this.sent = [];
  }
  async sendMessage(jid, content) {
    const out = { jid, content, ts: Date.now() };
    this.sent.push(out);
    this.emit('outbound', out);
    return out;
  }
  async groupMetadata(jid) {
    return { id: jid, subject: 'Mock Group', participants: [
      { id: 'mock@s.whatsapp.net', admin: 'admin' },
      { id: 'other@s.whatsapp.net', admin: null },
    ]};
  }
  async groupParticipantsUpdate(jid, ids, action) {
    return ids.map((id) => ({ status: '200', jid: id, action }));
  }
  async end() { this.emit('end'); }
  /** Simulate an inbound message in mock mode. */
  inject(text, opts = {}) {
    const msg = {
      jid: opts.jid || 'mock@s.whatsapp.net',
      from: opts.jid || 'mock@s.whatsapp.net',
      body: text,
      text,
      pushName: opts.pushName || 'MockUser',
      fromMe: opts.fromMe || false,
      id: 'MOCKID-' + Date.now(),
      key: { remoteJid: opts.jid || 'mock@s.whatsapp.net', id: 'MOCKID-' + Date.now(), fromMe: false },
    };
    this.emit('message', msg);
    return msg;
  }
}

async function createConnection() {
  if (config.MOCK_MODE || !config.SESSION_ID) {
    console.log('[titan-md] Starting in MOCK MODE (no SESSION_ID).');
    return new MockSocket();
  }
  // Decode SESSION_ID env into ./session/creds.json if not already there.
  // Short-form SESSION_IDs do a network fetch, so we await.
  await materializeSession();
  // Real connection path
  const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
  const { state, saveCreds } = await useMultiFileAuthState('./session');
  const sock = makeWASocket({ auth: state, printQRInTerminal: true });

  // Baileys sock has its own `.ev` EventEmitter but NOT `.on` / `.emit` directly.
  // Inject a thin EventEmitter facade so client.js's `sock.on('message', ...)` works
  // identically across MockSocket and real Baileys.
  const emitter = new EventEmitter();
  sock.on = emitter.on.bind(emitter);
  sock.off = emitter.off.bind(emitter);
  sock.once = emitter.once.bind(emitter);
  sock.emit = emitter.emit.bind(emitter);

  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('connection.update', (update) => {
    if (update.connection === 'open') console.log('[titan-md] WhatsApp connected.');
    if (update.connection === 'close') console.log('[titan-md] WhatsApp disconnected.');
  });

  // Bridge baileys message events into our normalized 'message' event.
  sock.ev.on('messages.upsert', ({ messages, type }) => {
    if (type !== 'notify' && type !== 'append') return;
    for (const m of messages) {
      if (!m.message) continue;
      const text =
        m.message.conversation
        || m.message.extendedTextMessage?.text
        || m.message.imageMessage?.caption
        || m.message.videoMessage?.caption
        || '';
      sock.emit('message', {
        jid: m.key.remoteJid,
        from: m.key.remoteJid,
        sender: m.key.participant || m.key.remoteJid,
        body: text,
        text,
        pushName: m.pushName,
        fromMe: m.key.fromMe,
        id: m.key.id,
        key: m.key,
      });
    }
  });

  // end() that closes the underlying Baileys connection
  if (!sock.end) {
    sock.end = async () => {
      try { sock.ws && sock.ws.close && sock.ws.close(); } catch (_) {}
    };
  }
  return sock;
}

module.exports = { createConnection, MockSocket };
