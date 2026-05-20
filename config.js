const { Sequelize } = require('sequelize');
const { existsSync } = require('fs');
const path = require('path');

const configPath = path.join(__dirname, './config.env');
const databasePath = path.join(__dirname, './database.db');
if (existsSync(configPath)) require('dotenv').config({ path: configPath });

const toBool = (x) => String(x).toLowerCase() === 'true';
const trim = (x, d = '') => (x !== undefined && x !== null ? String(x).trim() : d);

const DATABASE_URL =
  process.env.DATABASE_URL === undefined ? databasePath : process.env.DATABASE_URL;

const DATABASE =
  DATABASE_URL === databasePath
    ? new Sequelize({
        dialect: 'sqlite',
        storage: DATABASE_URL,
        logging: false,
        retry: { max: 10 },
        pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
        dialectOptions: { busyTimeout: 10000 },
        hooks: {
          afterConnect: (conn) => {
            conn.run('PRAGMA synchronous = NORMAL;');
            conn.run('PRAGMA busy_timeout = 10000;');
          },
        },
      })
    : new Sequelize(DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
          ssl: { require: true, rejectUnauthorized: false },
          keepAlive: true,
        },
        logging: false,
        retry: { max: 10 },
        pool: { max: 5, min: 0, acquire: 30000, idle: 10000, evict: 10000 },
      });

module.exports = {
  VERSION: require('./package.json').version,
  SESSION_ID: trim(process.env.SESSION_ID),
  DATABASE,
  DATABASE_URL,

  // --- Prefix / bot identity ---
  PREFIX: trim(process.env.PREFIX, '^[.,!]'),
  BOT_NAME: trim(process.env.BOT_NAME, 'Titan MD'),
  STICKER_PACKNAME: trim(process.env.STICKER_PACKNAME, 'Titan MD;TitanDev'),
  BRANCH: 'master',

  // --- Sudo / access ---
  SUDO: process.env.SUDO || '',
  WHITE_LIST: process.env.WHITE_LIST || '',
  GROUP_ADMINS: process.env.GROUP_ADMINS || '',
  APPROVE: trim(process.env.APPROVE),

  // --- Warn system ---
  WARN_LIMIT: parseInt(process.env.WARN_LIMIT || '3', 10),
  WARN_MESSAGE: process.env.WARN_MESSAGE || '⚠️WARNING⚠️\n*User :* &mention\n*Warn :* &warn\n*Remaining :* &remaining',
  WARN_RESET_MESSAGE: process.env.WARN_RESET_MESSAGE || 'WARN RESET\nUser : &mention\nRemaining : &remaining',
  WARN_KICK_MESSAGE: process.env.WARN_KICK_MESSAGE || '&mention kicked',

  // --- Anti-* defaults ---
  ANTILINK_MSG: process.env.ANTILINK_MSG || '_Antilink Detected &mention kicked_',
  ANTISPAM_MSG: process.env.ANTISPAM_MSG || '_Antispam Detected &mention kicked_',
  ANTIWORDS_MSG: process.env.ANTIWORDS_MSG || '_AntiWord Detected &mention kicked_',
  ANTIWORDS: process.env.ANTIWORDS || 'word',

  // --- Anti-bot / anti-delete / anti-edit ---
  ANTI_BOT: trim(process.env.ANTI_BOT, 'off'),
  ANTI_BOT_MESSAGE: process.env.ANTI_BOT_MESSAGE || '&mention removed',
  ANTI_DELETE: trim(process.env.ANTI_DELETE, 'null'),
  DISABLE_BOT: trim(process.env.DISABLE_BOT, 'null'),

  // --- Status / presence ---
  REJECT_CALL: process.env.REJECT_CALL,
  ALWAYS_ONLINE: process.env.ALWAYS_ONLINE,
  AUTO_STATUS_VIEW: trim(process.env.AUTO_STATUS_VIEW, 'false'),
  SEND_READ: process.env.SEND_READ,
  PERSONAL_MESSAGE: trim(process.env.PERSONAL_MESSAGE, 'null'),
  MENTION: process.env.MENTION || '',

  // --- Logging / debug ---
  LOG_MSG: process.env.LOG_MSG || 'false',
  BAILEYS_LOG_LVL: process.env.BAILEYS_LOG_LVL || 'silent',

  // --- Language ---
  LANG: trim(process.env.LANGUAG, 'en').toLowerCase(),   // note: env var name is LANGUAG (legacy typo, kept for back-compat)
  BOT_LANG: process.env.BOT_LANG || 'en',

  // --- AI / chat ---
  GPT: trim(process.env.GPT, 'free'),
  MODEL: trim(process.env.MODEL, 'gpt-3.5-turbo'),
  GEMINI_API_KEY: trim(process.env.GEMINI_API_KEY),
  GEMINI_MODEL: trim(process.env.GEMINI_MODEL, 'gemini-2.5-flash'),
  GROQ_API_KEY: trim(process.env.GROQ_API_KEY),
  GROQ_MODEL: trim(process.env.GROQ_MODEL, 'llama-3.3-70b-versatile'),
  GROQ_SYSTEM_MSG: process.env.GROQ_SYSTEM_MSG || 'You are Titan MD, a helpful WhatsApp bot.',
  BING_COOKIE: trim(process.env.BING_COOKIE),
  BRAINSHOP: process.env.BRAINSHOP || '159501,6pq8dPiYt7PdqHz3',

  // --- External APIs ---
  RMBG_KEY: process.env.RMBG_KEY || 'null',
  TRUECALLER: process.env.TRUECALLER,
  YT_COOKIE: process.env.YT_COOKIE,

  // --- Hosting ---
  HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,
  HEROKU_API_KEY: process.env.HEROKU_API_KEY,
  RENDER_NAME: trim(process.env.RENDER_NAME),
  RENDER_API_KEY: trim(process.env.RENDER_API_KEY),
  KOYEB: toBool(process.env.KOYEB),
  KOYEB_NAME: trim(process.env.KOYEB_NAME),
  KOYEB_API: trim(process.env.KOYEB_API),
  VPS: toBool(process.env.VPS),

  // --- Bot behaviour ---
  AJOIN: process.env.AJOIN || 'false',
  AUTO_UPDATE: process.env.AUTO_UPDATE || 'true',
  CMD_REACTION: process.env.CMD_REACTION || 'true',
  DELETE_TYPE: trim(process.env.DELETE_TYPE),
  LIST_TYPE: trim(process.env.LIST_TYPE, 'text'),
  DISABLE_START_MESSAGE: process.env.DISABLE_START_MESSAGE || 'false',
  FORCE_LOGOUT: process.env.FORCE_LOGOUT || 'false',
  TIMEZONE: process.env.TIMEZONE,
  TZ: process.env.TZ || 'UTC',

  // --- Limits ---
  MAX_UPLOAD: parseInt(process.env.MAX_UPLOAD || '230', 10),

  // --- Group control & moderation extensions ---
  MODE: (process.env.MODE || 'private').trim(),          // public/private/inbox/groups
  ADMIN_ACCESS: toBool(process.env.ADMIN_ACCESS),        // group admins can use sudo cmds
  PM_ANTISPAM: toBool(process.env.PM_ANTISPAM),
  MULTI_HANDLERS: toBool(process.env.MULTI_HANDLERS),
  ANTISPAM_COUNT: process.env.ANTISPAM_COUNT || '6/10',
  READ_MESSAGES: toBool(process.env.READ_MESSAGES),
  READ_COMMAND: process.env.READ_COMMAND !== 'false',
  PMB_VAR: toBool(process.env.PMB_VAR),
  DIS_PM: toBool(process.env.DIS_PM),
  PMB: process.env.PMB || '_Personal messages not allowed, BLOCKED!_',
  ALLOWED_CALLS: process.env.ALLOWED_CALLS || '',
  CALL_REJECT_MESSAGE: process.env.CALL_REJECT_MESSAGE || '📞 Calls are not allowed.',
  IMGBB_KEY: process.env.IMGBB_KEY || '',
  BOT_INFO: process.env.BOT_INFO || 'Titan MD;TitanDev;default',
  STICKER_DATA: process.env.STICKER_DATA || 'Titan MD',
  AUDIO_DATA: (process.env.AUDIO_DATA === undefined || process.env.AUDIO_DATA === 'private') ? 'default' : process.env.AUDIO_DATA,
  CHATBOT: trim(process.env.CHATBOT, 'off'),
  SUPPORT_GROUP: process.env.SUPPORT_GROUP || 'https://titanmd.site',
  LANGUAGE: trim(process.env.LANGUAGE, 'en'),
  ANTI_SPAM: trim(process.env.ANTI_SPAM),
  ANTILINK_WARN: process.env.ANTILINK_WARN || '',
  AUTOMUTE_MSG: process.env.AUTOMUTE_MSG || '_Group automuted!_',
  AUTOUNMUTE_MSG: process.env.AUTOUNMUTE_MSG || '_Group auto unmuted!_',
  DISABLED_COMMANDS: (process.env.DISABLED_COMMANDS ? process.env.DISABLED_COMMANDS.split(',') : []),

  // --- Behaviour & reaction extensions ---
  OWNER_NUMBER: process.env.OWNER_NUMBER || '',
  OWNER_NAME: trim(process.env.OWNER_NAME, 'TitanDev'),
  AUTO_REPLY: trim(process.env.AUTO_REPLY, 'false'),
  AUTO_REACT: trim(process.env.AUTO_REACT, 'false'),
  OWNER_REACT: trim(process.env.OWNER_REACT, 'false'),
  AUTO_TYPING: trim(process.env.AUTO_TYPING, 'false'),
  AUTO_RECORDING: trim(process.env.AUTO_RECORDING, 'false'),
  ANTI_CALL: trim(process.env.ANTI_CALL, 'false'),
  REJECT_MSG: process.env.REJECT_MSG || '📞 Call not allowed on this number.',
  AUTO_STATUS_SEEN: trim(process.env.AUTO_STATUS_SEEN, 'false'),
  REACT_EMOJIS: process.env.REACT_EMOJIS || '❤️,🔥,👍,😍,😂,😮,😎,🥰',
  OWNER_EMOJIS: process.env.OWNER_EMOJIS || '👑,💎,⭐,✨,🔥,💯',
  MENTION_REPLY: trim(process.env.MENTION_REPLY, 'false'),
  AUTO_DOWNLOADER: trim(process.env.AUTO_DOWNLOADER, 'false'),
  ADMIN_ACTION: toBool(process.env.ADMIN_ACTION),
  DESCRIPTION: process.env.DESCRIPTION || '*© Powered by TitanDev — titanmd.site*',
  ANTI_DELETE_PATH: trim(process.env.ANTI_DELETE_PATH, 'inbox'),
  ANTIEDIT_PATH: trim(process.env.ANTIEDIT_PATH, 'inbox'),
  ANTI_LINK: trim(process.env.ANTI_LINK, 'true'),
  WELCOME_MESSAGE: process.env.WELCOME_MESSAGE || '*_@user joined @group, welcome! 🎉_*',
  GOODBYE_MESSAGE: process.env.GOODBYE_MESSAGE || '*_@user has left, we will miss them! 👋_*',

  // --- Sticker / branding extras ---
  STICKER_NAME: trim(process.env.STICKER_NAME, 'Titan MD'),
  PACK_NAME: trim(process.env.PACK_NAME, 'Titan MD'),
  PACK_AUTHER: trim(process.env.PACK_AUTHER, 'TitanDev'),
  THUMB_IMAGE: process.env.THUMB_IMAGE || '',
  CAPTION: process.env.CAPTION || '*© Titan MD by TitanDev*',
  MENU_IMAGE_URL: process.env.MENU_IMAGE_URL || '',
  REPO: process.env.REPO || 'https://github.com/TitanDev/titan-md',
  DEV: trim(process.env.DEV, 'TitanDev'),
  GITHUB: process.env.GITHUB || 'https://github.com/TitanDev',
  GURL: process.env.GURL || 'https://titanmd.site',

  // --- Theme & menu style ---
  THEME: trim(process.env.THEME, 'TITAN').toUpperCase(),
  MENU: process.env.MENU || '3',
  STYLE: process.env.STYLE || '0',

  // --- Status / presence extras ---
  WAPRESENCE: trim(process.env.WAPRESENCE, 'available'),
  AUTO_BIO: toBool(process.env.AUTO_BIO),
  AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || 'Status seen by Titan MD ✅',
  AUTO_STATUS_REACT: toBool(process.env.AUTO_STATUS_REACT),
  AUTO_STATUS_REPLY: toBool(process.env.AUTO_STATUS_REPLY),
  AUTO_READ_STATUS: toBool(process.env.AUTO_READ_STATUS),
  AUTO_SAVE_STATUS: toBool(process.env.AUTO_SAVE_STATUS),
  AUTO_STICKER: toBool(process.env.AUTO_STICKER),

  // --- Reactions / custom react ---
  CUSTOM_REACT: toBool(process.env.CUSTOM_REACT),
  CUSTOM_REACT_EMOJIS: process.env.CUSTOM_REACT_EMOJIS || '❤️,🔥,👍,😍,😂',

  // --- Anti / moderation extras ---
  ANTI_VV: trim(process.env.ANTI_VV, 'off'),
  ANTILINK_VALUES: process.env.ANTILINK_VALUES || 'all',
  DELETE_LINKS: toBool(process.env.DELETE_LINKS),
  PM_BLOCKER: toBool(process.env.PM_BLOCKER),
  BLOCK_CHAT: process.env.BLOCK_CHAT || '',
  PUBLIC_MODE: toBool(process.env.PUBLIC_MODE),

  // --- AI extras ---
  MONGODB_URI: trim(process.env.MONGODB_URI),
  OPENAI_API_KEY: trim(process.env.OPENAI_API_KEY),
  ELEVENLAB_API_KEY: trim(process.env.ELEVENLAB_API_KEY),
  AITTS_ID: trim(process.env.AITTS_ID),

  // --- Baileys / runtime ---
  BAILEYS: trim(process.env.BAILEYS, '@whiskeysockets/baileys'),
  HANDLERS: process.env.HANDLERS || '^[.,!]',
  MANGLISH_CHATBOT: toBool(process.env.MANGLISH_CHATBOT),
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  WORKTYPE: trim(process.env.WORKTYPE, 'private'),

  // --- Mock mode (Titan MD extension) ---
  MOCK_MODE: toBool(process.env.MOCK_MODE) || !trim(process.env.SESSION_ID),
};
