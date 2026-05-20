const os = require('os');
const config = require('../config');

async function handleError(err, ctx = {}) {
  const text = [
    '```',
    `╭══ TITAN MD ERROR ══⊷`,
    `│ Version  : ${config.VERSION}`,
    `│ Message  : ${ctx.message || ''}`,
    `│ Error    : ${err && err.message ? err.message : String(err)}`,
    `│ JID      : ${ctx.jid || ''}`,
    `│ Command  : ${ctx.command || ''}`,
    `│ Platform : ${os.platform()}`,
    `╰══════════════════⊷`,
    '```',
  ].join('\n');
  if (ctx.reply) {
    try { await ctx.reply(text); } catch {}
  }
  console.error('[titan-md error]', err);
  return text;
}

module.exports = { handleError };
