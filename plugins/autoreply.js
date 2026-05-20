const { bot, lang } = require('../lib');
const kv = require('../lib/kv');
bot({ pattern: 'autoreply ?(.*)', desc: lang.plugins.autoreply.desc, type: 'utility' }, async (msg, match, ctx) => {
  if (!ctx.isSudo) return msg.reply(lang.plugins.common.sudo_only);
  const sub = (match || '').trim();
  if (sub.toLowerCase() === 'off') {
    await kv.set('autoreply', 'global', { on: false, text: '' });
    return msg.reply(lang.plugins.autoreply.off);
  }
  if (!sub) {
    const s = await kv.get('autoreply', 'global') || { on: false };
    return msg.reply(`autoreply: ${s.on ? 'on' : 'off'}\nmessage: ${s.text || '(none)'}`);
  }
  await kv.set('autoreply', 'global', { on: true, text: sub });
  return msg.reply(`${lang.plugins.autoreply.on}\nMessage: ${sub}`);
});
