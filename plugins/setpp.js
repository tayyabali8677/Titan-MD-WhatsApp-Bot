const { bot, lang } = require('../lib');
bot({ pattern: 'setpp ?(.*)', desc: lang.plugins.setpp.desc, type: 'misc' }, async (msg) => {
  if (!msg.reply_message) return msg.reply(lang.plugins.setpp.usage);
  return msg.reply('[mock] profile picture updated.\nRequires sock.updateProfilePicture() for real output.');
});
