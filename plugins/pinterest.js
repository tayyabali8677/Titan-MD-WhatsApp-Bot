const { bot, lang } = require('../lib');
const dl = require('../lib/dl');
const { mockFetch } = require('../lib/fetcher');

bot({ pattern: 'pinterest ?(.*)', desc: lang.plugins.pinterest.desc, type: 'downloader' }, async (msg, match) => {
  const arg = (match || '').trim();
  if (!arg) return msg.reply(lang.plugins.pinterest.usage);

  if (!msg.client || msg.client.constructor.name === 'MockSocket') {
    return msg.reply(JSON.stringify(mockFetch('pinterest', arg)));
  }

  if (!dl.isUrl(arg)) {
    return msg.reply('_Please paste a Pinterest pin URL._');
  }

  let filePath;
  try {
    await msg.reply('_Fetching pin..._');
    const info = await dl.pinterest(arg);
    const ext = info.kind === 'video' ? 'mp4' : 'jpg';
    filePath = await dl.downloadToFile(info.mediaUrl, ext);
    await dl.sendAndCleanup(msg, filePath, info.kind, '📌 Pinterest');
  } catch (e) {
    if (filePath) dl.cleanup(filePath);
    return msg.reply('_Pinterest fetch failed: ' + (e.message || e) + '_');
  }
});
