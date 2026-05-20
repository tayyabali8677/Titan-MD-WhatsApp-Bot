const { bot, lang } = require('../lib');

bot({ pattern: 'song ?(.*)', desc: lang.plugins.downloads2.desc, type: 'downloader' }, async (msg, match) => {
  const query = match.trim();
  if (!query) return msg.reply('_Usage: .song <song name>_');
  return msg.reply(
    `🎵 *Song: ${query}*\n\n` +
    `*Artist:* Mock Artist\n` +
    `*Duration:* 3:45\n` +
    `*Album:* Mock Album\n\n` +
    `_[mock] Audio downloading..._`
  );
});

bot({ pattern: 'video ?(.*)', desc: lang.plugins.downloads2.desc, type: 'downloader' }, async (msg, match) => {
  const query = match.trim();
  if (!query) return msg.reply('_Usage: .video <query or URL>_');
  return msg.reply(
    `🎬 *Video: ${query}*\n\n` +
    `*Duration:* 4:20\n` +
    `*Views:* 1.2M\n\n` +
    `_[mock] Video downloading..._`
  );
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
