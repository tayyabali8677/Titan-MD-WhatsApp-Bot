const { bot, lang } = require('../lib');
const kv = require('../lib/kv');

bot({ pattern: 'welcome ?(.*)', desc: lang.plugins.greetings.desc, type: 'group', onlyGroup: true }, async (msg, match) => {
  const tpl = (match || '').trim() || 'Welcome &mention to &name!';
  await kv.set('welcome', msg.jid, { tpl, on: true });
  return msg.reply(lang.plugins.greetings.welcome_set.replace('{0}', tpl));
});

bot({ pattern: 'goodbye ?(.*)', desc: lang.plugins.greetings.desc, type: 'group', onlyGroup: true }, async (msg, match) => {
  const tpl = (match || '').trim() || 'Goodbye &mention!';
  await kv.set('goodbye', msg.jid, { tpl, on: true });
  return msg.reply(lang.plugins.greetings.goodbye_set.replace('{0}', tpl));
});
