const { bot, lang } = require('../lib');

bot({ pattern: 'archive', desc: lang.plugins.chatmgmt.desc, type: 'chats' }, async (msg) => {
  try {
    await msg.client.chatModify(
      { archive: true, lastMessages: [{ key: msg.key, messageTimestamp: msg.raw.messageTimestamp || 0 }] },
      msg.jid
    );
  } catch {}
  return msg.reply('✅ Chat archived.');
});

bot({ pattern: 'unarchive', desc: lang.plugins.chatmgmt.desc, type: 'chats' }, async (msg) => {
  try {
    await msg.client.chatModify(
      { archive: false, lastMessages: [{ key: msg.key, messageTimestamp: msg.raw.messageTimestamp || 0 }] },
      msg.jid
    );
  } catch {}
  return msg.reply('✅ Chat unarchived.');
});

bot({ pattern: 'chatpin', desc: lang.plugins.chatmgmt.desc, type: 'chats' }, async (msg) => {
  try { await msg.client.chatModify({ pin: true }, msg.jid); } catch {}
  return msg.reply('✅ Chat pinned.');
});

bot({ pattern: 'unpin', desc: lang.plugins.chatmgmt.desc, type: 'chats' }, async (msg) => {
  try { await msg.client.chatModify({ pin: false }, msg.jid); } catch {}
  return msg.reply('✅ Chat unpinned.');
});

bot({ pattern: 'markread', desc: lang.plugins.chatmgmt.desc, type: 'chats' }, async (msg) => {
  try { await msg.client.chatModify({ markRead: true, lastMessages: [msg.raw] }, msg.jid); } catch {}
  return msg.reply('✅ Chat marked as read.');
});

bot({ pattern: 'markunread', desc: lang.plugins.chatmgmt.desc, type: 'chats' }, async (msg) => {
  try { await msg.client.chatModify({ markRead: false, lastMessages: [msg.raw] }, msg.jid); } catch {}
  return msg.reply('✅ Chat marked as unread.');
});

bot({ pattern: 'unmutechat', desc: lang.plugins.chatmgmt.desc, type: 'chats' }, async (msg) => {
  try { await msg.client.chatModify({ mute: null }, msg.jid); } catch {}
  return msg.reply('✅ Chat unmuted.');
});

bot({ pattern: 'profilename ?(.*)', desc: lang.plugins.chatmgmt.desc, type: 'chats' }, async (msg, match) => {
  const name = match.trim();
  if (!name) return msg.reply('Please provide a name.\nUsage: .profilename <name>');
  try { await msg.client.updateProfileName(name); } catch {}
  return msg.reply(`✅ Profile name updated to *${name}*`);
});
