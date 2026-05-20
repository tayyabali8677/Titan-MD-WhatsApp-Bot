const { bot, lang } = require('../lib');

const triviaQuestions = [
  'What is the capital of France? (Paris)',
  'How many planets are in our solar system? (8)',
  'What is the chemical symbol for water? (H2O)',
  'Who painted the Mona Lisa? (Leonardo da Vinci)',
  'What is the largest ocean on Earth? (Pacific Ocean)',
  'What year did World War II end? (1945)',
  'What is the fastest land animal? (Cheetah)',
  'How many sides does a hexagon have? (6)',
  'What is the square root of 144? (12)',
  'Which planet is known as the Red Planet? (Mars)',
];

bot({ pattern: 'question', desc: lang.plugins.question.desc, type: 'fun' }, async (msg) => {
  const q = triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];
  return msg.reply(`🎯 *Trivia Question*\n\n${q}`);
});

bot({ pattern: 'simp ?(.*)', desc: lang.plugins.simp?.desc || 'Calculate simp level', type: 'fun' }, async (msg, match) => {
  const target = match || msg.pushName;
  const level = Math.floor(Math.random() * 101);
  return msg.reply(
    `💘 *Simp Meter*\n\n👤 User: *${target}*\n💝 Simp Level: *${level}%*\n${'█'.repeat(Math.floor(level / 10))}${'░'.repeat(10 - Math.floor(level / 10))}\n\n${level > 80 ? '😭 MAXIMUM SIMP!' : level > 50 ? '😅 Pretty simpy!' : '😎 Not a simp!'}`
  );
});

bot({ pattern: 'stupid ?(.*)', desc: lang.plugins.stupid?.desc || 'Calculate stupid level', type: 'fun' }, async (msg, match) => {
  const target = match || msg.pushName;
  const level = Math.floor(Math.random() * 101);
  return msg.reply(
    `🧠 *Stupidity Meter*\n\n👤 User: *${target}*\n🤡 Stupid Level: *${level}%*\n${'█'.repeat(Math.floor(level / 10))}${'░'.repeat(10 - Math.floor(level / 10))}\n\n${level > 80 ? '💀 MAXIMUM STUPID!' : level > 50 ? '😬 Pretty dumb!' : '✅ Not that stupid!'}`
  );
});
