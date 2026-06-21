const { bot } = require('../lib');
const axios = require('axios');

bot({ pattern: 'short ?(.*)', desc: 'Shorten a URL using TinyURL', type: 'utility' }, async (msg, match) => {
  const url = (match || '').trim();
  if (!url) return msg.reply('_Usage: .short <url>_\nExample: .short https://example.com/very/long/link');
  if (!/^https?:\/\//i.test(url)) return msg.reply('_URL must start with https:// or http://_');

  if (!msg.client || msg.client.constructor.name === 'MockSocket') {
    return msg.reply(`_[mock] Shortened: https://tinyurl.com/example_`);
  }

  try {
    const { data } = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`, {
      timeout: 10000,
    });
    if (!data || !data.startsWith('http')) throw new Error('Invalid response');
    return msg.reply(`🔗 *Shortened URL*\n\n*Original:* ${url.slice(0, 60)}${url.length > 60 ? '...' : ''}\n*Short:* ${data}`);
  } catch (e) {
    return msg.reply('_URL shortener failed: ' + (e.message || e) + '_');
  }
});
