const { bot, lang } = require('../lib');
const kv = require('../lib/kv');
const NS = 'antiwords';

bot({ pattern: 'antiwords ?(.*)', desc: lang.plugins.antiwords.desc, type: 'group', onlyGroup: true }, async (msg, match) => {
  const parts = (match || '').trim().split(/\s+/);
  const sub = (parts.shift() || '').toLowerCase();
  const rest = parts;
  const state = (await kv.get(NS, msg.jid)) || { on: false, action: 'warn', words: [] };
  switch (sub) {
    case 'on':  state.on = true;  await kv.set(NS, msg.jid, state); return msg.reply(lang.plugins.antiwords.on);
    case 'off': state.on = false; await kv.set(NS, msg.jid, state); return msg.reply(lang.plugins.antiwords.off);
    case 'add':
      state.words = [...new Set([...state.words, ...rest.map((s) => s.toLowerCase())])];
      await kv.set(NS, msg.jid, state); return msg.reply(`words: ${state.words.join(', ')}`);
    case 'remove':
      state.words = state.words.filter((w) => !rest.map((s) => s.toLowerCase()).includes(w));
      await kv.set(NS, msg.jid, state); return msg.reply('updated');
    case 'list': return msg.reply(`on:${state.on} action:${state.action} words:${state.words.join(', ') || '(none)'}`);
    case 'kick': case 'warn': case 'null':
      state.action = sub; await kv.set(NS, msg.jid, state); return msg.reply(`action: ${sub}`);
    default: return msg.reply(lang.plugins.antiwords.usage);
  }
});
