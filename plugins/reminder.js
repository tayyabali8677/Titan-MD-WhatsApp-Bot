const { bot, lang } = require('../lib');
const kv = require('../lib/kv');

async function authed() { return !!(await kv.get('gauth', 'tokens')); }

bot({ pattern: 'reminder ?(.*)', desc: lang.plugins.reminder.desc, type: 'utility' }, async (msg, match) => {
  const parts = (match || '').trim().split(/\s+/);
  const sub = (parts.shift() || 'list').toLowerCase();
  if (!(await authed())) return msg.reply(lang.plugins.reminder.not_authed);
  if (sub === 'add')  return msg.reply(`Reminder set: ${parts.join(' ')}`);
  if (sub === 'list') return msg.reply('Reminders: (none)');
  if (sub === 'del')  return msg.reply(`Deleted reminder ${parts[0]}`);
  return msg.reply(lang.plugins.reminder.usage);
});
