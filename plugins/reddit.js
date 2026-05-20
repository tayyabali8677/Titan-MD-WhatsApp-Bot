const { bot, lang } = require('../lib');
const { mockFetch } = require('../lib/fetcher');
bot({ pattern: 'reddit ?(.*)', desc: lang.plugins.reddit.desc, type: 'downloader' }, async (msg, match) => {
  if (!match) return msg.reply(lang.plugins.reddit.usage);
  return msg.reply(JSON.stringify(mockFetch('reddit', match)));
});
