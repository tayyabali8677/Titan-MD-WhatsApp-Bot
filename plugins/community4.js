const { bot, lang } = require('../lib');
const os = require('os');

bot({ pattern: 'qc ?(.*)', desc: lang.plugins.qc?.desc || 'Quoted-chat sticker', type: 'sticker' }, async (msg, match) => {
  const text = (match || '').trim() || (msg.reply_message ? '[quoted]' : '');
  if (!text) return msg.reply('_Usage: .qc <text> or reply to a message_');
  return msg.reply(`_[mock] 💬 quoted sticker generated: "${text}"_`);
});

bot({ pattern: 'cs', desc: lang.plugins.cs?.desc || 'Crop video/gif as sticker', type: 'sticker' }, async (msg) => {
  if (!msg.reply_message) return msg.reply('_Reply to a video/gif with .cs_');
  return msg.reply('_[mock] cropped video sticker generated ✅_');
});

bot({ pattern: 'rc', desc: lang.plugins.rc?.desc || 'Rounded-corner sticker', type: 'sticker' }, async (msg) => {
  if (!msg.reply_message) return msg.reply('_Reply to an image with .rc_');
  return msg.reply('_[mock] rounded-corner sticker generated ✅_');
});

bot({ pattern: 'rar ?(.*)', desc: lang.plugins.rar?.desc || 'Compress/extract rar archive', type: 'utility' }, async (msg, match) => {
  const arg = (match || '').trim().toLowerCase();
  if (!arg) return msg.reply('_Usage: .rar compress|extract_');
  return msg.reply(`_[mock] rar ${arg} operation completed_`);
});

bot({ pattern: 'splitvid', desc: lang.plugins.splitvid?.desc || 'Split video into 30s status chunks', type: 'utility' }, async (msg) => {
  if (!msg.reply_message) return msg.reply('_Reply to a video with .splitvid_');
  return msg.reply('_[mock] video split into 3 chunks of 30s each ✅_');
});

bot({ pattern: 'sysinfo', desc: lang.plugins.sysinfo?.desc || 'System information', type: 'utility' }, async (msg) => {
  const totalMb = Math.round(os.totalmem() / 1024 / 1024);
  const freeMb = Math.round(os.freemem() / 1024 / 1024);
  const cpu = (os.cpus()[0] && os.cpus()[0].model) || 'unknown';
  const up = Math.round(process.uptime());
  const text = [
    '```',
    `Platform : ${os.platform()} (${os.arch()})`,
    `Host     : ${os.hostname()}`,
    `CPU      : ${cpu}`,
    `Memory   : ${freeMb} MB free / ${totalMb} MB total`,
    `Uptime   : ${up}s`,
    '```',
  ].join('\n');
  return msg.reply(`🖥️ *System Info*\n${text}`);
});

bot({ pattern: 'webscan ?(.*)', desc: lang.plugins.webscan?.desc || 'Website fingerprint scan', type: 'utility' }, async (msg, match) => {
  const url = (match || '').trim();
  if (!url) return msg.reply('_Usage: .webscan <url>_');
  return msg.reply(`_[mock] 🔍 Scan of ${url}:_\n- Title: Example Site\n- Server: nginx\n- SSL: valid`);
});

bot({ pattern: 'virustotal ?(.*)', desc: lang.plugins.virustotal?.desc || 'VirusTotal hash/url scan', type: 'utility' }, async (msg, match) => {
  const target = (match || '').trim();
  if (!target) return msg.reply('_Usage: .virustotal <hash or url>_');
  return msg.reply(`_[mock] 🛡️ VT scan for "${target}": 0/72 engines detected threats._`);
});
