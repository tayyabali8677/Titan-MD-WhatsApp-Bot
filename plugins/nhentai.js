const { bot } = require('../lib');
const axios = require('axios');
const dl = require('../lib/dl');

const EXT_MAP = { j: 'jpg', p: 'png', g: 'gif', w: 'webp' };

function ext(t) { return EXT_MAP[t] || 'jpg'; }

bot({ pattern: 'nh ?(\\d+)', desc: 'Fetch nhentai doujin info by code', type: 'nsfw', dontAddCommandList: true }, async (msg, match) => {
  const id = (match || '').trim();
  if (!id) return msg.reply('_Usage: .nh <code>_\nExample: .nh 177013');

  if (!msg.client || msg.client.constructor.name === 'MockSocket') {
    return msg.reply(`_[mock] nhentai #${id}_`);
  }

  try {
    await msg.reply(`_Fetching #${id}..._`);
    const { data } = await axios.get(`https://nhentai.net/api/gallery/${id}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://nhentai.net/',
        'Cookie': 'cf_clearance=; sessionid=',
      },
      timeout: 15000,
    });

    const mediaId = data.media_id;
    const title = data.title?.english || data.title?.pretty || data.title?.japanese || 'Unknown';
    const tags = (data.tags || []).filter(t => t.type === 'tag').map(t => t.name).join(', ');
    const parodies = (data.tags || []).filter(t => t.type === 'parody').map(t => t.name).join(', ') || 'Original';
    const characters = (data.tags || []).filter(t => t.type === 'character').map(t => t.name).join(', ') || 'N/A';
    const artists = (data.tags || []).filter(t => t.type === 'artist').map(t => t.name).join(', ') || 'N/A';
    const pages = data.num_pages;
    const coverExt = ext(data.images?.cover?.t);
    const coverUrl = `https://t.nhentai.net/galleries/${mediaId}/cover.${coverExt}`;
    const url = `https://nhentai.net/g/${id}/`;
    const favorites = data.num_favorites?.toLocaleString() || '0';

    const text =
      `📚 *nhentai #${id}*\n\n` +
      `📖 *Title:* ${title}\n` +
      `🎨 *Artist:* ${artists}\n` +
      `📺 *Parodies:* ${parodies}\n` +
      `👤 *Characters:* ${characters}\n` +
      `🏷 *Tags:* ${tags.slice(0, 200)}${tags.length > 200 ? '...' : ''}\n` +
      `📄 *Pages:* ${pages}\n` +
      `❤️ *Favorites:* ${favorites}\n` +
      `🔗 ${url}`;

    let filePath;
    try {
      filePath = await dl.downloadToFile(coverUrl, coverExt);
      await dl.sendAndCleanup(msg, filePath, 'image', text);
    } catch {
      if (filePath) dl.cleanup(filePath);
      await msg.reply(text);
    }
  } catch (e) {
    if (e.response?.status === 403) {
      return msg.reply('_nhentai is blocking the request (Cloudflare). Try again or use a VPN._');
    }
    return msg.reply('_nhentai fetch failed: ' + (e.message || e) + '_');
  }
});

bot({ pattern: 'nhentai ?(\\d+)', desc: 'nhentai alias', type: 'nsfw', dontAddCommandList: true }, async (msg, match) => {
  const id = (match || '').trim();
  if (!id) return msg.reply('_Usage: .nhentai <code>_');
  if (!msg.client || msg.client.constructor.name === 'MockSocket') return msg.reply(`_[mock] nhentai #${id}_`);
  try {
    await msg.reply(`_Fetching #${id}..._`);
    const { data } = await axios.get(`https://nhentai.net/api/gallery/${id}`, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://nhentai.net/' }, timeout: 15000,
    });
    const title = data.title?.english || data.title?.pretty || 'Unknown';
    const pages = data.num_pages;
    const mediaId = data.media_id;
    const coverExt = ext(data.images?.cover?.t);
    const coverUrl = `https://t.nhentai.net/galleries/${mediaId}/cover.${coverExt}`;
    const tags = (data.tags || []).filter(t => t.type === 'tag').map(t => t.name).join(', ');
    const text = `📚 *${title}*\n📄 Pages: ${pages}\n🏷 Tags: ${tags.slice(0, 200)}\n🔗 https://nhentai.net/g/${id}/`;
    let filePath;
    try { filePath = await dl.downloadToFile(coverUrl, coverExt); await dl.sendAndCleanup(msg, filePath, 'image', text); }
    catch { if (filePath) dl.cleanup(filePath); await msg.reply(text); }
  } catch (e) { return msg.reply('_Failed: ' + (e.message || e) + '_'); }
});
