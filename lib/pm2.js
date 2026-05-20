const { exec } = require('child_process');

async function stopInstance() {
  try {
    const { DATABASE } = require('../config');
    await DATABASE.close();
  } catch {}
  try {
    exec('pm2 stop titan-md', () => {});
  } catch {}
  process.exit(0);
}

module.exports = { stopInstance };
