const { bot, lang } = require('../lib');
const answers = [
  '✅ It is certain.','✅ It is decidedly so.','✅ Without a doubt.',
  '✅ Yes definitely.','✅ You may rely on it.','✅ As I see it, yes.',
  '✅ Most likely.','✅ Outlook good.','✅ Yes.','✅ Signs point to yes.',
  '🤔 Reply hazy, try again.','🤔 Ask again later.',
  '🤔 Better not tell you now.','🤔 Cannot predict now.',
  '🤔 Concentrate and ask again.',
  '❌ Don\'t count on it.','❌ My reply is no.',
  '❌ My sources say no.','❌ Outlook not so good.','❌ Very doubtful.',
];
bot({ pattern: '8ball ?(.*)', desc: lang.plugins.eightball.desc, type: 'misc' }, async (msg, match) => {
  if (!match) return msg.reply(lang.plugins.eightball.usage);
  const ans = answers[Math.floor(Math.random() * answers.length)];
  return msg.send(`🎱 *Magic 8-Ball*\n\n❓ ${match}\n\n${ans}`);
});
