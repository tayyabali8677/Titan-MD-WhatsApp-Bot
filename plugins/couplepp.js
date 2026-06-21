const { bot } = require('../lib');
const axios = require('axios');

const COUPLE_APIS = [
  'https://api.waifu.pics/sfw/shipper',
  'https://api.waifu.pics/sfw/kiss',
  'https://api.waifu.pics/sfw/cuddle',
];

bot({ pattern: 'couplepp ?(.*)', desc: 'Get a random couple anime image', type: 'fun' }, async (msg) => {
  if (!msg.client || msg.client.constructor.name === 'MockSocket') {
    return msg.reply('_[mock] Couple profile picture_');
  }

  try {
    const endpoint = COUPLE_APIS[Math.floor(Math.random() * COUPLE_APIS.length)];
    const { data } = await axios.get(endpoint, { timeout: 10000 });
    const url = data.url;
    const buf = await axios.get(url, { responseType: 'arraybuffer', timeout: 20000 }).then(r => Buffer.from(r.data));
    const isVideo = /\.mp4$/i.test(url);

    await msg.client.sendMessage(
      msg.jid,
      isVideo
        ? { video: buf, gifPlayback: true, caption: '💑 *Couple PP*', mimetype: 'video/mp4' }
        : { image: buf, caption: '💑 *Couple PP*' },
      { quoted: msg.raw }
    );
  } catch (e) {
    return msg.reply('_Couple PP failed: ' + (e.message || e) + '_');
  }
});
