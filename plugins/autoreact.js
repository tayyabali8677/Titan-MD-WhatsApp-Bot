const { bot, lang } = require('../lib');
const kv = require('../lib/kv');
bot({ pattern: 'autoreact ?(.*)', desc: lang.plugins.autoreact.desc, type: 'utility' }, async (msg, match, ctx) => {
  if (!ctx.isSudo) return msg.reply(lang.plugins.common.sudo_only);
  const sub = (match || '').trim().toLowerCase();
  if (sub === 'on')  { await kv.set('autoreact', 'global', { on: true });  return msg.reply(lang.plugins.autoreact.on); }
  if (sub === 'off') { await kv.set('autoreact', 'global', { on: false }); return msg.reply(lang.plugins.autoreact.off); }
  const s = await kv.get('autoreact', 'global') || { on: false };
  const emojis = ctx.config.REACT_EMOJIS;
  return msg.reply(`autoreact: ${s.on ? 'on' : 'off'}\nEmojis: ${emojis}`);
});
