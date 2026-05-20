const { bot, lang } = require('../lib');
const { mockFetch } = require('../lib/fetcher');

bot({ pattern: 'y2mate ?(.*)', desc: lang.plugins.y2mate.desc, type: 'downloader' }, async (msg, match) => {
  if (!match) return msg.reply(lang.plugins.y2mate.usage);
  const result = mockFetch('y2mate', match);
  result.qualities = ['360p', '480p', '720p', '1080p'];
  return msg.reply(JSON.stringify(result, null, 2));
});
