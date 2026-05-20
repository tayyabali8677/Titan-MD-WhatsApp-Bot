const { bot, lang } = require('../lib');

bot({ pattern: 'nr ?(.*)', desc: lang.plugins.nr.desc, type: 'utility' }, async (msg, match, ctx) => {
  if (!match) return msg.reply(lang.plugins.nr.usage);
  if (!ctx.config.TRUECALLER) {
    return msg.reply(`[mock truecaller]\n📞 Number: ${match}\n👤 Name: TitanUser (Mock)\n🌍 Country: Pakistan\n📡 Carrier: Jazz\n[Set TRUECALLER env var for real data]`);
  }
  return msg.reply(`[stub] Truecaller lookup for ${match}`);
});
