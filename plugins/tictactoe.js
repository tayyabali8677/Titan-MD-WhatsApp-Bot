const { bot, lang } = require('../lib');

const games = new Map();
const WIN = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

function render(b) {
  const c = (i) => b[i] || (i + 1);
  return `${c(0)}|${c(1)}|${c(2)}\n${c(3)}|${c(4)}|${c(5)}\n${c(6)}|${c(7)}|${c(8)}`;
}
function winner(b) {
  for (const [a, bb, c] of WIN) if (b[a] && b[a] === b[bb] && b[a] === b[c]) return b[a];
  return null;
}

bot({ pattern: 'ttt ?(.*)', desc: lang.plugins.tictactoe.desc, type: 'game' }, async (msg, match) => {
  const [sub, ...rest] = (match || '').trim().split(/\s+/);
  const key = msg.jid;
  let g = games.get(key);

  if (sub === 'start' || !g) {
    g = { board: Array(9).fill(null), turn: 'X', infinite: rest[0] === 'infinite', queue: [] };
    games.set(key, g);
    const mode = g.infinite ? 'infinite' : 'normal';
    return msg.reply(
      lang.plugins.tictactoe.started.replace('{0}', mode).replace('{1}', 'X').replace('{2}', render(g.board))
    );
  }
  if (sub === 'end') { games.delete(key); return msg.reply(lang.plugins.tictactoe.ended); }

  const pos = parseInt(sub, 10) - 1;
  if (isNaN(pos) || pos < 0 || pos > 8 || g.board[pos]) return msg.reply(lang.plugins.tictactoe.bad_move);

  g.board[pos] = g.turn;
  g.queue.push(pos);
  if (g.infinite && g.queue.length > 6) g.board[g.queue.shift()] = null;

  const w = winner(g.board);
  if (w) {
    games.delete(key);
    return msg.reply(lang.plugins.tictactoe.winner.replace('{0}', w).replace('{1}', render(g.board)));
  }
  if (!g.board.includes(null)) {
    games.delete(key);
    return msg.reply(lang.plugins.tictactoe.draw.replace('{0}', render(g.board)));
  }
  g.turn = g.turn === 'X' ? 'O' : 'X';
  return msg.reply(`${render(g.board)}\n${lang.plugins.tictactoe.your_turn.replace('{0}', g.turn)}`);
});
