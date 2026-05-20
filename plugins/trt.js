const { bot, lang } = require('../lib');

bot({ pattern: 'trt ?(.*)', desc: lang.plugins.trt.desc, type: 'utility' }, async (msg, match) => {
  if (!match) return msg.reply(lang.plugins.trt.usage);
  const [target, ...rest] = match.split(/\s+/);
  return msg.reply(`[mock] translated to ${target}: ${rest.join(' ')}`);
});
