const { bot, lang } = require('../lib');

// Text-maker effects. Each takes user text and "generates"
// a stylized PNG/sticker. In mock mode we just reply with a descriptive stub.
const textFxList = [
  'metallic', 'ice', 'neon', 'snow', 'matrix', 'devil', 'thunder', 'leaves',
  '1917', 'arena', 'hacker', 'sand', 'blackpink', 'glitch', 'fire', 'light',
  'purple', 'impressive',
];

for (const fx of textFxList) {
  bot(
    {
      pattern: `${fx} ?(.*)`,
      desc: (lang.plugins[fx] && lang.plugins[fx].desc) || `Generate ${fx} text effect sticker`,
      type: 'editor',
    },
    async (msg, match) => {
      const text = (match || '').trim();
      if (!text) return msg.reply(`_Provide text! Example: .${fx} Hello_`);
      return msg.reply(`_[mock] ${fx} text effect generated for "${text}"_`);
    }
  );
}
