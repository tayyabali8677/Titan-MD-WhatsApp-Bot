const { bot, lang } = require('../lib');
const kv = require('../lib/kv');
const PLATFORMS = ['youtube.com','youtu.be','tiktok.com','instagram.com','twitter.com','facebook.com'];

bot({ pattern: 'autodl ?(.*)', desc: lang.plugins.autodl.desc, type: 'utility' }, async (msg, match, ctx) => {
  if (!ctx.isSudo) return msg.reply(lang.plugins.common.sudo_only);
  const sub = (match || '').trim().toLowerCase();
  if (sub === 'on')  { await kv.set('autodl', 'global', { on: true });  return msg.reply(lang.plugins.autodl.on); }
  if (sub === 'off') { await kv.set('autodl', 'global', { on: false }); return msg.reply(lang.plugins.autodl.off); }
  const s = await kv.get('autodl', 'global') || { on: false };
  return msg.reply(`auto-downloader: ${s.on ? 'on' : 'off'}\nSupported: ${PLATFORMS.join(', ')}`);
});
