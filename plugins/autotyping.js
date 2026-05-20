const { bot, lang } = require('../lib');
const kv = require('../lib/kv');
bot({ pattern: 'autotyping ?(.*)', desc: lang.plugins.autotyping.desc, type: 'utility' }, async (msg, match, ctx) => {
  if (!ctx.isSudo) return msg.reply(lang.plugins.common.sudo_only);
  const sub = (match || '').trim().toLowerCase();
  if (sub === 'on')  { await kv.set('autotyping', 'global', { on: true });  return msg.reply(lang.plugins.autotyping.on); }
  if (sub === 'off') { await kv.set('autotyping', 'global', { on: false }); return msg.reply(lang.plugins.autotyping.off); }
  const s = await kv.get('autotyping', 'global') || { on: false };
  return msg.reply(`autotyping: ${s.on ? 'on' : 'off'}`);
});
