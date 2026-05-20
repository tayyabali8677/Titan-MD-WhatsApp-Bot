const { bot, lang } = require('../lib');

// Country-themed sticker pies. .pies <country> looks up a country list;
// the per-country aliases directly return that country's mock sticker.
const countryMap = {
  china:     { flag: '🇨🇳', label: 'China' },
  japan:     { flag: '🇯🇵', label: 'Japan' },
  korea:     { flag: '🇰🇷', label: 'Korea' },
  india:     { flag: '🇮🇳', label: 'India' },
  indonesia: { flag: '🇮🇩', label: 'Indonesia' },
  malaysia:  { flag: '🇲🇾', label: 'Malaysia' },
  thailand:  { flag: '🇹🇭', label: 'Thailand' },
};

bot(
  {
    pattern: 'pies ?(.*)',
    desc: (lang.plugins.pies && lang.plugins.pies.desc) || 'Country-themed sticker pies',
    type: 'fun',
  },
  async (msg, match) => {
    const arg = (match || '').trim().toLowerCase();
    if (!arg) {
      const list = Object.keys(countryMap).map((c) => `• ${countryMap[c].flag} .${c}`).join('\n');
      return msg.reply(`_Available pies countries:_\n${list}\n\n_Example: .pies china_`);
    }
    const entry = countryMap[arg];
    if (!entry) return msg.reply(`_Unknown country. Try: ${Object.keys(countryMap).join(', ')}_`);
    return msg.reply(`_[mock] ${entry.flag} ${entry.label} pies sticker_`);
  }
);

for (const key of Object.keys(countryMap)) {
  const { flag, label } = countryMap[key];
  bot(
    {
      pattern: key,
      desc: (lang.plugins[key] && lang.plugins[key].desc) || `${label} pies sticker`,
      type: 'fun',
    },
    async (msg) => msg.reply(`_[mock] ${flag} ${label} pies sticker_`)
  );
}
