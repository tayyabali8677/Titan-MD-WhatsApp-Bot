const { bot, lang } = require('../lib');
const dl = require('../lib/dl');
const { mockFetch } = require('../lib/fetcher');

bot({ pattern: 'reddit ?(.*)', desc: lang.plugins.reddit.desc, type: 'downloader' }, async (msg, match) => {
  const arg = (match || '').trim();
  if (!arg) return msg.reply(lang.plugins.reddit.usage);

  if (!msg.client || msg.client.constructor.name === 'MockSocket') {
    return msg.reply(JSON.stringify(mockFetch('reddit', arg)));
  }

  if (!dl.isUrl(arg) || !/reddit\.com/i.test(arg)) {
    return msg.reply('_Please paste a Reddit post URL._');
  }

  try {
    await msg.reply('_Fetching Reddit post..._');
    const items = await dl.reddit(arg);
    for (const it of items.slice(0, 10)) {
      let filePath;
      try {
        const ext = it.kind === 'video' ? 'mp4' : 'jpg';
        filePath = await dl.downloadToFile(it.mediaUrl, ext);
        await dl.sendAndCleanup(msg, filePath, it.kind, '🤖 ' + (it.title || 'Reddit'));
      } catch (e) {
        if (filePath) dl.cleanup(filePath);
      }
    }
  } catch (e) {
    return msg.reply('_Reddit fetch failed: ' + (e.message || e) + '_');
  }
});
