const { DataTypes } = require('sequelize');
const config = require('../config');

const db = config.DATABASE;

const KV = db.define('kv', {
  ns: { type: DataTypes.STRING, allowNull: false },
  k: { type: DataTypes.STRING, allowNull: false },
  v: { type: DataTypes.TEXT },
}, { indexes: [{ fields: ['ns', 'k'] }] });

const Warn = db.define('warn', {
  jid: DataTypes.STRING,
  user: DataTypes.STRING,
  count: { type: DataTypes.INTEGER, defaultValue: 0 },
});

const Budget = db.define('budget', {
  jid: DataTypes.STRING,
  kind: DataTypes.STRING, // income/expense
  amount: DataTypes.FLOAT,
  note: DataTypes.STRING,
});

const Vars = db.define('vars', {
  k: { type: DataTypes.STRING, unique: true },
  v: DataTypes.TEXT,
});

const Toggle = db.define('toggle', {
  command: { type: DataTypes.STRING, unique: true },
  enabled: { type: DataTypes.BOOLEAN, defaultValue: true },
});

const Filter = db.define('filter', {
  scope: DataTypes.STRING, // local/global/personal
  jid: DataTypes.STRING,
  trigger: DataTypes.STRING,
  reply: DataTypes.TEXT,
});

const MsgCount = db.define('msg_count', {
  jid: DataTypes.STRING,
  user: DataTypes.STRING,
  count: { type: DataTypes.INTEGER, defaultValue: 0 },
});

async function init() {
  await db.sync();
}

module.exports = { db, init, KV, Warn, Budget, Vars, Toggle, Filter, MsgCount };
