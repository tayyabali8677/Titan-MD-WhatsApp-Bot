const { bot, lang } = require('../lib');

bot({ pattern: 'dlt', desc: lang.plugins.dlt.desc, type: 'utility' }, async (msg) => {
  return msg.reply('[mock] your last sent message deleted.');
});
