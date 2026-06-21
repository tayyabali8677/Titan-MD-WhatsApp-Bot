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
    let info;
    try { info = await dl.universalDl(arg); }
    catch (_) { const t = await dl.facebook(arg); info = { mediaUrl: t.videoUrl, kind: 'video' }; }
    const ext = info.kind === 'video' ? 'mp4' : 'jpg';
    filePath = await dl.downloadToFile(info.mediaUrl, ext);
    await dl.sendAndCleanup(msg, filePath, info.kind, '📘 Facebook');
  } catch (e) {
    if (filePath) dl.cleanup(filePath);
    return msg.reply('_Facebook download failed: ' + (e.message || e) + '_');
  }
});

bot({ pattern: 'fb ?(.*)', desc: 'Facebook video downloader (alias)', type: 'downloader' }, async (msg, match) => {
  const arg = (match || '').trim();
  if (!arg) return msg.reply('_Usage:_ `.fb <url>`');
  if (!msg.client || msg.client.constructor.name === 'MockSocket') return msg.reply(JSON.stringify(mockFetch('facebook', arg)));
  if (!dl.isUrl(arg)) return msg.reply('_Please paste a Facebook video URL._');
  let filePath;
  try {
    let info;
    try { info = await dl.universalDl(arg); }
    catch (_) { const t = await dl.facebook(arg); info = { mediaUrl: t.videoUrl, kind: 'video' }; }
    filePath = await dl.downloadToFile(info.mediaUrl, info.kind === 'video' ? 'mp4' : 'jpg');
    await dl.sendAndCleanup(msg, filePath, info.kind, '📘 Facebook');
  } catch (e) {
    if (filePath) dl.cleanup(filePath);
    return msg.reply('_FB download failed: ' + (e.message || e) + '_');
  }
});
