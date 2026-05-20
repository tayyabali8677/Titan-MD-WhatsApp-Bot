const { bot, lang } = require('../lib');
const kv = require('../lib/kv');

function makeToggle(name, label, scope) {
  bot({ pattern: `${name} ?(.*)`, desc: lang.plugins[name]?.desc || `Toggle ${label}`, type: 'misc' }, async (msg, match) => {
    const sub = (match || '').trim().toLowerCase();
    const key = scope === 'jid' ? (msg.jid || 'global') : 'enabled';
    if (!sub) {
      const state = (await kv.get(name, key, 'off')) || 'off';
      return msg.reply(`_${label} is currently: *${state}*_`);
    }
    if (sub === 'on' || sub === 'off') {
      await kv.set(name, key, sub);
      return msg.reply(`_${label}: *${sub}* ✅_`);
    }
    return msg.reply(`_Usage: .${name} on/off_`);
  });
}

makeToggle('antibroadcast', 'Anti-broadcast', 'jid');
makeToggle('antireaction', 'Anti-reaction', 'jid');
makeToggle('antishield', 'Anti-spam shield', 'jid');
makeToggle('apresence', 'Auto-presence (typing/recording)', 'global');
