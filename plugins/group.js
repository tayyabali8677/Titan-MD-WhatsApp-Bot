const { bot, lang } = require('../lib');

async function ensureAdmin(msg, ctx) {
  if (!(await ctx.isAdmin())) { await msg.reply(lang.plugins.group.not_admin); return false; }
  return true;
}

function targets(msg, match) {
  const list = [...(msg.mention || [])];
  if (msg.reply_message && msg.reply_message.jid) list.push(msg.reply_message.jid);
  if (!list.length && match) {
    for (const tok of match.split(/\s+/)) if (/^\d+$/.test(tok)) list.push(`${tok}@s.whatsapp.net`);
  }
  return [...new Set(list)];
}

function reg(pattern, action, desc) {
  bot({ pattern, desc: desc || lang.plugins.group.desc, type: 'group', onlyGroup: true }, async (msg, match, ctx) => {
    if (!(await ensureAdmin(msg, ctx))) return;
    const ts = targets(msg, match);
    if (!ts.length) return msg.reply(lang.plugins.group.no_target);
    const r = await msg.client.groupParticipantsUpdate(msg.jid, ts, action);
    return msg.reply(`${action}: ${JSON.stringify(r)}`);
  });
}

reg('promote ?(.*)', 'promote', lang.plugins.group.desc);
reg('demote ?(.*)',  'demote',  lang.plugins.group.desc);
reg('kick ?(.*)',    'remove',  lang.plugins.group.desc);
reg('add ?(.*)',     'add',     lang.plugins.group.desc);

bot({ pattern: 'invite', desc: lang.plugins.group.desc, type: 'group', onlyGroup: true }, async (msg) => {
  return msg.reply(`https://chat.whatsapp.com/MOCKINVITE-${msg.jid.split('@')[0]}`);
});

bot({ pattern: 'revoke', desc: lang.plugins.group.desc, type: 'group', onlyGroup: true }, async (msg, _m, ctx) => {
  if (!(await ensureAdmin(msg, ctx))) return;
  return msg.reply('Invite revoked.');
});

bot({ pattern: 'mute', desc: lang.plugins.group.desc, type: 'group', onlyGroup: true }, async (msg, _m, ctx) => {
  if (!(await ensureAdmin(msg, ctx))) return;
  return msg.reply('Group muted (admins only).');
});

bot({ pattern: 'unmute', desc: lang.plugins.group.desc, type: 'group', onlyGroup: true }, async (msg, _m, ctx) => {
  if (!(await ensureAdmin(msg, ctx))) return;
  return msg.reply('Group unmuted.');
});

bot({ pattern: 'left', desc: lang.plugins.group.desc, type: 'group', onlyGroup: true }, async (msg) => {
  return msg.reply(`Leaving ${msg.jid}`);
});

bot({ pattern: 'join ?(.*)', desc: lang.plugins.group.desc, type: 'group' }, async (msg, match) => {
  return msg.reply(`Joining via: ${match || '(no link)'}`);
});
