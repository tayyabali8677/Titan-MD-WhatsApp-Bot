const { bot, lang } = require('../lib');
const truths = [
  'What is your biggest fear?','What is the most embarrassing thing you\'ve done?',
  'Have you ever lied to your best friend?','What is your worst habit?',
  'What is the last lie you told?','Have you ever cheated in an exam?',
  'What is something you\'ve never told anyone?','Who was your first crush?',
  'What is the most childish thing you still do?','Have you ever cried over a movie?',
];
bot({ pattern: 'truth', desc: lang.plugins.truth.desc, type: 'game' }, async (msg) => {
  return msg.send('🎭 *Truth*\n\n' + truths[Math.floor(Math.random() * truths.length)]);
});
