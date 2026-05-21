const { bot, lang } = require('../lib');
const dl = require('../lib/dl');
const { mockFetch } = require('../lib/fetcher');

bot({ pattern: 'tiktok ?(.*)', desc: lang.plugins.tiktok.desc, type: 'downloader' }, async (msg, match) => {
  const arg = (match || '').trim();
  if (!arg) return msg.reply(lang.plugins.tiktok.usage);

  if (!msg.client || msg.client.constructor.name === 'MockSocket') {
    return msg.reply(JSON.stringify(mockFetch('tiktok', arg)));
  }

  if (!dl.isUrl(arg)) {
    return msg.reply('_Please paste a TikTok video URL._\nExample: `.tiktok https://www.tiktok.com/@user/video/...`');
  }

  let filePath;
  try {
    await msg.reply('_Downloading TikTok video..._');
    const info = await dl.tiktok(arg);
    filePath = await dl.downloadToFile(info.videoUrl, 'mp4');
    const cap = `🎬 ${info.title || 'TikTok video'}\n👤 @${info.author || 'unknown'}`;
    await dl.sendAndCleanup(msg, filePath, 'video', cap);
  } catch (e) {
    if (filePath) dl.cleanup(filePath);
    return msg.reply('_TikTok download failed: ' + (e.message || e) + '_');
  }
});
