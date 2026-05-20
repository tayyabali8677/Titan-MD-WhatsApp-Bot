const { bot, lang } = require('../lib');
const { mockFetch } = require('../lib/fetcher');
bot({ pattern: 'insta ?(.*)', desc: lang.plugins.insta.desc, type: 'downloader' }, async (msg, match) => {
  if (!match) return msg.reply(lang.plugins.insta.usage);
  return msg.reply(JSON.stringify(mockFetch('instagram', match)));
});
