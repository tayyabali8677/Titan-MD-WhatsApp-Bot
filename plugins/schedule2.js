const { bot, lang } = require('../lib');
const kv = require('../lib/kv');

bot({ pattern: 'setschedule ?(.*)', desc: lang.plugins.setschedule?.desc || 'Set a cron schedule', type: 'utility' }, async (msg, match) => {
  if (!match) {
    return msg.reply('_Usage: .setschedule <cron_expr> | <message>_\n_Example: .setschedule 0 9 * * * | Good morning!_');
  }
  const [exprPart, ...textParts] = match.split('|');
  const expr = (exprPart || '').trim();
  const text = textParts.join('|').trim();
  if (!expr || !text) {
    return msg.reply('_Usage: .setschedule <cron_expr> | <message>_\n_Example: .setschedule 0 9 * * * | Good morning!_');
  }
  const list = (await kv.get('schedule_list')) || [];
  list.push({ expr, text });
  await kv.set('schedule_list', list);
  return msg.reply(`_✅ Schedule set: \`${expr}\` → "${text}"_`);
});

bot({ pattern: 'getschedule', desc: lang.plugins.getschedule?.desc || 'Get all active schedules', type: 'utility' }, async (msg) => {
  const list = (await kv.get('schedule_list')) || [];
  if (!list.length) return msg.reply('_No active schedules._');
  const formatted = list.map((s, i) => `*${i + 1}.* \`${s.expr}\` → "${s.text}"`).join('\n');
  return msg.reply(`*📅 Active Schedules*\n\n${formatted}`);
});

bot({ pattern: 'delschedule ?(.*)', desc: lang.plugins.delschedule?.desc || 'Delete a schedule by number', type: 'utility' }, async (msg, match) => {
  const num = parseInt((match || '').trim(), 10);
  if (!match || isNaN(num)) return msg.reply('_Usage: .delschedule <number>_\n_Example: .delschedule 1_');
  const list = (await kv.get('schedule_list')) || [];
  if (num < 1 || num > list.length) return msg.reply(`_No schedule #${num} found._`);
  list.splice(num - 1, 1);
  await kv.set('schedule_list', list);
  return msg.reply(`_Schedule #${num} deleted ✅_`);
});
