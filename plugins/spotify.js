const { bot, lang } = require('../lib');
const { mockFetch } = require('../lib/fetcher');
bot({ pattern: 'spotify ?(.*)', desc: lang.plugins.spotify.desc, type: 'downloader' }, async (msg, match, ctx) => {
  if (!match) return msg.reply(lang.plugins.spotify.usage);
  if (!ctx.config.GEMINI_API_KEY && !process.env.SPOTIFY_CLIENT_ID) return msg.reply(JSON.stringify(mockFetch('spotify', match)));
  return msg.reply('[stub] real spotify-dl integration.');
});
