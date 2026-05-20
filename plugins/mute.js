const { CronJob } = require('cron');
const { bot, lang } = require('../lib');
const kv = require('../lib/kv');

const NS = 'amute';
const tasks = new Map();

bot({ pattern: 'amute ?(.*)', desc: lang.plugins.mute.desc, type: 'group', onlyGroup: true }, async (msg, match) => {
  const parts = (match || '').trim().split(/\s+/);
  const sub = (parts.shift() || '').toLowerCase();
  const state = (await kv.get(NS, msg.jid)) || { on: false, expr: '0 22 * * *', msg: 'Group muted.' };
  switch (sub) {
    case 'on': {
      state.on = true;
      state.expr = parts.join(' ') || state.expr;
      await kv.set(NS, msg.jid, state);
      if (tasks.has(msg.jid)) tasks.get(msg.jid).stop();
      try {
        const job = new CronJob(state.expr, () => console.log(`[mute] auto-mute ${msg.jid}`));
        job.start();
        tasks.set(msg.jid, job);
      } catch {}
      return msg.reply(lang.plugins.mute.on.replace('{0}', state.expr));
    }
    case 'off':
      state.on = false;
      await kv.set(NS, msg.jid, state);
      if (tasks.has(msg.jid)) { tasks.get(msg.jid).stop(); tasks.delete(msg.jid); }
      return msg.reply(lang.plugins.mute.off);
    case 'info':
      return msg.reply(JSON.stringify(state, null, 2));
    default:
      if (msg.reply_message) {
        state.msg = msg.reply_message.body || state.msg;
        await kv.set(NS, msg.jid, state);
        return msg.reply('Mute message set.');
      }
      return msg.reply(lang.plugins.mute.usage);
  }
});

bot({ pattern: 'aunmute ?(.*)', desc: 'Schedule auto-unmute', type: 'group', onlyGroup: true }, async (msg, match) => {
  const expr = (match || '').trim() || '0 6 * * *';
  await kv.set(NS + ':un', msg.jid, { expr });
  return msg.reply(`aunmute: ${expr}`);
});
