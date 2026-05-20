const { bot, lang } = require('../lib');

// ─── wrg — Word Rearrange Game ────────────────────────────────────────────────
const WRG_WORDS = ['TITANMD', 'WHATSAPP', 'COMMAND', 'PLUGIN', 'DISCORD'];

function shuffleWord(word) {
  const arr = word.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const shuffled = arr.join('');
  // Re-shuffle if it came out identical to original
  return shuffled === word ? shuffleWord(word) : shuffled;
}

bot({ pattern: 'wrg', desc: lang.plugins.wrg.desc, type: 'game' }, async (msg) => {
  const word     = WRG_WORDS[Math.floor(Math.random() * WRG_WORDS.length)];
  const shuffled = shuffleWord(word);
  return msg.reply(`*🔤 Word Rearrange Game*\nRearrange: *${shuffled}*\n_Reply with the correct word!_`);
});

// ─── dice ─────────────────────────────────────────────────────────────────────
bot({ pattern: 'dice ?(.*)', desc: lang.plugins.dice.desc, type: 'game' }, async (msg, match) => {
  const sides = parseInt(match || '6', 10);
  if (isNaN(sides) || sides < 2) return msg.reply('_Usage: .dice [sides] — minimum 2 sides._');
  const roll = Math.floor(Math.random() * sides) + 1;
  return msg.reply(`🎲 You rolled a *${roll}* (out of ${sides})`);
});

// ─── coinflip ─────────────────────────────────────────────────────────────────
bot({ pattern: 'coinflip', desc: lang.plugins.coinflip.desc, type: 'game' }, async (msg) => {
  const result = Math.random() > 0.5 ? '🪙 Heads' : '🪙 Tails';
  return msg.reply(`*Coin Flip Result:* ${result}`);
});

// ─── slots ────────────────────────────────────────────────────────────────────
const SLOT_SYMBOLS = ['🍒', '🍋', '🍊', '🍇', '⭐', '💎', '7️⃣'];

bot({ pattern: 'slots', desc: lang.plugins.slots.desc, type: 'game' }, async (msg) => {
  const pick = () => SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];
  const s1 = pick(), s2 = pick(), s3 = pick();
  const allSame  = s1 === s2 && s2 === s3;
  const twoSame  = !allSame && (s1 === s2 || s2 === s3 || s1 === s3);
  const outcome  = allSame  ? '🎉 JACKPOT! You win!'
                 : twoSame  ? '😮 Two match! Small win!'
                 : '❌ No match. Try again!';
  return msg.reply(`🎰 *SLOTS*\n| ${s1} | ${s2} | ${s3} |\n${outcome}`);
});

// ─── typerace ─────────────────────────────────────────────────────────────────
const TYPERACE_SENTENCES = [
  'The quick brown fox jumps over the lazy dog.',
  'Titan MD is the fastest WhatsApp bot ever built.',
  'Practice makes perfect, keep typing every day.',
  'Speed and accuracy are the keys to victory.',
];

bot({ pattern: 'typerace', desc: lang.plugins.typerace.desc, type: 'game' }, async (msg) => {
  const sentence = TYPERACE_SENTENCES[Math.floor(Math.random() * TYPERACE_SENTENCES.length)];
  return msg.reply(`*⌨️ Type Race!*\nType this as fast as you can:\n\`\`\`${sentence}\`\`\`\n_Reply with the sentence to win!_`);
});

// ─── riddle ───────────────────────────────────────────────────────────────────
const RIDDLES = [
  { q: 'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?',           a: 'An echo' },
  { q: 'The more you take, the more you leave behind. What am I?',                                                        a: 'Footsteps' },
  { q: 'I have cities, but no houses live there. I have mountains, but no trees grow there. I have water, but no fish swim there. What am I?', a: 'A map' },
  { q: 'I am not alive, but I grow. I do not have lungs, but I need air. I do not have a mouth, but water kills me. What am I?', a: 'Fire' },
  { q: 'What has hands but cannot clap?',                                                                                 a: 'A clock' },
  { q: 'The more you have of it, the less you see. What is it?',                                                          a: 'Darkness' },
];

bot({ pattern: 'riddle', desc: lang.plugins.riddle.desc, type: 'game' }, async (msg) => {
  const riddle = RIDDLES[Math.floor(Math.random() * RIDDLES.length)];
  return msg.reply(`*🧩 Riddle:*\n${riddle.q}\n\n_Reply with your answer!_`);
});

// ─── calc ─────────────────────────────────────────────────────────────────────
bot({ pattern: 'calc ?(.*)', desc: lang.plugins.calc.desc, type: 'game' }, async (msg, match) => {
  const expr = (match || '').trim();
  if (!expr) return msg.reply('_Usage: .calc <expression>\nExample: .calc 2+2_');
  // Allow only digits, operators, spaces, dots, and parentheses — no eval injection
  if (!/^[\d\s+\-*/^%().]+$/.test(expr))
    return msg.reply('_Invalid expression. Only digits and + - * / ^ % ( ) are allowed._');
  try {
    // Replace ^ with ** for exponentiation, then evaluate safely
    const safe   = expr.replace(/\^/g, '**');
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${safe})`)();
    if (!isFinite(result)) return msg.reply('_Result is undefined (division by zero?)._');
    return msg.reply(`🧮 *${expr}* = *${result}*`);
  } catch {
    return msg.reply('_Could not evaluate expression. Check your syntax._');
  }
});
