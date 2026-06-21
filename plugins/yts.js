const { bot, lang } = require('../lib');
const { Innertube } = require('youtubei.js');

let _yt;
async function getYT() {
  if (!_yt) _yt = await Innertube.create({ retrieve_player: false });
  return _yt;
}

bot({ pattern: 'yts ?(.*)', desc: lang.plugins.yts?.desc || 'Search YouTube videos', type: 'downloader' }, async (msg, match) => {
  const query = (match || '').trim();
  if (!query) return msg.reply('_Usage: .yts <search query>_');

  if (!msg.client || msg.client.constructor.name === 'MockSocket') {
    return msg.reply(`_[mock] YT search: "${query}"_`);
  }

  try {
    await msg.reply('_Searching YouTube..._');
    const yt = await getYT();
    const results = await yt.search(query, { type: 'video' });
    const videos = (results.videos || []).slice(0, 8);

    if (!videos.length) return msg.reply(`_No results for "${query}"_`);

    const lines = videos.map((v, i) => {
      const dur = v.duration?.text || '?';
      const views = v.view_count?.text || '';
      return `*${i + 1}.* ${v.title?.text || 'Unknown'}\n    ⏱ ${dur}  👁 ${views}\n    🔗 https://youtu.be/${v.id}`;
    });

    return msg.reply(
      `🔎 *YouTube Search: ${query}*\n\n${lines.join('\n\n')}\n\n_Use .yta <url> or .ytv <url> to download_`
    );
  } catch (e) {
    return msg.reply('_YouTube search failed: ' + (e.message || e) + '_');
  }
});
