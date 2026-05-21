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

// .update and .updatenow are now implemented for real in plugins/update.js
