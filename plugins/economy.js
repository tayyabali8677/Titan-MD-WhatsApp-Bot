const { bot, lang, kv } = require('../lib');

const DAILY_AMOUNT = 500;
const DAILY_COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours in ms

bot({ pattern: 'money', desc: lang.plugins.economy.desc, type: 'economy' }, async (msg) => {
  const bal = await kv.get('eco_' + msg.jid) || 0;
  return msg.reply('💰 Balance: ' + bal + ' coins');
});

bot({ pattern: 'daily', desc: lang.plugins.daily.desc, type: 'economy' }, async (msg) => {
  const key = 'daily_' + msg.sender;
  const balKey = 'eco_' + msg.sender;
  const lastClaim = await kv.get(key) || 0;
  const now = Date.now();
  const diff = now - lastClaim;

  if (diff < DAILY_COOLDOWN) {
    const remaining = DAILY_COOLDOWN - diff;
    const hrs = Math.floor(remaining / 3600000);
    const mins = Math.floor((remaining % 3600000) / 60000);
    return msg.reply(`🧧 Already claimed daily!\nCome back in *${hrs}h ${mins}m* 🫡`);
  }

  const bal = (await kv.get(balKey)) || 0;
  await kv.set(balKey, bal + DAILY_AMOUNT);
  await kv.set(key, now);
  return msg.reply(`🎉 You claimed *${DAILY_AMOUNT} coins* for today!\n💰 New balance: *${bal + DAILY_AMOUNT} coins*`);
});

bot({ pattern: 'resetwallet ?(.*)', desc: lang.plugins.resetwallet.desc, type: 'economy' }, async (msg, match) => {
  if (!msg.isSudo) return msg.reply(lang.extra.sudo_only);
  const target = (msg.mention && msg.mention[0]) || (msg.reply_message && msg.reply_message.sender);
  if (!target) return msg.reply('_Mention or reply to a user to reset their wallet._');
  const balKey = 'eco_' + target;
  await kv.set(balKey, 0);
  return msg.reply(`⛩️ Wallet reset for @${target.split('@')[0]} — *0 coins* left.\n_Now live with that poverty 🫡_`);
});

bot({ pattern: 'capacity ?(.*)', desc: lang.plugins.capacity.desc, type: 'economy' }, async (msg, match) => {
  const balKey = 'eco_' + msg.sender;
  const capKey = 'cap_' + msg.sender;
  const bal = (await kv.get(balKey)) || 0;
  const cap = (await kv.get(capKey)) || 1000;

  if (!match) {
    return msg.reply(
      `💴 *Bank Capacity* 💳\n\n` +
      `1️⃣  *1000 sp* = 🪙 100  → capacity 1,000\n` +
      `2️⃣  *100,000 sp* = 🪙 1,000  → capacity 100,000\n` +
      `3️⃣  *10,000,000 sp* = 🪙 10,000,000  → capacity 10,000,000\n\n` +
      `Current capacity: *${cap}*\nBalance: *${bal} coins*\n\n` +
      `Example: _.capacity 1_`
    );
  }

  const plans = { '1': { cost: 100, cap: 1000 }, '2': { cost: 1000, cap: 100000 }, '3': { cost: 10000000, cap: 10000000 } };
  const plan = plans[match.trim()];
  if (!plan) return msg.reply('_Invalid plan. Use 1, 2, or 3._');
  if (bal < plan.cost) return msg.reply(`_You need *${plan.cost} coins* to upgrade. You have *${bal} coins*._`);

  await kv.set(balKey, bal - plan.cost);
  await kv.set(capKey, plan.cap);
  return msg.reply(`✅ Bank capacity upgraded to *${plan.cap}*!\n💰 Remaining balance: *${bal - plan.cost} coins*`);
});

bot({ pattern: 'rob ?(.*)', desc: lang.plugins.economy.desc, type: 'economy' }, async (msg) => {
  const target = msg.mention && msg.mention[0];
  if (!target) return msg.reply('Mention a user to rob.\nUsage: .rob @user');

  const robberKey = 'eco_' + msg.jid;
  const targetKey = 'eco_' + target;

  const robberBal = (await kv.get(robberKey)) || 0;
  const targetBal = (await kv.get(targetKey)) || 0;

  const success = Math.random() < 0.3;

  if (success) {
    const stolen = Math.floor(Math.random() * 91) + 10;
    const actualStolen = Math.min(stolen, targetBal);
    await kv.set(robberKey, robberBal + actualStolen);
    await kv.set(targetKey, Math.max(0, targetBal - actualStolen));
    return msg.reply(
      `🎉 Rob successful!\nYou stole *${actualStolen} coins* from @${target.split('@')[0]}\n` +
      `💰 Your balance: ${robberBal + actualStolen} coins`
    );
  } else {
    const fine = Math.floor(Math.random() * 41) + 10;
    await kv.set(robberKey, Math.max(0, robberBal - fine));
    return msg.reply(
      `❌ Rob failed! You got caught.\nYou lost *${fine} coins*\n` +
      `💰 Your balance: ${Math.max(0, robberBal - fine)} coins`
    );
  }
});
