const { bot, lang } = require('../lib');
const kv = require('../lib/kv');

bot({ pattern: 'pdm ?(.*)', desc: lang.plugins.pdm.desc, type: 'group', onlyGroup: true }, async (msg, match) => {
  const sub = (match || '').trim().toLowerCase();
  if (sub === 'on')  { await kv.set('pdm', msg.jid, { on: true });  return msg.reply(lang.plugins.pdm.on); }
  if (sub === 'off') { await kv.set('pdm', msg.jid, { on: false }); return msg.reply(lang.plugins.pdm.off); }
  const state = await kv.get('pdm', msg.jid) || { on: false };
  return msg.reply(`pdm: ${state.on ? 'on' : 'off'}`);
});
