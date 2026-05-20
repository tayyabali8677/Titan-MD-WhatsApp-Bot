const { bot, lang } = require('../lib');

const MOCK_NEWS = [
  { title: 'Tech Giants Announce New AI Partnerships', source: 'TechCrunch', url: 'https://techcrunch.com' },
  { title: 'Climate Summit Reaches Historic Agreement', source: 'Reuters', url: 'https://reuters.com' },
  { title: 'Global Markets Hit Record Highs', source: 'Bloomberg', url: 'https://bloomberg.com' },
];

bot({ pattern: 'news ?(.*)', desc: lang.plugins.news.desc, type: 'utility' }, async (msg, match) => {
  const topic = (match || '').trim() || 'latest';
  const items = MOCK_NEWS;
  let out = `📰 *Top News — ${topic}*\n\n`;
  items.forEach((n, i) => { out += `${i + 1}. *${n.title}*\n   📡 ${n.source}\n   🔗 ${n.url}\n\n`; });
  out += '[mock] Set NEWS_API_KEY for live headlines.';
  return msg.send(out);
});
