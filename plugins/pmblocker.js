const { bot, lang } = require('../lib');
const kv = require('../lib/kv');
bot({ pattern: 'pmblocker ?(.*)', desc: lang.plugins.pmblocker.desc, type: 'misc' }, async (msg, match, ctx) => {
  if (!ctx.isSudo) return msg.reply(lang.plugins.common.sudo_only);
  const sub = (match || '').trim().toLowerCase();
  if (sub === 'on')  { await kv.set('pmblocker', 'global', { on: true });  return msg.reply(lang.plugins.pmblocker.on); }
  if (sub === 'off') { await kv.set('pmblocker', 'global', { on: false }); return msg.reply(lang.plugins.pmblocker.off); }
  const s = await kv.get('pmblocker', 'global') || { on: false };
  return msg.reply(`pmblocker: ${s.on ? 'on' : 'off'}`);
});
