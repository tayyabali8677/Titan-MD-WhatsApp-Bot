const { bot, lang } = require('../lib');
const lines = [
  'Are you a magician? Because whenever I look at you, everyone else disappears. ✨',
  'Do you have a map? I keep getting lost in your eyes. 🗺️',
  'Are you made of copper and tellurium? Because you\'re CuTe. ⚗️',
  'If you were a vegetable, you\'d be a cute-cumber. 🥒',
  'Do you believe in love at first sight, or should I walk by again? 😏',
  'Are you a parking ticket? Because you\'ve got "fine" written all over you. 🎟️',
  'Is your name Google? Because you have everything I\'ve been searching for. 🔍',
];
bot({ pattern: 'flirt ?(.*)', desc: lang.plugins.flirt.desc, type: 'misc' }, async (msg, match) => {
  const target = match || (msg.mention && msg.mention[0] ? `@${msg.mention[0].split('@')[0]}` : '');
  const line = lines[Math.floor(Math.random() * lines.length)];
  return msg.send(`💘 ${target ? `*For ${target}:*\n\n` : ''}${line}`);
});
