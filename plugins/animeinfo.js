const { bot } = require('../lib');
const axios = require('axios');
const dl = require('../lib/dl');

bot({ pattern: 'anime ?(.*)', desc: 'Search anime info (Jikan/MAL)', type: 'anime' }, async (msg, match) => {
  const query = (match || '').trim();
  if (!query) return msg.reply('_Usage: .anime <title>_\nExample: .anime Naruto');

  if (!msg.client || msg.client.constructor.name === 'MockSocket') {
    return msg.reply(`_[mock] Anime info for "${query}"_`);
  }

  try {
    await msg.reply('_Searching anime..._');
    const { data } = await axios.get('https://api.jikan.moe/v4/anime', {
      params: { q: query, limit: 1 },
      timeout: 15000,
    });
    if (!data.data?.length) return msg.reply(`_No anime found for "${query}"_`);

    const a = data.data[0];
    const genres = a.genres?.map(g => g.name).join(', ') || 'N/A';
    const studios = a.studios?.map(s => s.name).join(', ') || 'N/A';
    const titles = a.titles?.map(t => t.title).join(' / ') || a.title;

    const text =
      `📺 *${titles}*\n\n` +
      `🎬 Type: ${a.type || 'N/A'}\n` +
      `📡 Status: ${a.status || 'N/A'}\n` +
      `🎞 Episodes: ${a.episodes || '?'}\n` +
      `⏱ Duration: ${a.duration || 'N/A'}\n` +
      `🌟 Score: ${a.score || 'N/A'} (by ${a.scored_by?.toLocaleString() || '?'} users)\n` +
      `🏆 Rank: #${a.rank || 'N/A'}\n` +
      `💥 Popularity: #${a.popularity || 'N/A'}\n` +
      `🗓 Season: ${a.season ? a.season + ' ' + a.year : (a.year || 'N/A')}\n` +
      `😎 Rating: ${a.rating || 'N/A'}\n` +
      `🎭 Genres: ${genres}\n` +
      `🏢 Studios: ${studios}\n` +
      `🔞 Favorites: ${a.favorites?.toLocaleString() || 'N/A'}\n` +
      `🔗 MAL: ${a.url}\n\n` +
      `📝 *Synopsis:*\n${(a.synopsis || 'N/A').slice(0, 600)}${a.synopsis?.length > 600 ? '...' : ''}`;

    const imgUrl = a.images?.jpg?.image_url;
    if (imgUrl) {
      let filePath;
      try {
        filePath = await dl.downloadToFile(imgUrl, 'jpg');
        await dl.sendAndCleanup(msg, filePath, 'image', text);
      } catch {
        if (filePath) dl.cleanup(filePath);
        await msg.reply(text);
      }
    } else {
      await msg.reply(text);
    }
  } catch (e) {
    return msg.reply('_Anime search failed: ' + (e.message || e) + '_');
  }
});
