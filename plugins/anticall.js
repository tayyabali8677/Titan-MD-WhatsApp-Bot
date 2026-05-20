const { bot, lang } = require('../lib');
const kv = require('../lib/kv');
bot({ pattern: 'anticall ?(.*)', desc: lang.plugins.anticall.desc, type: 'misc' }, async (msg, match, ctx) => {
  if (!ctx.isSudo) return msg.reply(lang.plugins.common.sudo_only);
  const sub = (match || '').trim().toLowerCase();
  if (sub === 'on')  { await kv.set('anticall', 'global', { on: true });  return msg.reply(lang.plugins.anticall.on); }
  if (sub === 'off') { await kv.set('anticall', 'global', { on: false }); return msg.reply(lang.plugins.anticall.off); }
  const s = await kv.get('anticall', 'global') || { on: false };
  return msg.reply(`anticall: ${s.on ? 'on' : 'off'}\nReject message: ${ctx.config.REJECT_MSG}`);
});
