const { bot, lang } = require('../lib');

bot({ pattern: 'gemini ?(.*)', desc: lang.plugins.gemini.desc, type: 'ai' }, async (msg, match, ctx) => {
  if (!ctx.config.GEMINI_API_KEY) return msg.reply(lang.plugins.gemini.no_key);
  if (!match) return msg.reply(lang.plugins.gemini.usage);
  return msg.reply(`[gemini stub] model=${ctx.config.GEMINI_MODEL} prompt="${match}"`);
});
