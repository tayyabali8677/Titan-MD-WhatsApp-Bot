const { bot, lang } = require('../lib');
const axios = require('axios');
const kv = require('../lib/kv');

const NS = 'gemini_chat';
const MAX_HISTORY = 10; // pairs of user+model turns kept for context

async function callGemini(prompt, history, apiKey, model) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const contents = [
    ...history.map((h) => ({ role: h.role, parts: [{ text: h.text }] })),
    { role: 'user', parts: [{ text: prompt }] },
  ];
  const r = await axios.post(url, {
    contents,
    generationConfig: { temperature: 0.9, maxOutputTokens: 1024 },
  }, { timeout: 45000 });
  const text = r.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini returned no text');
  return text.trim();
}

bot({ pattern: 'gemini ?(.*)', desc: lang.plugins.gemini.desc, type: 'ai' }, async (msg, match, ctx) => {
  const apiKey = ctx.config.GEMINI_API_KEY;
  const model = ctx.config.GEMINI_MODEL || 'gemini-2.5-flash';
  if (!apiKey) return msg.reply(lang.plugins.gemini.no_key);

  const sub = (match || '').trim();
  if (!sub) return msg.reply(lang.plugins.gemini.usage);

  // Special subcommand: .gemini clear → wipe this chat's history
  if (sub.toLowerCase() === 'clear') {
    await kv.set(NS, msg.jid, []);
    return msg.reply('✅ Gemini conversation history cleared for this chat.');
  }

  try {
    const history = (await kv.get(NS, msg.jid)) || [];
    const reply = await callGemini(sub, history, apiKey, model);
    history.push({ role: 'user', text: sub });
    history.push({ role: 'model', text: reply });
    // Keep only last MAX_HISTORY turns
    const trimmed = history.slice(-MAX_HISTORY * 2);
    await kv.set(NS, msg.jid, trimmed);
    return msg.reply(reply);
  } catch (e) {
    const detail = e.response?.data?.error?.message || e.message || 'unknown error';
    return msg.reply(`_Gemini error: ${detail}_`);
  }
});
