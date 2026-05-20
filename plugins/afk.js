const { bot, lang } = require('../lib');
const kv = require('../lib/kv');

bot({ pattern: 'afk ?(.*)', desc: lang.plugins.afk.desc, type: 'misc' }, async (msg, match) => {
  const reason = (match || '').trim() || 'no reason';
  await kv.set('afk', msg.jid, { reason, since: Date.now() });
  return msg.reply(lang.plugins.afk.set.replace('{0}', reason));
});
