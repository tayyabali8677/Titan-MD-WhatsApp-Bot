const { bot, lang } = require('../lib');
const kv = require('../lib/kv');
const config = require('../config');

bot({ pattern: 'fullgpp', desc: lang.plugins.fullgpp?.desc || 'Get full-size group profile picture', type: 'group', onlyGroup: true }, async (msg) => {
  try {
    if (msg.client.profilePictureUrl) {
      const url = await msg.client.profilePictureUrl(msg.jid, 'image');
      if (url) return msg.reply(`*🖼️ Group profile picture:*\n${url}`);
    }
  } catch {}
  return msg.reply('_[mock] full-size group pp_');
});

bot({ pattern: 'setmention ?(.*)', desc: lang.plugins.setmention?.desc || 'Toggle bot reply on @mention', type: 'system' }, async (msg, match) => {
  const arg = (match || '').trim().toLowerCase();
  if (!arg) {
    const cur = (await kv.get('settings', 'mention_reply')) || config.MENTION_REPLY || 'off';
    return msg.reply(`_Mention reply: *${cur}*_`);
  }
  if (!['on', 'off'].includes(arg)) return msg.reply('_Usage: .setmention on/off_');
  await kv.set('settings', 'mention_reply', arg);
  return msg.reply(`_Mention reply: *${arg}* ✅_`);
});

bot({ pattern: 'setgpp', desc: lang.plugins.setgpp?.desc || 'Set group profile picture from replied image', type: 'group', onlyGroup: true }, async (msg) => {
  if (!msg.reply_message) return msg.reply('_Reply to an image._');
  try {
    if (msg.client.updateProfilePicture) {
      await msg.client.updateProfilePicture(msg.jid, msg.reply_message);
      return msg.reply('_🖼️ Group pp updated ✅_');
    }
  } catch {}
  return msg.reply('_[mock] group pp updated_');
});

async function listAdmins(msg) {
  try {
    if (msg.client.groupMetadata) {
      const meta = await msg.client.groupMetadata(msg.jid);
      const admins = (meta.participants || []).filter((p) => p.admin === 'admin' || p.admin === 'superadmin');
      if (admins.length) {
        return msg.reply('*👑 Group admins:*\n' + admins.map((a) => `• ${a.id.split('@')[0]}`).join('\n'));
      }
    }
  } catch {}
  return msg.reply('_[mock] admins: +1234567890_');
}

bot({ pattern: 'admins', desc: lang.plugins.admins?.desc || 'List group admins', type: 'group', onlyGroup: true }, listAdmins);
bot({ pattern: 'listadmin', desc: lang.plugins.listadmin?.desc || 'List group admins (alias)', type: 'group', onlyGroup: true }, listAdmins);
