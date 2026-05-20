const { bot, lang } = require('../lib');
const shayaris = [
  'دل میں تیرے خیال ہے،\nتو مری آرزو ہے،\nبن تیرے ادھوری ہے زندگی،\nتو میری جستجو ہے۔',
  'محبت ایک عبادت ہے،\nجو دل سے ادا کی جاتی ہے،\nنہ الفاظ سے، نہ آنکھوں سے،\nبس روح سے محسوس کی جاتی ہے۔',
  'یہ زندگی ایک سفر ہے،\nجو ختم ہوگا ایک دن،\nجیو اس پل کو مکمل،\nکل کا کیا پتہ، کیا ہوگا۔',
  'Aankhon mein aankhein daal kar,\nDil ki baat keh deta hoon,\nTujhse mohabbat hai mujhe,\nYeh sach mein keh deta hoon.',
  'Zindagi ke safar mein,\nHum akele nahi hote,\nKuch yaadein saath chalti hain,\nJo door hoke bhi paas hoti hain.',
];
bot({ pattern: 'shayari', desc: lang.plugins.shayari.desc, type: 'misc' }, async (msg) => {
  const s = shayaris[Math.floor(Math.random() * shayaris.length)];
  return msg.send(`✍️ *Shayari*\n\n_${s}_`);
});
