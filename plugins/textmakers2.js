const { bot, lang } = require('../lib');

const effects = [
  { name: 'comic', label: 'comic' },
  { name: 'cloudsheart', label: 'clouds-heart' },
  { name: 'nameoncake', label: 'name-on-cake' },
  { name: 'advancedglow', label: 'advanced-glow' },
];

for (const { name, label } of effects) {
  bot(
    { pattern: `${name} ?(.*)`, desc: lang.plugins[name]?.desc || `Generate ${label} textmaker`, type: 'editor' },
    async (msg, match) => {
      const text = (match || '').trim();
      if (!text) return msg.reply(`_Provide text! Example: .${name} Hello_`);
      return msg.reply(`_[mock] ${label} textmaker generated for "${text}"_`);
    }
  );
}

bot({ pattern: 'custommenu', desc: lang.plugins.custommenu?.desc || 'Show a sample custom menu style block', type: 'editor' }, async (msg) => {
  const sample = '╭───[ *Custom Menu* ]───\n│ ▸ .alive\n│ ▸ .menu\n│ ▸ .ping\n│ ▸ .sysinfo\n╰─────────────────';
  return msg.reply(`_[mock] custom menu style preview:_\n\n${sample}`);
});
