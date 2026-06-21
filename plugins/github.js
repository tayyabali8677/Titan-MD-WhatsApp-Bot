const { bot, lang } = require('../lib');
const axios = require('axios');

const GH = 'https://api.github.com';
const UA = { 'User-Agent': 'TitanMD/1.0', Accept: 'application/vnd.github.v3+json' };

bot({ pattern: 'github ?(.*)', desc: lang.plugins.github?.desc || 'GitHub user/repo info', type: 'utility' }, async (msg, match) => {
  const query = (match || '').trim();
  if (!query) return msg.reply('_Usage: .github <username> OR .github <user/repo>_');

  if (!msg.client || msg.client.constructor.name === 'MockSocket') {
    return msg.reply(`_[mock] GitHub info for: ${query}_`);
  }

  try {
    if (query.includes('/')) {
      const [user, repo] = query.split('/');
      const { data: r } = await axios.get(`${GH}/repos/${user}/${repo}`, { headers: UA, timeout: 10000 });
      return msg.reply(
        `📦 *${r.full_name}*\n\n` +
        `📝 ${r.description || 'No description'}\n\n` +
        `⭐ Stars: ${r.stargazers_count.toLocaleString()}\n` +
        `🍴 Forks: ${r.forks_count.toLocaleString()}\n` +
        `🐛 Issues: ${r.open_issues_count}\n` +
        `📝 Language: ${r.language || 'N/A'}\n` +
        `👁 Watchers: ${r.watchers_count}\n` +
        `📅 Created: ${r.created_at?.slice(0, 10)}\n` +
        `🔗 ${r.html_url}`
      );
    } else {
      const { data: u } = await axios.get(`${GH}/users/${query}`, { headers: UA, timeout: 10000 });
      return msg.reply(
        `👤 *${u.name || u.login}* (@${u.login})\n\n` +
        `📝 ${u.bio || 'No bio'}\n\n` +
        `📦 Public Repos: ${u.public_repos}\n` +
        `👥 Followers: ${u.followers.toLocaleString()}\n` +
        `➡️ Following: ${u.following}\n` +
        `📍 Location: ${u.location || 'N/A'}\n` +
        `🏢 Company: ${u.company || 'N/A'}\n` +
        `🔗 ${u.html_url}`
      );
    }
  } catch (e) {
    return msg.reply('_GitHub lookup failed: ' + (e.message || e) + '_');
  }
});
