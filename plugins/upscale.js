const { bot, lang } = require('../lib');

// .upscale — reply to an image to 4x upscale it. (`enhance` alias is owned by photoeditor.js)
bot(
  {
    pattern: 'upscale',
    desc: (lang.plugins.upscale && lang.plugins.upscale.desc) || 'Upscale a replied image 4x',
    type: 'editor',
  },
  async (msg) => {
    if (!msg.reply_message) return msg.reply('_Reply to an image to upscale._');
    return msg.reply('_[mock] Image upscaled 4x ✅_');
  }
);
