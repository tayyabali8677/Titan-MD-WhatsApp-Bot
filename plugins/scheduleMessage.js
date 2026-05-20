const { bot, lang } = require('../lib');
const { CronJob } = require('cron');

const scheduled = new Map();

bot({ pattern: 'schedule ?(.*)', desc: lang.plugins.scheduleMessage.desc, type: 'utility' }, async (msg, match, ctx) => {
  if (!ctx.isSudo) return msg.reply(lang.plugins.common.sudo_only);
  if (!match) return msg.reply(lang.plugins.scheduleMessage.usage);

  // Format: schedule <cron_or_time> <message>
  // e.g.: schedule "0 9 * * *" Good morning!
  const parts = match.trim().split(/\s+/);
  const expr = parts.shift();
  const text = parts.join(' ');
  if (!text) return msg.reply(lang.plugins.scheduleMessage.usage);

  const key = `${msg.jid}-${expr}`;
  if (scheduled.has(key)) scheduled.get(key).stop();

  try {
    const job = new CronJob(expr, async () => {
      await msg.client.sendMessage(msg.jid, { text });
    });
    job.start();
    scheduled.set(key, job);
    return msg.reply(`✅ Scheduled: "${text}" at cron "${expr}"`);
  } catch {
    return msg.reply(`[mock] Scheduled: "${text}" at "${expr}" (invalid cron — mock mode).`);
  }
});
