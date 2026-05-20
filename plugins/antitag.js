const { bot, lang } = require('../lib');
const kv = require('../lib/kv');
bot({ pattern: 'antitag ?(.*)', desc: lang.plugins.antitag.desc, type: 'group', onlyGroup: true }, async (msg, match) => {
  const sub = (match || '').trim().toLowerCase();
  if (sub === 'on')  { await kv.set('antitag', msg.jid, { on: true });  return msg.reply(lang.plugins.antitag.on); }
  if (sub === 'off') { await kv.set('antitag', msg.jid, { on: false }); return msg.reply(lang.plugins.antitag.off); }
  const s = await kv.get('antitag', msg.jid) || { on: false };
  return msg.reply(`antitag: ${s.on ? 'on' : 'off'}`);
});
