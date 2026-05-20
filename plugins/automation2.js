const { bot, lang } = require('../lib');
const kv = require('../lib/kv');

bot({ pattern: 'autostatus ?(.*)', desc: lang.plugins.autostatus?.desc || 'Toggle auto status view', type: 'misc' }, async (msg, match) => {
  const sub = (match || '').trim().toLowerCase();
  if (!sub) {
    const state = (await kv.get('autostatus')) || 'off';
    return msg.reply(`_Auto status view is currently: *${state}*_`);
  }
  if (sub === 'on' || sub === 'off') {
    await kv.set('autostatus', sub);
    return msg.reply(`_Auto status view: *${sub}* ✅_`);
  }
  return msg.reply('_Usage: .autostatus on/off_');
});

bot({ pattern: 'antidelete ?(.*)', desc: lang.plugins.antidelete?.desc || 'Toggle anti-delete protection', type: 'misc' }, async (msg, match) => {
  const sub = (match || '').trim().toLowerCase();
  if (!sub) {
    const state = (await kv.get('antidelete')) || 'off';
    return msg.reply(`_Anti-delete is currently: *${state}*_`);
  }
  if (sub === 'on' || sub === 'off') {
    await kv.set('antidelete', sub);
    return msg.reply(`_Anti-delete: *${sub}* ✅_`);
  }
  return msg.reply('_Usage: .antidelete on/off_');
});

bot({ pattern: 'antispam ?(.*)', desc: lang.plugins.antispam?.desc || 'Toggle anti-spam protection', type: 'misc' }, async (msg, match) => {
  const sub = (match || '').trim().toLowerCase();
  if (!sub) {
    const state = (await kv.get(`antispam_${msg.jid}`)) || 'off';
    return msg.reply(`_Anti-spam is currently: *${state}*_`);
  }
  if (sub === 'on' || sub === 'off') {
    await kv.set(`antispam_${msg.jid}`, sub);
    return msg.reply(`_Anti-spam: *${sub}* ✅_`);
  }
  return msg.reply('_Usage: .antispam on/off_');
});

bot({ pattern: 'save', desc: lang.plugins.save?.desc || 'Save replied message to saved messages', type: 'misc' }, async (msg) => {
  if (!msg.reply_message) return msg.reply('_Reply to a message to save it._');
  return msg.reply('_[mock] Message saved to your saved messages ✅_');
});
