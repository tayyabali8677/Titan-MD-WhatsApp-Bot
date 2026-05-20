const { bot, lang } = require('../lib');

bot({ pattern: 'ringtone ?(.*)', desc: lang.plugins.dlmore.desc, type: 'downloader' }, async (msg, match) => {
  const name = match.trim();
  if (!name) return msg.reply('Please provide a ringtone name.\nUsage: .ringtone <name>');
  return msg.reply(
    `🎵 Ringtone: ${name}\n` +
    `_[mock] Download: https://zedge.net/find/ringtones/${encodeURIComponent(name)}_`
  );
});

bot({ pattern: 'gitclone ?(.*)', desc: lang.plugins.dlmore.desc, type: 'downloader' }, async (msg, match) => {
  const url = match.trim();
  if (!url) return msg.reply('Please provide a GitHub repo URL.\nUsage: .gitclone <url>');
  return msg.reply(
    `📦 Repository: ${url}\n` +
    `_[mock] Cloning to temp directory..._\n` +
    `_Done! Files available in temp/_`
  );
});

bot({ pattern: 'apksearch ?(.*)', desc: lang.plugins.dlmore.desc, type: 'downloader' }, async (msg, match) => {
  const name = match.trim();
  if (!name) return msg.reply('Please provide an app name.\nUsage: .apksearch <name>');
  return msg.reply(
    `📱 APK Search: ${name}\n` +
    `_[mock] Results from apkpure.com_\n` +
    `1. ${name} v1.0 - 25MB\n` +
    `2. ${name} Pro v2.1 - 40MB`
  );
});

bot({ pattern: 'modapk ?(.*)', desc: lang.plugins.dlmore.desc, type: 'downloader' }, async (msg, match) => {
  const name = match.trim();
  if (!name) return msg.reply('Please provide an app name.\nUsage: .modapk <name>');
  return msg.reply(
    `📱 Mod APK: ${name}\n` +
    `_[mock] Mod download link: https://apkmody.io/search/${encodeURIComponent(name)}_`
  );
});
