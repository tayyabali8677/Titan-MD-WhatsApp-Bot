const { bot, lang } = require('../lib');
const dares = [
  'Send a voice note singing your favourite song.','Change your profile picture for 1 hour.',
  'Type with your elbows for the next 5 messages.','Send your most embarrassing photo.',
  'Write a poem about the person above you.','Do 10 push-ups right now.',
  'Send a message to your crush right now.','Eat something spicy and record it.',
  'Let the next person in the group send a message from your phone.','Speak only in rhymes for the next 5 minutes.',
];
bot({ pattern: 'dare', desc: lang.plugins.dare.desc, type: 'game' }, async (msg) => {
  return msg.send('🎲 *Dare*\n\n' + dares[Math.floor(Math.random() * dares.length)]);
});
