const { bot, lang } = require('../lib');

bot({ pattern: 'ss ?(.*)', desc: lang.plugins.ss.desc, type: 'utility' }, async (msg, match) => {
  if (!match) return msg.reply(lang.plugins.ss.usage);
  return msg.reply(`[mock screenshot] ${match}\nhttps://cdn.titanmd.site/mock/ss-${Date.now()}.png`);
});
