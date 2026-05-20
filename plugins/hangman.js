const { bot, lang } = require('../lib');
const WORDS = ['javascript','python','database','algorithm','variable','function','boolean','integer','compiler','framework','interface','recursion','iteration','abstract','polymorphism'];
const STAGES = ['😵 7 left','😰 6 left','😨 5 left','😧 4 left','😦 3 left','😟 2 left','😢 1 left','💀 0 left'];
const games = new Map();

bot({ pattern: 'hangman ?(.*)', desc: lang.plugins.hangman.desc, type: 'game' }, async (msg, match) => {
  const key = msg.jid;
  const sub = (match || '').trim().toLowerCase();
  if (sub === 'start' || sub === '') {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    games.set(key, { word, guessed: new Set(), wrong: 0 });
    const display = word.split('').map(() => '_').join(' ');
    return msg.reply(lang.plugins.hangman.started.replace('{0}', display).replace('{1}', '7'));
  }
  const g = games.get(key);
  if (!g) return msg.reply('No active game. Send .hangman start');
  if (sub === 'end' || sub === 'stop') { games.delete(key); return msg.reply('Game ended.'); }
  if (sub.length !== 1) return msg.reply(lang.plugins.hangman.usage);
  const letter = sub;
  if (g.guessed.has(letter)) return msg.reply(lang.plugins.hangman.already);
  g.guessed.add(letter);
  if (!g.word.includes(letter)) {
    g.wrong++;
    if (g.wrong >= 7) { games.delete(key); return msg.reply(lang.plugins.hangman.lose.replace('{0}', g.word)); }
    const display = g.word.split('').map((c) => g.guessed.has(c) ? c : '_').join(' ');
    return msg.reply(`${lang.plugins.hangman.wrong.replace('{0}', letter).replace('{1}', 7 - g.wrong)}\n${display}\n${STAGES[g.wrong - 1]}`);
  }
  const display = g.word.split('').map((c) => g.guessed.has(c) ? c : '_').join(' ');
  if (!display.includes('_')) { games.delete(key); return msg.reply(lang.plugins.hangman.win.replace('{0}', g.word)); }
  return msg.reply(`${lang.plugins.hangman.correct.replace('{0}', display)}\n${STAGES[g.wrong]}`);
});
