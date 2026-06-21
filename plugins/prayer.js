const { bot } = require('../lib');
const axios = require('axios');

bot({ pattern: 'prayer ?(.*)', desc: 'Islamic prayer times for any city', type: 'utility' }, async (msg, match) => {
  const city = (match || '').trim();
  if (!city) return msg.reply('_Usage: .prayer <city>_\nExample: .prayer Lahore');

  if (!msg.client || msg.client.constructor.name === 'MockSocket') {
    return msg.reply(`_[mock] Prayer times for ${city}_`);
  }

  try {
    await msg.reply('_Fetching prayer times..._');
    const { data } = await axios.get('https://api.aladhan.com/v1/timingsByCity', {
      params: { city, country: '', method: 2 },
      timeout: 10000,
    });
    const t = data.data.timings;
    const date = data.data.date.readable;

    return msg.reply(
      `🕌 *Prayer Times — ${city}*\n📅 ${date}\n\n` +
      `🌙 Fajr: *${t.Fajr}*\n` +
      `☀️ Sunrise: *${t.Sunrise}*\n` +
      `🌤 Dhuhr: *${t.Dhuhr}*\n` +
      `🌇 Asr: *${t.Asr}*\n` +
      `🌆 Maghrib: *${t.Maghrib}*\n` +
      `🌙 Isha: *${t.Isha}*\n` +
      `🌙 Midnight: *${t.Midnight}*`
    );
  } catch (e) {
    return msg.reply('_Prayer times fetch failed: ' + (e.message || e) + '_');
  }
});

bot({ pattern: 'sholat ?(.*)', desc: 'Prayer times alias (.sholat)', type: 'utility' }, async (msg, match) => {
  const city = (match || '').trim();
  if (!city) return msg.reply('_Usage: .sholat <city>_');
  if (!msg.client || msg.client.constructor.name === 'MockSocket') return msg.reply(`_[mock] Prayer times: ${city}_`);
  try {
    const { data } = await axios.get('https://api.aladhan.com/v1/timingsByCity', { params: { city, country: '', method: 2 }, timeout: 10000 });
    const t = data.data.timings; const date = data.data.date.readable;
    return msg.reply(`🕌 *Jadwal Sholat — ${city}*\n📅 ${date}\n\n🌙 Fajr: *${t.Fajr}*\n☀️ Syuruq: *${t.Sunrise}*\n🌤 Zuhur: *${t.Dhuhr}*\n🌇 Asar: *${t.Asr}*\n🌆 Magrib: *${t.Maghrib}*\n🌙 Isya: *${t.Isha}*`);
  } catch (e) { return msg.reply('_Gagal: ' + (e.message || e) + '_'); }
});
