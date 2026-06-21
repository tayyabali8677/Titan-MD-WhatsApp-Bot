const { bot, lang } = require('../lib');
const dl = require('../lib/dl');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

bot({ pattern: 'tts ?(.*)', desc: lang.plugins.tts.desc, type: 'utility' }, async (msg, match) => {
  const text = (match || '').trim();
  if (!text) return msg.reply('_Usage: .tts <text to speak>_');

  if (!msg.client || msg.client.constructor.name === 'MockSocket') {
    return msg.reply(`_[mock] TTS audio for "${text.slice(0, 30)}..."_`);
  }

  let filePath;
  try {
    await msg.reply('_🔊 Converting to speech..._');
    const resp = await axios.get(`${dl.AHM7_BASE}/tts`, {
      params: { text, voice: 'en-US' },
      responseType: 'stream',
      timeout: 30000,
    });
    filePath = path.join(os.tmpdir(), crypto.randomBytes(8).toString('hex') + '.mp3');
    const writer = fs.createWriteStream(filePath);
    resp.data.pipe(writer);
    await new Promise((res, rej) => { writer.on('finish', res); writer.on('error', rej); });
    await msg.client.sendMessage(msg.jid, {
      audio: { url: filePath },
      mimetype: 'audio/mpeg',
      ptt: false,
    }, { quoted: msg.raw });
  } catch (e) {
    return msg.reply('_TTS failed: ' + (e.message || e) + '_');
  } finally {
    if (filePath) fs.unlink(filePath, () => {});
  }
});
