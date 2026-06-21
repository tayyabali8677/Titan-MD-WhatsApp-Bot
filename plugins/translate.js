const { bot, lang } = require('../lib');
const translate = require('translate-google-api');

const CODES = ['af','sq','am','ar','hy','az','eu','be','bn','bs','bg','ca','ceb','zh-CN','zh-TW','co','hr','cs','da','nl','en','eo','et','fi','fr','fy','gl','ka','de','el','gu','ht','ha','haw','iw','hi','hmn','hu','is','ig','id','ga','it','ja','kn','kk','km','ko','ku','ky','lo','lv','lt','lb','mk','mg','ms','ml','mt','mi','mr','mn','my','ne','no','ny','ps','fa','pl','pt','pa','ro','ru','sm','gd','sr','st','sn','sd','si','sk','sl','so','es','su','sw','sv','tl','tg','ta','te','th','tr','uk','ur','uz','vi','cy','xh','yi','yo','zu'];

// .translate <text>          → translate to English
// .translate <lang>|<text>   → translate to specific lang code
bot(
  {
    pattern: 'translate ?(.*)',
    desc: (lang.plugins.translate && lang.plugins.translate.desc) || 'Translate text to another language',
    type: 'misc',
  },
  async (msg, match) => {
    const input = (match || '').trim();
    if (!input) return msg.reply('_Usage: .translate <text>  OR  .translate <lang>|<text>\nExample: .translate ur|Hello world_');

    let targetLang = 'en';
    let text = input;
    if (input.includes('|')) {
      const [code, ...rest] = input.split('|');
      targetLang = code.trim().toLowerCase() || 'en';
      text = rest.join('|').trim();
    }
    if (!text) return msg.reply('_Provide text to translate._');
    if (!CODES.includes(targetLang)) {
      return msg.reply(`_Unknown language code: *${targetLang}*\nSupported codes: ${CODES.join(', ')}_`);
    }

    if (!msg.client || msg.client.constructor.name === 'MockSocket') {
      return msg.reply(`_[mock] Translated to ${targetLang}: "${text}"_`);
    }

    try {
      const result = await translate(text, { to: targetLang });
      const translated = Array.isArray(result) ? result.join('') : result;
      return msg.reply(`🌐 *Translation (→ ${targetLang})*\n\n${translated}`);
    } catch (e) {
      return msg.reply('_Translation failed: ' + (e.message || e) + '_');
    }
  }
);
