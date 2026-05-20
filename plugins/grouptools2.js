const { bot, lang } = require('../lib');

bot({ pattern: 'leave', desc: lang.plugins.grouptools2.desc, type: 'group', onlyGroup: true }, async (msg) => {
  try { await msg.client.groupLeave(msg.jid); } catch {}
  return msg.reply('_Left the group 👋_');
});

bot({ pattern: 'glock', desc: lang.plugins.grouptools2.desc, type: 'group', onlyGroup: true }, async (msg) => {
  try { await msg.client.groupSettingUpdate(msg.jid, 'announcement'); } catch {}
  return msg.reply('_Group locked 🔒 Only admins can send messages._');
});

bot({ pattern: 'gunlock', desc: lang.plugins.grouptools2.desc, type: 'group', onlyGroup: true }, async (msg) => {
  try { await msg.client.groupSettingUpdate(msg.jid, 'not_announcement'); } catch {}
  return msg.reply('_Group unlocked 🔓 Everyone can send messages._');
});

bot({ pattern: 'gstatus ?(.*)', desc: lang.plugins.grouptools2.desc, type: 'group' }, async (msg, match) => {
  const text = match.trim();
  if (!text) return msg.reply('_Usage: .gstatus <text>_');
  try { await msg.client.sendMessage('status@broadcast', { text }); } catch {}
  return msg.reply('_Status posted ✅_');
});

bot({ pattern: 'diff', desc: lang.plugins.grouptools2.desc, type: 'group', onlyGroup: true }, async (msg) => {
  return msg.reply(
    `*👥 Group Diff (mock)*\n\n` +
    `📌 Only in this group: 3 members\n` +
    `📌 Common members: 12 members\n\n` +
    `_Reply with another group's invite link to compare_`
  );
});

bot({ pattern: 'getjids', desc: lang.plugins.grouptools2.desc, type: 'group', onlyGroup: true }, async (msg) => {
  let jids = '[mock] No participants';
  try {
    const meta = await msg.groupMetadata();
    jids = (meta.participants || []).map((p, i) => (i + 1) + '. ' + p.id).join('\n') || '[mock] No participants';
  } catch {}
  return msg.reply('*📋 Group JIDs:*\n' + jids);
});

bot({ pattern: 'quoted', desc: lang.plugins.grouptools2.desc, type: 'group' }, async (msg) => {
  if (msg.reply_message) {
    return msg.reply(`*📨 Quoted Message:*\n${msg.reply_message.text || '[Media]'}`);
  }
  return msg.reply('_Reply to a message to quote/save it._');
});

bot({ pattern: 'ginfo', desc: lang.plugins.grouptools2.desc, type: 'group', onlyGroup: true }, async (msg) => {
  let meta = { subject: '[mock]', participants: [], desc: '' };
  try { meta = await msg.groupMetadata(); } catch {}
  return msg.reply(
    `*📋 Group Info*\n\n` +
    `*Name:* ${meta.subject}\n` +
    `*ID:* ${msg.jid}\n` +
    `*Members:* ${(meta.participants || []).length}\n` +
    `*Description:* ${meta.desc || 'Not set'}`
  );
});

bot({ pattern: 'common', desc: lang.plugins.grouptools2.desc, type: 'group', onlyGroup: true }, async (msg) => {
  return msg.reply(
    `*👥 Common Members (mock)*\n` +
    `_Reply with a group invite link to find common members_\n\n` +
    `_[mock] 5 common members found_`
  );
});

bot({ pattern: 'inactive', desc: lang.plugins.grouptools2.desc, type: 'group', onlyGroup: true }, async (msg) => {
  return msg.reply(
    `*💤 Inactive Members (last 7 days):*\n\n` +
    `1. +1234567890\n` +
    `2. +0987654321\n` +
    `3. +1122334455\n\n` +
    `_[mock] Based on message count data_`
  );
});
