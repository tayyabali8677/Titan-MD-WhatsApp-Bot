const { bot, lang } = require('../lib');
bot({ pattern: 'wasted', desc: lang.plugins.wasted.desc, type: 'media' }, async (msg) => {
  if (!msg.reply_message) return msg.reply(lang.plugins.wasted.usage);
  return msg.reply('[mock wasted] GTA wasted effect applied.\nhttps://cdn.titanmd.site/mock/wasted.jpg\nRequires jimp + wasted overlay for real output.');
});
