const { bot, lang } = require('../lib');
const kv = require('../lib/kv');

function parseAmt(s) {
  const n = parseInt(String(s || '').trim(), 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

bot({ pattern: 'bank', desc: lang.plugins.bank?.desc || 'Show bank balance', type: 'economy' }, async (msg) => {
  const wallet = (await kv.get('eco_' + msg.sender)) || 0;
  const bank = (await kv.get('bank_' + msg.sender)) || 0;
  return msg.reply(`🏦 *Bank:* ${bank} coins\n💰 *Wallet:* ${wallet} coins\n🧧 *Total:* *${wallet + bank} coins*`);
});

bot({ pattern: 'wallet', desc: lang.plugins.wallet?.desc || 'Show wallet balance', type: 'economy' }, async (msg) => {
  const bal = (await kv.get('eco_' + msg.sender)) || 0;
  return msg.reply(`💰 *Wallet:* ${bal} coins`);
});

bot({ pattern: 'deposit ?(.*)', desc: lang.plugins.deposit?.desc || 'Deposit coins to bank', type: 'economy' }, async (msg, match) => {
  const amt = parseAmt(match);
  if (!amt) return msg.reply('_Usage: .deposit <amount>_');
  const wallet = (await kv.get('eco_' + msg.sender)) || 0;
  const bank = (await kv.get('bank_' + msg.sender)) || 0;
  const cap = (await kv.get('cap_' + msg.sender)) || 1000;
  if (amt > wallet) return msg.reply(`_You only have *${wallet} coins* in wallet._`);
  if (bank + amt > cap) return msg.reply(`_Bank capacity exceeded. Cap: *${cap}*, current bank: *${bank}*._`);
  await kv.set('eco_' + msg.sender, wallet - amt);
  await kv.set('bank_' + msg.sender, bank + amt);
  return msg.reply(`🏦 Deposited *${amt} coins*.\n💰 Wallet: *${wallet - amt}* | Bank: *${bank + amt}*`);
});

bot({ pattern: 'withdraw ?(.*)', desc: lang.plugins.withdraw?.desc || 'Withdraw coins from bank', type: 'economy' }, async (msg, match) => {
  const amt = parseAmt(match);
  if (!amt) return msg.reply('_Usage: .withdraw <amount>_');
  const wallet = (await kv.get('eco_' + msg.sender)) || 0;
  const bank = (await kv.get('bank_' + msg.sender)) || 0;
  if (amt > bank) return msg.reply(`_Bank only has *${bank} coins*._`);
  await kv.set('eco_' + msg.sender, wallet + amt);
  await kv.set('bank_' + msg.sender, bank - amt);
  return msg.reply(`💸 Withdrew *${amt} coins*.\n💰 Wallet: *${wallet + amt}* | Bank: *${bank - amt}*`);
});

async function transferFn(msg, match) {
  const amt = parseAmt(match);
  if (!amt) return msg.reply('_Usage: .transfer <amount> (mention or reply to user)_');
  const target = (msg.mention && msg.mention[0]) || (msg.reply_message && msg.reply_message.sender);
  if (!target) return msg.reply('_Mention or reply to a user to transfer._');
  const senderBal = (await kv.get('eco_' + msg.sender)) || 0;
  if (amt > senderBal) return msg.reply(`_You only have *${senderBal} coins*._`);
  const targetBal = (await kv.get('eco_' + target)) || 0;
  await kv.set('eco_' + msg.sender, senderBal - amt);
  await kv.set('eco_' + target, targetBal + amt);
  return msg.reply(`🧧 Transferred *${amt} coins* to @${target.split('@')[0]}.\n💰 Your wallet: *${senderBal - amt}*`);
}

bot({ pattern: 'transfer ?(.*)', desc: lang.plugins.transfer?.desc || 'Transfer coins to another user', type: 'economy' }, transferFn);
bot({ pattern: 'give ?(.*)', desc: lang.plugins.give?.desc || 'Give coins to another user', type: 'economy' }, transferFn);

bot({ pattern: 'gamble ?(.*)', desc: lang.plugins.gamble?.desc || '50/50 gamble your coins', type: 'economy' }, async (msg, match) => {
  const amt = parseAmt(match);
  if (!amt) return msg.reply('_Usage: .gamble <amount>_');
  const bal = (await kv.get('eco_' + msg.sender)) || 0;
  if (amt > bal) return msg.reply(`_You only have *${bal} coins*._`);
  const win = Math.random() < 0.5;
  const newBal = win ? bal + amt : bal - amt;
  await kv.set('eco_' + msg.sender, newBal);
  return msg.reply(win
    ? `🎰 *YOU WON!* +${amt} coins 🎉\n💰 Balance: *${newBal}*`
    : `💀 *YOU LOST!* -${amt} coins\n💰 Balance: *${newBal}*`);
});

bot({ pattern: 'slot2', desc: lang.plugins.slot2?.desc || 'Jackpot slot machine', type: 'economy' }, async (msg) => {
  const reels = ['🍒','🍋','🍇','🍉','⭐','💎','7️⃣'];
  const r = [reels[Math.floor(Math.random()*reels.length)], reels[Math.floor(Math.random()*reels.length)], reels[Math.floor(Math.random()*reels.length)]];
  const bal = (await kv.get('eco_' + msg.sender)) || 0;
  let payout = 0;
  if (r[0] === r[1] && r[1] === r[2]) payout = r[0] === '7️⃣' ? 5000 : 1500;
  else if (r[0] === r[1] || r[1] === r[2]) payout = 200;
  const newBal = bal + payout - 50;
  await kv.set('eco_' + msg.sender, newBal);
  return msg.reply(`🎰 [ ${r.join(' | ')} ]\n${payout > 0 ? `🧧 *JACKPOT!* +${payout} coins` : '_No match. -50 coins_'}\n💰 Balance: *${newBal}*`);
});

bot({ pattern: 'lb', desc: lang.plugins.lb?.desc || 'Economy leaderboard', type: 'economy' }, async (msg) => {
  const rows = await kv.all('default');
  const eco = (rows || []).filter(r => r.k && r.k.startsWith('eco_')).map(r => ({ jid: r.k.slice(4), bal: Number(r.v) || 0 }));
  eco.sort((a, b) => b.bal - a.bal);
  const top = eco.slice(0, 10);
  if (!top.length) return msg.reply('_No leaderboard data yet._');
  const lines = top.map((e, i) => `*${i + 1}.* @${e.jid.split('@')[0]} — *${e.bal}* 💰`);
  return msg.reply(`🏆 *Top 10 Richest* 🧧\n\n${lines.join('\n')}`);
});
