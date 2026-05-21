const { bot, lang } = require('../lib');
const axios = require('axios');
const kv = require('../lib/kv');

const NS = 'groq_chat';
const MAX_HISTORY = 10;

async function callGroq(prompt, history, apiKey, model, systemMsg) {
  const messages = [
    { role: 'system', content: systemMsg || 'You are Titan MD, a helpful WhatsApp bot.' },
    ...history,
    { role: 'user', content: prompt },
  ];
  const r = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    { model, messages, temperature: 0.7, max_tokens: 1024 },
    {
      headers: { Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
      timeout: 45000,
    }
  );
  const text = r.data?.choices?.[0]?.message?.content;
  if (!text) throw new Error('Groq returned no text');
  return text.trim();
}

bot({ pattern: 'groq ?(.*)', desc: lang.plugins.groq.desc, type: 'ai' }, async (msg, match, ctx) => {
  const apiKey = ctx.config.GROQ_API_KEY;
  const model = ctx.config.GROQ_MODEL || 'llama-3.3-70b-versatile';
  if (!apiKey) return msg.reply(lang.plugins.groq.no_key);

  const sub = (match || '').trim();
  if (!sub) return msg.reply(lang.plugins.groq.usage);

  if (sub.toLowerCase() === 'clear') {
    await kv.set(NS, msg.jid, []);
    return msg.reply('✅ Groq conversation history cleared for this chat.');
  }

  try {
    const history = (await kv.get(NS, msg.jid)) || [];
    const reply = await callGroq(sub, history, apiKey, model, ctx.config.GROQ_SYSTEM_MSG);
    history.push({ role: 'user', content: sub });
    history.push({ role: 'assistant', content: reply });
    await kv.set(NS, msg.jid, history.slice(-MAX_HISTORY * 2));
    return msg.reply(reply);
  } catch (e) {
    const detail = e.response?.data?.error?.message || e.message || 'unknown error';
    return msg.reply(`_Groq error: ${detail}_`);
  }
});
