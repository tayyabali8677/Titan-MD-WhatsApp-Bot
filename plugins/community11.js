const { bot, lang } = require('../lib');

bot({ pattern: 'animation ?(.*)', desc: lang.plugins.animation?.desc || 'Message edit animation', type: 'fun' }, async (msg, match) => {
  const text = (match || 'Hello').trim();
  return msg.reply(
    `_[mock] animation frame 1: ${'_'.repeat(text.length)}_\n` +
    `frame 2: ${text.split('').map((c, i) => (i % 2 === 0 ? c : '_')).join('')}\n` +
    `frame 3: ${text.slice(0, -1)}_`
  );
});

bot({ pattern: 'astatus ?(.*)', desc: lang.plugins.astatus?.desc || 'Auto-send your status on reply', type: 'misc' }, async (msg, match) => {
  return msg.reply(`_[mock] auto-status: ${match || 'status'}_`);
});

bot({ pattern: 'couplepp ?(.*)', desc: lang.plugins.couplepp?.desc || 'Couple profile picture generator', type: 'fun' }, async (msg, match) => {
  const arg = (match || '').trim();
  if (!arg) return msg.reply('_Usage: .couplepp <jid1> <jid2>_');
  const parts = arg.split(/[\s,]+/).filter(Boolean);
  if (parts.length < 2) return msg.reply('_Provide 2 jids. Usage: .couplepp <jid1> <jid2>_');
  return msg.reply(`💑 _[mock] Couple PP generated for ${parts[0]} & ${parts[1]}_`);
});
