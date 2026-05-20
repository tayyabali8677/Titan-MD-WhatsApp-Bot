const { bot, lang } = require('../lib');
const questions = [
  { q: 'What is the capital of France?',        opts: ['Berlin','Madrid','Paris','Rome'],    ans: 2 },
  { q: 'What is 2 + 2?',                         opts: ['3','4','5','6'],                    ans: 1 },
  { q: 'Which planet is closest to the Sun?',    opts: ['Venus','Earth','Mars','Mercury'],   ans: 3 },
  { q: 'What is the largest ocean?',             opts: ['Atlantic','Indian','Pacific','Arctic'], ans: 2 },
  { q: 'Who wrote Romeo and Juliet?',            opts: ['Dickens','Shakespeare','Tolstoy','Hemingway'], ans: 1 },
  { q: 'What is H2O commonly known as?',         opts: ['Salt','Sugar','Water','Acid'],       ans: 2 },
  { q: 'How many continents are there on Earth?',opts: ['5','6','7','8'],                    ans: 2 },
  { q: 'What color is the sky on a clear day?',  opts: ['Green','Blue','Red','Yellow'],      ans: 1 },
];
const active = new Map();
const LETTERS = ['A','B','C','D'];
bot({ pattern: 'trivia ?(.*)', desc: lang.plugins.trivia.desc, type: 'game' }, async (msg, match) => {
  const key = msg.jid;
  const sub = (match || '').trim().toUpperCase();
  if (!active.has(key) || sub === 'START') {
    const q = questions[Math.floor(Math.random() * questions.length)];
    active.set(key, { ...q, started: Date.now() });
    return msg.reply(
      lang.plugins.trivia.question
        .replace('{0}', q.q)
        .replace('{1}', q.opts[0]).replace('{2}', q.opts[1])
        .replace('{3}', q.opts[2]).replace('{4}', q.opts[3])
    );
  }
  const g = active.get(key);
  if (['A','B','C','D'].includes(sub)) {
    active.delete(key);
    const idx = LETTERS.indexOf(sub);
    if (idx === g.ans) return msg.reply(lang.plugins.trivia.correct);
    return msg.reply(lang.plugins.trivia.wrong.replace('{0}', `${LETTERS[g.ans]}) ${g.opts[g.ans]}`));
  }
  return msg.reply('Send A, B, C or D to answer, or .trivia start for a new question.');
});
