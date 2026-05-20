const { bot, lang } = require('../lib');

// Say/meme commands — overlay user-supplied text on celebrity images.
// In mock mode, replies with a text stub; live mode would use canvas to render.
const sayChars = [
  { name: 'trump',   label: 'Trump Tweet'       },
  { name: 'ronaldo', label: 'Ronaldo Say'        },
  { name: 'mia',     label: 'Mia Khalifa Say'   },
  { name: 'johni',   label: 'Johnny Depp Say'   },
  { name: 'modi',    label: 'Modi Say'           },
  { name: 'elon',    label: 'Elon Musk Say'      },
  { name: 'imran',   label: 'Imran Khan Say'     },
  { name: 'mark',    label: 'Mark Zuckerberg Say'},
  { name: 'kofi',    label: 'Kofi Say'           },
];

for (const { name, label } of sayChars) {
  bot(
    { pattern: `${name} ?(.*)`, desc: (lang.plugins[name] && lang.plugins[name].desc) || `Create a ${label} meme`, type: 'fun' },
    async (msg, match) => {
      if (!match) return msg.reply(`_Provide text!\nExample: .${name} Hello World_`);
      return msg.reply(`_[mock] 🖼️ ${label} meme generated:\n"${match}"_`);
    }
  );
}
