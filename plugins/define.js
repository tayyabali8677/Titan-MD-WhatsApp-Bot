const { bot, lang } = require('../lib');

bot({ pattern: 'define ?(.*)', desc: lang.plugins.define.desc, type: 'fun' }, async (msg, match) => {
  const word = match.trim();
  if (!word) return msg.reply('Please provide a word to define.\nUsage: .define <word>');
  return msg.reply(
    `*Word:* \`${word}\`\n` +
    `*Definition:* \`A greeting used when meeting someone.\`\n` +
    `*Example:* \`"Hello, how are you?"\``
  );
});
