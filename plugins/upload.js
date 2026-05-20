const { bot, lang } = require('../lib');

bot({ pattern: 'upload', desc: lang.plugins.upload.desc, type: 'utility' }, async (msg) => {
  if (!msg.reply_message) return msg.reply('Reply to a file/image/video to upload.');
  return msg.reply(`[mock] uploaded to CDN:\nhttps://cdn.titanmd.site/mock/upload-${Date.now()}.bin`);
});
