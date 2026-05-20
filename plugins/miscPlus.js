const { bot, lang } = require('../lib');

bot({ pattern: 'paste ?(.*)', desc: lang.plugins.paste?.desc || 'Mock pastebin upload', type: 'utility' }, async (msg, match) => {
  if (!match) return msg.reply('_Usage: .paste <text>_');
  return msg.reply('_[mock] Pasted: https://pastebin.com/abc123_');
});

bot({ pattern: 'pick ?(.*)', desc: lang.plugins.pick?.desc || 'Random pick from options', type: 'utility' }, async (msg, match) => {
  if (!match || !match.includes('|')) return msg.reply('_Usage: .pick opt1|opt2|opt3_');
  const opts = match.split('|').map(s => s.trim()).filter(Boolean);
  if (!opts.length) return msg.reply('_No options provided_');
  const choice = opts[Math.floor(Math.random() * opts.length)];
  return msg.reply(`🎲 I pick: *${choice}*`);
});

bot({ pattern: 'tiny ?(.*)', desc: lang.plugins.tiny?.desc || 'Mock URL shortener', type: 'utility' }, async (msg, match) => {
  if (!match) return msg.reply('_Usage: .tiny <url>_');
  return msg.reply('_[mock] Short URL: https://tinyurl.com/abc_');
});

bot({ pattern: 'num ?(.*)', desc: lang.plugins.num?.desc || 'Phone number country lookup', type: 'utility' }, async (msg, match) => {
  if (!match) return msg.reply('_Usage: .num <number>_');
  const n = match.replace(/[^0-9]/g, '');
  return msg.reply(`📱 +${n}\n_[mock] Country: Pakistan_`);
});

bot({ pattern: 'dbinary ?(.*)', desc: lang.plugins.dbinary?.desc || 'Decode binary to text', type: 'utility' }, async (msg, match) => {
  if (!match) return msg.reply('_Usage: .dbinary <binary>_');
  try {
    const text = match.trim().split(/\s+/).map(b => String.fromCharCode(parseInt(b, 2))).join('');
    return msg.reply(`*🔓 Decoded:*\n${text}`);
  } catch {
    return msg.reply('_Invalid binary string_');
  }
});

bot({ pattern: 'ebinary ?(.*)', desc: lang.plugins.ebinary?.desc || 'Encode text to binary', type: 'utility' }, async (msg, match) => {
  if (!match) return msg.reply('_Usage: .ebinary <text>_');
  const bin = match.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
  return msg.reply(`*🔒 Binary:*\n\`\`\`${bin}\`\`\``);
});
