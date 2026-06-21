const { bot, lang } = require('../lib');
const axios = require('axios');

bot({ pattern: 'lyrics ?(.*)', desc: lang.plugins.lyrics.desc, type: 'utility' }, async (msg, match) => {
  const query = (match || '').trim();
  if (!query) return msg.reply('_Usage: .lyrics <song name or artist - title>_');

  if (!msg.client || msg.client.constructor.name === 'MockSocket') {
    return msg.reply(`_[mock] Lyrics for "${query}"_`);
  }

  try {
    await msg.reply('_Searching lyrics..._');
    const { data } = await axios.get(`https://lrclib.net/api/search`, {
      params: { q: query },
      timeout: 12000,
    });
    if (!data || !data.length) return msg.reply(`_No lyrics found for "${query}"_`);

    const song = data[0];
    const lyrics = song.plainLyrics || song.syncedLyrics?.replace(/\[\d+:\d+\.\d+\]/g, '').trim();
    if (!lyrics) return msg.reply(`_No lyrics text for "${song.trackName}"_`);

    const header = `🎵 *${song.trackName}*\n👤 ${song.artistName}${song.albumName ? '\n💿 ' + song.albumName : ''}\n\n`;
    const full = header + lyrics;
    if (full.length > 4000) {
      return msg.reply(full.slice(0, 4000) + '\n\n_...truncated_');
    }
    return msg.reply(full);
  } catch (e) {
    return msg.reply('_Lyrics fetch failed: ' + (e.message || e) + '_');
  }
});
