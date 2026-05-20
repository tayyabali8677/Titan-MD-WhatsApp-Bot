const { bot, lang } = require('../lib');
const { mockFetch } = require('../lib/fetcher');
bot({ pattern: 'pinterest ?(.*)', desc: lang.plugins.pinterest.desc, type: 'downloader' }, async (msg, match) => {
  if (!match) return msg.reply(lang.plugins.pinterest.usage);
  return msg.reply(JSON.stringify(mockFetch('pinterest', match)));
});
