const { bot, lang } = require('../lib');
const axios = require('axios');
const dl = require('../lib/dl');

const REACTIONS = [
  'hug','pat','poke','cry','wink','nom','bite','blush','bonk','bully',
  'cringe','cuddle','dance','glomp','handhold','happy','highfive','kick',
  'kill','kiss','lick','slap','smile','smug','wave','yeet',
];

async function sendReaction(msg, type, target) {
  const { data } = await axios.get(`https://api.waifu.pics/sfw/${type}`, { timeout: 10000 });
  const url = data.url;
  const isVideo = /\.mp4$/i.test(url);
  const buf = await axios.get(url, { responseType: 'arraybuffer', timeout: 20000 }).then(r => Buffer.from(r.data));
  const actor = msg.pushName || 'Someone';
  const caption = target ? `*${actor} ${type}s ${target}* 🎭` : `*${type}* 🎭`;
  await msg.client.sendMessage(
    msg.jid,
    isVideo
      ? { video: buf, gifPlayback: true, caption, mimetype: 'video/mp4' }
      : { image: buf, caption },
    { quoted: msg.raw }
  );
}

for (const name of REACTIONS) {
  bot(
    {
      pattern: `${name} ?(.*)`,
      desc: (lang.plugins[name] && lang.plugins[name].desc) || `Send a ${name} anime reaction GIF`,
      type: 'fun',
    },
    async (msg, match) => {
      if (!msg.client || msg.client.constructor.name === 'MockSocket') {
        return msg.reply(`_[mock] ${name} reaction_`);
      }
      try {
        await sendReaction(msg, name, (match || '').trim() || null);
      } catch (e) {
        return msg.reply('_Reaction failed: ' + (e.message || e) + '_');
      }
    }
  );
}
