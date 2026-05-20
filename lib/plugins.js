const fs = require('fs');
const path = require('path');

const commands = [];
let pluginsCount = 0;

function bot(meta, handler) {
  if (!meta || typeof meta !== 'object') throw new Error('bot() requires metadata');
  const pattern = meta.pattern || '';
  const m = String(pattern).match(/^([a-z0-9_]+)/i);
  const name = m ? m[1].toLowerCase() : '';
  commands.push({
    name,
    pattern,
    regex: new RegExp(`^${pattern}$`, 'i'),
    desc: meta.desc || '',
    type: meta.type || 'misc',
    onlyGroup: !!meta.onlyGroup,
    dontAddCommandList: !!meta.dontAddCommandList,
    active: meta.active !== false,
    handler,
  });
}

function loadPlugins(dir) {
  const abs = path.resolve(dir);
  if (!fs.existsSync(abs)) return 0;
  const files = fs.readdirSync(abs).filter((f) => f.endsWith('.js'));
  for (const f of files) {
    try {
      require(path.join(abs, f));
      pluginsCount += 1;
    } catch (e) {
      console.error(`[plugin load fail] ${f}:`, e.message);
    }
  }
  return pluginsCount;
}

function getCommands() { return commands; }
function getPluginsCount() { return pluginsCount; }

module.exports = { bot, loadPlugins, getCommands, getPluginsCount };
