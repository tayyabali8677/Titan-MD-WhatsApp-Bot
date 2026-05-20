const { bot, lang, db } = require('../lib');

bot({ pattern: 'income ?(.*)', desc: lang.plugins.budget.desc, type: 'utility' }, async (msg, match) => {
  const [amt, ...rest] = (match || '').trim().split(/\s+/);
  const amount = parseFloat(amt);
  if (isNaN(amount)) return msg.reply(lang.plugins.budget.usage);
  await db.Budget.create({ jid: msg.jid, kind: 'income', amount, note: rest.join(' ') });
  return msg.reply(lang.plugins.budget.income_added.replace('{0}', amount));
});

bot({ pattern: 'expense ?(.*)', desc: lang.plugins.budget.desc, type: 'utility' }, async (msg, match) => {
  const [amt, ...rest] = (match || '').trim().split(/\s+/);
  const amount = parseFloat(amt);
  if (isNaN(amount)) return msg.reply(lang.plugins.budget.usage);
  await db.Budget.create({ jid: msg.jid, kind: 'expense', amount, note: rest.join(' ') });
  return msg.reply(lang.plugins.budget.expense_added.replace('{0}', amount));
});

bot({ pattern: 'delbudget ?(.*)', desc: 'Delete budget entry', type: 'utility' }, async (msg, match) => {
  const id = parseInt(match || '', 10);
  if (!id) { await db.Budget.destroy({ where: { jid: msg.jid } }); return msg.reply(lang.plugins.budget.cleared); }
  await db.Budget.destroy({ where: { id, jid: msg.jid } });
  return msg.reply(`Deleted #${id}`);
});

bot({ pattern: 'summary', desc: 'Budget summary', type: 'utility' }, async (msg) => {
  const rows = await db.Budget.findAll({ where: { jid: msg.jid } });
  const inc = rows.filter((r) => r.kind === 'income').reduce((a, r) => a + r.amount, 0);
  const exp = rows.filter((r) => r.kind === 'expense').reduce((a, r) => a + r.amount, 0);
  return msg.reply(`Income: ${inc}\nExpense: ${exp}\nBalance: ${inc - exp}`);
});
