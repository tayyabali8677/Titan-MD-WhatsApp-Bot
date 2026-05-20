const { bot, lang } = require('../lib');
const kv = require('../lib/kv');

const NS = 'slowmode';

async function handler(msg, match) {
  const arg = (match || '').trim().toLowerCase();
  if (!arg) {
    const cur = await kv.get(NS, msg.jid);
    if (!cur || cur === 'off') return msg.reply('_Slow-mode: *off*_');
    return msg.reply(`_Slow-mode: *${cur}s*_`);
  }
  if (arg === 'off') {
    await kv.del(NS, msg.jid);
    return msg.reply('_Slow-mode: *off* ✅_');
  }
  if (arg === 'on') {
    await kv.set(NS, msg.jid, 5);
    return msg.reply('_Slow-mode: *5s* ✅_');
  }
  const n = parseInt(arg, 10);
  if (!n || n < 1) return msg.reply('_Usage: .slow on/off/<seconds>_');
  await kv.set(NS, msg.jid, n);
  return msg.reply(`_Slow-mode: *${n}s* ✅_`);
}

bot({ pattern: 'slow ?(.*)', desc: lang.plugins.slow?.desc || 'Toggle slow-mode', type: 'group', onlyGroup: true }, handler);
bot({ pattern: 'slowmo ?(.*)', desc: lang.plugins.slowmo?.desc || 'Toggle slow-mode (alias)', type: 'group', onlyGroup: true }, handler);
