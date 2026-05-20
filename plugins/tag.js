const { bot, lang } = require('../lib');

bot({ pattern: 'tag ?(.*)', desc: lang.plugins.tag.desc, type: 'group', onlyGroup: true }, async (msg, match) => {
  const which = (match || 'all').trim().toLowerCase();
  const meta = await msg.groupMetadata();
  const parts = meta.participants || [];
  let list = parts;
  if (which === 'admin')    list = parts.filter((p) => p.admin);
  if (which === 'notadmin') list = parts.filter((p) => !p.admin);
  const tags = list.map((p) => `@${p.id.split('@')[0]}`).join(' ');
  return msg.send(tags || '(empty)');
});
