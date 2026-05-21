const { bot, lang, onBeforeMessage } = require('../lib');
const kv = require('../lib/kv');
const config = require('../config');

const NS = 'antilink';

// Broad-but-safe URL regex: catches http(s)://, www., and bare-domain references.
// Whatsapp invite links and t.me / discord.gg are explicitly included.
const URL_RE = /\b((?:https?:\/\/|www\.)\S+|\b\S+\.(?:com|net|org|io|me|co|gg|xyz|app|site|link|tk|cc|to|ly|click|us)\b\S*|chat\.whatsapp\.com\/[A-Za-z0-9]+|t\.me\/\S+|discord\.gg\/\S+|wa\.me\/\S+)/i;

function getState(jid) {
  return kv.get(NS, jid).then((s) => s || { on: false, action: 'warn', allow: [] });
}

// ─── Slash command for configuration (unchanged from before) ─────────────────
bot({ pattern: 'antilink ?(.*)', desc: lang.plugins.antilink.desc, type: 'group', onlyGroup: true }, async (msg, match) => {
  const parts = (match || '').trim().split(/\s+/);
  const sub = (parts.shift() || '').toLowerCase();
  const rest = parts;
  const state = await getState(msg.jid);
  switch (sub) {
    case 'on':  state.on = true;  await kv.set(NS, msg.jid, state); return msg.reply(lang.plugins.antilink.on);
    case 'off': state.on = false; await kv.set(NS, msg.jid, state); return msg.reply(lang.plugins.antilink.off);
    case 'kick': case 'warn': case 'delete':
      state.action = sub; await kv.set(NS, msg.jid, state);
      return msg.reply(`✅ Anti-link action set to: *${sub}*`);
    case 'allow':
      state.allow = [...new Set([...state.allow, ...rest])];
      await kv.set(NS, msg.jid, state);
      return msg.reply(`✅ Allowed domains: ${state.allow.join(', ') || '(none)'}`);
    case 'disallow':
      state.allow = state.allow.filter((x) => !rest.includes(x));
      await kv.set(NS, msg.jid, state);
      return msg.reply('✅ Updated allowlist');
    case 'clear':
      state.allow = []; await kv.set(NS, msg.jid, state);
      return msg.reply('✅ Allowlist cleared');
    case 'list':
    case '':
      return msg.reply(
        `*Anti-link config for this group:*\n` +
        `• Status: ${state.on ? '🟢 ON' : '🔴 OFF'}\n` +
        `• Action on link: *${state.action}*\n` +
        `• Allowed domains: ${state.allow.length ? state.allow.join(', ') : '(none)'}\n\n` +
        `_Usage:_\n` +
        `\`.antilink on|off\`\n` +
        `\`.antilink warn|delete|kick\`\n` +
        `\`.antilink allow youtube.com github.com\`\n` +
        `\`.antilink disallow youtube.com\`\n` +
        `\`.antilink clear\``
      );
    default:
      return msg.reply(lang.plugins.antilink.usage);
  }
});

// ─── The actual enforcement middleware ───────────────────────────────────────
// Runs on every message. Cheap exit if (group only, anti-link off, admin sender).
onBeforeMessage(async (msg, sock) => {
  if (!msg.jid || !msg.jid.endsWith('@g.us')) return; // groups only
  if (!msg.body) return;

  // URL detection — cheap regex
  const urlMatch = URL_RE.exec(msg.body);
  if (!urlMatch) return;

  // Load group config
  const state = await kv.get(NS, msg.jid);
  if (!state || !state.on) return;

  // Allowed domain bypass
  const matchedLink = urlMatch[0].toLowerCase();
  if (state.allow && state.allow.length) {
    for (const d of state.allow) if (matchedLink.includes(d.toLowerCase())) return;
  }

  // Don't act on the bot itself or fromMe
  if (msg.fromMe) return;

  // Admin bypass — admins can post links freely
  try {
    const meta = await sock.groupMetadata(msg.jid);
    const sender = msg.sender || msg.key?.participant;
    const senderInfo = meta.participants?.find((p) => p.id === sender);
    if (senderInfo && (senderInfo.admin === 'admin' || senderInfo.admin === 'superadmin')) return;

    // Ensure the bot itself is admin (otherwise we can't delete/kick)
    const botJid = sock.user?.id?.split(':')[0] + '@s.whatsapp.net';
    const botInfo = meta.participants?.find((p) => p.id === botJid || (p.id || '').startsWith(sock.user?.id?.split(':')[0]));
    const botIsAdmin = botInfo && (botInfo.admin === 'admin' || botInfo.admin === 'superadmin');

    // Always try to delete the offending message (only works if bot is admin)
    if (botIsAdmin && msg.key) {
      try { await sock.sendMessage(msg.jid, { delete: msg.key }); } catch (_) {}
    }

    // Per-action response
    const senderTag = '@' + sender.split('@')[0];
    if (state.action === 'delete') {
      // delete only — already done above, no reply
    } else if (state.action === 'warn') {
      await sock.sendMessage(msg.jid, {
        text: `🚫 ${senderTag}, links are not allowed here. *Strike issued.*`,
        mentions: [sender],
      });
    } else if (state.action === 'kick' && botIsAdmin) {
      await sock.sendMessage(msg.jid, {
        text: `🚫 ${senderTag} kicked for posting a link.`,
        mentions: [sender],
      });
      try { await sock.groupParticipantsUpdate(msg.jid, [sender], 'remove'); } catch (_) {}
    }
  } catch (e) {
    // Best-effort enforcement; don't crash if groupMetadata fails
  }

  return false; // short-circuit — don't dispatch the link as if it were a command
});
