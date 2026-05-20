const { bot, lang } = require('../lib');
bot({ pattern: 'viewonce', desc: lang.plugins.viewonce.desc, type: 'utility' }, async (msg) => {
  if (!msg.reply_message) return msg.reply(lang.plugins.viewonce.usage);
  // In real implementation, intercept view-once media and re-send without the flag
  return msg.reply('[mock] view-once media re-sent.\nRequires reading raw message.message.viewOnceMessage for real output.');
});
