const { bot, lang } = require('../lib');
bot({ pattern: 'github ?(.*)', desc: lang.plugins.github.desc, type: 'utility' }, async (msg, match) => {
  if (!match) return msg.reply(lang.plugins.github.usage);
  const isRepo = match.includes('/');
  if (isRepo) {
    const [user, repo] = match.split('/');
    return msg.reply(
      `📦 *GitHub Repo*\n\n` +
      `🔗 ${user}/${repo}\n` +
      `⭐ Stars: 1.2k (mock)\n` +
      `🍴 Forks: 234 (mock)\n` +
      `🐛 Issues: 12 (mock)\n` +
      `📝 Language: JavaScript (mock)\n` +
      `🔗 https://github.com/${user}/${repo}`
    );
  }
  return msg.reply(
    `👤 *GitHub User: ${match}*\n\n` +
    `📦 Repos: 42 (mock)\n` +
    `👥 Followers: 500 (mock)\n` +
    `📍 Location: (mock)\n` +
    `🔗 https://github.com/${match}`
  );
});
