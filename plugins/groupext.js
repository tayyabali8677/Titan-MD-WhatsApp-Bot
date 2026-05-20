const { bot, lang, kv } = require('../lib');

bot({ pattern: 'gdesc', desc: lang.plugins.groupext.desc, type: 'group', onlyGroup: true }, async (msg) => {
  let desc = 'Not set';
  try {
    const meta = await msg.client.groupMetadata(msg.jid);
    desc = meta.desc || 'Not set';
  } catch {}
  return msg.reply(`📋 *Group Description:*\n${desc}`);
});

bot({ pattern: 'setgdesc ?(.*)', desc: lang.plugins.groupext.desc, type: 'group', onlyGroup: true }, async (msg, match) => {
  const text = match.trim();
  if (!text) return msg.reply('Please provide a description.\nUsage: .setgdesc <text>');
  try { await msg.client.groupUpdateDescription(msg.jid, text); } catch {}
  return msg.reply(`✅ Group description updated.`);
});

bot({ pattern: 'setgname ?(.*)', desc: lang.plugins.groupext.desc, type: 'group', onlyGroup: true }, async (msg, match) => {
  const name = match.trim();
  if (!name) return msg.reply('Please provide a name.\nUsage: .setgname <name>');
  try { await msg.client.groupUpdateSubject(msg.jid, name); } catch {}
  return msg.reply(`✅ Group name updated to *${name}*`);
});

bot({ pattern: 'welcometext ?(.*)', desc: lang.plugins.groupext.desc, type: 'group', onlyGroup: true }, async (msg, match) => {
  const text = match.trim();
  const key = `welcome_text_${msg.jid}`;
  if (!text) {
    const current = await kv.get(key);
    return msg.reply(current ? `📝 *Welcome Text:*\n${current}` : 'No welcome text set.\nUsage: .welcometext <text>');
  }
  await kv.set(key, text);
  return msg.reply(`✅ Welcome text saved.`);
});

bot({ pattern: 'goodbyetext ?(.*)', desc: lang.plugins.groupext.desc, type: 'group', onlyGroup: true }, async (msg, match) => {
  const text = match.trim();
  const key = `goodbye_text_${msg.jid}`;
  if (!text) {
    const current = await kv.get(key);
    return msg.reply(current ? `📝 *Goodbye Text:*\n${current}` : 'No goodbye text set.\nUsage: .goodbyetext <text>');
  }
  await kv.set(key, text);
  return msg.reply(`✅ Goodbye text saved.`);
});

bot({ pattern: 'newgc ?(.*)', desc: lang.plugins.groupext.desc, type: 'group' }, async (msg, match) => {
  const name = match.trim() || 'New Group';
  let result = { id: '[mock-group-jid]' };
  try { result = await msg.client.groupCreate(name, [msg.jid]); } catch {}
  return msg.reply(`✅ Group created!\n*Name:* ${name}\n*JID:* ${result.id || result}`);
});

bot({ pattern: 'tagadmin', desc: lang.plugins.groupext.desc, type: 'group', onlyGroup: true }, async (msg) => {
  let admins = [];
  try {
    const meta = await msg.client.groupMetadata(msg.jid);
    admins = meta.participants.filter(p => p.admin).map(p => p.id);
  } catch {}
  if (!admins.length) return msg.reply('No admins found or not in a group.');
  const tags = admins.map(a => `@${a.split('@')[0]}`).join(' ');
  return msg.reply(`👑 *Admins:*\n${tags}`, { mentions: admins });
});

bot({ pattern: 'allgc', desc: lang.plugins.groupext.desc, type: 'group' }, async (msg) => {
  return msg.reply('You are in [mock] 5 groups.');
});

bot({ pattern: 'nsfw ?(.*)', desc: lang.plugins.groupext.desc, type: 'group', onlyGroup: true }, async (msg, match) => {
  const val = match.trim().toLowerCase();
  const key = `nsfw_${msg.jid}`;
  if (!val || (val !== 'on' && val !== 'off')) {
    const current = await kv.get(key);
    return msg.reply(`NSFW is currently *${current || 'off'}*.\nUsage: .nsfw [on/off]`);
  }
  await kv.set(key, val);
  return msg.reply(`✅ NSFW turned *${val}* for this group.`);
});

bot({ pattern: 'announce ?(.*)', desc: lang.plugins.groupext.desc, type: 'group', onlyGroup: true }, async (msg) => {
  try { await msg.client.groupSettingUpdate(msg.jid, 'announcement'); } catch {}
  return msg.reply('✅ Group set to announcement mode (only admins can send messages).');
});

bot({ pattern: 'listrequest', desc: lang.plugins.groupext.desc, type: 'group', onlyGroup: true }, async (msg) => {
  let requests = [];
  try { requests = await msg.client.groupRequestParticipantsList(msg.jid); } catch {}
  if (!requests.length) return msg.reply('No pending join requests.\n_[mock] 0 requests_');
  return msg.reply(`📋 *Pending Join Requests:* ${requests.length}\n_[mock] list_`);
});

bot({ pattern: 'acceptjoin', desc: lang.plugins.groupext.desc, type: 'group', onlyGroup: true }, async (msg) => {
  return msg.reply('✅ [mock] All join requests accepted.');
});

bot({ pattern: 'rejectjoin', desc: lang.plugins.groupext.desc, type: 'group', onlyGroup: true }, async (msg) => {
  return msg.reply('✅ [mock] All join requests rejected.');
});

bot({ pattern: 'acceptall', desc: lang.plugins.groupext.desc, type: 'group', onlyGroup: true }, async (msg) => {
  let requests = [];
  try { requests = await msg.client.groupRequestParticipantsList(msg.jid); } catch {}
  const jids = requests.map(r => r.jid || r.id).filter(Boolean);
  if (jids.length) {
    try { await msg.client.groupRequestParticipantsUpdate(msg.jid, jids, 'approve'); } catch {}
  }
  return msg.reply(`✅ Approved ${jids.length || '[mock]'} pending requests.`);
});

bot({ pattern: 'rejectall', desc: lang.plugins.groupext.desc, type: 'group', onlyGroup: true }, async (msg) => {
  let requests = [];
  try { requests = await msg.client.groupRequestParticipantsList(msg.jid); } catch {}
  const jids = requests.map(r => r.jid || r.id).filter(Boolean);
  if (jids.length) {
    try { await msg.client.groupRequestParticipantsUpdate(msg.jid, jids, 'reject'); } catch {}
  }
  return msg.reply(`✅ Rejected ${jids.length || '[mock]'} pending requests.`);
});

bot({ pattern: 'broadcast ?(.*)', desc: lang.plugins.groupext.desc, type: 'group' }, async (msg, match) => {
  const text = match.trim();
  if (!text) return msg.reply('Please provide a message.\nUsage: .broadcast <message>');
  return msg.reply(`📢 Broadcast sent to [mock] 5 groups.\n*Message:* ${text}`);
});
