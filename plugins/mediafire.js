const { bot, lang } = require('../lib');
const { mockFetch } = require('../lib/fetcher');
bot({ pattern: 'mediafire ?(.*)', desc: lang.plugins.mediafire.desc, type: 'downloader' }, async (msg, match) => {
  if (!match) return msg.reply(lang.plugins.mediafire.usage);
  return msg.reply(JSON.stringify(mockFetch('mediafire', match)));
});
