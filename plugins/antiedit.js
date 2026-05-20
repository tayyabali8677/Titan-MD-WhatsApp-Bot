const { bot, lang } = require('../lib');
const kv = require('../lib/kv');

bot({ pattern: 'antiedit ?(.*)', desc: lang.plugins.antiedit.desc, type: 'group', onlyGroup: true }, async (msg, match) => {
  const sub = (match || '').trim().toLowerCase();
  if (sub === 'on')  { await kv.set('antiedit', msg.jid, { on: true });  return msg.reply(lang.plugins.antiedit.on); }
  if (sub === 'off') { await kv.set('antiedit', msg.jid, { on: false }); return msg.reply(lang.plugins.antiedit.off); }
  const s = await kv.get('antiedit', msg.jid) || { on: false };
  return msg.reply(`antiedit: ${s.on ? 'on' : 'off'}`);
});
