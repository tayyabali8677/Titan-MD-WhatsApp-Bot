const { bot, lang } = require('../lib');

bot({ pattern: 'setstatus ?(.*)', desc: lang.plugins.setstatus.desc, type: 'utility' }, async (msg, match) => {
  if (!match) return msg.reply(lang.plugins.setstatus.usage);
  return msg.reply(`[mock] status broadcast: ${match}`);
});

bot({ pattern: 'scstatus ?(.*)', desc: lang.plugins.scstatus.desc, type: 'utility' }, async (msg, match) => {
  if (!match) return msg.reply(lang.plugins.scstatus.usage);
  return msg.reply(`[mock] scheduled: ${match}`);
});
