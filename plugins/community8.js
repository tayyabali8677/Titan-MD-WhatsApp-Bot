const { bot, lang } = require('../lib');

bot({ pattern: 'wiki ?(.*)', desc: lang.plugins.wiki?.desc || 'Wikipedia search', type: 'utility' }, async (msg, match) => {
  if (!match) return msg.reply('_Usage: .wiki <query>_');
  return msg.reply(`📖 *Wikipedia: ${match}*\n_[mock] Wikipedia article excerpt about ${match}..._`);
});

bot({ pattern: 'speedtest', desc: lang.plugins.speedtest?.desc || 'Internet speedtest', type: 'utility' }, async (msg) => {
  return msg.reply('🌐 *Speedtest Results*\n• Download: 123.45 Mbps\n• Upload: 45.67 Mbps\n• Ping: 12ms\n_[mock]_');
});

bot({ pattern: 'selfmention', desc: lang.plugins.selfmention?.desc || 'Mention the sender', type: 'utility' }, async (msg) => {
  try {
    if (!msg.sender) return msg.reply('_[mock] @user_');
    return msg.reply(`@${msg.sender.split('@')[0]}`);
  } catch {
    return msg.reply('_[mock] @user_');
  }
});

bot({ pattern: 'pastpaper ?(.*)', desc: lang.plugins.pastpaper?.desc || 'Past papers lookup', type: 'utility' }, async (msg, match) => {
  if (!match) return msg.reply('_Usage: .pastpaper <subject>_');
  return msg.reply(`📄 *Past Papers: ${match}*\n_[mock] Listing past papers for ${match}..._`);
});

bot({ pattern: 'imagegen ?(.*)', desc: lang.plugins.imagegen?.desc || 'AI image generation', type: 'utility' }, async (msg, match) => {
  if (!match) return msg.reply('_Usage: .imagegen <prompt>_');
  return msg.reply(`🎨 _[mock] AI image generated for prompt: "${match}"_`);
});

bot({ pattern: 'imageedit ?(.*)', desc: lang.plugins.imageedit?.desc || 'AI image edit', type: 'utility' }, async (msg, match) => {
  if (!match) return msg.reply('_Reply to an image with .imageedit <prompt>_');
  return msg.reply(`🖌️ _[mock] AI image edited with prompt: "${match}"_`);
});

bot({ pattern: 'advsend ?(.*)', desc: lang.plugins.advsend?.desc || 'Advanced forward to a number', type: 'utility' }, async (msg, match) => {
  if (!match || !match.includes('|')) return msg.reply('_Usage: .advsend <number>|<text>_');
  const [num, ...rest] = match.split('|');
  const text = rest.join('|').trim();
  return msg.reply(`📤 _[mock] Sent to +${num.trim()}: "${text}"_`);
});
