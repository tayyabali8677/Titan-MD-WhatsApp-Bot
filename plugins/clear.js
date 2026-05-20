const { bot, lang } = require('../lib');

bot({ pattern: 'clear ?(.*)', desc: lang.plugins.clear.desc, type: 'utility' }, async (msg, match, ctx) => {
  if (!ctx.isSudo) return msg.reply(lang.plugins.common.sudo_only);
  const count = parseInt(match || '10', 10) || 10;
  return msg.reply(`[mock] cleared ${count} messages from ${msg.jid}.`);
});
