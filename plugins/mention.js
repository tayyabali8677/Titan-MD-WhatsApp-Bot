const { bot, lang } = require('../lib');
const kv = require('../lib/kv');

bot({ pattern: 'mention ?(.*)', desc: lang.plugins.mention.desc, type: 'misc' }, async (msg, match) => {
  const sub = (match || '').trim().split(/\s+/)[0].toLowerCase();
  const state = (await kv.get('mention', msg.jid)) || { on: false, text: 'Hi! I will respond shortly.' };
  if (sub === 'on')  { state.on = true;  await kv.set('mention', msg.jid, state); return msg.reply(lang.plugins.mention.on); }
  if (sub === 'off') { state.on = false; await kv.set('mention', msg.jid, state); return msg.reply(lang.plugins.mention.off); }
  if (sub === 'get') return msg.reply(JSON.stringify(state));
  return msg.reply('Usage: mention <on|off|get>');
});
