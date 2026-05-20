const { bot, lang } = require('../lib');
const config = require('../config');
bot({ pattern: 'take ?(.*)', desc: lang.plugins.take.desc, type: 'media' }, async (msg, match) => {
  if (!msg.reply_message) return msg.reply(lang.plugins.take.usage);
  const parts = (match || '').split(';').map((s) => s.trim());
  const pack = parts[0] || config.BOT_NAME;
  const author = parts[1] || config.OWNER_NAME || 'TitanDev';
  return msg.reply(`[mock] sticker re-tagged\nPackname: ${pack}\nAuthor: ${author}\nRequires node-webpmux for real EXIF injection.`);
});
