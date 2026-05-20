const { bot, lang } = require('../lib');

bot({ pattern: 'img ?(.*)', desc: lang.plugins.img.desc, type: 'utility' }, async (msg, match) => {
  if (!match) return msg.reply(lang.plugins.img.usage);
  return msg.reply(
    `[mock image search] "${match}"\nhttps://cdn.titanmd.site/mock/img/${encodeURIComponent(match)}.jpg`
  );
});
