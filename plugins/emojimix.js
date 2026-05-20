const { bot, lang } = require('../lib');
bot({ pattern: 'emojimix ?(.*)', desc: lang.plugins.emojimix.desc, type: 'media' }, async (msg, match) => {
  if (!match) return msg.reply(lang.plugins.emojimix.usage);
  const parts = match.trim().split(/\s+/);
  const e1 = parts[0] || '😀';
  const e2 = parts[1] || '🔥';
  // Google Emoji Kitchen URL pattern
  const cp1 = e1.codePointAt(0).toString(16);
  const cp2 = e2.codePointAt(0).toString(16);
  const url = `https://www.gstatic.com/android/keyboard/emojikitchen/20201001/u${cp1}/u${cp1}_u${cp2}.png`;
  return msg.reply(`[mock] emoji mix ${e1} + ${e2}\n${url}\nRequires valid Google Emoji Kitchen pair.`);
});
