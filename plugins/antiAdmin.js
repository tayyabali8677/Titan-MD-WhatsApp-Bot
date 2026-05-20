const { bot, lang } = require('../lib');
const kv = require('../lib/kv');
const config = require('../config');

async function toggle(msg, match, ns, label, defaultVal) {
  const arg = (match || '').trim().toLowerCase();
  if (!arg) {
    const cur = (await kv.get(ns, msg.jid)) || defaultVal || 'off';
    return msg.reply(`*${label}: ${cur}*`);
  }
  if (!['on', 'off'].includes(arg)) return msg.reply(`_Usage: .${ns} on/off_`);
  await kv.set(ns, msg.jid, arg);
  return msg.reply(`*${label}: ${arg}*`);
}

bot({ pattern: 'antibot ?(.*)', desc: lang.plugins.antibot?.desc || 'Toggle anti-bot', type: 'group', onlyGroup: true }, async (msg, match) => {
  return toggle(msg, match, 'antibot', 'Antibot', config.ANTI_BOT);
});

bot({ pattern: 'antipromote ?(.*)', desc: lang.plugins.antipromote?.desc || 'Toggle anti-promote', type: 'group', onlyGroup: true }, async (msg, match) => {
  return toggle(msg, match, 'antipromote', 'Antipromote', 'off');
});

bot({ pattern: 'antidemote ?(.*)', desc: lang.plugins.antidemote?.desc || 'Toggle anti-demote', type: 'group', onlyGroup: true }, async (msg, match) => {
  return toggle(msg, match, 'antidemote', 'Antidemote', 'off');
});
