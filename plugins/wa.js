const { bot, lang } = require('../lib');

bot({ pattern: 'wa', desc: lang.plugins.wa.desc, type: 'user' }, async (msg) => {
  if (msg.mention && msg.mention[0]) {
    const number = msg.mention[0].split('@')[0];
    return msg.reply(`🔗 WhatsApp Link:\nhttps://wa.me/${number}`);
  }
  const own = msg.jid.split('@')[0];
  return msg.reply(`🔗 Your WhatsApp Link:\nhttps://wa.me/${own}`);
});

bot({ pattern: 'mee', desc: lang.plugins.wa.desc, type: 'user' }, async (msg) => {
  const number = msg.jid.split('@')[0];
  return msg.reply(`🔗 Your WhatsApp Link:\nhttps://wa.me/${number}`);
});
