const { bot, lang } = require('../lib');

function uptime(ms) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}h ${m}m ${sec}s`;
}

bot({ pattern: 'alive', desc: lang.plugins.alive.desc, type: 'misc' }, async (msg, _m, ctx) => {
  return msg.send(lang.plugins.alive.message.replace('{0}', uptime(Date.now() - ctx.startedAt)));
});
