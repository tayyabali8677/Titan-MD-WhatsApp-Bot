const { bot } = require('../lib');
const axios = require('axios');
const dl = require('../lib/dl');

bot({ pattern: 'quran ?(.*)', desc: 'Fetch a Quran verse with translation and audio', type: 'utility' }, async (msg, match) => {
  const args = (match || '').trim().split(/\s+/);
  const surah = parseInt(args[0]);
  const verse = parseInt(args[1]);

  if (!surah || !verse || isNaN(surah) || isNaN(verse)) {
    return msg.reply('_Usage: .quran <surah> <verse>_\nExample: .quran 1 1 (Al-Fatihah, verse 1)');
  }
  if (surah < 1 || surah > 114) return msg.reply('_Surah must be between 1 and 114._');

  if (!msg.client || msg.client.constructor.name === 'MockSocket') {
    return msg.reply(`_[mock] Quran ${surah}:${verse}_`);
  }

  try {
    await msg.reply('_Fetching verse..._');
    const [arabic, english] = await Promise.all([
      axios.get(`https://api.alquran.cloud/v1/ayah/${surah}:${verse}`, { timeout: 10000 }),
      axios.get(`https://api.alquran.cloud/v1/ayah/${surah}:${verse}/en.asad`, { timeout: 10000 }),
    ]);

    const ar = arabic.data.data;
    const en = english.data.data;

    const text =
      `📖 *Al-Quran — ${ar.surah.englishName} (${ar.surah.name}) : ${ar.numberInSurah}*\n\n` +
      `${ar.text}\n\n` +
      `_${en.text}_\n\n` +
      `( Q.S ${ar.surah.englishName} : ${ar.numberInSurah} )`;

    await msg.reply(text);

    // Send audio recitation
    try {
      const audioResp = await axios.get(`https://api.alquran.cloud/v1/ayah/${surah}:${verse}/ar.alafasy`, { timeout: 10000 });
      const audioUrl = audioResp.data.data?.audio;
      if (audioUrl) {
        let filePath;
        try {
          filePath = await dl.downloadToFile(audioUrl, 'mp3');
          const fs = require('fs');
          const buf = fs.readFileSync(filePath);
          dl.cleanup(filePath);
          await msg.client.sendMessage(
            msg.jid,
            { audio: buf, mimetype: 'audio/mpeg', ptt: false },
            { quoted: msg.raw }
          );
        } catch { if (filePath) dl.cleanup(filePath); }
      }
    } catch {}
  } catch (e) {
    return msg.reply('_Quran fetch failed: ' + (e.message || e) + '_');
  }
});
