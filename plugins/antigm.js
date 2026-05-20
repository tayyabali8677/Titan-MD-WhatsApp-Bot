const { bot, lang } = require('../lib');
const kv = require('../lib/kv');

bot({ pattern: 'antigm ?(.*)', desc: lang.plugins.antigm.desc, type: 'group', onlyGroup: true }, async (msg, match) => {
  const sub = (match || '').trim().toLowerCase();
  if (sub === 'on')  { await kv.set('antigm', msg.jid, { on: true });  return msg.reply(lang.plugins.antigm.on); }
  if (sub === 'off') { await kv.set('antigm', msg.jid, { on: false }); return msg.reply(lang.plugins.antigm.off); }
  const s = await kv.get('antigm', msg.jid) || { on: false };
  return msg.reply(`antigm: ${s.on ? 'on' : 'off'}`);
});
