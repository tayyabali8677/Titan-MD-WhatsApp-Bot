const { bot, lang } = require('../lib');

// password generator
bot({ pattern: 'password ?(.*)', desc: lang.plugins.password?.desc || 'Generate a secure password', type: 'utility' }, async (msg, match) => {
  const len = parseInt(match || '16');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  const pwd = Array.from({ length: Math.min(len, 64) }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return msg.reply(`🔐 *Generated Password:*\n\`\`\`${pwd}\`\`\`\n_Length: ${len} chars_`);
});

// base64 encode
bot({ pattern: 'encode ?(.*)', desc: lang.plugins.encode?.desc || 'Base64 encode text', type: 'utility' }, async (msg, match) => {
  if (!match) return msg.reply('_Usage: .encode <text>_');
  const encoded = Buffer.from(match).toString('base64');
  return msg.reply(`*🔒 Base64 Encoded:*\n\`\`\`${encoded}\`\`\``);
});

// base64 decode
bot({ pattern: 'decode ?(.*)', desc: lang.plugins.decode?.desc || 'Base64 decode text', type: 'utility' }, async (msg, match) => {
  if (!match) return msg.reply('_Usage: .decode <base64text>_');
  try {
    const decoded = Buffer.from(match, 'base64').toString('utf8');
    return msg.reply(`*🔓 Base64 Decoded:*\n\`\`\`${decoded}\`\`\``);
  } catch {
    return msg.reply('_Invalid base64 string_');
  }
});

// set WhatsApp bio/about
bot({ pattern: 'setbio ?(.*)', desc: lang.plugins.setbio?.desc || 'Set your WhatsApp about/bio', type: 'utility' }, async (msg, match) => {
  if (!match) return msg.reply('_Usage: .setbio <text>_');
  try { await msg.client.updateProfileStatus(match); } catch {}
  return msg.reply(`_Bio updated to: "${match}" ✅_`);
});

// get someone's WhatsApp bio/about
bot({ pattern: 'bio ?(.*)', desc: lang.plugins.bio?.desc || "Get someone's WhatsApp about/bio", type: 'utility' }, async (msg, match) => {
  let jid, num;
  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  const quotedJid = msg.message?.extendedTextMessage?.contextInfo?.participant;
  if (mentioned) {
    jid = mentioned;
    num = jid.split('@')[0];
  } else if (quotedJid) {
    jid = quotedJid;
    num = jid.split('@')[0];
  } else {
    return msg.reply('_Reply to or mention someone to get their bio_');
  }
  try {
    const status = await msg.client.fetchStatus(jid);
    return msg.reply(`*Bio of @${num}:*\n${status.status}`);
  } catch {
    return msg.reply(`[mock] Status: Busy 🔴`);
  }
});

// number fact
bot({ pattern: 'numfact ?(.*)', desc: lang.plugins.numfact?.desc || 'Get a fun number fact', type: 'utility' }, async (msg, match) => {
  const n = parseInt(match) || Math.floor(Math.random() * 100) + 1;
  return msg.reply(`🔢 *Number Fact: ${n}*\n\n_${n} is a ${n % 2 === 0 ? 'even' : 'odd'} number. It appears in ${n} Fibonacci-like sequences. Fun fact: ${n} × ${n} = ${n * n}!_`);
});

// random cat fact
bot({ pattern: 'catfact', desc: lang.plugins.catfact?.desc || 'Get a random cat fact', type: 'utility' }, async (msg) => {
  const facts = [
    'Cats sleep 12-16 hours a day.',
    'A group of cats is called a clowder.',
    'Cats have 32 muscles in each ear.',
    'A cat can jump up to six times its length.',
    'Cats can make over 100 vocal sounds.',
    'The first cat in space was a French cat named Felicette in 1963.',
    'Cats have a unique collarbone that allows them to always land on their feet.',
  ];
  const fact = facts[Math.floor(Math.random() * facts.length)];
  return msg.reply(`🐱 *Cat Fact:*\n_${fact}_`);
});

// random dog fact
bot({ pattern: 'dogfact', desc: lang.plugins.dogfact?.desc || 'Get a random dog fact', type: 'utility' }, async (msg) => {
  const facts = [
    'Dogs have a sense of smell 40x better than humans.',
    'A dog\'s nose print is unique, like a human fingerprint.',
    'Dogs can understand up to 250 words and gestures.',
    'The Basenji is the only dog breed that cannot bark.',
    'Dogs dream just like humans do.',
    'A dog\'s heart beats between 60 and 140 times per minute.',
    'Dalmatians are born completely white and develop their spots over time.',
  ];
  const fact = facts[Math.floor(Math.random() * facts.length)];
  return msg.reply(`🐶 *Dog Fact:*\n_${fact}_`);
});
