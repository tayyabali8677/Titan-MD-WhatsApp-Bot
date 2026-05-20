const { bot, lang } = require('../lib');

bot({ pattern: 'tempkick (\\d+) ?(.*)', desc: lang.plugins.tempkick?.desc || 'Temp-kick a user for N minutes', type: 'group' }, async (msg, match) => {
  const minutes = parseInt(match[1] || '0');
  if (!minutes) return msg.reply('_Usage: .tempkick <minutes> @user_');
  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  const target = mentioned ? '@' + mentioned.split('@')[0] : 'user';
  return msg.reply(`_[mock] ${target} temp-kicked for ${minutes} min_`);
});

bot({ pattern: 'fa ?(.*)', desc: lang.plugins.fa?.desc || 'Forward text to multiple JIDs', type: 'utility' }, async (msg, match) => {
  const raw = (match || '').trim();
  if (!raw || !raw.includes('|')) return msg.reply('_Usage: .fa <num1,num2,...>|<text>_');
  const [numsPart, ...rest] = raw.split('|');
  const text = rest.join('|').trim();
  const nums = numsPart.split(',').map((n) => n.trim()).filter(Boolean);
  if (!nums.length || !text) return msg.reply('_Usage: .fa <num1,num2,...>|<text>_');
  return msg.reply(`_[mock] forwarded message to ${nums.length} recipient(s) ✅_`);
});
