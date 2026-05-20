const { bot, lang, db } = require('../lib');

bot({ pattern: 'setvar ?(.*)', desc: lang.plugins.vars.desc, type: 'system' }, async (msg, match, ctx) => {
  if (!ctx.isSudo) return msg.reply(lang.plugins.common.sudo_only);
  const [k, ...rest] = (match || '').trim().split(/\s+/);
  if (!k) return msg.reply(lang.plugins.vars.usage);
  const [row] = await db.Vars.findOrCreate({ where: { k }, defaults: { v: rest.join(' ') } });
  row.v = rest.join(' '); await row.save();
  process.env[k] = row.v;
  return msg.reply(lang.plugins.vars.set.replace('{0}', k));
});

bot({ pattern: 'getvar ?(.*)', desc: lang.plugins.vars.desc, type: 'system' }, async (msg, match) => {
  const k = (match || '').trim();
  const row = await db.Vars.findOne({ where: { k } });
  return msg.reply(`${k}=${row ? row.v : '(unset)'}`);
});

bot({ pattern: 'delvar ?(.*)', desc: lang.plugins.vars.desc, type: 'system' }, async (msg, match, ctx) => {
  if (!ctx.isSudo) return msg.reply(lang.plugins.common.sudo_only);
  const k = (match || '').trim();
  await db.Vars.destroy({ where: { k } });
  return msg.reply(lang.plugins.vars.deleted.replace('{0}', k));
});

bot({ pattern: 'allvar', desc: lang.plugins.vars.desc, type: 'system' }, async (msg) => {
  const rows = await db.Vars.findAll();
  return msg.reply(rows.map((r) => `${r.k}=${r.v}`).join('\n') || '(none)');
});
