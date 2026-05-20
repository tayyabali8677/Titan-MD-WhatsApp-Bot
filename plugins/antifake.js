const { bot, lang } = require('../lib');
const kv = require('../lib/kv');
const NS = 'antifake';

bot({ pattern: 'antifake ?(.*)', desc: lang.plugins.antifake.desc, type: 'group', onlyGroup: true }, async (msg, match) => {
  const parts = (match || '').trim().split(/\s+/);
  const sub = (parts.shift() || '').toLowerCase();
  const rest = parts;
  const state = (await kv.get(NS, msg.jid)) || { mode: null, codes: [], on: false };
  switch (sub) {
    case 'on':  state.on = true;  await kv.set(NS, msg.jid, state); return msg.reply(lang.plugins.antifake.on);
    case 'off': state.on = false; await kv.set(NS, msg.jid, state); return msg.reply(lang.plugins.antifake.off);
    case 'allow':
      if (state.mode === 'blacklist' && state.codes.length) return msg.reply(lang.plugins.antifake.mix_error);
      state.mode = 'whitelist';
      state.codes = [...new Set([...state.codes, ...rest])];
      await kv.set(NS, msg.jid, state);
      return msg.reply(lang.plugins.antifake.allowed.replace('{0}', state.codes.join(', ')));
    case 'disallow':
      if (state.mode === 'whitelist' && state.codes.length) return msg.reply(lang.plugins.antifake.mix_error);
      state.mode = 'blacklist';
      state.codes = [...new Set([...state.codes, ...rest])];
      await kv.set(NS, msg.jid, state);
      return msg.reply(lang.plugins.antifake.disallowed.replace('{0}', state.codes.join(', ')));
    case 'remove':
      state.codes = state.codes.filter((c) => !rest.includes(c));
      await kv.set(NS, msg.jid, state);
      return msg.reply(`now: ${state.codes.join(', ') || '(empty)'}`);
    case 'clear':
      state.codes = []; state.mode = null;
      await kv.set(NS, msg.jid, state);
      return msg.reply(lang.plugins.antifake.cleared);
    case 'list':
      return msg.reply(`mode: ${state.mode || 'none'}\non: ${state.on}\ncodes: ${state.codes.join(', ') || '(none)'}`);
    default:
      return msg.reply(lang.plugins.antifake.usage);
  }
});
