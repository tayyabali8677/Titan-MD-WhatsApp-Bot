const { bot, lang } = require('../lib');

bot({ pattern: 'voice', desc: lang.plugins.voice?.desc || 'Convert audio to voice note', type: 'convert' }, async (msg) => {
  return msg.reply('_[mock] audio converted to voice note ✅_');
});

async function toAudio(msg) {
  return msg.reply('_[mock] video converted to audio ✅_');
}
bot({ pattern: 'toaudio', desc: lang.plugins.toaudio?.desc || 'Convert video to audio', type: 'convert' }, toAudio);
bot({ pattern: 'tomp3', desc: lang.plugins.tomp3?.desc || 'Convert video to mp3 audio', type: 'convert' }, toAudio);

async function toVideo(msg) {
  return msg.reply('_[mock] converted to video ✅_');
}
bot({ pattern: 'tovideo', desc: lang.plugins.tovideo?.desc || 'Convert audio/sticker to video', type: 'convert' }, toVideo);
bot({ pattern: 'tomp4', desc: lang.plugins.tomp4?.desc || 'Convert audio/sticker to mp4 video', type: 'convert' }, toVideo);

bot({ pattern: 'sound', desc: lang.plugins.sound?.desc || 'Extract audio from video', type: 'convert' }, async (msg) => {
  return msg.reply('_[mock] sound extracted from video ✅_');
});

bot({ pattern: 'fliptext ?(.*)', desc: lang.plugins.fliptext?.desc || 'Flip text upside down', type: 'convert' }, async (msg, match) => {
  if (!match) return msg.reply('_Usage: .fliptext <text>_');
  const flipMap = {a:'ɐ',b:'q',c:'ɔ',d:'p',e:'ǝ',f:'ɟ',g:'ƃ',h:'ɥ',i:'ᴉ',j:'ɾ',k:'ʞ',l:'l',m:'ɯ',n:'u',o:'o',p:'d',q:'b',r:'ɹ',s:'s',t:'ʇ',u:'n',v:'ʌ',w:'ʍ',x:'x',y:'ʎ',z:'z','.':'˙',',':"'",'?':'¿','!':'¡',"'":',','(':')',')':'('};
  const flipped = match.toLowerCase().split('').reverse().map(c => flipMap[c] || c).join('');
  return msg.reply(`🙃 *Flipped:*\n${flipped}`);
});

bot({ pattern: 'ttp ?(.*)', desc: lang.plugins.ttp?.desc || 'Text to picture sticker', type: 'convert' }, async (msg, match) => {
  if (!match) return msg.reply('_Usage: .ttp <text>_');
  return msg.reply(`_[mock] text-to-picture sticker for "${match}"_`);
});

bot({ pattern: 'tourl', desc: lang.plugins.tourl?.desc || 'Upload media to url', type: 'convert' }, async (msg) => {
  return msg.reply('_[mock] uploaded to https://example.com/tmp/abc.jpg_');
});
