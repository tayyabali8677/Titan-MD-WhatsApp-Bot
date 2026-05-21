const { bot, lang } = require('../lib');
const dl = require('../lib/dl');
const { mockFetch } = require('../lib/fetcher');

bot({ pattern: 'facebook ?(.*)', desc: lang.plugins.facebook.desc, type: 'downloader' }, async (msg, match) => {
  const arg = (match || '').trim();
  if (!arg) return msg.reply(lang.plugins.facebook.usage);

  if (!msg.client || msg.client.constructor.name === 'MockSocket') {
    return msg.reply(JSON.stringify(mockFetch('facebook', arg)));
  }

  if (!dl.isUrl(arg)) {
    return msg.reply('_Please paste a Facebook video URL._');
  }

  let filePath;
  try {
    await msg.reply('_Downloading Facebook video..._');
    const info = await dl.facebook(arg);
    filePath = await dl.downloadToFile(info.videoUrl, 'mp4');
    await dl.sendAndCleanup(msg, filePath, 'video', '📘 Facebook video');
  } catch (e) {
    if (filePath) dl.cleanup(filePath);
    return msg.reply('_Facebook download failed: ' + (e.message || e) + '_');
  }
});

// .fb alias
bot({ pattern: 'fb ?(.*)', desc: 'Facebook video downloader (alias)', type: 'downloader' }, async (msg, match) => {
  const arg = (match || '').trim();
  if (!arg) return msg.reply('_Usage:_ `.fb <facebook url>`');
  if (!msg.client || msg.client.constructor.name === 'MockSocket') {
    return msg.reply(JSON.stringify(mockFetch('facebook', arg)));
  }
  if (!dl.isUrl(arg)) return msg.reply('_Please paste a Facebook video URL._');
  let filePath;
  try {
    const info = await dl.facebook(arg);
    filePath = await dl.downloadToFile(info.videoUrl, 'mp4');
    await dl.sendAndCleanup(msg, filePath, 'video', '📘 Facebook video');
  } catch (e) {
    if (filePath) dl.cleanup(filePath);
    return msg.reply('_FB download failed: ' + (e.message || e) + '_');
  }
});
