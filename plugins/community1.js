const { bot, lang } = require('../lib');

// readmore — pushes text below a "Read more" fold via invisible chars
bot({ pattern: 'readmore ?(.*)', desc: lang.plugins.readmore?.desc || 'Hide long text behind a Read more fold', type: 'utility' }, async (msg, match) => {
  const text = (match || '').trim();
  if (!text) return msg.reply('_Usage: .readmore <text>_');
  const cut = Math.min(30, text.length);
  const folded = text.slice(0, cut) + '​'.repeat(2000) + text.slice(cut);
  return msg.reply(folded);
});

// age — calculate age from DDMMYYYY or DD/MM/YYYY
bot({ pattern: 'age ?(.*)', desc: lang.plugins.age?.desc || 'Calculate age from birthday', type: 'utility' }, async (msg, match) => {
  const raw = (match || '').trim().replace(/[\/\-\.]/g, '');
  if (!/^\d{8}$/.test(raw)) return msg.reply('_Usage: .age DDMMYYYY (e.g. .age 15081995)_');
  const d = parseInt(raw.slice(0, 2));
  const m = parseInt(raw.slice(2, 4));
  const y = parseInt(raw.slice(4, 8));
  const birth = new Date(y, m - 1, d);
  if (isNaN(birth.getTime())) return msg.reply('_Invalid date_');
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();
  if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
  if (months < 0) { years--; months += 12; }
  return msg.reply(`🎂 *Age:* ${years} years, ${months} months, ${days} days`);
});

// checkme — random user info
bot({ pattern: 'checkme', desc: lang.plugins.checkme?.desc || 'Random user info block', type: 'fun' }, async (msg) => {
  const names = ['Alex', 'Sam', 'Jordan', 'Riya', 'Hassan', 'Mei', 'Kofi'];
  const locs = ['Lahore', 'Tokyo', 'Berlin', 'Lagos', 'Sao Paulo'];
  const colors = ['Cyan', 'Magenta', 'Olive', 'Coral', 'Indigo'];
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  return msg.reply(`👤 *About You (mock):*\n• Name: ${pick(names)}\n• Age: ${18 + Math.floor(Math.random() * 40)}\n• Location: ${pick(locs)}\n• Favorite color: ${pick(colors)}`);
});

// pincode — Indian pincode lookup mock
bot({ pattern: 'pincode ?(.*)', desc: lang.plugins.pincode?.desc || 'Indian pincode lookup', type: 'utility' }, async (msg, match) => {
  const code = (match || '').trim();
  if (!code) return msg.reply('_Usage: .pincode <code>_');
  return msg.reply(`📮 Pincode ${code}\n_[mock] City: Mumbai, State: Maharashtra_`);
});

// iban — IBAN generator mock
bot({ pattern: 'iban ?(.*)', desc: lang.plugins.iban?.desc || 'IBAN generator', type: 'utility' }, async (msg, match) => {
  const country = (match || 'XX').trim().toUpperCase();
  return msg.reply(`🏦 _[mock] IBAN: ${country}89370400440532013000_`);
});

// countrycode — flag lookup
const flags = {
  US: '🇺🇸', GB: '🇬🇧', IN: '🇮🇳', PK: '🇵🇰', BD: '🇧🇩', LK: '🇱🇰', NP: '🇳🇵',
  CN: '🇨🇳', JP: '🇯🇵', KR: '🇰🇷', RU: '🇷🇺', DE: '🇩🇪', FR: '🇫🇷', IT: '🇮🇹',
  ES: '🇪🇸', BR: '🇧🇷', CA: '🇨🇦', AU: '🇦🇺', NG: '🇳🇬', SA: '🇸🇦',
};
bot({ pattern: 'countrycode ?(.*)', desc: lang.plugins.countrycode?.desc || 'Country flag lookup', type: 'utility' }, async (msg, match) => {
  const code = (match || '').trim().toUpperCase();
  if (!code) return msg.reply('_Usage: .countrycode <2-letter ISO code>_');
  const flag = flags[code];
  if (!flag) return msg.reply(`_Country "${code}" unknown_`);
  return msg.reply(`${flag} *${code}*`);
});

// time — world time
bot({ pattern: 'time ?(.*)', desc: lang.plugins.time?.desc || 'World time lookup', type: 'utility' }, async (msg, match) => {
  const arg = (match || '').trim();
  if (!arg) {
    return msg.reply(`🕒 *UTC:* ${new Date().toUTCString()}`);
  }
  const zones = ['Asia/Karachi', 'Asia/Tokyo', 'Europe/London', 'America/New_York', 'Australia/Sydney'];
  const lines = [`🌍 *Time in zones matching "${arg}":*`];
  for (const tz of zones) {
    if (!tz.toLowerCase().includes(arg.toLowerCase())) continue;
    try {
      lines.push(`• ${tz}: ${new Date().toLocaleString('en-US', { timeZone: tz })}`);
    } catch {}
  }
  if (lines.length === 1) {
    try {
      lines.push(`• ${arg}: ${new Date().toLocaleString('en-US', { timeZone: arg })}`);
    } catch {
      lines.push(`_No timezone matched "${arg}"_`);
    }
  }
  return msg.reply(lines.join('\n'));
});

// quran — verse mock
bot({ pattern: 'quran ?(.*)', desc: lang.plugins.quran?.desc || 'Quran verse lookup', type: 'utility' }, async (msg) => {
  return msg.reply(`📖 _[mock] Surah Al-Fatiha 1:1 — In the name of Allah, the Most Gracious, the Most Merciful._`);
});
