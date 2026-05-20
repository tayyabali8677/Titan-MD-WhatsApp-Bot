const { bot, lang } = require('../lib');

const cmds = ['mp3','rotate','reverse','cut','trim','compress','bass','treble','pitch','low','histo','vector','crop','merge','avec','avm','black','mp4','photo','page','pdf'];

for (const c of cmds) {
  bot({ pattern: c, desc: lang.plugins.media.desc, type: 'media' }, async (msg, match) => {
    return msg.reply(`[mock] ${c} ${match || ''} — would process replied media.`);
  });
}
