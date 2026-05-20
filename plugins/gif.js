const { bot, lang } = require('../lib');
bot({ pattern: 'gif ?(.*)', desc: lang.plugins.gif.desc, type: 'utility' }, async (msg, match) => {
  if (!match) return msg.reply(lang.plugins.gif.usage);
  return msg.reply(`[mock gif] "${match}"\nhttps://cdn.titanmd.site/mock/gif/${encodeURIComponent(match)}.gif\n[Set GIPHY_API_KEY for live results]`);
});
