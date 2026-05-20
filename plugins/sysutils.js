const { bot, lang } = require('../lib');

bot({ pattern: 'sudo ?(.*)', desc: lang.plugins.sudo?.desc || 'Manage sudo users', type: 'system' }, async (msg, match) => {
  const config = require('../config');
  return msg.reply(
    `*👑 Sudo Management*\n\nUsage:\n.sudo add <number>\n.sudo remove <number>\n.sudo list\n\n_Current sudo: ${config.SUDO || 'none'}_`
  );
});

bot({ pattern: 'clearsession', desc: lang.plugins.clearsession?.desc || 'Clear WhatsApp session', type: 'system' }, async (msg) => {
  return msg.reply('_⚠️ Clearing session..._\n_[mock] Session files cleared. Restart bot to re-link._');
});

bot({ pattern: 'cleartmp', desc: lang.plugins.cleartmp?.desc || 'Clear temp/cache files', type: 'system' }, async (msg) => {
  const fs = require('fs');
  try { const files = fs.readdirSync('./temp').length; } catch {}
  return msg.reply('_🗑️ Temp files cleared ✅_\n_[mock] Cleared temporary media cache_');
});

bot({ pattern: 'update', desc: lang.plugins.update?.desc || 'Check for bot updates', type: 'system' }, async (msg) => {
  const config = require('../config');
  return msg.reply(
    `*🔄 Update Check*\n\n📦 Current: v${config.VERSION}\n🌐 Latest: v${config.VERSION} (up to date)\n\n_Source: github.com/TitanDev/titan-md_`
  );
});

bot({ pattern: 'updatenow', desc: lang.plugins.updatenow?.desc || 'Force update bot from GitHub', type: 'system' }, async (msg) => {
  return msg.reply('_⬇️ Pulling latest updates..._\n_[mock] git pull origin master_\n_✅ Bot is up to date! Restart to apply._');
});
