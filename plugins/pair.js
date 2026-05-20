const { bot, lang } = require('../lib');
bot({ pattern: 'pair ?(.*)', desc: lang.plugins.pair.desc, type: 'misc' }, async (msg, match) => {
  const mentions = msg.mention || [];
  const parts = (match || '').trim().split(/\s+/).filter(Boolean);
  const a = mentions[0] ? `@${mentions[0].split('@')[0]}` : (parts[0] || msg.pushName);
  const b = mentions[1] ? `@${mentions[1].split('@')[0]}` : (parts[1] || 'Someone Special');
  const pairs = ['💑 Soulmates', '💞 Power Couple', '🥰 Made for Each Other', '💫 Destined Pair', '🌸 Sweet Couple'];
  const title = pairs[Math.floor(Math.random() * pairs.length)];
  return msg.send(`💘 *Pairing*\n\n${a} + ${b}\n\n${title} ✨`);
});
