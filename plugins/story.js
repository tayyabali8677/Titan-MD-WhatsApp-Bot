const { bot, lang } = require('../lib');
const { mockFetch } = require('../lib/fetcher');
bot({ pattern: 'story ?(.*)', desc: lang.plugins.story.desc, type: 'downloader' }, async (msg, match) => {
  if (!match) return msg.reply(lang.plugins.story.usage);
  return msg.reply(JSON.stringify(mockFetch('story', match)));
});
