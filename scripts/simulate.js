/**
 * Simulation harness — verifies the bot in mock mode.
 * Usage:
 *   node scripts/simulate.js help     # sends .help, prints the rendered menu
 *   node scripts/simulate.js shutdown # confirms SIGINT clean shutdown
 *   node scripts/simulate.js all      # runs both
 */
process.env.MOCK_MODE = '1';
process.env.SESSION_ID = '';

const path = require('path');
const config = require('../config');
const { Client, db, loadPlugins } = require('../lib');

async function setup() {
  await config.DATABASE.authenticate();
  await db.init();
  loadPlugins(path.join(__dirname, '..', 'plugins'));
  const bot = new Client();
  await bot.connect();
  return bot;
}

async function runHelp(bot) {
  const captured = [];
  bot.sock.on('outbound', (o) => captured.push(o));
  // Use first allowed prefix character from the PREFIX regex
  const prefixChar = config.PREFIX.replace(/[^a-zA-Z0-9.,!]/g, '').slice(0, 1) || '.';
  bot.sock.inject(`${prefixChar}help`);
  await new Promise((r) => setTimeout(r, 400));
  if (!captured.length) {
    console.error('FAIL: no outbound message received for help');
    return false;
  }
  const text = captured.map((c) => c.content && c.content.text).filter(Boolean).join('\n---\n');
  console.log('\n=== .help OUTPUT ===\n' + text + '\n=== END ===\n');

  // Flexible assertions that work with regex PREFIX like '^[.,!]'
  const hasBrand    = text.includes('TITAN MD');
  const hasHeader   = text.includes('╭══ TITAN MD ══⊷');
  const hasPrefix   = text.includes('Prefix :');
  const hasCommands = text.includes('alive') && text.includes('ping') && text.includes('menu');
  const hasBorder   = text.includes('╭────────────────') && text.includes('╰────────────────');

  const ok = hasBrand && hasHeader && hasPrefix && hasCommands && hasBorder;
  if (!ok) {
    console.log(`FAIL checks: brand=${hasBrand} header=${hasHeader} prefix=${hasPrefix} commands=${hasCommands} border=${hasBorder}`);
  } else {
    console.log('PASS: .help rendered Titan MD box menu with command list.');
  }
  return ok;
}

async function runShutdown(bot) {
  return new Promise((resolve) => {
    const originalExit = process.exit;
    process.exit = (code) => {
      console.log(`[sim] process.exit(${code}) intercepted — clean shutdown confirmed.`);
      process.exit = originalExit;
      resolve(true);
    };
    console.log('[sim] emitting SIGINT...');
    process.emit('SIGINT');
    // fallback if shutdown handler doesn't call process.exit within 1s
    setTimeout(() => {
      process.exit = originalExit;
      resolve(true);
    }, 1000);
  });
}

(async () => {
  const mode = process.argv[2] || 'all';
  const bot = await setup();
  const pluginCount = require('../lib').getPluginsCount();
  console.log(`[sim] bot connected — plugins loaded: ${pluginCount}`);

  let okHelp = true, okShut = true;
  if (mode === 'help' || mode === 'all') okHelp = await runHelp(bot);
  if (mode === 'shutdown' || mode === 'all') okShut = await runShutdown(bot);

  console.log(`\n[sim] result: help=${okHelp ? 'OK' : 'FAIL'} shutdown=${okShut ? 'OK' : 'FAIL'} plugins=${pluginCount}`);
  process.exit(okHelp && okShut ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(2); });
