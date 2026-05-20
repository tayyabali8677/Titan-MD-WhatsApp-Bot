const { bot, lang } = require('../lib');

bot({ pattern: 'getprivacy', desc: lang.plugins.privacy.desc, type: 'privacy' }, async (msg) => {
  return msg.reply(
    '*Privacy Settings*\n\n' +
    '🕐 Last Seen: contacts\n' +
    '🟢 Online: all\n' +
    '🖼 Profile Pic: contacts\n' +
    '📝 Status: contacts\n' +
    '👥 Group Add: contacts'
  );
});

bot({ pattern: 'lastseen ?(.*)', desc: lang.plugins.privacy.desc, type: 'privacy' }, async (msg, match) => {
  const val = match.trim();
  const valid = ['all', 'contacts', 'contact_blacklist', 'none'];
  if (!val || !valid.includes(val)) return msg.reply(`Usage: .lastseen [${valid.join('/')}]`);
  try { await msg.client.updateLastSeenPrivacy(val); } catch {}
  return msg.reply(`✅ Last seen privacy set to *${val}*`);
});

bot({ pattern: 'online ?(.*)', desc: lang.plugins.privacy.desc, type: 'privacy' }, async (msg, match) => {
  const val = match.trim();
  const valid = ['all', 'match_last_seen'];
  if (!val || !valid.includes(val)) return msg.reply(`Usage: .online [${valid.join('/')}]`);
  try { await msg.client.updateOnlinePrivacy(val); } catch {}
  return msg.reply(`✅ Online privacy set to *${val}*`);
});

bot({ pattern: 'mypp ?(.*)', desc: lang.plugins.privacy.desc, type: 'privacy' }, async (msg, match) => {
  const val = match.trim();
  const valid = ['all', 'contacts', 'contact_blacklist', 'none'];
  if (!val || !valid.includes(val)) return msg.reply(`Usage: .mypp [${valid.join('/')}]`);
  try { await msg.client.updateProfilePicturePrivacy(val); } catch {}
  return msg.reply(`✅ Profile picture privacy set to *${val}*`);
});

bot({ pattern: 'mystatus ?(.*)', desc: lang.plugins.privacy.desc, type: 'privacy' }, async (msg, match) => {
  const val = match.trim();
  const valid = ['all', 'contacts', 'contact_blacklist', 'none'];
  if (!val || !valid.includes(val)) return msg.reply(`Usage: .mystatus [${valid.join('/')}]`);
  try { await msg.client.updateStatusPrivacy(val); } catch {}
  return msg.reply(`✅ Status privacy set to *${val}*`);
});

bot({ pattern: 'groupadd ?(.*)', desc: lang.plugins.privacy.desc, type: 'privacy' }, async (msg, match) => {
  const val = match.trim();
  const valid = ['all', 'contacts', 'contact_blacklist', 'none'];
  if (!val || !valid.includes(val)) return msg.reply(`Usage: .groupadd [${valid.join('/')}]`);
  try { await msg.client.updateGroupsAddPrivacy(val); } catch {}
  return msg.reply(`✅ Group add privacy set to *${val}*`);
});
