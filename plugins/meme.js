const { bot, lang } = require('../lib');
const axios = require('axios');
const dl = require('../lib/dl');

const SUBS = ['dankmemes','facepalm','funny','cursedcomments','blursedimages','hmmm','memes','me_irl','therewasanattempt','tihi','unexpected','watchpeopledieinside','nextfuckinglevel','oddlysatisfying'];

async function fetchMeme(sub) {
  sub = sub || SUBS[Math.floor(Math.random() * SUBS.length)];
  const url = `https://api.reddit.com/r/${sub}/top.json?limit=100&t=week`;
  const { data } = await axios.get(url, {
    headers: { 'User-Agent': 'TitanMD/1.0' },
    timeout: 15000,
  });

  const posts = (data.data.children || [])
    .map(c => c.data)
    .filter(p => !p.stickied && !p.over_18 && (
      p.url.endsWith('.jpg') || p.url.endsWith('.jpeg') || p.url.endsWith('.png') || p.url.endsWith('.gif')
    ));

  if (!posts.length) throw new Error('No image posts found in r/' + sub);
  const post = posts[Math.floor(Math.random() * posts.length)];
  return { title: post.title, url: post.url, sub };
}

bot({ pattern: 'meme ?(.*)', desc: lang.plugins.meme.desc, type: 'misc' }, async (msg, match) => {
  const sub = (match || '').trim().replace(/^r\//, '') || null;

  if (!msg.client || msg.client.constructor.name === 'MockSocket') {
    return msg.reply(`_[mock] Random meme from r/${sub || 'dankmemes'}_`);
  }

  try {
    await msg.reply('_Fetching meme..._');
    const meme = await fetchMeme(sub);
    let filePath;
    try {
      const ext = meme.url.endsWith('.gif') ? 'gif' : 'jpg';
      filePath = await dl.downloadToFile(meme.url, ext);
      const kind = meme.url.endsWith('.gif') ? 'video' : 'image';
      await dl.sendAndCleanup(msg, filePath, kind, `😂 *${meme.title}*\n_r/${meme.sub}_`);
    } catch (e) {
      if (filePath) dl.cleanup(filePath);
      return msg.reply('_Could not download meme: ' + (e.message || e) + '_');
    }
  } catch (e) {
    return msg.reply('_Meme fetch failed: ' + (e.message || e) + '_');
  }
});
