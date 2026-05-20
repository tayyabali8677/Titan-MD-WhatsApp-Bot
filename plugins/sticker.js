const { bot, lang } = require('../lib');

bot({ pattern: 'sticker ?(.*)', desc: lang.plugins.sticker.desc, type: 'media' }, async (msg, match) => {
  if (/^circle/i.test(match || '')) {
    return msg.reply(lang.plugins.sticker.circle || '[mock] circle sticker generated.');
  }
  return msg.reply(lang.plugins.sticker.processing || '[mock] sticker created.');
});
