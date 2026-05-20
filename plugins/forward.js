const { bot, lang } = require('../lib');

bot({ pattern: 'forward ?(.*)', desc: lang.plugins.forward.desc, type: 'utility' }, async (msg, match) => {
  if (!msg.reply_message) return msg.reply(lang.plugins.forward.usage);
  const target = (match || '').trim() || msg.jid;
  return msg.reply(`[mock] forwarded message to ${target}.`);
});
