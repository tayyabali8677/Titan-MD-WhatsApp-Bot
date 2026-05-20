const { bot, lang } = require('../lib');
const kv = require('../lib/kv');

bot({ pattern: 'backup', desc: lang.plugins.backup.desc, type: 'system' }, async (msg) => {
  if (!(await kv.get('gauth', 'tokens'))) return msg.reply(lang.plugins.backup.not_authed);
  return msg.reply(lang.plugins.backup.done);
});
