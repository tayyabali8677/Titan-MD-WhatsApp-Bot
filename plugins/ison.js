const { bot, lang } = require('../lib');

bot({ pattern: 'ison ?(.*)', desc: lang.plugins.ison.desc, type: 'misc' }, async (msg, match) => {
  if (!match) return msg.reply(lang.plugins.ison.usage);
  const num = match.replace(/\D/g, '');
  return msg.reply(`[mock] +${num} is on WhatsApp: ✅ Yes\nJID: ${num}@s.whatsapp.net`);
});
