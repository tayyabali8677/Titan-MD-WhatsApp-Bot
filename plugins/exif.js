const { bot, lang } = require('../lib');

bot({ pattern: 'exif', desc: lang.plugins.exif.desc, type: 'media' }, async (msg) => {
  if (!msg.reply_message) return msg.reply(lang.plugins.exif.usage);
  return msg.reply('[mock exif]\nTitle: Titan MD\nAuthor: TitanDev\nPackname: Titan MD;TitanDev\nSite: titanmd.site');
});
