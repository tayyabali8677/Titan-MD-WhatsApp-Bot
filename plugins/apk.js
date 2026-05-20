const { bot, lang } = require('../lib');
const { mockFetch } = require('../lib/fetcher');

bot({ pattern: 'apk ?(.*)', desc: lang.plugins.apk.desc, type: 'downloader' }, async (msg, match) => {
  if (!match) return msg.reply(lang.plugins.apk.usage);
  const result = mockFetch('aptoide', match);
  result.title = `${match} v1.0.0 (Mock APK)`;
  result.size = '12.5 MB';
  return msg.reply(JSON.stringify(result, null, 2));
});
