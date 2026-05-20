const { bot, lang, getCommands } = require('../lib');

// Alias for tog — enable/disable commands at runtime
bot({ pattern: 'cmd ?(.*)', desc: lang.plugins.cmd.desc, type: 'system' }, async (msg, match, ctx) => {
  if (!ctx.isSudo) return msg.reply(lang.plugins.common.sudo_only);
  const [name, state] = (match || '').trim().split(/\s+/);
  if (!name) {
    const cmds = getCommands().map((c) => `${c.name}: ${c.active ? 'on' : 'off'}`).join('\n');
    return msg.reply(cmds || '(no commands)');
  }
  const enabled = (state || 'on').toLowerCase() !== 'off';
  const cmd = getCommands().find((c) => c.name === name);
  if (!cmd) return msg.reply(`Command "${name}" not found.`);
  cmd.active = enabled;
  return msg.reply(`${name}: ${enabled ? 'on' : 'off'}`);
});
