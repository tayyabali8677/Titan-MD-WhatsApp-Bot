const { bot, lang, db } = require('../lib');
bot({ pattern: 'topmembers ?(.*)', desc: lang.plugins.topmembers.desc, type: 'group', onlyGroup: true }, async (msg, match) => {
  const limit = parseInt(match || '10', 10) || 10;
  const rows = await db.MsgCount.findAll({
    where: { jid: msg.jid },
    order: [['count', 'DESC']],
    limit,
  });
  if (!rows.length) return msg.reply('No data yet. Messages need to be tracked first.');
  let text = `🏆 *Top ${limit} Members*\n\n`;
  rows.forEach((r, i) => {
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
    text += `${medal} @${r.user.split('@')[0]} — ${r.count} msgs\n`;
  });
  return msg.send(text);
});
