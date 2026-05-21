// Hidden NSFW downloader plugin — not listed in .help/.menu/.list
// Real implementation: scrape XVideos / XNXX page for the MP4 URL,
// download, send as a video. Deletes immediately after send.

const { bot, lang } = require('../lib');
const dl = require('../lib/dl');
const axios = require('axios');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

/** Pull a direct MP4 URL from an XVideos or XNXX page. */
async function extract(pageUrl) {
  const r = await axios.get(pageUrl, {
    headers: { 'User-Agent': UA },
    timeout: 30000,
    maxRedirects: 5,
  });
  const html = r.data || '';
  // XVideos: html5player.setVideoUrlHigh('...');  OR  videoUrlHigh:'...'
  // XNXX: html5player.setVideoUrlHigh('...');
  const patterns = [
    /html5player\.setVideoUrlHigh\(['"]([^'"]+\.mp4[^'"]*)['"]/i,
    /html5player\.setVideoUrlLow\(['"]([^'"]+\.mp4[^'"]*)['"]/i,
    /setVideoHLS\(['"]([^'"]+)['"]/i,
    /content="video\/mp4"[^>]+content="([^"]+\.mp4[^"]*)"/i,
    /<source[^>]+src="([^"]+\.mp4[^"]*)"/i,
  ];
  for (const p of patterns) {
    const m = String(html).match(p);
    if (m && m[1]) return m[1];
  }
  throw new Error('Could not extract video URL from page');
}

async function handle(msg, match) {
  const arg = (match || '').trim();
  if (!arg) return msg.reply('_Usage: .xvid <xvideos or xnxx URL>_');

  if (!msg.client || msg.client.constructor.name === 'MockSocket') {
    return msg.reply(`_[mock] 🔞 xv downloader: ${arg}_`);
  }

  if (!dl.isUrl(arg)) {
    return msg.reply('_Please paste a direct video URL (xvideos.com or xnxx.com)._\n_Search-by-query not supported._');
  }
  if (!/(xvideos|xnxx)\.com/i.test(arg)) {
    return msg.reply('_Only xvideos.com and xnxx.com URLs are supported._');
  }

  let filePath;
  try {
    await msg.reply('_🔞 Downloading..._');
    const videoUrl = await extract(arg);
    filePath = await dl.downloadToFile(videoUrl, 'mp4');
    await dl.sendAndCleanup(msg, filePath, 'video');
  } catch (e) {
    if (filePath) dl.cleanup(filePath);
    return msg.reply('_Download failed: ' + (e.message || e) + '_');
  }
}

bot(
  {
    pattern: 'xvideo ?(.*)',
    desc: lang.plugins.xvideo?.desc || 'NSFW video downloader (hidden)',
    type: 'nsfw',
    dontAddCommandList: true,
  },
  handle
);

// Aliases — also hidden
for (const alias of ['xnxx', 'xv', 'xvid']) {
  bot(
    {
      pattern: `${alias} ?(.*)`,
      desc: lang.plugins.xvideo?.desc || 'NSFW video downloader (hidden)',
      type: 'nsfw',
      dontAddCommandList: true,
    },
    handle
  );
}
