const { bot, lang } = require('../lib');
const axios = require('axios');
const dl = require('../lib/dl');

const TENOR_KEY = 'LIVDSRZULELA';

bot({ pattern: 'gif ?(.*)', desc: lang.plugins.gif?.desc || 'Search and send a GIF', type: 'utility' }, async (msg, match) => {
  const query = (match || '').trim();
  if (!query) return msg.reply('_Usage: .gif <search term>_');

  if (!msg.client || msg.client.constructor.name === 'MockSocket') {
    return msg.reply(`_[mock] GIF: ${query}_`);
  }

  try {
    await msg.reply('_Searching GIFs..._');
    const { data } = await axios.get('https://tenor.googleapis.com/v2/search', {
      params: { q: query, key: TENOR_KEY, limit: 10, media_filter: 'mp4' },
      timeout: 10000,
    });
    const results = data.results || [];
    if (!results.length) return msg.reply(`_No GIFs found for "${query}"_`);

    const pick = results[Math.floor(Math.random() * results.length)];
    const url = pick.media_formats?.mp4?.url || pick.media_formats?.tinygif?.url;
    if (!url) return msg.reply('_Could not get GIF URL._');

    const filePath = await dl.downloadToFile(url, 'mp4');
    const buf = require('fs').readFileSync(filePath);
    dl.cleanup(filePath);

    await msg.client.sendMessage(
      msg.jid,
      { video: buf, gifPlayback: true, caption: `🎬 *${pick.title || query}*`, mimetype: 'video/mp4' },
      { quoted: msg.raw }
    );
  } catch (e) {
    return msg.reply('_GIF search failed: ' + (e.message || e) + '_');
  }
});
