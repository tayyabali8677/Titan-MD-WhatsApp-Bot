const { bot, lang } = require('../lib');
const { mockFetch } = require('../lib/fetcher');
bot({ pattern: 'tiktok ?(.*)', desc: lang.plugins.tiktok.desc, type: 'downloader' }, async (msg, match) => {
  if (!match) return msg.reply(lang.plugins.tiktok.usage);
  return msg.reply(JSON.stringify(mockFetch('tiktok', match)));
});
