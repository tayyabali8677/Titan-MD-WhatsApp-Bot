const { bot, lang } = require('../lib');
const kv = require('../lib/kv');

bot({ pattern: 'dream ?(.*)', desc: lang.plugins.dream?.desc || 'AI dream interpretation', type: 'fun' }, async (msg, match) => {
  const text = (match || '').trim();
  if (!text) return msg.reply('_Usage: .dream <describe your dream>_');
  return msg.reply(`💭 _[mock] Dream interpretation for "${text}": signifies upcoming change and personal growth._`);
});

bot({ pattern: 'mock ?(.*)', desc: lang.plugins.mock?.desc || 'Mocking-case text', type: 'fun' }, async (msg, match) => {
  const text = (match || '').trim();
  if (!text) return msg.reply('_Usage: .mock <text>_');
  const mocked = text.split('').map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase())).join('');
  return msg.reply(`🤡 ${mocked}`);
});

bot({ pattern: 'hack ?(.*)', desc: lang.plugins.hack?.desc || 'Fun hack prank', type: 'fun' }, async (msg, match) => {
  const target = (match || 'target').trim();
  return msg.reply(`_⚙️ Connecting to ${target}..._\n_🔓 Bypassing firewall..._\n_📡 Extracting data..._\n_💀 Hack complete for ${target}!_`);
});

bot({ pattern: 'shadi ?(.*)', desc: lang.plugins.shadi?.desc || 'Random marriage', type: 'fun' }, async (msg, match) => {
  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  const u1 = mentioned[0] ? '@' + mentioned[0].split('@')[0] : '@' + (msg.sender || '').split('@')[0];
  const u2 = mentioned[1] ? '@' + mentioned[1].split('@')[0] : (match || 'mystery person').trim();
  return msg.reply(`💍 ${u1} ❤️ ${u2}\n_[mock] Mubarak! 🎉_`);
});

bot({ pattern: 'slap ?(.*)', desc: lang.plugins.slap?.desc || 'Slap a user', type: 'fun' }, async (msg, match) => {
  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  const target = mentioned ? '@' + mentioned.split('@')[0] : (match || 'someone').trim();
  return msg.reply(`_[mock] 🖐️ slapped ${target}_`);
});

bot({ pattern: 'tenor ?(.*)', desc: lang.plugins.tenor?.desc || 'Random tenor gif', type: 'fun' }, async (msg, match) => {
  const q = (match || '').trim();
  if (!q) return msg.reply('_Usage: .tenor <query>_');
  return msg.reply(`_[mock] 🎬 tenor gif for "${q}"_`);
});

const wyrQuestions = [
  'be invisible or be able to fly?',
  'live without music or without movies?',
  'have unlimited money or unlimited time?',
  'know the date of your death or the cause?',
  'always be 10 minutes late or 20 minutes early?',
  'be famous but poor or rich but unknown?',
  'travel to the past or to the future?',
  'speak every language or play every instrument?',
  'never use the internet again or never watch TV again?',
  'live in space or under the sea?',
];
bot({ pattern: 'wyr', desc: lang.plugins.wyr?.desc || 'Would you rather question', type: 'fun' }, async (msg) => {
  const q = wyrQuestions[Math.floor(Math.random() * wyrQuestions.length)];
  return msg.reply(`🤔 *Would you rather...*\n_${q}_`);
});

bot({ pattern: 'note ?(.*)', desc: lang.plugins.note?.desc || 'Save and list personal notes', type: 'utility' }, async (msg, match) => {
  const arg = (match || '').trim();
  const owner = msg.sender || 'unknown';
  const notes = (await kv.get('notes', owner, [])) || [];
  if (!arg) {
    if (!notes.length) return msg.reply('_No notes saved. Usage: .note <text>_');
    return msg.reply('📝 *Your Notes:*\n' + notes.map((n, i) => `${i + 1}. ${n}`).join('\n'));
  }
  const delMatch = arg.match(/^del\s+(\d+)$/i);
  if (delMatch) {
    const idx = parseInt(delMatch[1]) - 1;
    if (idx < 0 || idx >= notes.length) return msg.reply('_Invalid note number_');
    const removed = notes.splice(idx, 1)[0];
    await kv.set('notes', owner, notes);
    return msg.reply(`_Deleted note: "${removed}" ✅_`);
  }
  notes.push(arg);
  await kv.set('notes', owner, notes);
  return msg.reply(`_Note #${notes.length} saved ✅_`);
});
