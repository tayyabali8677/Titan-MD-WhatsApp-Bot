const { bot, lang } = require('../lib');

function authed(ctx) { return ctx.config.HEROKU_API_KEY && ctx.config.HEROKU_APP_NAME; }

bot({ pattern: 'restart', desc: lang.plugins.heroku.desc, type: 'system' }, async (msg, _m, ctx) => {
  if (!authed(ctx)) return msg.reply(lang.plugins.heroku.no_key);
  return msg.reply(lang.plugins.heroku.restarting.replace('{0}', ctx.config.HEROKU_APP_NAME));
});

bot({ pattern: 'shutdown', desc: lang.plugins.heroku.desc, type: 'system' }, async (msg, _m, ctx) => {
  if (!authed(ctx)) return msg.reply(lang.plugins.heroku.no_key);
  return msg.reply(lang.plugins.heroku.shutting);
});

bot({ pattern: 'quota', desc: lang.plugins.heroku.desc, type: 'system' }, async (msg, _m, ctx) => {
  if (!authed(ctx)) return msg.reply(lang.plugins.heroku.quota);
  return msg.reply('Quota: (real API call would go here).');
});
