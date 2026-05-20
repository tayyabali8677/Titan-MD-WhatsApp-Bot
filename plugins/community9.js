const { bot, lang } = require('../lib');
const kv = require('../lib/kv');

bot({ pattern: 'autoforward ?(.*)', desc: lang.plugins.autoforward?.desc || 'Toggle auto-forward', type: 'misc' }, async (msg, match) => {
  const parts = (match || '').trim().split(/\s+/);
  const sub = (parts[0] || '').toLowerCase();
  if (!sub || sub === 'status') {
    const enabled = (await kv.get('autoforward', 'enabled')) || 'off';
    const target = (await kv.get('autoforward', 'target_jid')) || 'none';
    return msg.reply(`*Autoforward: ${enabled}*\nTarget: ${target}`);
  }
  if (sub === 'on') {
    if (!parts[1]) return msg.reply('_Usage: .autoforward on <target_jid>_');
    await kv.set('autoforward', 'enabled', 'on');
    await kv.set('autoforward', 'target_jid', parts[1]);
    return msg.reply(`*Autoforward: on* ✅\nTarget: ${parts[1]}`);
  }
  if (sub === 'off') {
    await kv.set('autoforward', 'enabled', 'off');
    return msg.reply('*Autoforward: off* ✅');
  }
  return msg.reply('_Usage: .autoforward on <jid> / off / status_');
});

bot({ pattern: 'autoinsta ?(.*)', desc: lang.plugins.autoinsta?.desc || 'Toggle Instagram auto-download', type: 'misc' }, async (msg, match) => {
  const sub = (match || '').trim().toLowerCase();
  if (!sub) {
    const state = (await kv.get('autoinsta', 'enabled')) || 'off';
    return msg.reply(`*Autoinsta: ${state}*`);
  }
  if (sub === 'on' || sub === 'off') {
    await kv.set('autoinsta', 'enabled', sub);
    return msg.reply(`*Autoinsta: ${sub}* ✅`);
  }
  return msg.reply('_Usage: .autoinsta on/off_');
});

bot({ pattern: 'autostatussender ?(.*)', desc: lang.plugins.autostatussender?.desc || 'Toggle auto-send status on reply', type: 'misc' }, async (msg, match) => {
  const sub = (match || '').trim().toLowerCase();
  if (!sub) {
    const state = (await kv.get('autostatussender', 'enabled')) || 'off';
    return msg.reply(`*Autostatussender: ${state}*`);
  }
  if (sub === 'on' || sub === 'off') {
    await kv.set('autostatussender', 'enabled', sub);
    return msg.reply(`*Autostatussender: ${sub}* ✅`);
  }
  return msg.reply('_Usage: .autostatussender on/off_');
});

bot({ pattern: 'antistatusmention ?(.*)', desc: lang.plugins.antistatusmention?.desc || 'Toggle anti status mention in group', type: 'misc' }, async (msg, match) => {
  const sub = (match || '').trim().toLowerCase();
  if (!sub) {
    const state = (await kv.get('antistatusmention', msg.jid)) || 'off';
    return msg.reply(`*Antistatusmention: ${state}*`);
  }
  if (sub === 'on' || sub === 'off') {
    await kv.set('antistatusmention', msg.jid, sub);
    return msg.reply(`*Antistatusmention: ${sub}* ✅`);
  }
  return msg.reply('_Usage: .antistatusmention on/off_');
});

bot({ pattern: 'stealth ?(.*)', desc: lang.plugins.stealth?.desc || 'Toggle stealth read (no receipts)', type: 'misc' }, async (msg, match) => {
  const sub = (match || '').trim().toLowerCase();
  if (!sub) {
    const state = (await kv.get('settings', 'stealth_read')) || 'off';
    return msg.reply(`*Stealth: ${state}*`);
  }
  if (sub === 'on' || sub === 'off') {
    await kv.set('settings', 'stealth_read', sub);
    return msg.reply(`*Stealth: ${sub}* ✅`);
  }
  return msg.reply('_Usage: .stealth on/off_');
});

bot({ pattern: 'statussaver', desc: lang.plugins.statussaver?.desc || 'Save replied status', type: 'misc' }, async (msg) => {
  if (!msg.reply_message) return msg.reply('_Reply to a status with .statussaver_');
  return msg.reply('_[mock] status saved ✅_');
});
