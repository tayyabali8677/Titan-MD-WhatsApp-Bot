const { bot, lang, onGroupEvent } = require('../lib');
const kv = require('../lib/kv');

// Substitute template variables in a greeting message
function renderTemplate(tpl, ctx) {
  return String(tpl)
    .replace(/&mention|@user|\$user/g, ctx.mention || '@user')
    .replace(/&name|&group|@group|\$group/g, ctx.group || '(group)')
    .replace(/&count|\$count/g, String(ctx.count || ''))
    .replace(/&desc|\$desc/g, ctx.desc || '');
}

// ─── Config commands ─────────────────────────────────────────────────────────
bot({ pattern: 'welcome ?(.*)', desc: lang.plugins.greetings.desc, type: 'group', onlyGroup: true }, async (msg, match) => {
  const arg = (match || '').trim();
  if (arg === 'off') {
    const cur = (await kv.get('welcome', msg.jid)) || {};
    cur.on = false; await kv.set('welcome', msg.jid, cur);
    return msg.reply('✅ Welcome messages: *off*');
  }
  if (arg === 'on') {
    const cur = (await kv.get('welcome', msg.jid)) || { tpl: 'Welcome &mention to &group!' };
    cur.on = true; await kv.set('welcome', msg.jid, cur);
    return msg.reply('✅ Welcome messages: *on*');
  }
  const tpl = arg || 'Welcome &mention to &group!';
  await kv.set('welcome', msg.jid, { tpl, on: true });
  return msg.reply(
    `✅ Welcome template saved & enabled.\n\n*Template:* ${tpl}\n\n` +
    `_Placeholders: &mention &group &count &desc_\n` +
    `_Toggle: .welcome off | .welcome on_`
  );
});

bot({ pattern: 'goodbye ?(.*)', desc: lang.plugins.greetings.desc, type: 'group', onlyGroup: true }, async (msg, match) => {
  const arg = (match || '').trim();
  if (arg === 'off') {
    const cur = (await kv.get('goodbye', msg.jid)) || {};
    cur.on = false; await kv.set('goodbye', msg.jid, cur);
    return msg.reply('✅ Goodbye messages: *off*');
  }
  if (arg === 'on') {
    const cur = (await kv.get('goodbye', msg.jid)) || { tpl: 'Goodbye &mention 👋' };
    cur.on = true; await kv.set('goodbye', msg.jid, cur);
    return msg.reply('✅ Goodbye messages: *on*');
  }
  const tpl = arg || 'Goodbye &mention 👋';
  await kv.set('goodbye', msg.jid, { tpl, on: true });
  return msg.reply(
    `✅ Goodbye template saved & enabled.\n\n*Template:* ${tpl}\n\n` +
    `_Placeholders: &mention &group_`
  );
});

// ─── Real enforcement: fires on add/remove events ────────────────────────────
onGroupEvent(async (event, sock) => {
  if (!event || !event.id || !event.action) return;
  const jid = event.id;
  const participants = event.participants || [];

  let cfg, kind;
  if (event.action === 'add') {
    cfg = await kv.get('welcome', jid);
    kind = 'welcome';
  } else if (event.action === 'remove') {
    cfg = await kv.get('goodbye', jid);
    kind = 'goodbye';
  } else {
    return; // ignore promote/demote here
  }

  if (!cfg || !cfg.on || !cfg.tpl) return;

  // Fetch group metadata for &group and &count
  let groupName = '(group)';
  let count = 0;
  try {
    const meta = await sock.groupMetadata(jid);
    groupName = meta.subject || groupName;
    count = (meta.participants || []).length;
  } catch (_) {}

  for (const userJid of participants) {
    const text = renderTemplate(cfg.tpl, {
      mention: '@' + userJid.split('@')[0],
      group: groupName,
      count,
    });
    try {
      await sock.sendMessage(jid, { text, mentions: [userJid] });
    } catch (e) {
      // best-effort — don't crash the event loop on send failure
    }
  }
});
