const { bot, lang } = require('../lib');
const { mockFetch } = require('../lib/fetcher');
bot({ pattern: 'twitter ?(.*)', desc: lang.plugins.twitter.desc, type: 'downloader' }, async (msg, match) => {
  if (!match) return msg.reply(lang.plugins.twitter.usage);
  return msg.reply(JSON.stringify(mockFetch('twitter', match)));
});
