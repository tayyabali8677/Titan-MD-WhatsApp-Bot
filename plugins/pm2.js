const { bot, lang } = require('../lib');
const { exec } = require('child_process');

bot({ pattern: 'reboot', desc: lang.plugins.pm2.desc, type: 'system' }, async (msg, _m, ctx) => {
  if (!ctx.isSudo) return msg.reply(lang.plugins.common.sudo_only);
  await msg.reply(lang.plugins.pm2.rebooting);
  exec('pm2 restart titan-md', (e) => { if (e) console.error(e); });
});
