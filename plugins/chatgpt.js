const { bot, lang } = require('../lib');
const axios = require('axios');
const kv = require('../lib/kv');

const NS = 'gpt_chat';
const MAX_HISTORY = 10;

async function callOpenAI(prompt, history, apiKey, model) {
  const messages = [
    { role: 'system', content: 'You are Titan MD, a helpful WhatsApp bot.' },
    ...history,
    { role: 'user', content: prompt },
  ];
  const r = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    { model, messages, temperature: 0.7, max_tokens: 1024 },
    {
      headers: { Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
      timeout: 60000,
    }
  );
  const text = r.data?.choices?.[0]?.message?.content;
  if (!text) throw new Error('OpenAI returned no text');
  return text.trim();
}

bot({ pattern: 'chatgpt ?(.*)', desc: lang.plugins.chatgpt.desc, type: 'ai' }, async (msg, match, ctx) => {
  const sub = (match || '').trim();
  if (!sub) return msg.reply(lang.plugins.chatgpt.usage);

  const apiKey = ctx.config.OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  const model = ctx.config.MODEL || 'gpt-3.5-turbo';
  const gptMode = ctx.config.GPT || 'free';

  if (sub.toLowerCase() === 'clear') {
    await kv.set(NS, msg.jid, []);
    return msg.reply('✅ ChatGPT conversation history cleared for this chat.');
  }

  // No key or in free mode → friendly stub explaining how to enable
  if (gptMode === 'free' || !apiKey) {
    return msg.reply(
      '_ChatGPT requires a paid OpenAI account._\n\n' +
      '1. Sign up at https://platform.openai.com\n' +
      '2. Add $5 credit\n' +
      '3. Create API key at https://platform.openai.com/api-keys\n' +
      '4. Set env vars on your bot:\n' +
      '   `OPENAI_API_KEY=sk-...`\n' +
      '   `GPT=paid`\n' +
      '5. Restart the bot\n\n' +
      '_Or use `.gemini` (free) or `.groq` (free) for now._'
    );
  }

  try {
    const history = (await kv.get(NS, msg.jid)) || [];
    const reply = await callOpenAI(sub, history, apiKey, model);
    history.push({ role: 'user', content: sub });
    history.push({ role: 'assistant', content: reply });
    await kv.set(NS, msg.jid, history.slice(-MAX_HISTORY * 2));
    return msg.reply(reply);
  } catch (e) {
    const detail = e.response?.data?.error?.message || e.message || 'unknown error';
    return msg.reply(`_ChatGPT error: ${detail}_`);
  }
});

// .gpt as a friendlier alias
bot({ pattern: 'gpt ?(.*)', desc: 'Chat with ChatGPT (alias)', type: 'ai' }, async (msg, match, ctx) => {
  // Re-dispatch to chatgpt handler logic
  const sub = (match || '').trim();
  if (!sub) return msg.reply('_Usage:_ `.gpt <prompt>` — alias of `.chatgpt`');
  // Call into the same flow by simulating
  const apiKey = ctx.config.OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  const model = ctx.config.MODEL || 'gpt-3.5-turbo';
  const gptMode = ctx.config.GPT || 'free';
  if (gptMode === 'free' || !apiKey) {
    return msg.reply('_Set OPENAI_API_KEY + GPT=paid to enable. Try `.gemini` or `.groq` for free AI._');
  }
  try {
    const history = (await kv.get(NS, msg.jid)) || [];
    const reply = await callOpenAI(sub, history, apiKey, model);
    history.push({ role: 'user', content: sub });
    history.push({ role: 'assistant', content: reply });
    await kv.set(NS, msg.jid, history.slice(-MAX_HISTORY * 2));
    return msg.reply(reply);
  } catch (e) {
    const detail = e.response?.data?.error?.message || e.message || 'unknown error';
    return msg.reply(`_ChatGPT error: ${detail}_`);
  }
});
