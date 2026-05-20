const { bot, lang } = require('../lib');

bot({ pattern: 'circle', desc: lang.plugins.circle.desc, type: 'media' }, async (msg) => {
  if (!msg.reply_message) return msg.reply('Reply to an image.');
  return msg.reply('_[mock] Circle sticker created ✅_');
});

bot({ pattern: 'stickercrop', desc: lang.plugins.stickercrop.desc, type: 'media' }, async (msg) => {
  if (!msg.reply_message) return msg.reply('Reply to an image.');
  return msg.reply('_[mock] Sticker cropped ✅_');
});

bot({ pattern: 'simage', desc: lang.plugins.simage.desc, type: 'media' }, async (msg) => {
  if (!msg.reply_message) return msg.reply('Reply to an image.');
  return msg.reply('_[mock] Sticker converted to image ✅_');
});
