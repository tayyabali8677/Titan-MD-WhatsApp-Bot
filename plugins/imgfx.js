const { bot, lang } = require('../lib');

const effects = [
  'invert', 'sepia', 'rainbow', 'beautiful', 'rip', 'wanted', 'facepalm', 'trash',
  'affect', 'ad', 'uncover', 'clown', 'mnm', 'pet', 'drip', 'gun', 'colorify',
];

for (const effect of effects) {
  bot({ pattern: effect, desc: (lang.plugins[effect] && lang.plugins[effect].desc) || lang.plugins.imgfx.desc, type: 'editor' }, async (msg) => {
    if (!msg.reply_message) return msg.reply('_Reply to an image._');
    return msg.reply(`_[mock] ${effect} effect applied ✅_`);
  });
}
