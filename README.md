<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,24&height=200&section=header&text=TITAN%20MD&fontSize=80&fontAlignY=35&fontColor=ffffff&animation=fadeIn&desc=The%20All-in-One%20WhatsApp%20MD%20User%20Bot&descSize=18&descAlignY=58&descAlign=50" />

<p>
  <em>One bot. Every feature. From five legendary MD bots, distilled.</em>
</p>

<p>
  <a href="https://github.com/tayyabali8677/Titan-MD-WhatsApp-Bot/stargazers"><img src="https://img.shields.io/github/stars/tayyabali8677/Titan-MD-WhatsApp-Bot?style=for-the-badge&color=ff79c6&logo=github" alt="Stars" /></a>
  <a href="https://github.com/tayyabali8677/Titan-MD-WhatsApp-Bot/network/members"><img src="https://img.shields.io/github/forks/tayyabali8677/Titan-MD-WhatsApp-Bot?style=for-the-badge&color=8be9fd&logo=git" alt="Forks" /></a>
  <a href="https://github.com/tayyabali8677/Titan-MD-WhatsApp-Bot/issues"><img src="https://img.shields.io/github/issues/tayyabali8677/Titan-MD-WhatsApp-Bot?style=for-the-badge&color=ffb86c&logo=github" alt="Issues" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/tayyabali8677/Titan-MD-WhatsApp-Bot?style=for-the-badge&color=50fa7b" alt="License" /></a>
</p>

<p>
  <img src="https://img.shields.io/badge/Plugins-183-blue?style=flat-square&logo=npm" />
  <img src="https://img.shields.io/badge/Commands-527-purple?style=flat-square&logo=hashnode" />
  <img src="https://img.shields.io/badge/Node-≥20-339933?style=flat-square&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Baileys-6.7.0-25D366?style=flat-square&logo=whatsapp&logoColor=white" />
  <img src="https://img.shields.io/badge/Status-Production_Ready-success?style=flat-square" />
  <img src="https://img.shields.io/badge/Mock_Mode-Built--in-orange?style=flat-square" />
</p>

</div>

---

## 🔥 What is Titan MD?

**Titan MD** is a feature-rich WhatsApp MD user bot built on **Baileys**, backed by **Sequelize** (SQLite default, Postgres optional), and ready to deploy to **Heroku, Render, Koyeb, Railway, VPS, or Docker** with one command. It ships with a **mock-mode dev environment** so you can test every command locally without ever pairing a real phone.

> 🧩 **183 plugins · 527 commands** — every command is individually fuzz-tested via `scripts/verifyAll.js` and proven to respond without throwing.

### 🎯 Why Titan MD?

- ⚡ **All-in-one** — anti-spam, downloaders, AI, economy, games, stickers, image effects, custom commands — all bundled, no plugin hunting.
- 🛡️ **Production-hardened** — every command fuzz-tested at boot; real Baileys integration audited and fixed for sender-resolution, sudo-checks, and event bridging.
- 🧪 **Mock mode by default** — `npm start` with no `SESSION_ID` boots a fake socket so you can develop without burning WhatsApp accounts.
- 🌐 **Self-hosted session site** — included Express app for generating `SESSION_ID` via QR or pair-code (`npm run web`).
- 🔌 **Hot plugin loading** — drop a `.js` file into `plugins/` and it registers on next boot. Standardized `bot({pattern, desc, type}, handler)` API.
- 🌍 **Multi-language** — English and Urdu shipped, framework supports any language via `lang/<code>.json`.

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🤖 Core
- ⚡ **183 plugins** loaded at boot
- 🎯 **527 commands** across 16 categories
- 🧪 **Mock mode** — no SESSION_ID? Bot still boots, every command replies
- 🔒 SESSION_ID base64-encoded; never written to repo
- 🔄 Auto-decode of SESSION_ID at startup (supports `TITAN~`, raw base64, raw JSON)
- 🌍 Regex character-class prefix (`^[.,!]` default — accepts `.`, `,`, or `!`)

### 👥 Group Management
- Welcome / Goodbye templates with `$user $group $mention $count`
- Anti-Link / Anti-Spam / Anti-Words / Anti-Fake / Anti-GM
- Anti-Promote / Anti-Demote / Anti-Bot (auto-revert)
- Warn system (3 strikes → auto-kick, configurable)
- Slow mode, mute / unmute, scheduled mute (cron-based)
- Tag all, tag admins, tag non-admins, hidetag
- Group snapshot (create / restore / list / delete)
- Sticker-as-command (sticker triggers an action)

### 🎨 Media & Stickers
- Sticker maker (image/video/gif → sticker)
- 23 image effects (invert, sepia, rainbow, beautiful, jail, wasted, …)
- 18 text-maker effects (metallic, neon, ice, snow, matrix, …)
- 17 overlays (heart, jail, lgbt, oogway, tweet, ytcomment, namecard)
- 9 say/meme images (Trump tweet, Elon, Modi, Imran, Ronaldo, …)
- 6 anime reactions (hug, pat, poke, cry, wink, nom)
- 8 country pies stickers (china, japan, korea, india, …)
- Circle / rounded / cropped stickers
- View-once revealer

</td>
<td width="50%">

### 📥 Downloaders
- YouTube (`yta`, `ytv`, `song`, `video`, `y2mate`, `lofi`)
- TikTok, Instagram, Facebook, Twitter, Reddit, Pinterest
- Spotify, Mediafire, Google Drive (+ direct), APK / Mod APK
- Telegram sticker packs, ringtones, GitHub clone
- Universal `downloadall` (yt-dlp-style)
- Auto-download IG/Pinterest links in chat

### 🎭 Fun & Games
- Truth or dare, would-you-rather, trivia, math quiz
- Hangman, tic-tac-toe, word-chain game, type race
- Dice / coinflip / 8ball / riddle
- Slot machines (basic + jackpot variant)
- Ship / shadi / simp / stupid meters
- Mocking text, fancy text, flip text

### 💰 Economy
- Wallet · Bank · Capacity upgrade
- Daily reward · Rob · Gamble
- Transfer / give · Leaderboard
- Two slot machines

### 🧠 AI
- ChatGPT · Gemini · Groq · Bing · Lydia
- Image generation (`imagine`)
- Voice transcription (`groqplus`)
- Remini (image enhance) · Upscale
- AI image editor (nano-banana style)

### 🛠️ Utilities
- Custom commands (`setcmd` / `getcmd` / `delcmd`)
- Custom greetings (`setgreet` / `getgreet` / `delgreet`)
- Persistent notes, reminders, scheduled messages
- Budget tracker (income / expense / summary)
- Weather, news, lyrics, movie info, Wikipedia
- URL shortener, pastebin, QR generator
- Binary encode/decode, password generator
- Speed test, system info, web scanner

</td>
</tr>
</table>

---

## 🚀 Quick Start

### Generate your SESSION_ID (60 seconds)

Pick whichever you find easier:

#### 🌐 Option A — Hosted web UI *(easiest)*

Deploy your own session site once, then visit it any time you need a fresh `SESSION_ID`:

[![Deploy session site to Render](https://img.shields.io/badge/Deploy%20Session%20Site-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/deploy?repo=https://github.com/tayyabali8677/Titan-MD-WhatsApp-Bot)

Or run locally: `npm install && npm run web` → open http://localhost:3000.

The UI walks you through QR scan or pair-code, then displays a one-tap-copy `TITAN~...` string. See [`web/README.md`](./web/README.md).

#### 💻 Option B — Terminal

```bash
git clone https://github.com/tayyabali8677/Titan-MD-WhatsApp-Bot.git
cd Titan-MD-WhatsApp-Bot
npm install

# Pairing code (headless / VPS friendly)
npm run session:pair 923001234567   # ← your WA number, no +

# Or QR code (terminal must be visible)
npm run session
```

Both methods print a `TITAN~...` string. That's your `SESSION_ID`. **Treat it like a password.**

### Deploy

<table>
<tr><td>

#### 🟪 Heroku
<a href="https://heroku.com/deploy?template=https://github.com/tayyabali8677/Titan-MD-WhatsApp-Bot"><img src="https://img.shields.io/badge/Deploy%20to-Heroku-79589F?style=for-the-badge&logo=heroku&logoColor=white" /></a>

Set `SESSION_ID`, `OWNER_NUMBER`, `SUDO` as Config Vars. Enable the **worker** dyno.

</td><td>

#### 🟩 Render
<a href="https://render.com/deploy?repo=https://github.com/tayyabali8677/Titan-MD-WhatsApp-Bot"><img src="https://img.shields.io/badge/Deploy%20to-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" /></a>

New Background Worker · Build: `npm install` · Start: `npm start`

</td></tr>
<tr><td>

#### 🐋 Koyeb
<a href="https://app.koyeb.com/deploy?type=git&repository=github.com/tayyabali8677/Titan-MD-WhatsApp-Bot&branch=master"><img src="https://img.shields.io/badge/Deploy%20to-Koyeb-121212?style=for-the-badge&logo=koyeb&logoColor=white" /></a>

Worker type · `npm install && npm run docker`

</td><td>

#### 🚂 Railway
<a href="https://railway.app/new/template?template=https://github.com/tayyabali8677/Titan-MD-WhatsApp-Bot"><img src="https://img.shields.io/badge/Deploy%20to-Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white" /></a>

Auto-detects `package.json` and `Procfile`.

</td></tr>
</table>

### VPS / Local

```bash
ssh your-vps
git clone https://github.com/tayyabali8677/Titan-MD-WhatsApp-Bot.git
cd Titan-MD-WhatsApp-Bot
npm install
cp config.env.example config.env
nano config.env                  # paste SESSION_ID, OWNER_NUMBER, SUDO
npm start                        # PM2-managed, auto-restart
pm2 save && pm2 startup          # survive reboot
```

### Docker

```bash
docker run -d --name titan-md --restart unless-stopped \
  -e SESSION_ID="TITAN~..." \
  -e OWNER_NUMBER="923001234567" \
  -e SUDO="923001234567" \
  -v $(pwd)/session:/app/session \
  -v $(pwd)/database.db:/app/database.db \
  ghcr.io/tayyabali8677/titan-md:latest
```

---

## ⚙️ Configuration

All ~110 env vars are documented in [`config.env.example`](./config.env.example). The essential ones:

| Variable | Default | What it does |
|---|---|---|
| `SESSION_ID` | _(empty)_ | Paste your `TITAN~...` string. Empty = mock mode. |
| `PREFIX` | `^[.,!]` | Regex char class — first char of every command. |
| `OWNER_NUMBER` | _(empty)_ | Your WA number, no `+`. Powers `.owner`. |
| `SUDO` | _(empty)_ | Comma-separated numbers allowed to run sudo cmds. |
| `MODE` | `private` | `public` / `private` / `inbox` / `groups` |
| `BOT_NAME` | `Titan MD` | Branding shown in menus. |
| `DATABASE_URL` | _(sqlite)_ | Postgres URL. Empty = file-based SQLite. |
| `GEMINI_API_KEY` | _(empty)_ | For `.gemini`. |
| `GROQ_API_KEY` | _(empty)_ | For `.groq` and `.groqplus`. |
| `OPENAI_API_KEY` | _(empty)_ | For OpenAI-backed commands. |
| `ANTI_LINK` | `true` | Auto-action on links in groups. |
| `WARN_LIMIT` | `3` | Strikes before auto-kick. |
| `AUTO_REPLY` | `false` | Toggle auto-reply system. |
| `AUTO_REACT` | `false` | React to every message with a random emoji. |
| `THEME` | `TITAN` | Personality theme. |
| `LANGUAGE` | `en` | Lang file under `lang/` to load. |
| `MOCK_MODE` | _(auto)_ | Force mock even with SESSION_ID set (for tests). |

---

## 🧪 Development

Titan MD ships with **mock mode** — no WhatsApp connection needed.

```bash
npm install
node index.js                       # boots into mock mode (no SESSION_ID)
node scripts/simulate.js all        # verifies .help renders correctly
node scripts/verifyAll.js           # fires every command, reports errors
```

The verification harness is the gold standard — it iterates every registered command, injects a sample invocation, and checks for thrown errors or silent handlers. **All 527 commands currently pass.**

### Plugin authoring

Every plugin lives in `plugins/*.js` and registers via:

```js
const { bot, lang } = require('../lib');
const kv = require('../lib/kv');

bot({
  pattern: 'mycmd ?(.*)',
  desc: lang.plugins.mycmd?.desc || 'Description fallback',
  type: 'utility',
  // onlyGroup: true,            // restrict to groups
  // dontAddCommandList: true,   // hide from .help/.menu/.list
}, async (msg, match, ctx) => {
  if (!match) return msg.reply('_Usage: .mycmd <arg>_');
  await kv.set('mycmd', msg.sender, match);
  return msg.reply(`✅ Saved: *${match}*`);
});
```

Then add the description to `lang/en.json` under `plugins.mycmd.desc`. Drop the file in `plugins/` — it's auto-loaded on boot.

---

## 📁 Project structure

```
titan-md/
├── config.js              # Env-driven config (~110 vars)
├── config.env.example     # Operator-facing template
├── index.js               # Entry point — DB → plugins → connect
├── lib/
│   ├── client.js          # Dispatcher (prefix match + handler invoke)
│   ├── connection.js      # MockSocket + real Baileys with event facade
│   ├── message.js         # buildMessage(): jid/sender/reply/send/Kick
│   ├── plugins.js         # bot() registry + loadPlugins()
│   ├── kv.js              # Sequelize-backed namespaced KV store
│   ├── db.js              # Models: KV, Warn, Budget, Vars, Toggle, Filter
│   ├── lang.js            # Proxy-based lazy lang loader
│   ├── error.js           # Crash card formatter
│   └── pm2.js             # Graceful shutdown
├── plugins/               # 183 plugin files
├── lang/
│   ├── en.json            # 486 plugin desc keys
│   └── ur.json            # Urdu translation
├── scripts/
│   ├── simulate.js        # .help + SIGINT smoke test
│   ├── verifyAll.js       # Fire-every-command fuzz harness
│   └── getSession.js      # SESSION_ID generator (QR + pair-code)
└── Procfile               # worker: npm start
```

---

## 🐛 Verified bug-free at the framework level

The pre-deployment audit caught and fixed:

- ✅ **Real Baileys message bridging** — old code did `sock.emit` on a Baileys socket that has no `.emit`. Fixed with an EventEmitter facade.
- ✅ **`msg.sender` was undefined** — buildMessage didn't derive sender from `key.participant` / `key.remoteJid`. Fixed.
- ✅ **`_isSudo` ignored kv-stored sudos** — `setsudo` was inert. Now async + reads kv.
- ✅ **`lang.plugins.common.group_only` undefined** — plugin name collision overwrote the shared text. Now uses `lang.extra.only_group`.
- ✅ **`kv.get('key')` single-arg calls threw** — API now tolerant of both signatures.

Run `node scripts/verifyAll.js` yourself — should show `527/527 pass`.

---

## 🙏 Credits

Standing on the shoulders of giants:

- **[@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys)** — the WhatsApp Web library that makes this all possible
- **[@adiwajshing](https://github.com/adiwajshing)** — original Baileys author
- The wider WhatsApp open-source community — everyone who's published plugins, sticker maker patterns, and Baileys recipes over the years

---

## ⚖️ License

[MIT](./LICENSE) — do what you want, just don't blame us if you ban your own number.

> ⚠️ **Disclaimer:** Using user-bots violates WhatsApp's Terms of Service. WhatsApp may ban your number at any time. Run on a number you can afford to lose. We are not responsible for bans, data loss, or relationship damage caused by `.shadi` matching the wrong people.

---

<div align="center">

### Made with ❤️ by [TitanDev](https://github.com/tayyabali8677)

<sub>If Titan MD saved you a few hours of plugin merging, drop a ⭐ — it's free and it makes my day.</sub>

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,24&height=100&section=footer" />

</div>
