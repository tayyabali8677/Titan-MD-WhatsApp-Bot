/**
 * Shared download helpers for the downloader plugins.
 *
 * Each platform plugin (tiktok, insta, facebook, twitter, reddit, pinterest)
 * calls a free public scraper API → gets a direct media URL → downloads it
 * to a tmp file → sends via Baileys → deletes the file.
 *
 * All requests have a 30s timeout and a desktop User-Agent header so the
 * scrapers behave correctly.
 */
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const axios = require('axios');

const TMP_DIR = path.join(os.tmpdir(), 'titan-dl');
try { fs.mkdirSync(TMP_DIR, { recursive: true }); } catch (_) {}

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function tmpFile(ext = 'mp4') {
  return path.join(TMP_DIR, crypto.randomBytes(8).toString('hex') + '.' + ext);
}

/** Stream a URL to a tmp file. Returns the file path. */
async function downloadToFile(url, ext = 'mp4') {
  const out = tmpFile(ext);
  const writer = fs.createWriteStream(out);
  const resp = await axios.get(url, {
    responseType: 'stream',
    headers: { 'User-Agent': UA, Referer: new URL(url).origin },
    timeout: 60000,
    maxContentLength: 100 * 1024 * 1024, // 100 MB hard cap
  });
  resp.data.pipe(writer);
  await new Promise((res, rej) => { writer.on('finish', res); writer.on('error', rej); });
  return out;
}

/** Best-effort delete; doesn't throw. */
function cleanup(filePath) {
  if (!filePath) return;
  fs.unlink(filePath, () => {});
}

/** Detect if a string looks like a URL */
function isUrl(s) { return /^https?:\/\//i.test(String(s || '').trim()); }

/** Send a media file via Baileys, then immediately delete. */
async function sendAndCleanup(msg, filePath, kind, caption) {
  if (!msg.client || typeof msg.client.sendMessage !== 'function' || msg.client.constructor.name === 'MockSocket') {
    cleanup(filePath);
    return msg.reply(`_[mock] would send ${kind}: ${caption || ''}_`);
  }
  try {
    const content = {};
    if (kind === 'video')      { content.video = { url: filePath }; content.mimetype = 'video/mp4'; }
    else if (kind === 'image') { content.image = { url: filePath }; content.mimetype = 'image/jpeg'; }
    else if (kind === 'audio') { content.audio = { url: filePath }; content.mimetype = 'audio/mpeg'; }
    else                       { content.document = { url: filePath }; content.fileName = path.basename(filePath); }
    if (caption) content.caption = caption;

    await msg.client.sendMessage(msg.jid, content, { quoted: msg.raw });
  } finally {
    cleanup(filePath);
  }
}

// ─── Universal downloader via ahm7xmakki.com/api/alldl ──────────────────────
// Covers 100+ platforms: TikTok, IG, FB, Twitter/X, Reddit, Pinterest, YT, etc.
// Returns the direct video/image URL to stream-download.
const AHM7_BASE = 'https://ahm7xmakki.com/api';

/**
 * Universal downloader — tries ahm7xmakki first, falls back to per-platform scrapers.
 * Returns { mediaUrl, kind: 'video'|'image', title, author } or throws.
 */
async function universalDl(url) {
  const r = await axios.get(`${AHM7_BASE}/alldl`, {
    params: { url },
    headers: { 'User-Agent': UA },
    timeout: 30000,
  });
  const d = r.data;
  if (!d) throw new Error('Empty response from ahm7xmakki alldl');
  // Response may be { url, download_url, video, link, ... } — normalise
  const mediaUrl = d.download_url || d.url || d.video || d.link || d.result;
  if (!mediaUrl || typeof mediaUrl !== 'string') throw new Error('alldl: no download URL in response');
  const kind = /\.mp4|\.webm|video/i.test(mediaUrl) ? 'video' : 'image';
  return { mediaUrl, kind, title: d.title || '', author: d.author || d.uploader || '' };
}

// ─── Per-platform scrapers (fallback if ahm7xmakki is down) ─────────────────

/** TikTok via tikwm.com — returns { videoUrl, title, author } */
async function tiktok(url) {
  const api = 'https://www.tikwm.com/api/';
  const r = await axios.post(api, { url, hd: 1 }, {
    headers: { 'User-Agent': UA },
    timeout: 30000,
  });
  const d = r.data?.data;
  if (!d || !d.play) throw new Error('tikwm returned no video');
  return {
    videoUrl: d.hdplay || d.play,
    title: d.title || '',
    author: d.author?.unique_id || d.author?.nickname || '',
  };
}

/** Instagram via instaloader-free public scrapers */
async function instagram(url) {
  // Use saveinsta-style API (free, no auth)
  const api = 'https://api.instaloader.app/api/v1/instagram';
  try {
    const r = await axios.get(api, { params: { url }, headers: { 'User-Agent': UA }, timeout: 30000 });
    const items = r.data?.media || r.data?.items || [];
    if (!items.length) throw new Error('no items');
    return items.map((it) => ({
      mediaUrl: it.url || it.video_url || it.display_url || it.image,
      kind: (it.is_video || /\.mp4/i.test(it.url || '')) ? 'video' : 'image',
    }));
  } catch (e) {
    // fallback: try instagram-direct style
    throw new Error('Instagram scrape failed: ' + (e.message || e));
  }
}

/** Facebook video via fdown.net-style scraper */
async function facebook(url) {
  // Try the snapsave-format public endpoint
  const r = await axios.post('https://snapsave.app/action.php?lang=en', new URLSearchParams({ url }), {
    headers: {
      'User-Agent': UA,
      'Content-Type': 'application/x-www-form-urlencoded',
      Origin: 'https://snapsave.app',
      Referer: 'https://snapsave.app/',
    },
    timeout: 30000,
  });
  // snapsave returns HTML with embedded download links
  const html = r.data || '';
  const m = String(html).match(/href="(https?:\/\/[^"]+\.mp4[^"]*)"/i);
  if (!m) throw new Error('Could not extract Facebook video URL');
  return { videoUrl: m[1] };
}

/** X / Twitter via vxtwitter.com — returns JSON */
async function twitter(url) {
  const vxUrl = url.replace(/^https?:\/\/(www\.)?(twitter|x)\.com/i, 'https://api.vxtwitter.com');
  const r = await axios.get(vxUrl, { headers: { 'User-Agent': UA }, timeout: 30000 });
  const d = r.data || {};
  const media = d.media_extended || [];
  return media.map((m) => ({
    mediaUrl: m.url,
    kind: m.type === 'video' ? 'video' : 'image',
    title: d.text || '',
    author: d.user_screen_name || '',
  }));
}

/** Reddit via native .json endpoint */
async function reddit(url) {
  const jsonUrl = url.replace(/\/?$/, '/.json');
  const r = await axios.get(jsonUrl, { headers: { 'User-Agent': UA }, timeout: 30000 });
  const post = r.data?.[0]?.data?.children?.[0]?.data;
  if (!post) throw new Error('Reddit post not found');
  // Video?
  if (post.media?.reddit_video?.fallback_url) {
    return [{ mediaUrl: post.media.reddit_video.fallback_url, kind: 'video', title: post.title }];
  }
  // Image gallery?
  if (post.is_gallery && post.media_metadata) {
    const items = Object.values(post.media_metadata)
      .map((m) => m.s?.u?.replace(/&amp;/g, '&'))
      .filter(Boolean);
    return items.map((u) => ({ mediaUrl: u, kind: 'image', title: post.title }));
  }
  // Single image?
  if (post.url && /\.(jpg|jpeg|png|webp|gif)$/i.test(post.url)) {
    return [{ mediaUrl: post.url, kind: 'image', title: post.title }];
  }
  // Fallback: just return the URL as text
  throw new Error('Reddit post has no downloadable media');
}

/** Pinterest via simple HTML scrape */
async function pinterest(url) {
  const r = await axios.get(url, { headers: { 'User-Agent': UA }, timeout: 30000 });
  const html = r.data || '';
  // Look for og:image or og:video meta
  const mVideo = String(html).match(/<meta[^>]+property="og:video"[^>]+content="([^"]+)"/i);
  const mImage = String(html).match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i);
  if (mVideo) return { mediaUrl: mVideo[1], kind: 'video' };
  if (mImage) return { mediaUrl: mImage[1].replace(/\/[0-9]+x\//, '/originals/'), kind: 'image' };
  throw new Error('No og:image / og:video found on Pinterest page');
}

module.exports = {
  isUrl, downloadToFile, cleanup, sendAndCleanup,
  universalDl,
  tiktok, instagram, facebook, twitter, reddit, pinterest,
  AHM7_BASE,
};
