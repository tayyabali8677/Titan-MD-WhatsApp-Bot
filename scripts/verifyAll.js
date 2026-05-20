/**
 * Command verification harness.
 * Invokes every registered command in mock mode, records reply/error/silent outcomes.
 * Usage: node scripts/verifyAll.js [--verbose] [--filter=regex]
 */
process.env.MOCK_MODE = '1';
process.env.SESSION_ID = '';

const path = require('path');
const config = require('../config');
const { Client, db, loadPlugins, getCommands } = require('../lib');

const VERBOSE = process.argv.includes('--verbose');
const filterArg = process.argv.find((a) => a.startsWith('--filter='));
const FILTER = filterArg ? new RegExp(filterArg.split('=')[1]) : null;

// Sample args by pattern heuristic — keeps stubs satisfied without doing real network calls.
const ARG_HINTS = {
  url: 'https://example.com/test.jpg',
  num: '923001234567',
  amount: '50',
  cmd: 'test reply text',
  text: 'hello world',
};

function sampleArg(name) {
  // Args that look like URL/number/etc get tailored values
  if (/url|link|website|http/i.test(name)) return ARG_HINTS.url;
  if (/num|phone|mobile|jid/i.test(name)) return ARG_HINTS.num;
  if (/amount|coins|money|gold/i.test(name)) return ARG_HINTS.amount;
  // Special-case some commands we know take structured args
  return ARG_HINTS.text;
}

function buildInvocation(name) {
  // Multi-arg style for commands that need them
  const structured = {
    setcmd: 'mycmd|hello world',
    setgreet: 'welcome|Hi $user!',
    setvar: 'PREFIX|.',
    setbio: 'living the dream',
    pick: 'a|b|c',
    fa: '923001234567,923007654321|hello',
    fd: '923001234567|hello',
    transfer: '10',
    give: '10',
    deposit: '10',
    withdraw: '10',
    gamble: '10',
    bank: '',
    pair: '923001234567',
    advsend: '923001234567|hi',
    autoforward: 'on 923001234567@s.whatsapp.net',
    mathgame: '',
    ison: '923001234567',
    age: '01/01/2000',
    countrycode: 'PK',
    pincode: '110001',
    iban: 'PK',
    time: 'Asia/Karachi',
    encode: 'hello',
    decode: 'aGVsbG8=',
    dbinary: '01101000 01100101 01101100 01101100 01101111',
    ebinary: 'hello',
    fliptext: 'hello',
    tiny: 'https://example.com/long/url',
    paste: 'sample content to paste',
    num: '923001234567',
    weather: 'Karachi',
    google: 'titan md',
    wiki: 'Pakistan',
    translate: 'es|hello',
    sudo: 'list',
    setsudo: '923001234567',
    delsudo: '923001234567',
    setwarnlimit: '5',
    setschedule: '* * * * *|test message',
    delschedule: '1',
    mode: 'public',
    language: 'en',
    schedule: 'in 5 minutes test',
    reminder: 'in 5 minutes test',
    note: 'sample note',
    setcookie: 'sample',
    cap: 'new caption',
    capacity: '1',
    rar: 'compress',
    fancy: 'hello',
    yts: 'titan md',
    yta: 'https://youtu.be/dQw4w9WgXcQ',
    ytv: 'https://youtu.be/dQw4w9WgXcQ',
    song: 'never gonna give you up',
    video: 'cat',
    lyrics: 'bohemian rhapsody',
    movie: 'inception',
    spotify: 'never gonna give you up',
    insta: 'https://instagram.com/p/abc',
    ig: 'cristiano',
    tiktok: 'https://tiktok.com/@user/video/123',
    facebook: 'https://facebook.com/video/123',
    twitter: 'https://twitter.com/user/status/123',
    reddit: 'r/cats',
    pinterest: 'https://pinterest.com/pin/123',
    apk: 'whatsapp',
    apksearch: 'instagram',
    modapk: 'spotify',
    gitclone: 'https://github.com/torvalds/linux',
    mediafire: 'https://mediafire.com/?abc',
    gdrive: 'https://drive.google.com/file/d/abc',
    gdirect: 'https://drive.google.com/file/d/abc',
    teleget: 'https://t.me/c/123/45',
    'ringtone': 'titanic',
    autoreply: 'on hi|hello there',
    autoreact: 'on',
    autotyping: 'on',
    react: '🔥',
    poll: 'pizza|pasta|burger',
    vote: 'pizza',
    qr: 'https://example.com',
    img: 'cat',
    photo: 'titan',
    meme: '',
    define: 'serendipity',
    dictionary: 'algorithm',
  };
  return structured[name] !== undefined ? structured[name] : sampleArg(name);
}

async function setup() {
  await config.DATABASE.authenticate();
  await db.init();
  loadPlugins(path.join(__dirname, '..', 'plugins'));
  const bot = new Client();
  await bot.connect();
  return bot;
}

(async () => {
  const bot = await setup();
  const commands = getCommands();
  const cmds = commands.filter((c) => c.name && (!FILTER || FILTER.test(c.name)));

  console.log(`\n[verify] testing ${cmds.length} commands...\n`);

  const prefixChar = config.PREFIX.replace(/[^a-zA-Z0-9.,!]/g, '').slice(0, 1) || '.';
  const results = { ok: [], silent: [], threw: [] };

  // Capture stdout/stderr — Titan MD's error handler writes to console
  const errCapture = [];
  const origConsoleError = console.error;
  console.error = (...args) => { errCapture.push(args.map(String).join(' ')); };

  const origUnhandled = process.listeners('unhandledRejection').slice();
  process.removeAllListeners('unhandledRejection');
  const unhandled = [];
  process.on('unhandledRejection', (err) => { unhandled.push(err); });

  for (const c of cmds) {
    const captured = [];
    const handler = (o) => captured.push(o);
    bot.sock.on('outbound', handler);
    errCapture.length = 0;
    unhandled.length = 0;

    const arg = buildInvocation(c.name);
    const invocation = arg ? `${prefixChar}${c.name} ${arg}` : `${prefixChar}${c.name}`;

    try {
      bot.sock.inject(invocation);
      // give async handlers time to fire
      await new Promise((r) => setImmediate(r));
      await new Promise((r) => setTimeout(r, 30));
    } catch (e) {
      results.threw.push({ name: c.name, err: String(e.message || e), inv: invocation });
      bot.sock.off('outbound', handler);
      continue;
    }
    bot.sock.off('outbound', handler);

    const err = errCapture.find((s) => /error|throw|TypeError|ReferenceError|SyntaxError|Cannot read|undefined is not/i.test(s));
    const rejected = unhandled.length > 0;

    if (err || rejected) {
      results.threw.push({
        name: c.name,
        err: (err || String(unhandled[0])).slice(0, 200),
        inv: invocation,
        replied: captured.length > 0,
      });
    } else if (captured.length === 0) {
      results.silent.push({ name: c.name, inv: invocation });
    } else {
      results.ok.push({ name: c.name, inv: invocation, snippet: (captured[0].content?.text || '').slice(0, 80) });
    }
  }

  console.error = origConsoleError;
  process.removeAllListeners('unhandledRejection');
  origUnhandled.forEach((l) => process.on('unhandledRejection', l));

  console.log(`\n========================================`);
  console.log(`VERIFICATION SUMMARY`);
  console.log(`========================================`);
  console.log(`Total commands tested : ${cmds.length}`);
  console.log(`✅ Replied successfully : ${results.ok.length}`);
  console.log(`⚠️  Silent (no reply)   : ${results.silent.length}`);
  console.log(`❌ Errored             : ${results.threw.length}`);
  console.log(`========================================\n`);

  if (results.threw.length) {
    console.log(`### ERRORS:\n`);
    for (const r of results.threw) {
      console.log(`  .${r.name}  →  ${r.err}`);
      if (VERBOSE) console.log(`    inv: ${r.inv}\n`);
    }
    console.log('');
  }

  if (results.silent.length) {
    console.log(`### SILENT (registered but no reply when fired):\n`);
    for (const r of results.silent) console.log(`  .${r.name}  (sent: ${r.inv})`);
    console.log('');
  }

  if (VERBOSE && results.ok.length) {
    console.log(`### OK SAMPLE (first 20):\n`);
    for (const r of results.ok.slice(0, 20)) {
      console.log(`  .${r.name}  →  ${r.snippet}`);
    }
  }

  process.exit(results.threw.length ? 1 : 0);
})().catch((e) => { console.error('HARNESS CRASH:', e); process.exit(2); });
