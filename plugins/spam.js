const { bot, lang } = require('../lib');
const kv = require('../lib/kv');

bot({ pattern: 'spam ?(.*)', desc: lang.plugins.spam.desc, type: 'group', onlyGroup: true }, async (msg, match) => {
  const parts = (match || '').trim().split(/\s+/);
  const sub = (parts.shift() || '').toLowerCase();
  const state = (await kv.get('spam', msg.jid)) || { on: false, level: 'medium', action: 'warn' };
  switch (sub) {
    case 'on':     state.on = true;                    await kv.set('spam', msg.jid, state); return msg.reply(lang.plugins.spam.on);
    case 'off':    state.on = false;                   await kv.set('spam', msg.jid, state); return msg.reply(lang.plugins.spam.off);
    case 'level':  state.level = parts[0] || state.level;  await kv.set('spam', msg.jid, state); return msg.reply(`level: ${state.level}`);
    case 'action': state.action = parts[0] || state.action; await kv.set('spam', msg.jid, state); return msg.reply(`action: ${state.action}`);
    default: return msg.reply(JSON.stringify(state));
  }
});
