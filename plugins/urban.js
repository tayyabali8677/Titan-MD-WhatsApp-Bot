const { bot } = require('../lib');
const axios = require('axios');

async function udDefine(term) {
  const { data } = await axios.get('https://api.urbandictionary.com/v0/define', {
    params: { term },
    timeout: 10000,
  });
  if (!data.list || !data.list.length) return null;
  const best = data.list.reduce((a, b) => (b.thumbs_up > a.thumbs_up ? b : a));
  return {
    word: best.word,
    definition: best.definition.replace(/[\[\]\r]/g, ''),
    example: best.example.replace(/[\[\]\r]/g, ''),
    thumbsUp: best.thumbs_up,
    thumbsDown: best.thumbs_down,
  };
}

async function udRandom() {
  const { data } = await axios.get('https://api.urbandictionary.com/v0/random', { timeout: 10000 });
  const item = data.list[Math.floor(Math.random() * data.list.length)];
  return {
    word: item.word,
    definition: item.definition.replace(/[\[\]\r]/g, ''),
    example: item.example.replace(/[\[\]\r]/g, ''),
    thumbsUp: item.thumbs_up,
    thumbsDown: item.thumbs_down,
  };
}

function fmt(entry) {
  return `📖 *${entry.word}*\n\n${entry.definition}\n\n_Example: ${entry.example}_\n\n👍 ${entry.thumbsUp}  👎 ${entry.thumbsDown}`;
}

bot({ pattern: 'ud ?(.*)', desc: 'Look up a word on Urban Dictionary', type: 'misc' }, async (msg, match) => {
  const term = (match || '').trim();

  if (!msg.client || msg.client.constructor.name === 'MockSocket') {
    return msg.reply(`_[mock] Urban Dictionary: ${term || 'random'}_`);
  }

  try {
    const entry = term ? await udDefine(term) : await udRandom();
    if (!entry) return msg.reply(`_No definition found for "${term}"_`);
    return msg.reply(fmt(entry));
  } catch (e) {
    return msg.reply('_Urban Dictionary lookup failed: ' + (e.message || e) + '_');
  }
});

bot({ pattern: 'urban ?(.*)', desc: 'Look up a word on Urban Dictionary (alias)', type: 'misc' }, async (msg, match) => {
  const term = (match || '').trim();
  if (!msg.client || msg.client.constructor.name === 'MockSocket') return msg.reply(`_[mock] Urban Dictionary: ${term || 'random'}_`);
  try {
    const entry = term ? await udDefine(term) : await udRandom();
    if (!entry) return msg.reply(`_No definition found for "${term}"_`);
    return msg.reply(fmt(entry));
  } catch (e) {
    return msg.reply('_Urban Dictionary lookup failed: ' + (e.message || e) + '_');
  }
});
