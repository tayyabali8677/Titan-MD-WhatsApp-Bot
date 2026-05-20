const { bot, lang } = require('../lib');

const STYLES = {
  bold:    { a: '𝗮', z: 26, A: '𝗔' },
  italic:  { a: '𝘢', z: 26, A: '𝘈' },
  script:  { a: '𝒶', z: 26, A: '𝒜' },
  double:  { a: '𝕒', z: 26, A: '𝔸' },
  sans:    { a: '𝖺', z: 26, A: '𝖠' },
  small:   { map: 'ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖqʳˢᵗᵘᵛʷˣʸᶻ' },
};

function convert(text, style) {
  const s = STYLES[style] || STYLES.bold;
  return text.replace(/[a-z]/gi, (ch) => {
    if (s.map) {
      const i = ch.toLowerCase().charCodeAt(0) - 97;
      return s.map[i] || ch;
    }
    if (/[a-z]/.test(ch)) return String.fromCodePoint(s.a.codePointAt(0) + (ch.charCodeAt(0) - 97));
    if (/[A-Z]/.test(ch)) return String.fromCodePoint(s.A.codePointAt(0) + (ch.charCodeAt(0) - 65));
    return ch;
  });
}

bot({ pattern: 'fancy ?(.*)', desc: lang.plugins.fancy.desc, type: 'utility' }, async (msg, match) => {
  if (!match) return msg.reply(lang.plugins.fancy.usage);
  const [style, ...rest] = match.split(/\s+/);
  if (!rest.length) {
    // No style given — show all
    const text = style;
    const out = Object.entries(STYLES).map(([k]) => `*${k}*: ${convert(text, k)}`).join('\n');
    return msg.send(out);
  }
  const text = rest.join(' ');
  return msg.send(convert(text, style) || text);
});
