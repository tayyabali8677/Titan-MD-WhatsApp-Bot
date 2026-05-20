const { bot, lang } = require('../lib');

bot({ pattern: 'delete', desc: lang.plugins.delete.desc, type: 'utility' }, async (msg) => {
  if (!msg.reply_message) return msg.reply(lang.plugins.delete.usage);
  const key = msg.reply_message.key;
  try {
    if (msg.client.sendMessage) {
      await msg.client.sendMessage(msg.jid, { delete: key });
    }
    return msg.reply('[mock] message deleted for everyone.');
  } catch (e) {
    return msg.reply(`[mock] delete: ${key.id}`);
  }
});
