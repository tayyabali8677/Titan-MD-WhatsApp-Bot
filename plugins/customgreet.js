const { bot, lang } = require('../lib');
const kv = require('../lib/kv');

const NS = 'customgreet';

bot({ pattern: 'setgreet ?(.*)', desc: lang.plugins.setgreet?.desc || 'Set welcome/goodbye template', type: 'group' }, async (msg, match) => {
  const raw = (match || '').trim();
  if (!raw.includes('|')) return msg.reply('_Usage: .setgreet welcome|<template> or .setgreet goodbye|<template>_\n_Placeholders: $user $group $mention $count_');
  const [kind, ...rest] = raw.split('|');
  const key = kind.trim().toLowerCase();
  const tpl = rest.join('|').trim();
  if (!['welcome', 'goodbye'].includes(key)) return msg.reply('_First arg must be welcome or goodbye._');
  if (!tpl) return msg.reply('_Template cannot be empty._');
  await kv.set(NS, `${msg.jid}:${key}`, tpl);
  return msg.reply(`_${key} template saved ✅_`);
});

bot({ pattern: 'getgreet', desc: lang.plugins.getgreet?.desc || 'Show greet templates', type: 'group' }, async (msg) => {
  const w = await kv.get(NS, `${msg.jid}:welcome`);
  const g = await kv.get(NS, `${msg.jid}:goodbye`);
  return msg.reply(`*Greet templates:*\n• welcome: ${w || '(unset)'}\n• goodbye: ${g || '(unset)'}`);
});

bot({ pattern: 'delgreet ?(.*)', desc: lang.plugins.delgreet?.desc || 'Delete greet template', type: 'group' }, async (msg, match) => {
  const key = (match || '').trim().toLowerCase();
  if (!['welcome', 'goodbye'].includes(key)) return msg.reply('_Usage: .delgreet welcome|goodbye_');
  await kv.del(NS, `${msg.jid}:${key}`);
  return msg.reply(`_${key} template deleted ✅_`);
});
