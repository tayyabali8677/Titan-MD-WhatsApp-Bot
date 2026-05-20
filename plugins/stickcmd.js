const { bot, lang } = require('../lib');
const kv = require('../lib/kv');
const crypto = require('crypto');

const NS = 'stickcmd';

function stickerHash(rep) {
  if (!rep) return null;
  const id = rep.id || (rep.key && rep.key.id) || rep.fileSha256 || rep.body || JSON.stringify(rep);
  return crypto.createHash('sha1').update(String(id)).digest('hex').slice(0, 16);
}

function isSticker(rep) {
  if (!rep) return false;
  return rep.type === 'sticker' || rep.mtype === 'stickerMessage' || rep.stickerMessage || (rep._type === 'sticker');
}

bot({ pattern: 'stickcmd ?(.*)', desc: lang.plugins.stickcmd?.desc || 'Bind a sticker to a command', type: 'misc' }, async (msg, match) => {
  const cmd = (match || '').trim();
  if (!cmd) return msg.reply('_Usage: .stickcmd <command>  (reply to a sticker)_');
  if (!msg.reply_message) return msg.reply('_Reply to a sticker to bind it._');
  if (!isSticker(msg.reply_message)) return msg.reply('_Replied message is not a sticker._');
  const hash = stickerHash(msg.reply_message);
  if (!hash) return msg.reply('_Could not hash sticker._');
  await kv.set(NS, hash, cmd);
  return msg.reply(`_🔗 Sticker bound to *${cmd}* ✅_`);
});

bot({ pattern: 'unstick', desc: lang.plugins.unstick?.desc || 'Unbind a sticker command', type: 'misc' }, async (msg) => {
  if (!msg.reply_message) return msg.reply('_Reply to a bound sticker._');
  const hash = stickerHash(msg.reply_message);
  const v = await kv.get(NS, hash);
  if (!v) return msg.reply('_This sticker is not bound._');
  await kv.del(NS, hash);
  return msg.reply(`_🗑️ Unbound from *${v}* ✅_`);
});

bot({ pattern: 'getstick', desc: lang.plugins.getstick?.desc || 'List bound stickers', type: 'misc' }, async (msg) => {
  const all = await kv.all(NS);
  if (!all.length) return msg.reply('_No bound stickers._');
  return msg.reply('*🔗 Bound stickers:*\n' + all.map((r) => `• ${r.k.slice(0, 8)}… → ${r.v}`).join('\n'));
});
