const { bot, lang } = require('../lib');
const kv = require('../lib/kv');

const NS = 'customcmd';

bot({ pattern: 'setcmd ?(.*)', desc: lang.plugins.setcmd?.desc || 'Save a custom auto-reply command', type: 'misc' }, async (msg, match) => {
  const raw = (match || '').trim();
  if (!raw.includes('|')) return msg.reply('_Usage: .setcmd <name>|<reply>_');
  const [name, ...rest] = raw.split('|');
  const key = name.trim().toLowerCase();
  const reply = rest.join('|').trim();
  if (!key || !reply) return msg.reply('_Usage: .setcmd <name>|<reply>_');
  await kv.set(NS, key, reply);
  return msg.reply(`_Custom command *${key}* saved ✅_`);
});

async function showCmd(msg, match) {
  const arg = (match || '').trim().toLowerCase();
  if (arg) {
    const v = await kv.get(NS, arg);
    if (!v) return msg.reply(`_No custom command *${arg}*_`);
    return msg.reply(`*${arg}* → ${v}`);
  }
  const all = await kv.all(NS);
  if (!all.length) return msg.reply('_No custom commands set._');
  return msg.reply('*Custom commands:*\n' + all.map((r) => `• ${r.k} → ${r.v}`).join('\n'));
}

bot({ pattern: 'getcmd ?(.*)', desc: lang.plugins.getcmd?.desc || 'List or show custom commands', type: 'misc' }, showCmd);
bot({ pattern: 'listcmd ?(.*)', desc: lang.plugins.listcmd?.desc || 'List custom commands', type: 'misc' }, showCmd);

bot({ pattern: 'delcmd ?(.*)', desc: lang.plugins.delcmd?.desc || 'Delete a custom command', type: 'misc' }, async (msg, match) => {
  const key = (match || '').trim().toLowerCase();
  if (!key) return msg.reply('_Usage: .delcmd <name>_');
  await kv.del(NS, key);
  return msg.reply(`_Custom command *${key}* deleted ✅_`);
});
