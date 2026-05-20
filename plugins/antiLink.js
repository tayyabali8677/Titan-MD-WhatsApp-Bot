const { bot, lang } = require('../lib');
const kv = require('../lib/kv');
const NS = 'antilink';

bot({ pattern: 'antilink ?(.*)', desc: lang.plugins.antilink.desc, type: 'group', onlyGroup: true }, async (msg, match) => {
  const parts = (match || '').trim().split(/\s+/);
  const sub = (parts.shift() || '').toLowerCase();
  const rest = parts;
  const state = (await kv.get(NS, msg.jid)) || { on: false, action: 'warn', allow: [] };
  switch (sub) {
    case 'on':  state.on = true;  await kv.set(NS, msg.jid, state); return msg.reply(lang.plugins.antilink.on);
    case 'off': state.on = false; await kv.set(NS, msg.jid, state); return msg.reply(lang.plugins.antilink.off);
    case 'kick': case 'warn': case 'null': case 'delete':
      state.action = sub; await kv.set(NS, msg.jid, state); return msg.reply(`action: ${sub}`);
    case 'allow':
      state.allow = [...new Set([...state.allow, ...rest])];
      await kv.set(NS, msg.jid, state); return msg.reply(`allow: ${state.allow.join(', ')}`);
    case 'disallow':
      state.allow = state.allow.filter((x) => !rest.includes(x));
      await kv.set(NS, msg.jid, state); return msg.reply('updated');
    case 'clear': state.allow = []; await kv.set(NS, msg.jid, state); return msg.reply('cleared');
    case 'list': return msg.reply(`on:${state.on} action:${state.action} allow:${state.allow.join(', ') || '(none)'}`);
    default: return msg.reply(lang.plugins.antilink.usage);
  }
});
