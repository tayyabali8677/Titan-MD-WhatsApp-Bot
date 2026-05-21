/**
 * Auto-reply system.
 *
 * Two modes:
 *
 * 1) Global blanket auto-reply
 *    .autoreply <text>     — set a single message that gets sent in reply to
 *                            any PM the bot receives (e.g. for "I'm busy" auto-replies)
 *    .autoreply off        — disable
 *    .autoreply            — show current state
 *
 * 2) Keyword auto-reply (per-chat)
 *    .setreply <kw>|<reply>  — bind a keyword to a response
 *    .getreply [kw]          — list all or look up one
 *    .delreply <kw>          — remove a binding
 *    .clearreply             — wipe all bindings in this chat
 */

const { bot, lang, onBeforeMessage } = require('../lib');
const config = require('../config');
const kv = require('../lib/kv');

const NS_GLOBAL = 'autoreply';
const NS_KW = 'autoreply_kw';

const PREFIX_TOKEN = (() => {
  const p = String(config.PREFIX || '^[.,!]');
  return p.replace(/[\^\[\]\\]/g, '').slice(0, 1) || '.';
})();

function normalize(s) { return String(s || '').trim().toLowerCase(); }

// ─── (1) Global blanket auto-reply ───────────────────────────────────────────
bot({ pattern: 'autoreply ?(.*)', desc: lang.plugins.autoreply.desc, type: 'utility' }, async (msg, match, ctx) => {
  if (!ctx.isSudo) return msg.reply(lang.extra.sudo_only);
  const sub = (match || '').trim();
  if (sub.toLowerCase() === 'off') {
    await kv.set(NS_GLOBAL, 'global', { on: false, text: '' });
    return msg.reply(lang.plugins.autoreply.off);
  }
  if (!sub) {
    const s = (await kv.get(NS_GLOBAL, 'global')) || { on: false };
    return msg.reply(`autoreply: ${s.on ? 'on' : 'off'}\nmessage: ${s.text || '(none)'}`);
  }
  await kv.set(NS_GLOBAL, 'global', { on: true, text: sub });
  return msg.reply(`${lang.plugins.autoreply.on}\nMessage: ${sub}`);
});

// ─── (2) Keyword auto-reply (per-chat) ───────────────────────────────────────
bot({ pattern: 'setreply ?(.*)', desc: 'Bind a keyword to an auto-reply', type: 'utility' }, async (msg, match) => {
  const raw = (match || '').trim();
  if (!raw || !raw.includes('|')) {
    return msg.reply(
      `_Usage:_ \`${PREFIX_TOKEN}setreply <keyword>|<reply text>\`\n\n` +
      `Example: \`${PREFIX_TOKEN}setreply hello|Hi there 👋\`\n` +
      `Then anyone typing "hello" in this chat gets that reply.`
    );
  }
  const idx = raw.indexOf('|');
  const keyword = normalize(raw.slice(0, idx));
  const reply = raw.slice(idx + 1).trim();
  if (!keyword || !reply) return msg.reply('_Both keyword and reply are required._');
  if (keyword.length < 2) return msg.reply('_Keyword must be at least 2 characters._');

  const all = (await kv.get(NS_KW, msg.jid)) || {};
  all[keyword] = reply;
  await kv.set(NS_KW, msg.jid, all);
  return msg.reply(`✅ Auto-reply saved.\n*Trigger:* \`${keyword}\`\n*Reply:* ${reply}`);
});

bot({ pattern: 'getreply ?(.*)', desc: 'List or look up keyword auto-replies', type: 'utility' }, async (msg, match) => {
  const all = (await kv.get(NS_KW, msg.jid)) || {};
  const keys = Object.keys(all);
  if (!keys.length) return msg.reply('_No keyword auto-replies in this chat._');
  const arg = normalize(match || '');
  if (arg) {
    return all[arg]
      ? msg.reply(`*${arg}* → ${all[arg]}`)
      : msg.reply(`_No auto-reply for_ \`${arg}\``);
  }
  return msg.reply(
    `*Keyword auto-replies (${keys.length}):*\n\n` +
    keys.map((k, i) => `${i + 1}. \`${k}\` → ${all[k]}`).join('\n')
  );
});

bot({ pattern: 'delreply ?(.*)', desc: 'Delete a keyword auto-reply', type: 'utility' }, async (msg, match) => {
  const keyword = normalize(match || '');
  if (!keyword) return msg.reply(`_Usage:_ \`${PREFIX_TOKEN}delreply <keyword>\``);
  const all = (await kv.get(NS_KW, msg.jid)) || {};
  if (!all[keyword]) return msg.reply(`_No auto-reply for_ \`${keyword}\``);
  delete all[keyword];
  await kv.set(NS_KW, msg.jid, all);
  return msg.reply(`✅ Deleted auto-reply for \`${keyword}\``);
});

bot({ pattern: 'clearreply', desc: 'Delete all keyword auto-replies in this chat', type: 'utility' }, async (msg) => {
  await kv.set(NS_KW, msg.jid, {});
  return msg.reply('✅ All keyword auto-replies in this chat have been deleted.');
});

// ─── Middleware: detect triggers in inbound messages ─────────────────────────
onBeforeMessage(async (msg, sock) => {
  if (!msg.body || msg.fromMe) return;

  // Skip messages that start with the command prefix
  if (/^[.,!]/.test(msg.body.slice(0, 1))) return;

  // (A) Global blanket auto-reply — only fires in DMs (not groups)
  if (!msg.jid.endsWith('@g.us')) {
    const g = await kv.get(NS_GLOBAL, 'global');
    if (g && g.on && g.text) {
      try { await sock.sendMessage(msg.jid, { text: g.text }, { quoted: msg.raw }); }
      catch (_) {}
    }
  }

  // (B) Keyword auto-reply — works in groups + DMs
  const all = await kv.get(NS_KW, msg.jid);
  if (!all || !Object.keys(all).length) return;

  const lowered = msg.body.toLowerCase();
  for (const [keyword, reply] of Object.entries(all)) {
    const re = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (re.test(lowered)) {
      try { await sock.sendMessage(msg.jid, { text: reply }, { quoted: msg.raw }); }
      catch (_) {}
      return;
    }
  }
});
