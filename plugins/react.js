const { bot, lang } = require('../lib');
bot({ pattern: 'react ?(.*)', desc: lang.plugins.react.desc, type: 'utility' }, async (msg, match) => {
  if (!msg.reply_message) return msg.reply(lang.plugins.react.usage);
  const emoji = (match || '👍').trim().slice(0, 4);
  return msg.send({ react: { text: emoji, key: msg.reply_message.key } }, {}, 'reaction');
});
