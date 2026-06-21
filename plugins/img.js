const { bot, lang } = require('../lib');
const axios = require('axios');
const cheerio = require('cheerio');
const dl = require('../lib/dl');

async function bingImage(query) {
  const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&first=1&count=20`;
  const { data } = await axios.get(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    timeout: 10000,
  });
  const $ = cheerio.load(data);
  const imgs = [];
  $('.iusc').each((_, el) => {
    try { const m = JSON.parse($(el).attr('m')); if (m.murl) imgs.push(m.murl); } catch {}
  });
  return imgs;
}

bot({ pattern: 'img ?(.*)', desc: lang.plugins.img?.desc || 'Search and send an image', type: 'utility' }, async (msg, match) => {
  const query = (match || '').trim();
  if (!query) return msg.reply('_Usage: .img <search term>_');

  if (!msg.client || msg.client.constructor.name === 'MockSocket') {
    return msg.reply(`_[mock] Image search: "${query}"_`);
  }

  try {
    await msg.reply('_Searching images..._');
    const imgs = await bingImage(query);
    if (!imgs.length) return msg.reply(`_No images found for "${query}"_`);

    const url = imgs[Math.floor(Math.random() * Math.min(imgs.length, 10))];
    const ext = /\.png/i.test(url) ? 'png' : 'jpg';
    const filePath = await dl.downloadToFile(url, ext);
    await dl.sendAndCleanup(msg, filePath, 'image', `🔎 *${query}*`);
  } catch (e) {
    return msg.reply('_Image search failed: ' + (e.message || e) + '_');
  }
});

bot({ pattern: 'gimage ?(.*)', desc: 'Google image search', type: 'utility' }, async (msg, match) => {
  const query = (match || '').trim();
  if (!query) return msg.reply('_Usage: .gimage <search term>_');
  if (!msg.client || msg.client.constructor.name === 'MockSocket') return msg.reply(`_[mock] Image: "${query}"_`);
  try {
    await msg.reply('_Searching..._');
    const imgs = await bingImage(query);
    if (!imgs.length) return msg.reply(`_No images found for "${query}"_`);
    const url = imgs[Math.floor(Math.random() * Math.min(imgs.length, 10))];
    const filePath = await dl.downloadToFile(url, 'jpg');
    await dl.sendAndCleanup(msg, filePath, 'image', `🔎 *${query}*`);
  } catch (e) { return msg.reply('_Image search failed: ' + (e.message || e) + '_'); }
});
