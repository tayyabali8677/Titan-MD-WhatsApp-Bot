const { bot, lang } = require('../lib');
const dl = require('../lib/dl');
const { mockFetch } = require('../lib/fetcher');

bot({ pattern: 'insta ?(.*)', desc: lang.plugins.insta.desc, type: 'downloader' }, async (msg, match) => {
  const arg = (match || '').trim();
  if (!arg) return msg.reply(lang.plugins.insta.usage);

  if (!msg.client || msg.client.constructor.name === 'MockSocket') {
    return msg.reply(JSON.stringify(mockFetch('instagram', arg)));
  }

  if (!dl.isUrl(arg)) {
    return msg.reply('_Please paste an Instagram post/reel URL._');
  }

  try {
    await msg.reply('_Fetching Instagram media..._');
    // Try universal downloader first (ahm7xmakki), fall back to per-platform scraper
    let items;
    try {
      const info = await dl.universalDl(arg);
      items = [info];
    } catch (_) {
      items = await dl.instagram(arg);
    }
    if (!items.length) return msg.reply('_No media found in that Instagram post._');

    for (const item of items.slice(0, 10)) {
      let filePath;
      try {
        const ext = item.kind === 'video' ? 'mp4' : 'jpg';
        const url = item.mediaUrl || item.mediaUrl;
        filePath = await dl.downloadToFile(url, ext);
        await dl.sendAndCleanup(msg, filePath, item.kind);
      } catch (e) {
        if (filePath) dl.cleanup(filePath);
        await msg.reply('_Skipped one item: ' + (e.message || e) + '_');
      }
    }
  } catch (e) {
    return msg.reply('_Instagram fetch failed: ' + (e.message || e) + '_');
  }
});
