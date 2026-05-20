const { bot, lang } = require('../lib');

bot({ pattern: 'weather ?(.*)', desc: lang.plugins.weather.desc, type: 'utility' }, async (msg, match) => {
  if (!match) return msg.reply(lang.plugins.weather.usage);
  return msg.reply(
    `🌤 *Weather — ${match}*\n🌡 Temp: 24°C\n💧 Humidity: 60%\n💨 Wind: 12 km/h\n☁️ Condition: Partly cloudy\n[mock] Set WEATHER_API_KEY for live data.`
  );
});
