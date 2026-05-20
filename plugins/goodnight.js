const { bot, lang } = require('../lib');
const msgs = [
  '🌙 Good night! Sweet dreams. 😴',
  '🌟 Time to rest. Good night, sleep tight! 🛌',
  '💤 May your dreams be as sweet as you are. Good night! 🌙',
  '🌙 The night is young... for sleeping! Good night! 😂',
];
bot({ pattern: 'goodnight', desc: lang.plugins.goodnight.desc, type: 'misc' }, async (msg) => {
  const m = msgs[Math.floor(Math.random() * msgs.length)];
  const target = (msg.mention && msg.mention[0]) ? `@${msg.mention[0].split('@')[0]} ` : '';
  return msg.send(`${target}${m}`);
});
