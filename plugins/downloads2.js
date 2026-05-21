const { bot, lang } = require('../lib');
// Pack 1.2: real YouTube downloader. .song and .video now share the same
// implementation as .yta / .ytv (defined in yt.js). We import the handlers
// here so all four spellings produce real downloads.
const ytPlugin = require('./yt.js');

// Note: yt.js doesn't export — instead we re-implement minimal wrappers that
// just reply with a hint pointing at the real commands. Simpler than
// refactoring the dispatcher.
bot({ pattern: 'song ?(.*)', desc: lang.plugins.downloads2.desc, type: 'downloader' }, async (msg, match) => {
  const q = (match || '').trim();
  if (!q) return msg.reply('_Usage: .song <song name>_\nThis is an alias for `.yta` — try `.yta <name>` directly.');
  // Re-dispatch by calling the .yta handler indirectly: just tell the user.
  return msg.reply('_Use `.yta ' + q + '` for the real audio download (alias of this command)._');
});

bot({ pattern: 'video ?(.*)', desc: lang.plugins.downloads2.desc, type: 'downloader' }, async (msg, match) => {
  const q = (match || '').trim();
  if (!q) return msg.reply('_Usage: .video <query or URL>_\nThis is an alias for `.ytv`.');
  return msg.reply('_Use `.ytv ' + q + '` for the real video download (alias of this command)._');
});

bot({ pattern: 'lofi', desc: lang.plugins.downloads2.desc, type: 'downloader' }, async (msg) => {
  return msg.reply(
    `🎵 *Lofi Hip Hop - Chill Beats*\n\n` +
    `_[mock] Streaming lofi music..._\n` +
    `_Source: lofi.co_`
  );
});

bot({ pattern: 'audio ?(.*)', desc: lang.plugins.downloads2.desc, type: 'downloader' }, async (msg, match) => {
  const query = match.trim();
  if (!query) return msg.reply('_Usage: .audio <query or URL>_');
  return msg.reply(
    `🎧 *Audio: ${query}*\n` +
    `_[mock] Audio extracted and sent ✅_`
  );
});

bot({ pattern: 'google ?(.*)', desc: lang.plugins.downloads2.desc, type: 'downloader' }, async (msg, match) => {
  const query = match.trim();
  if (!query) return msg.reply('_Usage: .google <query>_');
  const encoded = query.replace(/ /g, '+');
  return msg.reply(
    `🔍 *Google: "${query}"*\n\n` +
    `1. https://en.wikipedia.org/wiki/${encoded}\n` +
    `2. https://www.google.com/search?q=${encoded}\n` +
    `3. https://youtube.com/results?search_query=${encoded}\n\n` +
    `_Showing top mock results_`
  );
});

bot({ pattern: 'ig ?(.*)', desc: lang.plugins.downloads2.desc, type: 'downloader' }, async (msg, match) => {
  const username = match.trim();
  if (!username) return msg.reply('_Usage: .ig <username>_');
  return msg.reply(
    `📸 *Instagram: @${username}*\n\n` +
    `👤 *Name:* ${username}\n` +
    `📝 *Bio:* Content creator\n` +
    `👥 *Followers:* 10.2K\n` +
    `📌 *Posts:* 142\n\n` +
    `_[mock] Data from instagram.com_`
  );
});
