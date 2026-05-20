const { bot, lang } = require('../lib');
const kv = require('../lib/kv');

bot({ pattern: 'antigstatus ?(.*)', desc: lang.plugins.antigstatus.desc, type: 'group', onlyGroup: true }, async (msg, match) => {
  const sub = (match || '').trim().toLowerCase();
  if (sub === 'on')  { await kv.set('antigstatus', msg.jid, { on: true });  return msg.reply(lang.plugins.antigstatus.on); }
  if (sub === 'off') { await kv.set('antigstatus', msg.jid, { on: false }); return msg.reply(lang.plugins.antigstatus.off); }
  const s = await kv.get('antigstatus', msg.jid) || { on: false };
  return msg.reply(`antigstatus: ${s.on ? 'on' : 'off'}`);
});
