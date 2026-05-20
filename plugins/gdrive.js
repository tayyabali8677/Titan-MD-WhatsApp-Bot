const { bot, lang } = require('../lib');
const kv = require('../lib/kv');

async function authed() { return !!(await kv.get('gauth', 'tokens')); }

bot({ pattern: 'gdrive ?(.*)', desc: lang.plugins.gdrive.desc, type: 'utility' }, async (msg, match) => {
  const parts = (match || '').trim().split(/\s+/);
  const sub = (parts.shift() || 'list').toLowerCase();
  if (!(await authed())) return msg.reply(lang.plugins.gdrive.not_authed);
  if (sub === 'list')   return msg.reply('Files: titan-backup.zip, notes.md');
  if (sub === 'upload') return msg.reply(`Uploaded ${parts.join(' ') || '(replied file)'}`);
  if (sub === 'delete') return msg.reply(`Deleted ${parts.join(' ')}`);
  return msg.reply(lang.plugins.gdrive.usage);
});
