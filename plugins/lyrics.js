const { bot, lang } = require('../lib');
bot({ pattern: 'lyrics ?(.*)', desc: lang.plugins.lyrics.desc, type: 'utility' }, async (msg, match) => {
  if (!match) return msg.reply(lang.plugins.lyrics.usage);
  // Mock lyrics response - real implementation uses lyrics.ovh or similar
  return msg.reply(
    `🎵 *Lyrics: ${match}*\n\n` +
    `[mock] Verse 1:\nThis is a mock lyrics response for "${match}".\n` +
    `The real lyrics would appear here.\n\n` +
    `Chorus:\nLa la la, this is mock.\nReal data needs a lyrics API.\n\n` +
    `[Set LYRICS_API_KEY for real lyrics via genius.com]`
  );
});
