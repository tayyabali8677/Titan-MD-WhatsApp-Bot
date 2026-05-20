const { bot, lang } = require('../lib');
const kv = require('../lib/kv');

function newQuestion() {
  const a = Math.floor(Math.random() * 50) + 1;
  const b = Math.floor(Math.random() * 50) + 1;
  return { a, b, answer: a + b };
}

bot({ pattern: 'mathgame ?(.*)', desc: lang.plugins.mathgame?.desc || 'Math quiz game', type: 'fun' }, async (msg, match) => {
  const arg = (match || '').trim();
  const state = (await kv.get('mathgame', msg.jid)) || { score: 0, current: null };

  if (!arg || arg.toLowerCase() === 'start') {
    const q = newQuestion();
    state.current = q;
    await kv.set('mathgame', msg.jid, state);
    return msg.reply(`🧮 *Math Game*\nScore: ${state.score}\n\nWhat is *${q.a} + ${q.b}*?\n_Reply with .mathgame <answer>_`);
  }

  if (!state.current) {
    return msg.reply('_No active question. Use .mathgame to start._');
  }

  const guess = parseInt(arg, 10);
  if (isNaN(guess)) return msg.reply('_Provide a number. Usage: .mathgame <answer>_');

  if (guess === state.current.answer) {
    state.score += 1;
    const q = newQuestion();
    state.current = q;
    await kv.set('mathgame', msg.jid, state);
    return msg.reply(`✅ Correct! Score: *${state.score}*\n\nNext: *${q.a} + ${q.b}* = ?`);
  } else {
    const correct = state.current.answer;
    state.current = null;
    await kv.set('mathgame', msg.jid, state);
    return msg.reply(`❌ Wrong! Correct answer was *${correct}*.\nFinal score: *${state.score}*\n_Use .mathgame to play again._`);
  }
});
