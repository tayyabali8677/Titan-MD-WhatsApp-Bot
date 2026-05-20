const { bot, lang } = require('../lib');

// .translate <text>            — translate to default (en)
// .translate <lang>|<text>     — translate to specific language code
bot(
  {
    pattern: 'translate ?(.*)',
    desc: (lang.plugins.translate && lang.plugins.translate.desc) || 'Translate text to another language',
    type: 'misc',
  },
  async (msg, match) => {
    const input = (match || '').trim();
    if (!input) return msg.reply('_Usage: .translate <text>  OR  .translate <lang>|<text>_');
    let targetLang = 'en';
    let text = input;
    if (input.includes('|')) {
      const parts = input.split('|');
      targetLang = (parts[0] || '').trim() || 'en';
      text = parts.slice(1).join('|').trim();
    }
    if (!text) return msg.reply('_Provide text to translate._');
    return msg.reply(`_[mock] Translated to ${targetLang}: "${text}"_`);
  }
);
