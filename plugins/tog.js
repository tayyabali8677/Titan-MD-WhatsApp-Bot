const { bot, lang, db, getCommands } = require('../lib');

bot({ pattern: 'tog ?(.*)', desc: lang.plugins.tog.desc, type: 'system' }, async (msg, match, ctx) => {
  if (!ctx.isSudo) return msg.reply(lang.plugins.common.sudo_only);
  const [name, state] = (match || '').trim().split(/\s+/);
  if (!name) return msg.reply(lang.plugins.tog.usage);
  const enabled = (state || 'on').toLowerCase() !== 'off';
  const [row] = await db.Toggle.findOrCreate({ where: { command: name }, defaults: { enabled } });
  row.enabled = enabled; await row.save();
  const cmd = getCommands().find((c) => c.name === name);
  if (cmd) cmd.active = enabled;
  return msg.reply(`${name}: ${enabled ? 'on' : 'off'}`);
});
