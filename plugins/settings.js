const { bot, lang } = require('../lib');

bot({ pattern: 'status ?(.*)', desc: lang.plugins.status.desc, type: 'misc' }, async (msg, match) => {
  if (!match) return msg.reply('_Usage: status <text>_');
  try { await msg.client.updateProfileStatus?.(match); } catch (_) {}
  return msg.reply(`_Auto status view: *${match}* ✅_`);
});

bot({ pattern: 'call ?(.*)', desc: lang.plugins.call.desc, type: 'misc' }, async (msg, match) => {
  if (!match) return msg.reply('_Usage: call <on|off>_');
  try { await msg.client.setCallRejection?.(match); } catch (_) {}
  return msg.reply(`_Call rejection: *${match}* ✅_`);
});

bot({ pattern: 'setread ?(.*)', desc: lang.plugins.setread.desc, type: 'misc' }, async (msg, match) => {
  if (!match) return msg.reply('_Usage: setread <on|off>_');
  try { await msg.client.setReadReceipts?.(match); } catch (_) {}
  return msg.reply(`_Read receipts: *${match}* ✅_`);
});

bot({ pattern: 'setonline ?(.*)', desc: lang.plugins.setonline.desc, type: 'misc' }, async (msg, match) => {
  if (!match) return msg.reply('_Usage: setonline <on|off>_');
  try { await msg.client.setAlwaysOnline?.(match); } catch (_) {}
  return msg.reply(`_Always online: *${match}* ✅_`);
});
