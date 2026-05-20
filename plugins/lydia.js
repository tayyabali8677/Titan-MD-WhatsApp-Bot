const { bot, lang } = require('../lib');

bot({ pattern: 'lydia ?(.*)', desc: lang.plugins.lydia.desc, type: 'ai' }, async (msg, match) => {
  if (!match) return msg.reply(lang.plugins.lydia.usage);
  const replies = [
    'That\'s an interesting thought!',
    'Tell me more about that.',
    'Hmm, let me think about it.',
    'I agree with you on that.',
    'Can you elaborate?',
  ];
  const r = replies[Math.floor(Math.random() * replies.length)];
  return msg.reply(`🤖 Lydia: ${r}`);
});
