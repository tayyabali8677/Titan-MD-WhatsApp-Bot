let pino;
try {
  pino = require('pino');
} catch {
  // fallback if pino not installed
  const makeLogger = (level) => (...args) => console[level === 'error' ? 'error' : 'log']('[titan-md]', ...args);
  module.exports = {
    info: makeLogger('info'), warn: makeLogger('warn'),
    error: makeLogger('error'), debug: makeLogger('debug'),
    child: () => module.exports,
  };
  return;
}

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.stdout.isTTY
    ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:standard', ignore: 'pid,hostname' } }
    : undefined,
});

module.exports = logger;
