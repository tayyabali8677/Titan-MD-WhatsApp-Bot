// Hidden NSFW downloader plugin — not listed in .help/.menu/.list
// Behavior: download videos from XNXX/XVideos as documents
// In mock mode this returns a stub reply.

const { bot, lang } = require('../lib');

bot(
  {
    pattern: 'xvideo ?(.*)',
    desc: lang.plugins.xvideo?.desc || 'NSFW video downloader (hidden)',
    type: 'nsfw',
    dontAddCommandList: true,
  },
  async (msg, match) => {
    if (!match) return msg.reply('_Usage: .xvideo <url or query>_');

    const isUrl = /^https?:\/\//i.test(match.trim());
    if (isUrl) {
      return msg.reply(`_[mock] 🔞 downloading video from ${match} as document..._`);
    }
    return msg.reply(`_[mock] 🔞 searching for "${match}" — top result would be sent as document._`);
  }
);

// Aliases — also hidden
for (const alias of ['xnxx', 'xv']) {
  bot(
    {
      pattern: `${alias} ?(.*)`,
      desc: lang.plugins.xvideo?.desc || 'NSFW video downloader (hidden)',
      type: 'nsfw',
      dontAddCommandList: true,
    },
    async (msg, match) => {
      if (!match) return msg.reply(`_Usage: .${alias} <url or query>_`);
      return msg.reply(`_[mock] 🔞 ${alias} downloader: "${match}"_`);
    }
  );
}
