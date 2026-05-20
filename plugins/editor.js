const { bot, lang } = require('../lib');

for (const c of ['blur', 'grayscale', 'flip', 'brightness']) {
  bot({ pattern: c, desc: lang.plugins.editor.desc, type: 'media' }, async (msg, match) => {
    return msg.reply(`[mock] ${c} ${match || ''} applied via jimp.`);
  });
}
