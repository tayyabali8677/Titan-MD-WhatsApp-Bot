const { bot, lang } = require('../lib');
bot({ pattern: 'vote ?(.*)', desc: lang.plugins.vote.desc, type: 'utility' }, async (msg, match) => {
  if (!match) return msg.reply(lang.plugins.vote.usage);
  return msg.send(`🗳 *Vote:* ${match}\n👍 yes   👎 no   (react to cast)`);
});
