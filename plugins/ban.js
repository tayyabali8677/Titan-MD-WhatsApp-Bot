const { bot, lang } = require('../lib');
const kv = require('../lib/kv');
bot({ pattern: 'ban ?(.*)', desc: lang.plugins.ban.desc, type: 'group', onlyGroup: true }, async (msg, match, ctx) => {
  if (!(await ctx.isAdmin())) return msg.reply(lang.plugins.common.bot_admin);
  const target = (msg.mention && msg.mention[0]) || (msg.reply_message && msg.reply_message.jid);
  if (!target) return msg.reply(lang.plugins.ban.usage);
  const bans = (await kv.get('ban', msg.jid)) || [];
  if (!bans.includes(target)) bans.push(target);
  await kv.set('ban', msg.jid, bans);
  await msg.Kick(target);
  return msg.reply(lang.plugins.ban.done.replace('{0}', target.split('@')[0]));
});
