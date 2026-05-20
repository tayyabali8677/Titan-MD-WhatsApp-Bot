const { bot, lang } = require('../lib');

bot({ pattern: 'zushi', desc: lang.plugins.zushi.desc, type: 'misc' }, async (msg) => {
  return msg.reply('*Zushi is alive!* 🥊\n_『 Titan MD 』powered by TitanDev_');
});

bot({ pattern: 'yami', desc: lang.plugins.yami.desc, type: 'misc' }, async (msg) => {
  return msg.reply('*Yami is alive!* ⚡\n_『 Titan MD 』powered by TitanDev_');
});

bot({ pattern: 'ope', desc: lang.plugins.ope.desc, type: 'misc' }, async (msg) => {
  return msg.reply('*Ope Ope no Mi!* 🏥\n_『 Titan MD 』powered by TitanDev_');
});
