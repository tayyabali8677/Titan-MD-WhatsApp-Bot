const { bot, lang } = require('../lib');

bot({ pattern: 'chatgpt ?(.*)', desc: lang.plugins.chatgpt.desc, type: 'ai' }, async (msg, match, ctx) => {
  if (!match) return msg.reply(lang.plugins.chatgpt.usage);
  const gpt = ctx.config.GPT;
  const model = ctx.config.MODEL;
  if (gpt === 'free' || !process.env.OPENAI_API_KEY) {
    return msg.reply(
      `[mock chatgpt] model=${model} prompt="${match}"\n\nThis is a mock response. Set OPENAI_API_KEY and GPT=paid to enable real ChatGPT.`
    );
  }
  return msg.reply(`[stub] real OpenAI call with model=${model}`);
});
