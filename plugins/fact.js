const { bot, lang } = require('../lib');
const facts = [
  'Honey never spoils. Archaeologists found 3,000-year-old honey in Egyptian tombs.',
  'A group of flamingos is called a flamboyance.',
  'Bananas are berries, but strawberries are not.',
  'The shortest war in history lasted 38–45 minutes.',
  'Crows can recognize and remember human faces.',
  'A day on Venus is longer than a year on Venus.',
  'Octopuses have three hearts and blue blood.',
  'The Eiffel Tower can grow taller in summer by up to 15 cm.',
  'There are more stars in the universe than grains of sand on Earth.',
  'Wombat poop is cube-shaped.',
];
bot({ pattern: 'fact', desc: lang.plugins.fact.desc, type: 'misc' }, async (msg) => {
  return msg.send('🧠 *Random Fact*\n\n' + facts[Math.floor(Math.random() * facts.length)]);
});
