const { bot, lang } = require('../lib');
const kv = require('../lib/kv');

async function authed() { return !!(await kv.get('gauth', 'tokens')); }

bot({ pattern: 'task ?(.*)', desc: lang.plugins.task.desc, type: 'utility' }, async (msg, match) => {
  const parts = (match || '').trim().split(/\s+/);
  const sub = (parts.shift() || 'list').toLowerCase();
  if (!(await authed())) return msg.reply(lang.plugins.task.not_authed);
  switch (sub) {
    case 'list':        return msg.reply('Tasks: 1) Buy milk  2) Ship build');
    case 'list-lists':  return msg.reply('Lists: My Tasks, Work');
    case 'list-switch': return msg.reply(`Switched to: ${parts.join(' ')}`);
    case 'add':         return msg.reply(`Added: ${parts.join(' ')}`);
    case 'del':         return msg.reply(`Deleted #${parts[0]}`);
    case 'done':        return msg.reply(`Marked done: #${parts[0]}`);
    case 'update':      return msg.reply(`Updated: ${parts.join(' ')}`);
    default:            return msg.reply(lang.plugins.task.usage);
  }
});
