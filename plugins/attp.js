const { bot, lang } = require('../lib');
bot({ pattern: 'attp ?(.*)', desc: lang.plugins.attp.desc, type: 'media' }, async (msg, match) => {
  if (!match) return msg.reply(lang.plugins.attp.usage);
  return msg.reply(`[mock attp] animated text sticker for: "${match}"\nRequires node-webpmux + canvas for real output.`);
});
