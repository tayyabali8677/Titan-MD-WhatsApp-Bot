const { bot, lang, db } = require('../lib');

function fmt(tpl, vars) {
  return tpl.replace(/&(\w+)/g, (_, k) => (vars[k] !== undefined ? vars[k] : `&${k}`));
}

bot({ pattern: 'warn ?(.*)', desc: lang.plugins.warn.desc, type: 'group', onlyGroup: true }, async (msg, match, ctx) => {
  const target = (msg.mention && msg.mention[0]) || (msg.reply_message && msg.reply_message.jid);
  if (!target) return msg.reply(lang.plugins.warn.no_target);

  if (/^reset/i.test(match || '')) {
    await db.Warn.destroy({ where: { jid: msg.jid, user: target } });
    return msg.reply(fmt(lang.plugins.warn.reset_message, {
      mention: target.split('@')[0],
      remaining: ctx.config.WARN_LIMIT,
    }));
  }

  const [row] = await db.Warn.findOrCreate({ where: { jid: msg.jid, user: target }, defaults: { count: 0 } });
  row.count = (row.count || 0) + 1;
  await row.save();

  const limit = ctx.config.WARN_LIMIT;
  if (row.count >= limit) {
    if (await ctx.isAdmin()) {
      await msg.Kick(target);
      await db.Warn.destroy({ where: { jid: msg.jid, user: target } });
      return msg.reply(fmt(lang.plugins.warn.kick_message, { mention: target.split('@')[0], warn: row.count }));
    }
    return msg.reply(lang.plugins.warn.not_admin || lang.plugins.common.bot_admin);
  }

  return msg.reply(fmt(lang.plugins.warn.warn_message, {
    mention: target.split('@')[0],
    warn: row.count,
    remaining: limit - row.count,
    reason: (match || '').trim() || 'unspecified',
  }));
});
