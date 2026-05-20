const { bot, lang } = require('../lib');

const s = (pattern, key, fn) => bot({ pattern, desc: lang.plugins[key] ? lang.plugins[key].desc : lang.plugins.misc.desc, type: 'misc' }, fn);

s('jid',           'misc',    async (msg)      => msg.reply(msg.jid));
s('block ?(.*)' ,  'misc',    async (msg, m)   => msg.reply(`[mock] blocked ${(msg.mention&&msg.mention[0])||msg.reply_message?.jid||m||'target'}`));
s('unblock ?(.*)', 'misc',    async (msg)       => msg.reply('[mock] unblocked.'));
s('gjid',          'misc',    async (msg)       => msg.reply(`Group jid: ${msg.jid}`));
s('whois ?(.*)',   'whois',   async (msg, m, ctx) => {
  if (!ctx.config.TRUECALLER) return msg.reply(lang.plugins.whois.no_key);
  return msg.reply(`[mock truecaller] ${m||msg.jid}: TitanUser, US`);
});
s('url ?(.*)',     'url',     async (msg)       => msg.reply('[mock] uploaded — https://cdn.titanmd.site/mock/file.bin'));
s('screenshot ?(.*)', 'ss',   async (msg, m)   => msg.reply(`[mock screenshot of ${m}] https://cdn.titanmd.site/mock/ss.png`));
