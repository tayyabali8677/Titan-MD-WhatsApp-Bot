const { bot, lang } = require('../lib');
const insults = [
  'You\'re the reason they put instructions on shampoo. 🤦',
  'I\'d agree with you but then we\'d both be wrong. 😬',
  'You\'re not stupid; you just have bad luck thinking. 🧠',
  'I\'ve met some pricks in my time, but you\'re a cactus. 🌵',
  'If laughter is the best medicine, your face must be curing diseases. 😄',
  'You\'re like a cloud — when you disappear, it\'s a beautiful day. ☁️',
  'I\'d call you a tool, but that implies you\'re useful. 🔧',
];
bot({ pattern: 'insult ?(.*)', desc: lang.plugins.insult.desc, type: 'misc' }, async (msg, match) => {
  const target = match || (msg.mention && msg.mention[0] ? `@${msg.mention[0].split('@')[0]}` : '');
  const ins = insults[Math.floor(Math.random() * insults.length)];
  return msg.send(`😈 *Roast${target ? ` for ${target}` : ''}:*\n\n${ins}`);
});
