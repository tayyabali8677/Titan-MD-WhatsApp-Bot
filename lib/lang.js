const path = require('path');

let _lang;

function loadLang() {
  if (_lang) return _lang;
  const config = require('../config');
  const langCode = (config.BOT_LANG || config.LANG || 'en').toLowerCase();
  const langDir = path.join(__dirname, '..', 'lang');
  try {
    _lang = require(path.join(langDir, `${langCode}.json`));
  } catch {
    _lang = require(path.join(langDir, 'en.json'));
  }
  return _lang;
}

// Proxy so lang.plugins.warn.desc etc. work immediately after require
const lang = new Proxy(
  {},
  {
    get(_, key) {
      return loadLang()[key];
    },
  }
);

// Legacy helpers kept for backwards compat
function format(str, ...args) {
  if (typeof str !== 'string') return str;
  return str.replace(/\{(\d+)\}/g, (_, i) => (args[i] !== undefined ? args[i] : `{${i}}`));
}

module.exports = lang;
module.exports.format = format;
module.exports.load = loadLang;
