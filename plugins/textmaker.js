const { bot, lang } = require('../lib');
const STYLES = {
  bold:   (t) => t.replace(/[a-z]/gi, (c) => String.fromCodePoint((/[a-z]/.test(c) ? 0x1D41A : 0x1D400) + (c.toLowerCase().charCodeAt(0) - 97))),
  italic: (t) => t.replace(/[a-z]/gi, (c) => String.fromCodePoint((/[a-z]/.test(c) ? 0x1D622 : 0x1D608) + (c.toLowerCase().charCodeAt(0) - 97))),
  bubble: (t) => t.replace(/[a-z0-9]/gi, (c) => {
    const map = 'ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ';
    const i = c.toLowerCase().charCodeAt(0) - 97;
    return i >= 0 && i < 26 ? map[i] : c;
  }),
  strike: (t) => t.split('').join('̶') + '̶',
  square: (t) => t.replace(/[a-z]/gi, (c) => String.fromCodePoint(0x1F130 + (c.toLowerCase().charCodeAt(0) - 97))),
};
const styleNames = Object.keys(STYLES);
bot({ pattern: 'textmaker ?(.*)', desc: lang.plugins.textmaker.desc, type: 'utility' }, async (msg, match) => {
  if (!match) {
    return msg.reply(`${lang.plugins.textmaker.usage}\nStyles: ${styleNames.join(', ')}`);
  }
  const [style, ...rest] = match.split(/\s+/);
  if (!rest.length) {
    const text = style;
    return msg.send(styleNames.map((s) => `*${s}*: ${STYLES[s](text)}`).join('\n'));
  }
  const text = rest.join(' ');
  const fn = STYLES[style.toLowerCase()];
  return msg.send(fn ? fn(text) : text);
});
