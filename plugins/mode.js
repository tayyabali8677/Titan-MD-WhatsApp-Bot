const { bot, lang } = require('../lib');
const kv = require('../lib/kv');
const config = require('../config');

const NS = 'mode';
const VALID = ['public', 'private', 'inbox', 'groups'];

bot({ pattern: 'mode ?(.*)', desc: lang.plugins.mode?.desc || 'Show or set bot access mode', type: 'system' }, async (msg, match, ctx) => {
  const arg = (match || '').trim().toLowerCase();
  if (!arg) {
    const cur = (await kv.get(NS, 'current')) || config.MODE || 'private';
    return msg.reply(`_Current mode: *${cur}*_\n_Options: ${VALID.join(', ')}_`);
  }
  if (!VALID.includes(arg)) return msg.reply(`_Invalid mode. Options: ${VALID.join(', ')}_`);
  if (!ctx.isSudo) return msg.reply(lang.extra?.sudo_only || lang.plugins.common.sudo_only);
  await kv.set(NS, 'current', arg);
  return msg.reply(`_Mode set to: *${arg}* ✅_`);
});
