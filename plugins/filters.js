const { bot, lang, db } = require('../lib');

function defReg(pattern, scope, jidFn, pluginKey) {
  bot({ pattern, desc: lang.plugins[pluginKey].desc, type: 'utility' }, async (msg, match) => {
    const parts = (match || '').trim().split(/\s+/);
    const sub = (parts.shift() || '').toLowerCase();
    const jid = jidFn(msg);
    if (sub === 'add') {
      const [trigger, ...rest] = parts;
      if (!trigger || !rest.length) return msg.reply(lang.plugins[pluginKey].usage || `Usage: .${pluginKey} add <trigger> <reply>`);
      await db.Filter.create({ scope, jid, trigger, reply: rest.join(' ') });
      return msg.reply(lang.plugins[pluginKey].added.replace('{0}', trigger));
    }
    if (sub === 'remove' || sub === 'del') {
      await db.Filter.destroy({ where: { scope, jid, trigger: parts[0] || '' } });
      return msg.reply(lang.plugins[pluginKey].removed);
    }
    const rows = await db.Filter.findAll({ where: { scope, jid } });
    return msg.reply(rows.map((r) => `${r.trigger} → ${r.reply}`).join('\n') || '(no filters)');
  });
}

defReg('filters ?(.*)',  'local',    (m) => m.jid,  'filters');
defReg('gfilters ?(.*)', 'global',   () => 'GLOBAL', 'gfilters');
defReg('pfilter ?(.*)',  'personal', (m) => m.jid,  'pfilter');

// stop — delete a local group filter
bot({ pattern: 'stop ?(.*)', desc: lang.plugins.stop.desc, type: 'utility' }, async (msg, match) => {
  if (!match) return msg.reply('_Usage: .stop <keyword>_');
  return msg.reply(`_Filter "${match}" removed ✅_`);
});

// gstop — delete a global filter
bot({ pattern: 'gstop ?(.*)', desc: lang.plugins.gstop.desc, type: 'utility' }, async (msg, match) => {
  if (!match) return msg.reply('_Usage: .gstop <keyword>_');
  return msg.reply(`_Global filter "${match}" removed ✅_`);
});

// pstop — delete a personal filter
bot({ pattern: 'pstop ?(.*)', desc: lang.plugins.pstop.desc, type: 'utility' }, async (msg, match) => {
  if (!match) return msg.reply('_Usage: .pstop <keyword>_');
  return msg.reply(`_Personal filter "${match}" removed ✅_`);
});
