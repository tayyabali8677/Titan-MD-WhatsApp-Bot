const { bot, lang } = require('../lib');
const { mockFetch } = require('../lib/fetcher');

bot({ pattern: 'ytv ?(.*)', desc: lang.plugins.ytv.desc, type: 'downloader' }, async (msg, match, ctx) => {
  if (!match) return msg.reply(lang.plugins.ytv.usage);
  if (!ctx.config.YT_COOKIE) return msg.reply(JSON.stringify(mockFetch('youtube-video', match)));
  return msg.reply('[stub] youtubei.js video pipeline.');
});

bot({ pattern: 'yta ?(.*)', desc: lang.plugins.yta.desc, type: 'downloader' }, async (msg, match, ctx) => {
  if (!match) return msg.reply(lang.plugins.yta.usage);
  if (!ctx.config.YT_COOKIE) return msg.reply(JSON.stringify(mockFetch('youtube-audio', match)));
  return msg.reply('[stub] youtubei.js audio pipeline.');
});
