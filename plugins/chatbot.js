const { bot, lang } = require('../lib');
const kv = require('../lib/kv');
const responses = [
  'That\'s interesting! Tell me more.','I see what you mean.','How does that make you feel?',
  'That\'s a great point!','I hadn\'t thought of it that way.','Really? Tell me more!',
  'Hmm, that\'s something to think about.','I agree with you on that.',
];
bot({ pattern: 'chatbot ?(.*)', desc: lang.plugins.chatbot.desc, type: 'ai' }, async (msg, match, ctx) => {
  if (!ctx.isSudo) return msg.reply(lang.plugins.common.sudo_only);
  const sub = (match || '').trim().toLowerCase();
  if (sub === 'on')  { await kv.set('chatbot', msg.jid, { on: true });  return msg.reply(lang.plugins.chatbot.on); }
  if (sub === 'off') { await kv.set('chatbot', msg.jid, { on: false }); return msg.reply(lang.plugins.chatbot.off); }
  const s = await kv.get('chatbot', msg.jid) || { on: false };
  return msg.reply(`chatbot: ${s.on ? 'on' : 'off'}\n[Uses GROQ_API_KEY if available, else mock responses]`);
});
