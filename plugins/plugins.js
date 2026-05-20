const { bot, lang } = require('../lib');
const kv = require('../lib/kv');

bot({ pattern: 'install ?(.*)', desc: lang.plugins.plugins.desc, type: 'system' }, async (msg, match, ctx) => {
  if (!ctx.isSudo) return msg.reply(lang.plugins.common.sudo_only);
  if (!match) return msg.reply(lang.plugins.plugins.usage);
  const list = (await kv.get('extplugins', 'list')) || [];
  list.push({ url: match, installed: Date.now() });
  await kv.set('extplugins', 'list', list);
  return msg.reply(lang.plugins.plugins.installed.replace('{0}', match));
});

bot({ pattern: 'plugin', desc: lang.plugins.plugins.desc, type: 'system' }, async (msg) => {
  const list = (await kv.get('extplugins', 'list')) || [];
  return msg.reply(list.length ? list.map((p, i) => `${i}: ${p.url}`).join('\n') : '(none)');
});

bot({ pattern: 'remove ?(.*)', desc: lang.plugins.plugins.desc, type: 'system' }, async (msg, match, ctx) => {
  if (!ctx.isSudo) return msg.reply(lang.plugins.common.sudo_only);
  const i = parseInt(match || '', 10);
  const list = (await kv.get('extplugins', 'list')) || [];
  if (isNaN(i) || !list[i]) return msg.reply('Bad index.');
  const [removed] = list.splice(i, 1);
  await kv.set('extplugins', 'list', list);
  return msg.reply(lang.plugins.plugins.removed.replace('{0}', removed.url));
});
