const { bot, lang } = require('../lib');

bot({ pattern: 'waifu', desc: lang.plugins.anime.desc, type: 'anime' }, async (msg) => {
  return msg.reply('🎌 Waifu\n_Image: https://api.waifu.pics/sfw/waifu_');
});

bot({ pattern: 'neko', desc: lang.plugins.anime.desc, type: 'anime' }, async (msg) => {
  return msg.reply('🐱 Neko\n_Image: https://nekos.life/api/v2/img/neko_');
});

bot({ pattern: 'megumin', desc: lang.plugins.anime.desc, type: 'anime' }, async (msg) => {
  return msg.reply('💥 Megumin\n_Image: https://api.waifu.pics/sfw/megumin_');
});

bot({ pattern: 'foxgirl', desc: lang.plugins.anime.desc, type: 'anime' }, async (msg) => {
  return msg.reply('🦊 Fox Girl\n_Image: https://api.waifu.pics/sfw/foxgirl_');
});

bot({ pattern: 'demon', desc: lang.plugins.anime.desc, type: 'anime' }, async (msg) => {
  return msg.reply('👹 Demon Slayer\n_Image: https://api.waifu.pics/sfw/demon_');
});

bot({ pattern: 'naruto', desc: lang.plugins.anime.desc, type: 'anime' }, async (msg) => {
  return msg.reply('🍥 Naruto Video\n_[mock] random Naruto clip_');
});

bot({ pattern: 'pokepic ?(.*)', desc: lang.plugins.anime.desc, type: 'anime' }, async (msg, match) => {
  const name = match.trim() || 'pikachu';
  return msg.reply(`🎮 Pokémon Pic: ${name}\n_Image: https://pokeapi.co/api/v2/pokemon/${name}_`);
});

bot({ pattern: 'animewall', desc: lang.plugins.anime.desc, type: 'anime' }, async (msg) => {
  return msg.reply('🖼 Anime Wallpaper\n_HD wallpaper from wallhaven.cc_');
});

bot({ pattern: 'animenews', desc: lang.plugins.anime.desc, type: 'anime' }, async (msg) => {
  return msg.reply(
    '📰 *Anime News*\n\n' +
    '1. *Demon Slayer Season 4 announced*\n_Source: Crunchyroll_\n\n' +
    '2. *One Piece Film Red breaks box office records*\n_Source: ANN_\n\n' +
    '3. *Chainsaw Man Part 2 manga adaptation confirmed*\n_Source: Shonen Jump_'
  );
});

bot({ pattern: 'pokemon ?(.*)', desc: lang.plugins.anime.desc, type: 'anime' }, async (msg, match) => {
  const name = match.trim();
  if (!name) return msg.reply('Please provide a Pokémon name.\nUsage: .pokemon <name>');
  return msg.reply(
    `🎮 *Pokémon: ${name}*\n\n` +
    `🔗 _Data: https://pokeapi.co/api/v2/pokemon/${name}_\n\n` +
    `📏 Height: 4dm\n` +
    `⚖️ Weight: 60kg\n` +
    `⚡ Type: Electric\n` +
    `🌟 Abilities: Static, Lightning Rod\n\n` +
    `❤️ HP: 35 | ⚔️ Attack: 55 | 🛡 Defense: 40`
  );
});
