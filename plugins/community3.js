const { bot, lang } = require('../lib');
const kv = require('../lib/kv');

bot({ pattern: 'find', desc: lang.plugins.find?.desc || 'Identify song from audio', type: 'utility' }, async (msg) => {
  if (!msg.reply_message) return msg.reply('_Reply to an audio clip with .find_');
  return msg.reply('_[mock] Song detected: Bohemian Rhapsody by Queen_');
});

bot({ pattern: 'groqplus', desc: lang.plugins.groqplus?.desc || 'Transcribe voice via Groq', type: 'utility' }, async (msg) => {
  if (!msg.reply_message) return msg.reply('_Reply to an audio/voice note with .groqplus_');
  return msg.reply('_[mock] Transcription: hello this is a sample audio transcript._');
});

bot({ pattern: 'downloadall ?(.*)', desc: lang.plugins.downloadall?.desc || 'Universal media downloader', type: 'downloader' }, async (msg, match) => {
  const url = (match || '').trim();
  if (!url) return msg.reply('_Usage: .downloadall <url>_');
  return msg.reply(`_[mock] downloaded media from ${url}_`);
});

bot({ pattern: 'gdirect ?(.*)', desc: lang.plugins.gdirect?.desc || 'Google Drive direct download link', type: 'downloader' }, async (msg, match) => {
  const url = (match || '').trim();
  if (!url) return msg.reply('_Usage: .gdirect <gdrive url>_');
  return msg.reply(`_[mock] direct link: ${url}&export=download_`);
});

bot({ pattern: 'musicdl ?(.*)', desc: lang.plugins.musicdl?.desc || 'Music search & download', type: 'downloader' }, async (msg, match) => {
  const q = (match || '').trim();
  if (!q) return msg.reply('_Usage: .musicdl <song name>_');
  return msg.reply(`_[mock] 🎵 downloaded "${q}.mp3"_`);
});

bot({ pattern: 'linux ?(.*)', desc: lang.plugins.linux?.desc || 'Mock Linux shell command', type: 'fun' }, async (msg, match) => {
  const cmd = (match || '').trim();
  if (!cmd) return msg.reply('_Usage: .linux <command>_');
  return msg.reply('```\n$ ' + cmd + '\n_[mock] command output_\n```');
});

bot({ pattern: 'setcookie ?(.*)', desc: lang.plugins.setcookie?.desc || 'Set Bing cookie (sudo)', type: 'owner' }, async (msg, match, ctx) => {
  if (ctx && ctx.isSudo === false) return msg.reply('_Sudo only._');
  const cookie = (match || '').trim();
  if (!cookie) return msg.reply('_Usage: .setcookie <cookie>_');
  await kv.set('settings', 'bing_cookie', cookie);
  return msg.reply('_Bing cookie saved ✅_');
});

bot({ pattern: 'cap ?(.*)', desc: lang.plugins.cap?.desc || 'Update caption on replied media', type: 'utility' }, async (msg, match) => {
  if (!msg.reply_message) return msg.reply('_Reply to a media message with .cap <new caption>_');
  const text = (match || '').trim();
  if (!text) return msg.reply('_Usage: .cap <new caption>_');
  return msg.reply(`_[mock] caption updated to: ${text}_`);
});
