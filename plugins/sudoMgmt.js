const { bot, lang } = require('../lib');
const kv = require('../lib/kv');
const config = require('../config');

const NS = 'sudo';
const KEY = 'list';

function normalize(num) {
  const n = String(num).replace(/[^0-9]/g, '');
  if (!n) return null;
  return n.includes('@') ? n : `${n}@s.whatsapp.net`;
}

async function getList() {
  const v = await kv.get(NS, KEY);
  if (Array.isArray(v)) return v;
  // seed from config.SUDO
  const seed = String(config.SUDO || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => (s.includes('@') ? s : `${s}@s.whatsapp.net`));
  return seed;
}

bot({ pattern: 'setsudo ?(.*)', desc: lang.plugins.setsudo?.desc || 'Add a sudo user', type: 'system' }, async (msg, match, ctx) => {
  if (!ctx.isSudo) return msg.reply(lang.extra?.sudo_only || lang.plugins.common.sudo_only);
  const target = normalize(match || (msg.mention && msg.mention[0]) || '');
  if (!target) return msg.reply('_Usage: .setsudo <number>_');
  const list = await getList();
  if (list.includes(target)) return msg.reply(`_${target.split('@')[0]} is already sudo._`);
  list.push(target);
  await kv.set(NS, KEY, list);
  return msg.reply(`_👑 Added *${target.split('@')[0]}* to sudo ✅_`);
});

bot({ pattern: 'getsudo', desc: lang.plugins.getsudo?.desc || 'List sudo users', type: 'system' }, async (msg) => {
  const list = await getList();
  if (!list.length) return msg.reply('_No sudo users set._');
  return msg.reply('*👑 Sudo users:*\n' + list.map((j) => `• ${j.split('@')[0]}`).join('\n'));
});

bot({ pattern: 'delsudo ?(.*)', desc: lang.plugins.delsudo?.desc || 'Remove a sudo user', type: 'system' }, async (msg, match, ctx) => {
  if (!ctx.isSudo) return msg.reply(lang.extra?.sudo_only || lang.plugins.common.sudo_only);
  const target = normalize(match || (msg.mention && msg.mention[0]) || '');
  if (!target) return msg.reply('_Usage: .delsudo <number>_');
  const list = await getList();
  const idx = list.indexOf(target);
  if (idx === -1) return msg.reply(`_${target.split('@')[0]} is not in sudo list._`);
  list.splice(idx, 1);
  await kv.set(NS, KEY, list);
  return msg.reply(`_🗑️ Removed *${target.split('@')[0]}* from sudo ✅_`);
});
