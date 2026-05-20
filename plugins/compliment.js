const { bot, lang } = require('../lib');
const compliments = [
  'You have an incredible smile! 😊',
  'You make the world a better place just by being in it. 🌟',
  'Your kindness is genuinely contagious. ✨',
  'You have an amazing ability to find good in everything. 💫',
  'You are more fun than a ball pit filled with puppies. 🐶',
  'You\'re as bright as the sun and twice as warm. ☀️',
  'Everything would be better with a bit more of you. ❤️',
  'You have a gift for making people feel heard and understood. 💎',
];
bot({ pattern: 'compliment ?(.*)', desc: lang.plugins.compliment.desc, type: 'misc' }, async (msg, match) => {
  const target = match ? `@${match.split('@')[0]}` : (msg.mention && msg.mention[0] ? `@${msg.mention[0].split('@')[0]}` : msg.pushName);
  const c = compliments[Math.floor(Math.random() * compliments.length)];
  return msg.send(`💐 *Compliment for ${target}*\n\n${c}`);
});
