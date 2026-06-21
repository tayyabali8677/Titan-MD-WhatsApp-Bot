const { bot, lang } = require('../lib');
const axios = require('axios');

bot({ pattern: 'joke', desc: lang.plugins.joke.desc, type: 'misc' }, async (msg) => {
  if (!msg.client || msg.client.constructor.name === 'MockSocket') {
    return msg.reply('_[mock] Why do programmers prefer dark mode? Because light attracts bugs!_');
  }
  try {
    const { data } = await axios.get('https://official-joke-api.appspot.com/random_joke', { timeout: 8000 });
    return msg.reply(`😂 *Random Joke*\n\n❓ ${data.setup}\n\n💬 ${data.punchline}`);
  } catch {
    const fallback = [
      { q: "Why don't scientists trust atoms?", a: "Because they make up everything!" },
      { q: "Why did the scarecrow win an award?", a: "Outstanding in his field." },
      { q: "What do you call a fake noodle?", a: "An impasta!" },
    ];
    const j = fallback[Math.floor(Math.random() * fallback.length)];
    return msg.reply(`😂 *Random Joke*\n\n❓ ${j.q}\n\n💬 ${j.a}`);
  }
});
