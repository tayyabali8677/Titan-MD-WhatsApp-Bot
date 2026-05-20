const { bot, lang } = require('../lib');
const kv = require('../lib/kv');
bot({ pattern: 'unban ?(.*)', desc: lang.plugins.unban.desc, type: 'group', onlyGroup: true }, async (msg, match, ctx) => {
  if (!(await ctx.isAdmin())) return msg.reply(lang.plugins.common.bot_admin);
  const target = (msg.mention && msg.mention[0]) || (msg.reply_message && msg.reply_message.jid);
  if (!target) return msg.reply('Reply to or mention a user.');
  let bans = (await kv.get('ban', msg.jid)) || [];
  bans = bans.filter((b) => b !== target);
  await kv.set('ban', msg.jid, bans);
  return msg.reply(lang.plugins.unban.done.replace('{0}', target.split('@')[0]));
});
