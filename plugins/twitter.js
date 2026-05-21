const { bot, lang } = require('../lib');
const dl = require('../lib/dl');
const { mockFetch } = require('../lib/fetcher');

async function handler(msg, match) {
  const arg = (match || '').trim();
  if (!arg) return msg.reply('_Usage:_ `.twitter <x.com or twitter.com URL>`');

  if (!msg.client || msg.client.constructor.name === 'MockSocket') {
    return msg.reply(JSON.stringify(mockFetch('twitter', arg)));
  }

  if (!dl.isUrl(arg) || !/(twitter|x)\.com/i.test(arg)) {
    return msg.reply('_Please paste a Twitter / X URL._');
  }

  try {
    await msg.reply('_Fetching tweet..._');
    const items = await dl.twitter(arg);
    if (!items.length) return msg.reply('_No media in this tweet — only text._');

    for (const it of items.slice(0, 4)) {
      let filePath;
      try {
        const ext = it.kind === 'video' ? 'mp4' : 'jpg';
        filePath = await dl.downloadToFile(it.mediaUrl, ext);
        await dl.sendAndCleanup(msg, filePath, it.kind, `🐦 @${it.author}\n${it.title || ''}`);
      } catch (e) {
        if (filePath) dl.cleanup(filePath);
      }
    }
  } catch (e) {
    return msg.reply('_Twitter fetch failed: ' + (e.message || e) + '_');
  }
}

bot({ pattern: 'twitter ?(.*)', desc: lang.plugins.twitter.desc, type: 'downloader' }, handler);
bot({ pattern: 'x ?(.*)', desc: 'X (Twitter) downloader (alias)', type: 'downloader' }, handler);
