const { bot, lang } = require('../lib');
const kv = require('../lib/kv');
const NS = 'gauth';

bot({ pattern: 'gauth ?(.*)', desc: lang.plugins.gauth.desc, type: 'utility' }, async (msg, match) => {
  const parts = (match || '').trim().split(/\s+/);
  const sub = (parts.shift() || '').toLowerCase();
  switch (sub) {
    case 'auth': {
      const creds = await kv.get(NS, 'credentials');
      if (!creds) return msg.reply(lang.plugins.gauth.no_creds);
      return msg.reply('https://accounts.google.com/o/oauth2/v2/auth?mock=titanmd&scope=drive%20tasks%20calendar');
    }
    case 'code':
      await kv.set(NS, 'tokens', { access_token: 'mock-token', refresh_token: 'mock-refresh', expiry: Date.now() + 3600e3 });
      return msg.reply(lang.plugins.gauth.authed);
    case 'import':
      await kv.set(NS, 'credentials', { client_id: 'mock', client_secret: 'mock', mock: true });
      return msg.reply('credentials.json imported (mock).');
    case 'status': {
      const t = await kv.get(NS, 'tokens');
      return msg.reply(t ? `${lang.plugins.gauth.authed} Expires ${new Date(t.expiry).toISOString()}` : lang.plugins.gauth.not_authed);
    }
    case 'logout':
      await kv.del(NS, 'tokens');
      return msg.reply(lang.plugins.gauth.logout);
    default:
      return msg.reply(lang.plugins.gauth.usage);
  }
});

module.exports.isAuthed = async () => !!(await kv.get(NS, 'tokens'));
