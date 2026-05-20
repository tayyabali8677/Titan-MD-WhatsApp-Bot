const { bot, lang } = require('../lib');

bot({ pattern: 'greet ?(.*)', desc: lang.plugins.greet.desc, type: 'group', onlyGroup: true }, async (msg, match) => {
  const name = (match || '').trim() || msg.pushName || 'friend';
  return msg.send(`👋 Welcome, ${name}! We're glad to have you here.`);
});
