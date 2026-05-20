const { bot, lang } = require('../lib');
bot({ pattern: 'groupinfo', desc: lang.plugins.groupinfo.desc, type: 'group', onlyGroup: true }, async (msg) => {
  const meta = await msg.groupMetadata();
  const admins = (meta.participants || []).filter((p) => p.admin).map((p) => `@${p.id.split('@')[0]}`).join(', ') || '(none)';
  const total = (meta.participants || []).length;
  const text = [
    `🏠 *Group Info*`,
    ``,
    `📌 Name: ${meta.subject || '(unknown)'}`,
    `🆔 JID: ${meta.id || msg.jid}`,
    `👥 Members: ${total}`,
    `👑 Admins: ${admins}`,
    `📝 Desc: ${(meta.desc || '(none)').slice(0, 200)}`,
    `📅 Created: ${meta.creation ? new Date(meta.creation * 1000).toLocaleDateString() : '(unknown)'}`,
  ].join('\n');
  return msg.send(text);
});
