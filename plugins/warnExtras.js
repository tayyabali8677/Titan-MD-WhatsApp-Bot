const { bot, lang, db } = require('../lib');
const kv = require('../lib/kv');

bot({ pattern: 'resetwarn ?(.*)', desc: lang.plugins.resetwarn?.desc || 'Reset warns for user or group', type: 'group', onlyGroup: true }, async (msg) => {
  const target = (msg.mention && msg.mention[0]) || (msg.reply_message && msg.reply_message.jid);
  if (target) {
    await db.Warn.destroy({ where: { jid: msg.jid, user: target } });
    return msg.reply(`_♻️ Warns reset for ${target.split('@')[0]} ✅_`);
  }
  await db.Warn.destroy({ where: { jid: msg.jid } });
  return msg.reply('_♻️ All warns in this group reset ✅_');
});

bot({ pattern: 'rmwarn ?(.*)', desc: lang.plugins.rmwarn?.desc || 'Reduce a warn by 1', type: 'group', onlyGroup: true }, async (msg) => {
  const target = (msg.mention && msg.mention[0]) || (msg.reply_message && msg.reply_message.jid);
  if (!target) return msg.reply('_Reply to or mention a user._');
  const row = await db.Warn.findOne({ where: { jid: msg.jid, user: target } });
  if (!row || row.count <= 0) return msg.reply(`_${target.split('@')[0]} has no warns._`);
  row.count -= 1;
  await row.save();
  if (row.count <= 0) await db.Warn.destroy({ where: { jid: msg.jid, user: target } });
  return msg.reply(`_➖ Warn removed for ${target.split('@')[0]} (now ${Math.max(row.count, 0)})_`);
});

bot({ pattern: 'setwarnlimit ?(.*)', desc: lang.plugins.setwarnlimit?.desc || 'Set warn limit', type: 'group' }, async (msg, match, ctx) => {
  if (!ctx.isSudo) return msg.reply(lang.extra?.sudo_only || lang.plugins.common.sudo_only);
  const n = parseInt((match || '').trim(), 10);
  if (!n || n < 1) return msg.reply('_Usage: .setwarnlimit <number>_');
  await kv.set('settings', 'warn_limit', n);
  return msg.reply(`_⚠️ Warn limit set to *${n}* ✅_`);
});

bot({ pattern: 'warnlist', desc: lang.plugins.warnlist?.desc || 'List users with warns', type: 'group', onlyGroup: true }, async (msg) => {
  const rows = await db.Warn.findAll({ where: { jid: msg.jid } });
  if (!rows.length) return msg.reply('_No users have warns in this group._');
  return msg.reply('*⚠️ Warn list:*\n' + rows.map((r) => `• ${r.user.split('@')[0]} → ${r.count}`).join('\n'));
});

bot({ pattern: 'warnstats', desc: lang.plugins.warnstats?.desc || 'Total warn entries', type: 'group' }, async (msg) => {
  const total = await db.Warn.count();
  const here = await db.Warn.count({ where: { jid: msg.jid } });
  return msg.reply(`*⚠️ Warn stats*\n• Total entries: ${total}\n• This chat: ${here}`);
});
