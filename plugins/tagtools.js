const { bot, lang } = require('../lib');

bot({ pattern: 'tagnotadmin ?(.*)', desc: lang.plugins.tagtools.desc, type: 'group', onlyGroup: true }, async (msg, match) => {
  const meta = await msg.groupMetadata();
  const admins = (meta.participants || []).filter(p => p.admin).map(p => p.id);
  const nonAdmins = (meta.participants || []).filter(p => !p.admin).map(p => p.id);
  if (!nonAdmins.length) return msg.reply('_No non-admin members found._');
  return msg.reply(
    (match.trim() || '👤 Non-admins:') + '\n' + nonAdmins.map(j => '@' + j.split('@')[0]).join('\n'),
    { mentions: nonAdmins }
  );
});

bot({ pattern: 'tagall ?(.*)', desc: lang.plugins.tagtools.desc, type: 'group', onlyGroup: true }, async (msg, match) => {
  const meta = await msg.groupMetadata();
  const all = (meta.participants || []).map(p => p.id);
  return msg.reply(
    (match.trim() || '📢 Everyone:') + '\n' + all.map(j => '@' + j.split('@')[0]).join('\n'),
    { mentions: all }
  );
});
