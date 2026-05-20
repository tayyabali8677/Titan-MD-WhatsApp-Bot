const { bot, lang } = require('../lib');

bot({ pattern: 'bing ?(.*)', desc: lang.plugins.bing.desc, type: 'ai' }, async (msg, match, ctx) => {
  if (!match) return msg.reply(lang.plugins.bing.usage);
  if (!ctx.config.BING_COOKIE) return msg.reply(lang.plugins.bing.no_key);
  return msg.reply(`[mock bing] top result for "${match}": https://www.bing.com/images/search?q=${encodeURIComponent(match)}`);
});
