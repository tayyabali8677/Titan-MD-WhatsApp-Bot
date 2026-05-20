const { bot, lang, db } = require('../lib');

bot({ pattern: 'msgs', desc: lang.plugins.msgs.desc, type: 'group', onlyGroup: true }, async (msg) => {
  const rows = await db.MsgCount.findAll({ where: { jid: msg.jid }, order: [['count', 'DESC']] });
  if (!rows.length) return msg.reply(lang.plugins.msgs.no_data);
  return msg.send(rows.map((r) => `${r.user.split('@')[0]}: ${r.count}`).join('\n'));
});

bot({ pattern: 'reset ?(.*)', desc: lang.plugins.msgs.reset, type: 'group', onlyGroup: true }, async (msg, match) => {
  const target = (msg.mention && msg.mention[0]) || (msg.reply_message && msg.reply_message.jid);
  if (match && target) {
    await db.MsgCount.destroy({ where: { jid: msg.jid, user: target } });
    return msg.reply(`reset for ${target.split('@')[0]}`);
  }
  await db.MsgCount.destroy({ where: { jid: msg.jid } });
  return msg.reply(lang.plugins.msgs.reset);
});
