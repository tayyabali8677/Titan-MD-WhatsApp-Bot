const { bot, lang } = require('../lib');
const memes = [
  { title: 'When the code works on the first try', url: 'https://cdn.titanmd.site/mock/meme1.jpg' },
  { title: 'Me explaining why I need 8 tabs open', url: 'https://cdn.titanmd.site/mock/meme2.jpg' },
  { title: 'Debugging at 3am be like', url: 'https://cdn.titanmd.site/mock/meme3.jpg' },
  { title: 'Stack Overflow saved me again', url: 'https://cdn.titanmd.site/mock/meme4.jpg' },
];
bot({ pattern: 'meme', desc: lang.plugins.meme.desc, type: 'misc' }, async (msg) => {
  const m = memes[Math.floor(Math.random() * memes.length)];
  return msg.send(`😂 *${m.title}*\n[mock] ${m.url}`);
});
