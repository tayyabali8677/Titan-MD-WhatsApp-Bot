const { bot, lang } = require('../lib');

const games = new Map();

bot({ pattern: 'wcg ?(.*)', desc: lang.plugins.wcg.desc, type: 'game' }, async (msg, match) => {
  const [sub, ...rest] = (match || '').trim().split(/\s+/);
  const key = msg.jid;
  let g = games.get(key);

  if (sub === 'start' || !g) {
    g = { players: [msg.pushName || 'P1'], turn: 0, last: '', words: new Set(), timer: null };
    games.set(key, g);
    return msg.reply(lang.plugins.wcg.started.replace('{0}', g.players.join(', ')));
  }
  if (sub === 'join') {
    const name = rest[0] || msg.pushName;
    g.players.push(name);
    return msg.reply(lang.plugins.wcg.joined.replace('{0}', name));
  }
  if (sub === 'end') { games.delete(key); return msg.reply(lang.plugins.wcg.ended); }

  const word = sub.toLowerCase();
  if (!word) return msg.reply(`Usage: wcg <word|start|join|end>`);
  if (g.words.has(word)) return msg.reply(lang.plugins.wcg.used);

  if (g.last && word[0] !== g.last.slice(-1)) {
    const loser = g.players[g.turn];
    games.delete(key);
    return msg.reply(lang.plugins.wcg.wrong_letter.replace('{0}', loser).replace('{1}', g.last).replace('{2}', word));
  }

  g.last = word;
  g.words.add(word);
  if (g.timer) clearTimeout(g.timer);
  g.turn = (g.turn + 1) % g.players.length;
  g.timer = setTimeout(() => {
    const tg = games.get(key); if (!tg) return;
    games.delete(key);
    msg.send(lang.plugins.wcg.timeout.replace('{0}', tg.players[tg.turn])).catch(() => {});
  }, 30000);

  return msg.reply(
    lang.plugins.wcg.ok.replace('{0}', g.players[g.turn]).replace('{1}', word.slice(-1))
  );
});
