const { bot, lang } = require('../lib');
const kv = require('../lib/kv');
bot({ pattern: 'autoread ?(.*)', desc: lang.plugins.autoread.desc, type: 'utility' }, async (msg, match, ctx) => {
  if (!ctx.isSudo) return msg.reply(lang.plugins.common.sudo_only);
  const sub = (match || '').trim().toLowerCase();
  if (sub === 'on')  { await kv.set('autoread', 'global', { on: true });  return msg.reply(lang.plugins.autoread.on); }
  if (sub === 'off') { await kv.set('autoread', 'global', { on: false }); return msg.reply(lang.plugins.autoread.off); }
  const s = await kv.get('autoread', 'global') || { on: false };
  return msg.reply(`autoread: ${s.on ? 'on' : 'off'}`);
});
