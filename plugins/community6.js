const { bot, lang } = require('../lib');
const kv = require('../lib/kv');

bot({ pattern: 'astatusreact ?(.*)', desc: lang.plugins.astatusreact?.desc || 'Toggle auto-react to statuses', type: 'misc' }, async (msg, match) => {
  const sub = (match || '').trim().toLowerCase();
  if (!sub) {
    const state = (await kv.get('astatusreact', 'enabled', 'off')) || 'off';
    return msg.reply(`_Auto status-react is currently: *${state}*_`);
  }
  if (sub === 'on' || sub === 'off') {
    await kv.set('astatusreact', 'enabled', sub);
    return msg.reply(`_Auto status-react: *${sub}* ✅_`);
  }
  return msg.reply('_Usage: .astatusreact on/off_');
});

bot({ pattern: 'teleget ?(.*)', desc: lang.plugins.teleget?.desc || 'Download Telegram file', type: 'downloader' }, async (msg, match) => {
  const url = (match || '').trim();
  if (!url) return msg.reply('_Usage: .teleget <telegram url>_');
  return msg.reply(`_[mock] 📥 fetched Telegram file from ${url}_`);
});

bot({ pattern: 'annas ?(.*)', desc: lang.plugins.annas?.desc || "Search Anna's Archive", type: 'utility' }, async (msg, match) => {
  const q = (match || '').trim();
  if (!q) return msg.reply('_Usage: .annas <book query>_');
  return msg.reply(`_[mock] 📚 Found 3 books for "${q}":_\n1. Sample Book One\n2. Sample Book Two\n3. Sample Book Three`);
});
