const { bot, lang } = require('../lib');
const config = require('../config');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const TMP_DIR = path.join(os.tmpdir(), 'titan-stickers');
try { fs.mkdirSync(TMP_DIR, { recursive: true }); } catch (_) {}

// Lazy-require so mock mode doesn't pay for these heavyweight deps at boot
let _baileys, _sharp, _ffmpeg, _webpmux;
function lazyDeps() {
  if (!_baileys) _baileys = require('@whiskeysockets/baileys');
  if (!_sharp) _sharp = require('sharp');
  if (!_ffmpeg) _ffmpeg = require('fluent-ffmpeg');
  if (!_webpmux) _webpmux = require('node-webpmux');
  return { _baileys, _sharp, _ffmpeg, _webpmux };
}

function tmpFile(ext) {
  return path.join(TMP_DIR, crypto.randomBytes(8).toString('hex') + '.' + ext);
}

function cleanup(...files) {
  for (const f of files) {
    if (!f) continue;
    fs.unlink(f, () => {}); // fire-and-forget delete (per user's "delete immediately" pref)
  }
}

/** Sharp path: image → 512x512 WebP with transparent background */
async function imageToWebp(inputBuf) {
  const { _sharp } = lazyDeps();
  return _sharp(inputBuf)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 80 })
    .toBuffer();
}

/** ffmpeg path: video/gif → animated WebP, max 6 seconds */
function videoToWebp(inputPath) {
  const { _ffmpeg } = lazyDeps();
  const outPath = tmpFile('webp');
  return new Promise((resolve, reject) => {
    _ffmpeg(inputPath)
      .inputOptions(['-t', '6'])
      .outputOptions([
        '-vcodec', 'libwebp',
        '-vf', "scale='if(gt(iw,ih),512,-2)':'if(gt(iw,ih),-2,512)',fps=15,pad=512:512:-1:-1:color=white@0.0,split[a][b];[a]palettegen=reserve_transparent=on:transparency_color=ffffff[p];[b][p]paletteuse",
        '-loop', '0',
        '-ss', '0',
        '-an', '-vsync', '0',
      ])
      .on('end', () => resolve(outPath))
      .on('error', (err) => { cleanup(outPath); reject(err); })
      .save(outPath);
  });
}

/** Embed sticker pack/author EXIF so WhatsApp shows your branding */
async function embedExif(webpBuf, packname, author) {
  const { _webpmux } = lazyDeps();
  const img = new _webpmux.Image();
  await img.load(webpBuf);
  const json = {
    'sticker-pack-id': crypto.randomBytes(16).toString('hex'),
    'sticker-pack-name': packname,
    'sticker-pack-publisher': author,
    'emojis': ['🎯'],
  };
  const exifAttr = Buffer.from([
    0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00,
    0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00,
  ]);
  const jsonBuf = Buffer.from(JSON.stringify(json), 'utf8');
  const exif = Buffer.concat([exifAttr, jsonBuf]);
  exif.writeUIntLE(jsonBuf.length, 14, 4);
  img.exif = exif;
  return img.save(null);
}

/** Decide between sharp/ffmpeg based on media type, then EXIF-stamp + return buffer */
async function buildSticker(media, mtype) {
  const isAnimated = /video|gif/i.test(mtype);
  let webp;

  if (isAnimated) {
    // Need ffmpeg with a file on disk
    const inPath = tmpFile(mtype.includes('gif') ? 'gif' : 'mp4');
    fs.writeFileSync(inPath, media);
    try {
      const outPath = await videoToWebp(inPath);
      webp = fs.readFileSync(outPath);
      cleanup(inPath, outPath);
    } catch (e) {
      cleanup(inPath);
      throw e;
    }
  } else {
    webp = await imageToWebp(media);
  }

  const pack = (config.STICKER_PACKNAME || 'Titan MD;TitanDev').split(';');
  return embedExif(webp, pack[0] || 'Titan MD', pack[1] || 'TitanDev');
}

bot({ pattern: 'sticker ?(.*)', desc: lang.plugins.sticker.desc, type: 'media' }, async (msg, match) => {
  // Resolve which media to convert: the reply target, or the current message itself
  const target = msg.reply_message || msg;
  const mtype = target.mtype || target.mediaType || '';
  const hasMedia = /image|video|gif|sticker/i.test(mtype);

  if (!hasMedia) {
    return msg.reply('_Reply to an image, video, gif, or sticker to convert it._');
  }

  // Mock mode: no real Baileys, just acknowledge
  if (!msg.client || typeof msg.client.downloadMediaMessage !== 'function') {
    return msg.reply(lang.plugins.sticker.processing || '_[mock] sticker created._');
  }

  try {
    const { _baileys } = lazyDeps();
    const media = await _baileys.downloadMediaMessage(target.raw || target, 'buffer', {});
    const stickerBuf = await buildSticker(media, mtype);
    await msg.client.sendMessage(msg.jid, { sticker: stickerBuf }, { quoted: msg.raw });
  } catch (e) {
    return msg.reply('_Failed to make sticker: ' + (e.message || e) + '_');
  }
});

// Alias: .s — same handler
bot({ pattern: 's ?(.*)', desc: 'Quick sticker (alias)', type: 'media' }, async (msg) => {
  const target = msg.reply_message || msg;
  const mtype = target.mtype || target.mediaType || '';
  if (!/image|video|gif|sticker/i.test(mtype)) {
    return msg.reply('_Reply to an image/video to convert._');
  }
  if (!msg.client || typeof msg.client.downloadMediaMessage !== 'function') {
    return msg.reply('_[mock] sticker created._');
  }
  try {
    const { _baileys } = lazyDeps();
    const media = await _baileys.downloadMediaMessage(target.raw || target, 'buffer', {});
    const stickerBuf = await buildSticker(media, mtype);
    await msg.client.sendMessage(msg.jid, { sticker: stickerBuf }, { quoted: msg.raw });
  } catch (e) {
    return msg.reply('_Failed: ' + (e.message || e) + '_');
  }
});
