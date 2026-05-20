const { bot, lang } = require('../lib');

bot({ pattern: 'removebg', desc: lang.plugins.removebg.desc, type: 'media' }, async (msg, _m, ctx) => {
  if (!msg.reply_message) return msg.reply(lang.plugins.removebg.usage);
  if (!ctx.config.RMBG_KEY || ctx.config.RMBG_KEY === 'null') {
    return msg.reply(lang.plugins.removebg.no_key + '\n[mock] removed.bg returned: https://cdn.titanmd.site/mock/nobg.png');
  }
  return msg.reply('[stub] remove.bg API call would run here.');
});
