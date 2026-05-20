const { bot, lang } = require('../lib');

bot({ pattern: 'qr ?(.*)', desc: lang.plugins.qr.desc, type: 'utility' }, async (msg, match) => {
  if (msg.reply_message && !match) return msg.reply(`${lang.plugins.qr.reading} decoded: HELLO_TITAN_MD`);
  return msg.reply(`${lang.plugins.qr.creating} for: ${match || '(empty)'}`);
});
