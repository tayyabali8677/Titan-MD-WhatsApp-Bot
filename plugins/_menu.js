const os = require('os');
const { bot, lang } = require('../lib');

function uptime(ms) {
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${d}d ${h}h ${m}m ${sec}s`;
}

function formatRam() {
  const used = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);
  const total = (os.totalmem() / 1024 / 1024).toFixed(0);
  return `${used}MB / ${total}MB`;
}

function header(ctx, msg) {
  const now = new Date();
  return lang.plugins.menu.header
    .replace('{0}', ctx.config.PREFIX)
    .replace('{1}', msg.pushName || 'User')
    .replace('{2}', now.toLocaleTimeString())
    .replace('{3}', now.toLocaleDateString(undefined, { weekday: 'long' }))
    .replace('{4}', now.toLocaleDateString())
    .replace('{5}', ctx.config.VERSION)
    .replace('{6}', ctx.pluginsCount)
    .replace('{7}', formatRam())
    .replace('{8}', uptime(Date.now() - ctx.startedAt))
    .replace('{9}', `${os.platform()} ${os.arch()}`);
}

function uniqueTypes(cmds) {
  const set = new Set();
  for (const c of cmds) if (!c.dontAddCommandList && c.name) set.add(c.type || 'misc');
  return [...set].sort();
}

function prettyType(t) {
  const map = {
    misc: 'ᴍɪsᴄ', group: 'ɢʀᴏᴜᴘ', media: 'ᴍᴇᴅɪᴀ',
    downloader: 'ᴅᴏᴡɴʟᴏᴀᴅᴇʀ', ai: 'ᴀɪ', utility: 'ᴜᴛɪʟɪᴛʏ',
    system: 'sʏsᴛᴇᴍ', game: 'ɢᴀᴍᴇ',
  };
  return map[t] || t.toUpperCase();
}

bot({ pattern: 'menu', desc: lang.plugins.menu.desc, type: 'misc' }, async (msg, _m, ctx) => {
  const cmds = ctx.commands.filter((c) => !c.dontAddCommandList && c.name);
  const types = uniqueTypes(cmds);
  let body = '```\n' + header(ctx, msg) + '\n';
  for (const t of types) {
    body += `\n ╭─❏ ${prettyType(t)} ❏\n`;
    cmds.filter((c) => (c.type || 'misc') === t).map((c) => c.name).sort().forEach((n) => { body += ` │ ${n.toUpperCase()}\n`; });
    body += ` ╰─────────────────\n`;
  }
  body += '```';
  return msg.send(body);
});

bot({ pattern: 'help', desc: lang.plugins.help.desc, type: 'misc' }, async (msg, _m, ctx) => {
  const cmds = ctx.commands.filter((c) => !c.dontAddCommandList && c.name);
  const names = [...new Set(cmds.map((c) => c.name))].sort();
  let body = '```\n' + header(ctx, msg) + '\n\n╭────────────────\n';
  for (const n of names) body += `│ .${n}\n`;
  body += '╰────────────────\n```';
  return msg.send(body);
});

bot({ pattern: 'list', desc: lang.plugins.list.desc, type: 'misc' }, async (msg, _m, ctx) => {
  const cmds = ctx.commands.filter((c) => !c.dontAddCommandList && c.name);
  const types = uniqueTypes(cmds);
  let body = '```\n' + header(ctx, msg) + '\n';
  for (const t of types) {
    body += `\n ╭─❏ ${prettyType(t)} ❏\n`;
    cmds.filter((c) => (c.type || 'misc') === t).map((c) => c.name).sort().forEach((n) => { body += ` │ ${n.toUpperCase()}\n`; });
    body += ` ╰─────────────────\n`;
  }
  body += '```';
  return msg.send(body);
});
