const { bot, lang } = require('../lib');

const effects = ['skull', 'sketch', 'pencil', 'color', 'kiss', 'bokeh', 'look', 'gandm', 'dark', 'makeup', 'cartoon', 'bloody', 'zombie', 'horned', 'enhance'];

for (const fx of effects) {
  bot({ pattern: fx, desc: lang.plugins[fx].desc, type: 'editor' }, async (msg) => {
    if (!msg.reply_message) return msg.reply('_Reply to an image._');
    return msg.reply(`_[mock] ${fx} effect applied ✅_`);
  });
}
