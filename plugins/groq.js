const { bot, lang } = require('../lib');

bot({ pattern: 'groq ?(.*)', desc: lang.plugins.groq.desc, type: 'ai' }, async (msg, match, ctx) => {
  if (!ctx.config.GROQ_API_KEY) return msg.reply(lang.plugins.groq.no_key);
  if (!match) return msg.reply(lang.plugins.groq.usage);
  return msg.reply(`[groq stub] model=${ctx.config.GROQ_MODEL} prompt="${match}"`);
});
