const { bot, lang } = require('../lib');
const axios = require('axios');

bot({ pattern: 'weather ?(.*)', desc: lang.plugins.weather.desc, type: 'utility' }, async (msg, match) => {
  const city = (match || '').trim();
  if (!city) return msg.reply('_Usage: .weather <city name>_\nExample: .weather Lahore');

  if (!msg.client || msg.client.constructor.name === 'MockSocket') {
    return msg.reply(`_[mock] Weather for ${city}: 24°C, partly cloudy_`);
  }

  try {
    await msg.reply('_Fetching weather..._');
    const { data } = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=j1`, {
      timeout: 10000,
      headers: { 'User-Agent': 'TitanMD/1.0' },
    });
    const c = data.current_condition[0];
    const area = data.nearest_area[0];
    const areaName = area.areaName[0].value;
    const country = area.country[0].value;
    const desc = c.weatherDesc[0].value;

    return msg.reply(
      `🌍 *Weather — ${areaName}, ${country}*\n\n` +
      `🌡 *Temp:* ${c.temp_C}°C (${c.temp_F}°F)\n` +
      `🤔 *Feels Like:* ${c.FeelsLikeC}°C\n` +
      `💧 *Humidity:* ${c.humidity}%\n` +
      `💨 *Wind:* ${c.windspeedKmph} km/h ${c.winddir16Point}\n` +
      `👁 *Visibility:* ${c.visibility} km\n` +
      `🌫 *UV Index:* ${c.uvIndex}\n` +
      `☁️ *Condition:* ${desc}`
    );
  } catch (e) {
    return msg.reply('_Weather fetch failed: ' + (e.message || e) + '_');
  }
});
