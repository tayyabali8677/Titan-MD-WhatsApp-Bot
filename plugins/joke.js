const { bot, lang } = require('../lib');
const jokes = [
  { q: 'Why don\'t scientists trust atoms?', a: 'Because they make up everything!' },
  { q: 'Why did the scarecrow win an award?', a: 'He was outstanding in his field.' },
  { q: 'Why can\'t you give Elsa a balloon?', a: 'Because she will let it go.' },
  { q: 'What do you call a fake noodle?', a: 'An impasta!' },
  { q: 'Why did the bicycle fall over?', a: 'Because it was two-tired.' },
  { q: 'What do you call cheese that isn\'t yours?', a: 'Nacho cheese!' },
  { q: 'Why did the math book look so sad?', a: 'Because it had too many problems.' },
  { q: 'What do you call a sleeping dinosaur?', a: 'A dino-snore!' },
];
bot({ pattern: 'joke', desc: lang.plugins.joke.desc, type: 'misc' }, async (msg) => {
  const j = jokes[Math.floor(Math.random() * jokes.length)];
  return msg.send(`😂 *Random Joke*\n\n❓ ${j.q}\n\n💬 ${j.a}`);
});
