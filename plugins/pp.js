const { bot, lang } = require('../lib');

bot({ pattern: 'pp', desc: lang.plugins.pp.desc, type: 'misc' }, async (msg) => {
  const target = (msg.mention && msg.mention[0]) || (msg.reply_message && msg.reply_message.jid) || msg.jid;
  return msg.reply(`[mock] pp for @${target.split('@')[0]}: https://cdn.titanmd.site/mock/pp.jpg`);
});

bot({ pattern: 'fullpp', desc: 'Get full profile picture', type: 'misc' }, async (msg) => {
  const target = (msg.mention && msg.mention[0]) || (msg.reply_message && msg.reply_message.jid) || msg.jid;
  return msg.reply(`[mock] full pp for @${target.split('@')[0]}: https://cdn.titanmd.site/mock/fullpp.jpg`);
});
