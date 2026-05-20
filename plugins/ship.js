const { bot, lang } = require('../lib');
bot({ pattern: 'ship ?(.*)', desc: lang.plugins.ship.desc, type: 'misc' }, async (msg, match) => {
  const mentions = msg.mention || [];
  const parts = (match || '').trim().split(/\s+/).filter(Boolean);
  const a = mentions[0] ? `@${mentions[0].split('@')[0]}` : (parts[0] || 'User1');
  const b = mentions[1] ? `@${mentions[1].split('@')[0]}` : (parts[1] || 'User2');
  if (!parts[0] && mentions.length < 2) return msg.reply(lang.plugins.ship.usage);
  const score = Math.floor(Math.random() * 101);
  const bar = '█'.repeat(Math.floor(score / 10)) + '░'.repeat(10 - Math.floor(score / 10));
  const label = score >= 80 ? '💑 Perfect Match!' : score >= 60 ? '💕 Great Pair!' : score >= 40 ? '💛 Good Friends!' : score >= 20 ? '🤝 Just Acquaintances' : '😬 Awkward...';
  return msg.send(`💘 *Ship Meter*\n\n${a} ❤️ ${b}\n\n[${bar}] ${score}%\n${label}`);
});
