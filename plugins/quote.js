const { bot, lang } = require('../lib');
const quotes = [
  { q: 'Be yourself; everyone else is already taken.', a: 'Oscar Wilde' },
  { q: 'In the end, it\'s not the years in your life that count. It\'s the life in your years.', a: 'Abraham Lincoln' },
  { q: 'Whether you think you can or you think you can\'t, you\'re right.', a: 'Henry Ford' },
  { q: 'The only way to do great work is to love what you do.', a: 'Steve Jobs' },
  { q: 'Life is what happens when you\'re busy making other plans.', a: 'John Lennon' },
  { q: 'The future belongs to those who believe in the beauty of their dreams.', a: 'Eleanor Roosevelt' },
  { q: 'It does not matter how slowly you go as long as you do not stop.', a: 'Confucius' },
  { q: 'Success is not final, failure is not fatal: It is the courage to continue that counts.', a: 'Winston Churchill' },
];
bot({ pattern: 'quote', desc: lang.plugins.quote.desc, type: 'misc' }, async (msg) => {
  const q = quotes[Math.floor(Math.random() * quotes.length)];
  return msg.send(`💬 *Quote of the moment*\n\n_"${q.q}"_\n\n— *${q.a}*`);
});
