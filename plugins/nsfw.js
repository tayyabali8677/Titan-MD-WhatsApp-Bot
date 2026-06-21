const { bot } = require('../lib');
const axios = require('axios');

// NSFW categories from waifu.pics
const NSFW_TYPES = {
  hentai: 'hentai',
  nsfwneko: 'neko',
  lewdwaifu: 'waifu',
  yuri: 'yuri',
  spank: 'spank',
  blowjob: 'blowjob',
};

async function fetchNsfw(type) {
  const { data } = await axios.get(`https://api.waifu.pics/nsfw/${type}`, { timeout: 10000 });
  return data.url;
}

async function sendNsfwMedia(msg, url, caption) {
  const buf = await axios.get(url, { responseType: 'arraybuffer', timeout: 20000 }).then(r => Buffer.from(r.data));
  const isVideo = /\.mp4$/i.test(url);
  await msg.client.sendMessage(
    msg.jid,
    isVideo
      ? { video: buf, gifPlayback: true, caption, mimetype: 'video/mp4' }
      : { image: buf, caption },
    { quoted: msg.raw }
  );
}

for (const [cmd, type] of Object.entries(NSFW_TYPES)) {
  bot({ pattern: cmd, desc: `NSFW: ${cmd}`, type: 'nsfw', dontAddCommandList: true }, async (msg) => {
    if (!msg.client || msg.client.constructor.name === 'MockSocket') {
      return msg.reply(`_[mock] NSFW ${cmd}_`);
    }
    try {
      const url = await fetchNsfw(type);
      await sendNsfwMedia(msg, url, `🔞 *${cmd}*`);
    } catch (e) {
      return msg.reply('_NSFW fetch failed: ' + (e.message || e) + '_');
    }
  });
}

// Nekos.life NSFW commands
const NEKOS_NSFW = {
  lewd: 'lewd', erofeet: 'erofeet', trap: 'trap', eron: 'eron', futa: 'futa',
};

for (const [cmd, type] of Object.entries(NEKOS_NSFW)) {
  bot({ pattern: cmd, desc: `NSFW: ${cmd}`, type: 'nsfw', dontAddCommandList: true }, async (msg) => {
    if (!msg.client || msg.client.constructor.name === 'MockSocket') {
      return msg.reply(`_[mock] NSFW ${cmd}_`);
    }
    try {
      const { data } = await axios.get(`https://nekos.life/api/v2/img/${type}`, { timeout: 10000 });
      const url = data.url;
      const buf = await axios.get(url, { responseType: 'arraybuffer', timeout: 20000 }).then(r => Buffer.from(r.data));
      await msg.client.sendMessage(msg.jid, { image: buf, caption: `🔞 *${cmd}*` }, { quoted: msg.raw });
    } catch (e) {
      return msg.reply('_NSFW fetch failed: ' + (e.message || e) + '_');
    }
  });
}
