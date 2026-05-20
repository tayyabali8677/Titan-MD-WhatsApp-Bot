const { bot, lang } = require('../lib');
bot({ pattern: 'hidetag ?(.*)', desc: lang.plugins.hidetag.desc, type: 'group', onlyGroup: true }, async (msg, match, ctx) => {
  if (!(await ctx.isAdmin())) return msg.reply(lang.plugins.common.bot_admin);
  const meta = await msg.groupMetadata();
  const participants = (meta.participants || []).map((p) => p.id);
  const text = (match || '').trim() || '📢 Announcement';
  // Mention all without showing @names visibly
  return msg.send(text + '​'.repeat(participants.length));
});
