const { bot, lang } = require('../lib');

const MOCK_MOVIES = {
  default: { title: 'Inception', year: 2010, rating: '8.8/10', genre: 'Sci-Fi, Thriller', director: 'Christopher Nolan', plot: 'A thief who steals corporate secrets through the use of dream-sharing technology.' },
};

bot({ pattern: 'movie ?(.*)', desc: lang.plugins.movie.desc, type: 'misc' }, async (msg, match, ctx) => {
  if (!match) return msg.reply(lang.plugins.movie.usage);
  if (!process.env.OMDB_KEY) {
    const m = MOCK_MOVIES.default;
    return msg.reply(`🎬 *${m.title}* (${m.year})\n⭐ ${m.rating}\n🎭 ${m.genre}\n🎬 ${m.director}\n📝 ${m.plot}\n\n[mock] Set OMDB_KEY for real data.`);
  }
  return msg.reply(`[stub] OMDB search for "${match}".`);
});
