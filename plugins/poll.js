const { bot, lang } = require('../lib');
bot({ pattern: 'poll ?(.*)', desc: lang.plugins.poll.desc, type: 'utility' }, async (msg, match) => {
  const [question, ...opts] = (match || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (!question || opts.length < 2) return msg.reply(lang.plugins.poll.usage);
  return msg.send({ poll: { name: question, options: opts } }, {}, 'poll');
});
