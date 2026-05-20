const { bot, lang } = require('../lib');
const config = require('../config');

bot({ pattern: 'dyno ?(.*)', desc: lang.plugins.dyno?.desc || 'Restart Heroku dyno', type: 'system' }, async (msg, match, ctx) => {
  if (!ctx.isSudo) return msg.reply(lang.extra?.sudo_only || lang.plugins.common.sudo_only);
  if (!config.HEROKU_API_KEY || !config.HEROKU_APP_NAME) {
    return msg.reply('_[mock] dyno restarted (HEROKU_API_KEY/HEROKU_APP_NAME not set)_');
  }
  try {
    const url = `https://api.heroku.com/apps/${config.HEROKU_APP_NAME}/dynos`;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        Accept: 'application/vnd.heroku+json; version=3',
        Authorization: `Bearer ${config.HEROKU_API_KEY}`,
      },
    });
    if (res.ok) return msg.reply('_♻️ Heroku dyno restarted ✅_');
    return msg.reply(`_Heroku API error: ${res.status}_`);
  } catch (e) {
    return msg.reply(`_Heroku request failed: ${e.message}_`);
  }
});

bot({ pattern: 'dall', desc: lang.plugins.dall?.desc || 'Delete all bot messages in chat', type: 'misc' }, async (msg, ctx) => {
  return msg.reply('_[mock] all bot messages cleared_');
});

bot({ pattern: 'read', desc: lang.plugins.read?.desc || 'Mark current chat as read', type: 'misc' }, async (msg) => {
  try {
    if (msg.client.chatModify) {
      await msg.client.chatModify({ markRead: true, lastMessages: [msg.key] }, msg.jid);
      return msg.reply('_✅ Chat marked as read_');
    }
  } catch {}
  return msg.reply('_[mock] chat marked as read_');
});

bot({ pattern: 'fullss ?(.*)', desc: lang.plugins.fullss?.desc || 'Full-page screenshot of URL', type: 'media' }, async (msg, match) => {
  const url = (match || '').trim();
  if (!url) return msg.reply('_Usage: .fullss <url>_');
  return msg.reply(`_[mock] full-page screenshot of ${url}_`);
});
