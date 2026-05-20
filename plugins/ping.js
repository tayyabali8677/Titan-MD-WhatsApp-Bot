const { bot, lang } = require('../lib');

bot({ pattern: 'ping', desc: lang.plugins.ping.desc, type: 'misc' }, async (msg) => {
  const t = Date.now();
  await msg.reply('Pong...');
  return msg.send(lang.plugins.ping.message.replace('{0}', Date.now() - t));
});
