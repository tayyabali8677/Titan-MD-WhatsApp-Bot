const { bot, lang } = require('../lib');
const { mockFetch } = require('../lib/fetcher');
bot({ pattern: 'facebook ?(.*)', desc: lang.plugins.facebook.desc, type: 'downloader' }, async (msg, match) => {
  if (!match) return msg.reply(lang.plugins.facebook.usage);
  return msg.reply(JSON.stringify(mockFetch('facebook', match)));
});
