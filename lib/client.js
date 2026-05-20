const config = require('../config');
const logger = require('./logger');
const { createConnection } = require('./connection');
const { buildMessage } = require('./message');
const { getCommands, getPluginsCount } = require('./plugins');
const { handleError } = require('./error');
const lang = require('./lang');

// PREFIX is a regex character class string, e.g. '^[.,!]'
function makePrefixRegex(prefix) {
  try {
    return new RegExp(prefix, 'i');
  } catch {
    return new RegExp(`^[${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`, 'i');
  }
}

class Client {
  constructor() {
    this.sock = null;
    this.startedAt = Date.now();
  }

  async connect() {
    this.sock = await createConnection();
    this.sock.on('message', (raw) => this._onMessage(raw).catch((e) => logger.error(e)));
    if (config.DISABLE_START_MESSAGE !== 'true') {
      logger.info(`${config.BOT_NAME} v${config.VERSION} — plugins: ${getPluginsCount()}`);
    }
    return this.sock;
  }

  async close() {
    if (this.sock && this.sock.end) await this.sock.end();
    logger.info('connection closed');
  }

  async _isSudo(jid) {
    if (!jid) return false;
    const num = jid.split('@')[0];
    const envList = String(config.SUDO || '').split(',').map((s) => s.trim()).filter(Boolean);
    if (envList.includes(jid) || envList.includes(num)) return true;
    // Also honor runtime sudo additions stored by the .setsudo plugin
    try {
      const kv = require('./kv');
      const dyn = (await kv.get('sudo', 'list')) || [];
      if (Array.isArray(dyn) && (dyn.includes(jid) || dyn.includes(num))) return true;
    } catch (_) { /* kv not ready — fall back to env-only */ }
    return false;
  }

  async _isAdmin(jid, userJid) {
    try {
      const meta = await this.sock.groupMetadata(jid);
      const p = (meta.participants || []).find((x) => x.id === userJid);
      return !!(p && (p.admin === 'admin' || p.admin === 'superadmin'));
    } catch {
      return false;
    }
  }

  async _onMessage(raw) {
    const msg = buildMessage(raw, this.sock);
    if (!msg.body) return;

    const prefixRe = makePrefixRegex(config.PREFIX);

    // Check if body starts with prefix
    if (!prefixRe.test(msg.body.slice(0, 1))) return;

    // Strip the prefix character and split
    const stripped = msg.body.slice(1).trim();
    const [head, ...rest] = stripped.split(/\s+/);
    const match = rest.join(' ');

    const cmds = getCommands();
    const cmd = cmds.find((c) => {
      if (!c.active) return false;
      try {
        return c.regex.test(stripped) || c.name === head.toLowerCase();
      } catch {
        return false;
      }
    });
    if (!cmd) return;

    // Compute sudo status once (async — also reads kv), then expose via both ctx and msg.
    const isSudo = (await this._isSudo(msg.sender)) || msg.fromMe;
    msg.isSudo = isSudo;

    const ctx = {
      config,
      lang,
      commands: cmds,
      pluginsCount: getPluginsCount(),
      VERSION: config.VERSION,
      isSudo,
      isAdmin: () => this._isAdmin(msg.jid, this.sock.user && this.sock.user.id),
      startedAt: this.startedAt,
    };

    if (cmd.onlyGroup && !msg.jid.endsWith('@g.us')) {
      return msg.reply(lang.extra.only_group);
    }

    try {
      await cmd.handler(msg, match, ctx);
    } catch (e) {
      await handleError(e, {
        reply: msg.reply,
        jid: msg.jid,
        command: head,
        message: msg.body,
      });
    }
  }
}

module.exports = { Client };
