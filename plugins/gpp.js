const { bot, lang } = require('../lib');

bot({ pattern: 'gpp ?(.*)', desc: lang.plugins.gpp.desc, type: 'group', onlyGroup: true }, async (msg, match) => {
  if (msg.reply_message) {
    return msg.reply('[mock] group profile picture updated.');
  }
  return msg.reply('[mock] current group pp: https://cdn.titanmd.site/mock/gpp.jpg');
});
