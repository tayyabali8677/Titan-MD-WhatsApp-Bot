const { bot } = require('../lib');
const axios = require('axios');

const CURRENCIES = {
  usd:'US Dollar',inr:'Indian Rupee',pkr:'Pakistani Rupee',gbp:'Pound Sterling',eur:'Euro',aed:'UAE Dirham',
  sar:'Saudi Riyal',aud:'Australian Dollar',cad:'Canadian Dollar',jpy:'Japanese Yen',cny:'Chinese Yuan',
  btc:'Bitcoin',eth:'Ether',usdt:'Tether',bnb:'Binance Coin',ada:'Cardano',doge:'Dogecoin',xrp:'XRP',
  sol:'Solana',matic:'Polygon',try:'Turkish Lira',rub:'Russian Ruble',brl:'Brazilian Real',
  mxn:'Mexican Peso',krw:'South Korean Won',sgd:'Singapore Dollar',hkd:'Hong Kong Dollar',
  nzd:'New Zealand Dollar',chf:'Swiss Franc',sek:'Swedish Krona',nok:'Norwegian Krone',
  dkk:'Danish Krone',zar:'South African Rand',myr:'Malaysian Ringgit',thb:'Thai Baht',
  idr:'Indonesian Rupiah',php:'Philippine Peso',egp:'Egyptian Pound',ngn:'Nigerian Naira',
  kes:'Kenyan Shilling',bdt:'Bangladeshi Taka',lkr:'Sri Lankan Rupee',npr:'Nepalese Rupee',
  afn:'Afghan Afghani',iqd:'Iraqi Dinar',kwd:'Kuwaiti Dinar',qar:'Qatari Rial',
  bhd:'Bahraini Dinar',omr:'Omani Rial',jod:'Jordanian Dinar',tnd:'Tunisian Dinar',
  mad:'Moroccan Dirham',dzd:'Algerian Dinar',cop:'Colombian Peso',pen:'Peruvian Sol',
  ars:'Argentine Peso',clp:'Chilean Peso',vnd:'Vietnamese Dong',mmk:'Myanmar Kyat',
  ltc:'Litecoin',bch:'Bitcoin Cash',link:'ChainLink',dot:'Polkadot',
};

bot({ pattern: 'convert ?(.*)', desc: 'Convert between currencies (.convert 100 usd pkr)', type: 'misc' }, async (msg, match) => {
  const args = (match || '').trim().split(/\s+/);

  if (args.length < 3) {
    return msg.reply('_Usage: .convert <amount> <from> <to>\nExample: .convert 100 usd pkr_');
  }

  const amount = parseFloat(args[0]);
  const from = args[1].toLowerCase();
  const to = args[2].toLowerCase();

  if (isNaN(amount) || amount <= 0) return msg.reply('_Amount must be a positive number._');
  if (!(from in CURRENCIES)) return msg.reply(`_Unknown currency: *${from}*_`);
  if (!(to in CURRENCIES)) return msg.reply(`_Unknown currency: *${to}*_`);

  if (!msg.client || msg.client.constructor.name === 'MockSocket') {
    return msg.reply(`_[mock] ${amount} ${from.toUpperCase()} → ? ${to.toUpperCase()}_`);
  }

  try {
    const { data } = await axios.get(
      `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${from}.json`,
      { timeout: 10000 }
    );
    const rate = data[from] && data[from][to];
    if (!rate) return msg.reply(`_Conversion rate for ${from}→${to} not available._`);
    const result = (amount * rate).toFixed(4);
    return msg.reply(`💱 *Currency Conversion*\n\n*${amount} ${from.toUpperCase()}* = *${result} ${to.toUpperCase()}*\n\n_${CURRENCIES[from]} → ${CURRENCIES[to]}_\n_Rate: 1 ${from.toUpperCase()} = ${rate} ${to.toUpperCase()}_`);
  } catch (e) {
    return msg.reply('_Currency fetch failed: ' + (e.message || e) + '_');
  }
});

bot({ pattern: 'currency ?(.*)', desc: 'List supported currencies or convert', type: 'misc' }, async (msg, match) => {
  const args = (match || '').trim().split(/\s+/).filter(Boolean);

  if (!msg.client || msg.client.constructor.name === 'MockSocket') {
    return msg.reply(`_[mock] Currency info_`);
  }

  if (!args.length) {
    const list = Object.entries(CURRENCIES).map(([k, v]) => `*${k.toUpperCase()}* – ${v}`).join('\n');
    return msg.reply(`💱 *Supported Currencies*\n\n${list}\n\n_Use: .convert <amount> <from> <to>_`);
  }

  if (args.length >= 3) {
    const amount = parseFloat(args[0]);
    const from = args[1].toLowerCase();
    const to = args[2].toLowerCase();
    if (isNaN(amount) || !(from in CURRENCIES) || !(to in CURRENCIES)) {
      return msg.reply('_Usage: .currency <amount> <from> <to>  OR  .currency (to list all)_');
    }
    try {
      const { data } = await axios.get(
        `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${from}.json`,
        { timeout: 10000 }
      );
      const rate = data[from] && data[from][to];
      if (!rate) return msg.reply(`_No rate for ${from}→${to}_`);
      const result = (amount * rate).toFixed(4);
      return msg.reply(`💱 *${amount} ${from.toUpperCase()}* = *${result} ${to.toUpperCase()}*\n_Rate: 1 ${from.toUpperCase()} = ${rate} ${to.toUpperCase()}_`);
    } catch (e) {
      return msg.reply('_Currency fetch failed: ' + (e.message || e) + '_');
    }
  }

  return msg.reply('_Usage: .currency  (list all)  OR  .currency 100 usd pkr_');
});
