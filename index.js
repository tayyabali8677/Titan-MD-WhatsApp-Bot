const path = require('path');
const { DATABASE, VERSION, DISABLE_START_MESSAGE } = require('./config');
const { stopInstance } = require('./lib/pm2');
const logger = require('./lib/logger');
const { Client, loadPlugins } = require('./lib');
const db = require('./lib/db');

const init = async () => {
  logger.info(`titan-md v${VERSION}`);

  try {
    await DATABASE.authenticate({ retry: { max: 3 } });
    await db.init();
  } catch (error) {
    logger.error({
      msg: 'Database connection failed',
      error: error.message,
      url: process.env.DATABASE_URL || '(sqlite)',
    });
    return stopInstance();
  }

  loadPlugins(path.join(__dirname, 'plugins'));

  const bot = new Client();

  try {
    await bot.connect();
  } catch (error) {
    logger.error({ msg: 'Bot client failed to start', error: error.message });
  }

  const shutdown = async (sig) => {
    logger.info(`received ${sig}, shutting down...`);
    try { await bot.close(); } catch (e) { logger.error(e); }
    try { await DATABASE.close(); } catch (e) { logger.error(e); }
    logger.info('clean shutdown');
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  return bot;
};

if (require.main === module) {
  init();
}

module.exports = { init, stopInstance };
