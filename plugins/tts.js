const { bot, lang } = require('../lib');

bot({ pattern: 'tts ?(.*)', desc: lang.plugins.tts.desc, type: 'utility' }, async (msg, match) => {
  if (!match) return msg.reply(lang.plugins.tts.usage);
  return msg.reply(`[mock] TTS audio for "${match}" via google-tts-api.`);
});
