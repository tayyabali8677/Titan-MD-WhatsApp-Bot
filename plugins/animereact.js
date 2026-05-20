const { bot, lang } = require('../lib');

// Anime-reaction sticker commands. Each tags the mentioned user when present.
const reactions = [
  { name: 'hug',  emoji: '🤗' },
  { name: 'pat',  emoji: '🫳' },
  { name: 'poke', emoji: '👉' },
  { name: 'cry',  emoji: '😭' },
  { name: 'wink', emoji: '😉' },
  { name: 'nom',  emoji: '😋' },
];

for (const { name, emoji } of reactions) {
  bot(
    {
      pattern: `${name} ?(.*)`,
      desc: (lang.plugins[name] && lang.plugins[name].desc) || `Send a ${name} anime reaction sticker`,
      type: 'fun',
    },
    async (msg) => {
      const target = msg.mention && msg.mention[0];
      if (target) return msg.reply(`_[mock] ${emoji} You ${name}ged @${String(target).split('@')[0]}!_`);
      return msg.reply(`_[mock] ${emoji} ${name} sticker_`);
    }
  );
}
