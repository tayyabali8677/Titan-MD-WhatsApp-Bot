const { bot, lang, db } = require('../lib');
bot({ pattern: 'warnings ?(.*)', desc: lang.plugins.warnings.desc, type: 'group', onlyGroup: true }, async (msg, match) => {
  const target = (msg.mention && msg.mention[0]) || (msg.reply_message && msg.reply_message.jid);
  if (target) {
    const row = await db.Warn.findOne({ where: { jid: msg.jid, user: target } });
    return msg.reply(`⚠️ Warnings for @${target.split('@')[0]}: ${row ? row.count : 0}/${msg.raw?.WARN_LIMIT || 3}`);
  }
  const all = await db.Warn.findAll({ where: { jid: msg.jid } });
  if (!all.length) return msg.reply('No warnings in this group.');
  return msg.send('⚠️ *Warning List*\n\n' + all.map((r) => `@${r.user.split('@')[0]}: ${r.count}`).join('\n'));
});
