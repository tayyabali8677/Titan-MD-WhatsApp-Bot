const { bot, lang } = require('../lib');
const kv = require('../lib/kv');
const config = require('../config');

bot({ pattern: 'vv', desc: lang.plugins.vv?.desc || 'Reveal view-once message', type: 'misc' }, async (msg) => {
  if (!msg.reply_message) return msg.reply('_Reply to a view-once message._');
  try {
    if (msg.client.copyNForward) {
      await msg.client.copyNForward(msg.jid, msg.reply_message);
      return msg.reply('_View-once revealed ✅_');
    }
  } catch {}
  return msg.reply('_[mock] view-once revealed_');
});

bot({ pattern: 'uptime', desc: lang.plugins.uptime?.desc || 'Show bot uptime', type: 'system' }, async (msg) => {
  const s = Math.floor(process.uptime());
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return msg.reply(`_⏱️ Uptime: ${d}d ${h}h ${m}m ${sec}s_`);
});

bot({ pattern: 'owner', desc: lang.plugins.owner?.desc || 'Show bot owner contact', type: 'misc' }, async (msg) => {
  return msg.reply(`*👑 Owner*\n\n*Name:* ${config.OWNER_NAME}\n*Number:* ${config.OWNER_NUMBER || '(not set)'}`);
});

bot({ pattern: 'repo', desc: lang.plugins.repo?.desc || 'Show bot repository', type: 'misc' }, async (msg) => {
  return msg.reply(`*📦 ${config.BOT_NAME}*\n\nhttps://github.com/TitanDev/titan-md\n\n_A multi-purpose WhatsApp bot._`);
});

bot({ pattern: 'language ?(.*)', desc: lang.plugins.language?.desc || 'Show or set bot language', type: 'system' }, async (msg, match, ctx) => {
  const arg = (match || '').trim().toLowerCase();
  if (!arg) {
    const cur = (await kv.get('settings', 'lang')) || config.BOT_LANG || 'en';
    return msg.reply(`_Current language: *${cur}*_`);
  }
  if (!ctx.isSudo) return msg.reply(lang.extra?.sudo_only || lang.plugins.common.sudo_only);
  await kv.set('settings', 'lang', arg);
  return msg.reply(`_Language set to: *${arg}* ✅_`);
});

bot({ pattern: 'cancel ?(.*)', desc: lang.plugins.cancel?.desc || 'Cancel a pending scheduled message', type: 'misc' }, async (msg, match) => {
  const id = (match || '').trim();
  if (!id) {
    const all = await kv.all('schedule_pending');
    if (!all.length) return msg.reply('_No pending scheduled messages._');
    return msg.reply('*Pending:*\n' + all.map((r) => `• ${r.k}`).join('\n') + '\n\n_Usage: .cancel <id>_');
  }
  await kv.del('schedule_pending', id);
  return msg.reply(`_Scheduled message *${id}* cancelled ✅_`);
});

bot({ pattern: 'retry', desc: lang.plugins.retry?.desc || 'Retry the last failed command', type: 'misc' }, async (msg) => {
  return msg.reply('_[mock] retry not yet wired in mock mode_');
});

bot({ pattern: 'edit ?(.*)', desc: lang.plugins.edit?.desc || 'Edit the last bot message', type: 'misc' }, async (msg, match) => {
  const text = (match || '').trim();
  if (!text) return msg.reply('_Usage: .edit <new text>_');
  try {
    if (msg.client.sendMessage) {
      await msg.client.sendMessage(msg.jid, { text, edit: msg.key });
      return;
    }
  } catch {}
  return msg.reply(`_[mock] last message edited to: ${text}_`);
});
