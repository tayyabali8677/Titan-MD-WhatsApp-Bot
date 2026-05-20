const { bot, lang } = require('../lib');

// ─── Simple overlay loop ──────────────────────────────────────────────────────
const overlays = ['heart', 'lgbt', 'lied', 'lolice', 'comrade', 'gay', 'glass', 'jail', 'passed', 'triggered'];

for (const o of overlays) {
  bot({ pattern: o, desc: lang.plugins[o].desc, type: 'editor' }, async (msg) => {
    if (!msg.reply_message) return msg.reply('_Reply to an image or mention a user._');
    return msg.reply(`_[mock] ${o} overlay applied ✅_`);
  });
}

// ─── simpcard ─────────────────────────────────────────────────────────────────
bot({ pattern: 'simpcard', desc: lang.plugins.simpcard.desc, type: 'editor' }, async (msg) => {
  return msg.reply(`_[mock] Simp card generated for ${msg.pushName} 😂_`);
});

// ─── tonikawa ─────────────────────────────────────────────────────────────────
bot({ pattern: 'tonikawa', desc: lang.plugins.tonikawa.desc, type: 'editor' }, async (msg) => {
  if (!msg.reply_message) return msg.reply('_Reply to an image or mention a user._');
  return msg.reply('_[mock] tonikawa overlay applied ✅_');
});

// ─── oogway ───────────────────────────────────────────────────────────────────
bot({ pattern: 'oogway ?(.*)', desc: lang.plugins.oogway.desc, type: 'editor' }, async (msg, match) => {
  const quote = (match || '').trim();
  if (!quote) return msg.reply('_Please provide a quote text.\nUsage: .oogway <text>_');
  return msg.reply(`*🐢 Oogway says:*\n_"${quote}"_`);
});

// ─── oogway2 ──────────────────────────────────────────────────────────────────
bot({ pattern: 'oogway2 ?(.*)', desc: lang.plugins.oogway2.desc, type: 'editor' }, async (msg, match) => {
  const quote = (match || '').trim();
  if (!quote) return msg.reply('_Please provide a quote text.\nUsage: .oogway2 <text>_');
  return msg.reply(`*🐢 Master Oogway:*\n> _"${quote}"_`);
});

// ─── tweet ────────────────────────────────────────────────────────────────────
bot({ pattern: 'tweet ?(.*)', desc: lang.plugins.tweet.desc, type: 'editor' }, async (msg, match) => {
  const input = (match || '').trim();
  if (!input) return msg.reply('_Usage: .tweet <displayname>|<username>|<comment>_');
  const parts = input.split('|');
  const displayName = (parts[0] || '').trim();
  const username    = (parts[1] || '').trim();
  const comment     = (parts[2] || '').trim();
  if (!displayName || !username || !comment)
    return msg.reply('_Usage: .tweet <displayname>|<username>|<comment>_');
  return msg.reply(
    `_[mock] Tweet card generated ✅\nDisplay: ${displayName}\nUsername: @${username}\nComment: ${comment}_`
  );
});

// ─── ytcomment ────────────────────────────────────────────────────────────────
bot({ pattern: 'ytcomment ?(.*)', desc: lang.plugins.ytcomment.desc, type: 'editor' }, async (msg, match) => {
  const input = (match || '').trim();
  if (!input) return msg.reply('_Usage: .ytcomment <username>|<comment>_');
  const parts = input.split('|');
  const username = (parts[0] || '').trim();
  const comment  = (parts[1] || '').trim();
  if (!username || !comment) return msg.reply('_Usage: .ytcomment <username>|<comment>_');
  return msg.reply(`_[mock] YouTube comment card ✅\nUsername: ${username}\nComment: ${comment}_`);
});

// ─── namecard ─────────────────────────────────────────────────────────────────
bot({ pattern: 'namecard ?(.*)', desc: lang.plugins.namecard.desc, type: 'editor' }, async (msg, match) => {
  const input = (match || '').trim();
  if (!input) return msg.reply('_Usage: .namecard <name>|<birthday>|<desc>_');
  const parts = input.split('|');
  const name     = (parts[0] || '').trim();
  const birthday = (parts[1] || '').trim();
  const desc     = (parts[2] || '').trim();
  if (!name || !birthday || !desc) return msg.reply('_Usage: .namecard <name>|<birthday>|<desc>_');
  return msg.reply(`_[mock] Name card generated for ${name} ✅\nBirthday: ${birthday}\nAbout: ${desc}_`);
});
