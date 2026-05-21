const {
  bot, loadPlugins, getCommands, getPluginsCount,
  onBeforeMessage, onGroupEvent,
} = require('./plugins');
const lang = require('./lang');
const { handleError } = require('./error');
const db = require('./db');
const { Client } = require('./client');
const logger = require('./logger');
const { stopInstance } = require('./pm2');
const kv = require('./kv');

module.exports = {
  bot,
  loadPlugins,
  getCommands,
  getPluginsCount,
  onBeforeMessage,
  onGroupEvent,
  lang,
  handleError,
  db,
  Client,
  logger,
  stopInstance,
  kv,
};
