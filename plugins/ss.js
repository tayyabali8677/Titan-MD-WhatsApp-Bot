const { bot, lang } = require('../lib');
const dl = require('../lib/dl');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

bot({ pattern: 'ss ?(.*)', desc: lang.plugins.ss.desc, type: 'utility' }, async (msg, match) => {
  const arg = (match || '').trim();
  if (!arg) return msg.reply(lang.plugins.ss.usage);

  // Ensure it looks like a URL
  const url = /^https?:\/\//i.test(arg) ? arg : 'https://' + arg;

  if (!msg.client || msg.client.constructor.name === 'MockSocket') {
    return msg.reply(`_[mock screenshot] ${url}_`);
  }

  let filePath;
  try {
    await msg.reply('_📸 Taking screenshot..._');
    const resp = await axios.get(`${dl.AHM7_BASE}/websnap`, {
      params: { url, format: 'png' },
      responseType: 'stream',
      timeout: 45000,
    });
    filePath = path.join(os.tmpdir(), crypto.randomBytes(8).toString('hex') + '.png');
    const writer = fs.createWriteStream(filePath);
    resp.data.pipe(writer);
    await new Promise((res, rej) => { writer.on('finish', res); writer.on('error', rej); });
    await msg.client.sendMessage(msg.jid, {
      image: { url: filePath },
      caption: `📸 Screenshot of: ${url}`,
      mimetype: 'image/png',
    }, { quoted: msg.raw });
  } catch (e) {
    return msg.reply('_Screenshot failed: ' + (e.message || e) + '_');
  } finally {
    if (filePath) fs.unlink(filePath, () => {});
  }
});

// .screenshot alias
bot({ pattern: 'screenshot ?(.*)', desc: 'Take screenshot of a website (alias)', type: 'utility' }, async (msg, match) => {
  const arg = (match || '').trim();
  if (!arg) return msg.reply('_Usage: .screenshot <url>_');
  const url = /^https?:\/\//i.test(arg) ? arg : 'https://' + arg;
  if (!msg.client || msg.client.constructor.name === 'MockSocket') return msg.reply(`_[mock screenshot] ${url}_`);
  let filePath;
  try {
    const resp = await axios.get(`${dl.AHM7_BASE}/websnap`, { params: { url, format: 'png' }, responseType: 'stream', timeout: 45000 });
    filePath = path.join(os.tmpdir(), crypto.randomBytes(8).toString('hex') + '.png');
    const writer = fs.createWriteStream(filePath);
    resp.data.pipe(writer);
    await new Promise((res, rej) => { writer.on('finish', res); writer.on('error', rej); });
    await msg.client.sendMessage(msg.jid, { image: { url: filePath }, caption: `📸 ${url}`, mimetype: 'image/png' }, { quoted: msg.raw });
  } catch (e) {
    return msg.reply('_Screenshot failed: ' + (e.message || e) + '_');
  } finally {
    if (filePath) fs.unlink(filePath, () => {});
  }
});
