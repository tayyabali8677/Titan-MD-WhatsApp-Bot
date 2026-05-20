const { bot, lang } = require('../lib');
const { mockFetch } = require('../lib/fetcher');

bot({ pattern: 'yts ?(.*)', desc: lang.plugins.yts.desc, type: 'downloader' }, async (msg, match, ctx) => {
  if (!match) return msg.reply(lang.plugins.yts.usage);
  if (!ctx.config.YT_COOKIE) {
    return msg.reply(
      `[mock yts] results for "${match}":\n1. ${match} - Official Video (3:45)\n2. ${match} - Live (5:12)\n3. ${match} - Lyric Video (3:51)\n[Set YT_COOKIE for real results]`
    );
  }
  return msg.reply('[stub] youtubei.js search.');
});
