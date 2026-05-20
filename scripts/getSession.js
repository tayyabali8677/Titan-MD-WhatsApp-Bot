/**
 * Generate a SESSION_ID for Titan MD.
 *
 * Usage:
 *   node scripts/getSession.js                    # default: shows QR code in terminal
 *   node scripts/getSession.js --pair 923001234567  # pairing code mode (8-char code)
 *
 * The script runs Baileys, lets you authenticate, and prints a SESSION_ID
 * (base64-encoded creds) that you paste into your deploy target's env var.
 */
const fs = require('fs');
const path = require('path');

const SESSION_DIR = path.join(process.cwd(), 'session-tmp');

(async () => {
  const args = process.argv.slice(2);
  const pairIdx = args.indexOf('--pair');
  const pairNumber = pairIdx >= 0 ? args[pairIdx + 1] : null;

  // Clean any stale tmp session
  try { fs.rmSync(SESSION_DIR, { recursive: true, force: true }); } catch (_) {}
  fs.mkdirSync(SESSION_DIR, { recursive: true });

  let makeWASocket, useMultiFileAuthState, DisconnectReason;
  try {
    ({ default: makeWASocket, useMultiFileAuthState, DisconnectReason } =
      require('@whiskeysockets/baileys'));
  } catch (e) {
    console.error('Run `npm install` first — @whiskeysockets/baileys is missing.');
    process.exit(1);
  }

  const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: !pairNumber,
    browser: ['Titan MD', 'Chrome', '1.0.0'],
  });

  // Pair-code path: request code AFTER socket boots, but BEFORE it's registered
  if (pairNumber) {
    setTimeout(async () => {
      try {
        const code = await sock.requestPairingCode(pairNumber.replace(/\D/g, ''));
        console.log('\n┌──────────────────────────────────────────┐');
        console.log('│   Open WhatsApp → Linked Devices → Link  │');
        console.log('│   a device → Link with phone number      │');
        console.log('│                                          │');
        console.log(`│   Code:  ${code.padEnd(31)}│`);
        console.log('└──────────────────────────────────────────┘\n');
      } catch (e) {
        console.error('Pair-code request failed:', e.message);
        process.exit(1);
      }
    }, 3000);
  } else {
    console.log('Scan the QR above with WhatsApp → Settings → Linked Devices.');
  }

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'open') {
      // Wait a tick for saveCreds to finish, then read & encode
      setTimeout(() => {
        const credsPath = path.join(SESSION_DIR, 'creds.json');
        if (!fs.existsSync(credsPath)) {
          console.error('creds.json not produced — something failed.');
          process.exit(1);
        }
        const json = fs.readFileSync(credsPath, 'utf8');
        const b64 = Buffer.from(json).toString('base64');
        const sessionId = 'TITAN~' + b64;

        console.log('\n════════════════════════════════════════════════════');
        console.log('  ✅ SESSION GENERATED');
        console.log('════════════════════════════════════════════════════\n');
        console.log('Copy the following SESSION_ID into your deploy env:\n');
        console.log(sessionId);
        console.log('\n════════════════════════════════════════════════════');
        console.log(`Length: ${sessionId.length} chars`);
        console.log('Treat this like a password — anyone with it controls the WA account.\n');

        // cleanup
        try { fs.rmSync(SESSION_DIR, { recursive: true, force: true }); } catch (_) {}
        try { sock.ws && sock.ws.close && sock.ws.close(); } catch (_) {}
        process.exit(0);
      }, 500);
    }

    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode;
      if (code === DisconnectReason?.loggedOut) {
        console.error('Logged out before pairing completed. Try again.');
      } else if (code) {
        console.error(`Connection closed (code ${code}). Try again.`);
      }
      // If we never opened, exit so the user can retry
      if (!sock.user) process.exit(1);
    }
  });
})().catch((e) => {
  console.error('Session generator crashed:', e);
  process.exit(1);
});
