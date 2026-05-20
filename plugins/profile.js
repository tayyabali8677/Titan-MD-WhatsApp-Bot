const { bot, lang } = require('../lib');

bot({ pattern: 'profile ?(.*)', desc: lang.plugins.profile.desc, type: 'misc' }, async (msg, match) => {
  const target = (msg.mention && msg.mention[0]) || (msg.reply_message && msg.reply_message.jid) || msg.jid;
  const num = target.split('@')[0];
  return msg.reply(
    `👤 *Profile*\n📞 Number: +${num}\n🏷 Name: MockUser\n📡 Status: Titan MD user\n🔗 pp: https://cdn.titanmd.site/mock/pp.jpg\n[mock]`
  );
});
