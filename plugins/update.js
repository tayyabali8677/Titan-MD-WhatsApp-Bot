/**
 * Auto-update system.
 *
 * Commands:
 *   .update           — check origin/master for pending commits
 *   .update now       — pull latest, npm install, restart
 *
 * Background:
 *   When AUTO_UPDATE=true (default), every 30 minutes the bot checks
 *   origin/master for new commits and DMs the owner with a list if any
 *   are pending — same as Levanter's "Update Available!" message.
 *
 * Restart strategy:
 *   process.exit(0) after a short delay to let the reply message send.
 *   Bot-Hosting / PM2 / panel.js bootstrap auto-restart the process.
 */

const { bot, lang, onGroupEvent } = require('../lib');
const config = require('../config');
const path = require('path');
const fs = require('fs');
const { spawnSync, spawn } = require('child_process');

const REPO_ROOT = process.cwd();
const CHECK_INTERVAL_MS = 30 * 60 * 1000; // 30 min
let lastNotifiedSha = null; // remember the SHA we last notified about so we don't spam

function gitCmd(args, opts = {}) {
  const r = spawnSync('git', args, {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    timeout: 30000,
    ...opts,
  });
  if (r.error) throw r.error;
  return { code: r.status, stdout: (r.stdout || '').trim(), stderr: (r.stderr || '').trim() };
}

/**
 * Returns { hasUpdate, behind, commits: [{sha, msg}], localSha, remoteSha }
 * or { error } if git isn't available / no repo.
 */
async function checkForUpdates() {
  try {
    // Make sure we're in a git repo
    const repoCheck = gitCmd(['rev-parse', '--is-inside-work-tree']);
    if (repoCheck.code !== 0) return { error: 'Not a git repo (deployed as a tarball?). .update disabled.' };

    // Fetch latest refs (silent, no merge)
    gitCmd(['fetch', 'origin', 'master'], { timeout: 60000 });

    const localSha = gitCmd(['rev-parse', 'HEAD']).stdout;
    const remoteSha = gitCmd(['rev-parse', 'origin/master']).stdout;
    if (!localSha || !remoteSha) return { error: 'Could not resolve git refs.' };

    if (localSha === remoteSha) {
      return { hasUpdate: false, localSha, remoteSha };
    }

    // List commits we're behind by
    const log = gitCmd(['log', '--pretty=format:%h %s', 'HEAD..origin/master']);
    const commits = log.stdout.split('\n').filter(Boolean).map((line) => {
      const sp = line.indexOf(' ');
      return { sha: line.slice(0, sp), msg: line.slice(sp + 1) };
    });

    return { hasUpdate: true, behind: commits.length, commits, localSha, remoteSha };
  } catch (e) {
    return { error: e.message || String(e) };
  }
}

/** Apply the update: git pull → npm install → process.exit */
async function applyUpdate(msg) {
  await msg.reply('_⬇️ Pulling latest changes..._');

  // git pull
  const pull = gitCmd(['pull', 'origin', 'master'], { timeout: 90000 });
  if (pull.code !== 0) {
    return msg.reply('_❌ git pull failed:_\n```' + (pull.stderr || pull.stdout || 'unknown') + '```');
  }

  await msg.reply('_📦 Installing dependencies..._');

  // npm install — non-blocking, non-interactive
  const npm = spawnSync('npm', ['install', '--no-audit', '--no-fund', '--loglevel', 'error'], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    timeout: 5 * 60 * 1000,
    shell: process.platform === 'win32',
    env: { ...process.env, CI: 'true' },
  });
  if (npm.status !== 0) {
    return msg.reply('_⚠️ npm install reported issues (continuing anyway):_\n```' + String(npm.stderr || '').slice(-500) + '```');
  }

  await msg.reply(
    '✅ *Update applied!*\n\n' +
    'Restarting in 2 seconds. The bot will be back in ~10–30 seconds.'
  );

  // Give the reply time to actually send before we kill the process
  setTimeout(() => { process.exit(0); }, 2000);
}

bot({ pattern: 'update ?(.*)', desc: lang.plugins.update?.desc || 'Check for bot updates from git', type: 'system' }, async (msg, match, ctx) => {
  const sub = (match || '').trim().toLowerCase();

  // Subcommand: `.update now` → apply
  if (sub === 'now' || sub === 'apply') {
    if (!ctx.isSudo) return msg.reply(lang.extra.sudo_only || '_Sudo only._');
    return applyUpdate(msg);
  }

  // Default: check
  await msg.reply('_🔍 Checking for updates..._');
  const r = await checkForUpdates();
  if (r.error) return msg.reply('_⚠️ ' + r.error + '_');

  if (!r.hasUpdate) {
    return msg.reply(
      '✅ *Up to date.*\n' +
      `📦 Version: v${config.VERSION}\n` +
      `🔖 Commit: \`${r.localSha.slice(0, 7)}\``
    );
  }

  const list = r.commits.slice(0, 10).map((c, i) => `${i + 1}. ${c.msg}`).join('\n');
  const more = r.commits.length > 10 ? `\n_… and ${r.commits.length - 10} more_` : '';
  return msg.reply(
    `🔄 *Update Available!*\n\n` +
    `${r.behind} pending update(s):\n${list}${more}\n\n` +
    `_Use_ \`${stripPrefix('update now')}\` _to update now_`
  );
});

function stripPrefix(cmd) {
  // Pick the first usable prefix char so the help text shows the right one
  const p = String(config.PREFIX || '^[.,!]').replace(/[\^\[\]\\]/g, '').slice(0, 1) || '.';
  return p + cmd;
}

// Keep .updatenow as an alias for backward-compat
bot({ pattern: 'updatenow', desc: 'Apply pending updates (alias of `.update now`)', type: 'system' }, async (msg, _, ctx) => {
  if (!ctx.isSudo) return msg.reply(lang.extra.sudo_only || '_Sudo only._');
  return applyUpdate(msg);
});

// ─── Background auto-check ──────────────────────────────────────────────────
// Cache the sock from the first inbound message so the background check
// has a working WhatsApp connection to DM the owner from.
const { onBeforeMessage } = require('../lib');
let cachedSock = null;
onBeforeMessage((_msg, sock) => { cachedSock = sock; });

async function backgroundCheck() {
  if (String(config.AUTO_UPDATE || 'true').toLowerCase() !== 'true') return;
  if (!cachedSock || !cachedSock.user) return; // wait until we have a live socket

  const r = await checkForUpdates();
  if (r.error || !r.hasUpdate) return;
  if (r.remoteSha === lastNotifiedSha) return; // already told the owner about this one

  const ownerJid = (config.OWNER_NUMBER ? config.OWNER_NUMBER.replace(/\D/g, '') + '@s.whatsapp.net' : null)
    || cachedSock.user.id;
  if (!ownerJid) return;

  const list = r.commits.slice(0, 10).map((c, i) => `${i + 1}. ${c.msg}`).join('\n');
  const more = r.commits.length > 10 ? `\n_… and ${r.commits.length - 10} more_` : '';
  const text =
    `🔄 *Update Available!*\n\n` +
    `${r.behind} pending update(s):\n${list}${more}\n\n` +
    `_Use_ \`${stripPrefix('update now')}\` _to update now_`;

  try {
    await cachedSock.sendMessage(ownerJid, { text });
    lastNotifiedSha = r.remoteSha;
  } catch (_) { /* best-effort */ }
}

// Run after 2 min grace, then every 30 min
setTimeout(backgroundCheck, 2 * 60 * 1000);
setInterval(backgroundCheck, CHECK_INTERVAL_MS);
