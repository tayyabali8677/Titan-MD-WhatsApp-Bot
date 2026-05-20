const { bot, lang } = require('../lib');

// Telegram sticker pack downloader. All aliases share one handler.
const aliases = ['tg', 'tgsticker', 'telesticker', 'stickertelegram'];

async function handler(msg, match) {
  const url = (match || '').trim();
  if (!url) {
    return msg.reply('_Provide a Telegram sticker pack URL.\nExample: .tg https://t.me/addstickers/PACK_NAME_');
  }
  if (!/t\.me\/addstickers\//i.test(url)) {
    return msg.reply('_Invalid URL. Must be a t.me/addstickers/<pack> link._');
  }
  return msg.reply(`_[mock] Telegram sticker pack downloaded from ${url}_`);
}

for (const alias of aliases) {
  bot(
    {
      pattern: `${alias} ?(.*)`,
      desc: (lang.plugins[alias] && lang.plugins[alias].desc) || 'Download a Telegram sticker pack',
      type: 'sticker',
    },
    handler
  );
}
