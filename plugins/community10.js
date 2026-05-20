const { bot, lang } = require('../lib');
const kv = require('../lib/kv');

bot({ pattern: 'groupsnap ?(.*)', desc: lang.plugins.groupsnap?.desc || 'Group snapshot tool', type: 'group' }, async (msg, match) => {
  const parts = (match || '').trim().split(/\s+/);
  const sub = (parts[0] || '').toLowerCase();
  const snaps = (await kv.get('groupsnap', msg.jid)) || [];

  if (!sub || sub === 'list') {
    if (!snaps.length) return msg.reply('_No snapshots saved for this group._');
    const lines = snaps.map((s, i) => `${i + 1}. ${s.name || 'group'} • ${s.members} members • ${new Date(s.timestamp).toISOString()}`);
    return msg.reply(`📸 *Snapshots:*\n${lines.join('\n')}`);
  }

  if (sub === 'create') {
    const snap = { timestamp: Date.now(), members: Math.floor(Math.random() * 200) + 1, name: 'group' };
    snaps.push(snap);
    await kv.set('groupsnap', msg.jid, snaps);
    return msg.reply(`📸 _[mock] Snapshot created (#${snaps.length}) ✅_`);
  }

  if (sub === 'restore') {
    const idx = parseInt(parts[1], 10);
    if (isNaN(idx) || !snaps[idx - 1]) return msg.reply('_Usage: .groupsnap restore <n>_');
    return msg.reply(`♻️ _[mock] Restored snapshot #${idx} ✅_`);
  }

  if (sub === 'delete') {
    const idx = parseInt(parts[1], 10);
    if (isNaN(idx) || !snaps[idx - 1]) return msg.reply('_Usage: .groupsnap delete <n>_');
    snaps.splice(idx - 1, 1);
    await kv.set('groupsnap', msg.jid, snaps);
    return msg.reply(`🗑️ _Snapshot #${idx} deleted ✅_`);
  }

  return msg.reply('_Usage: .groupsnap create / restore <n> / list / delete <n>_');
});

bot({ pattern: 'fd ?(.*)', desc: lang.plugins.fd?.desc || 'Forward to multiple JIDs', type: 'utility' }, async (msg, match) => {
  if (!match) return msg.reply('_Usage: .fd <jid1,jid2,...> (reply to a message)_');
  const jids = match.split(',').map(s => s.trim()).filter(Boolean);
  if (!jids.length) return msg.reply('_No valid JIDs provided._');
  return msg.reply(`📤 _[mock] Forwarded to ${jids.length} chat(s): ${jids.join(', ')}_`);
});
