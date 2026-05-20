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

Follow these **4 steps** in order. Total time: ~5 minutes.

---

### 🍴 Step 1 — Fork this repository

Click the **Fork** button at the top-right of this page (or use this link):

<a href="https://github.com/tayyabali8677/Titan-MD-WhatsApp-Bot/fork"><img src="https://img.shields.io/badge/Fork%20this%20repo-181717?style=for-the-badge&logo=github&logoColor=white" alt="Fork" /></a>

> 💡 **Why fork first?** A fork gives you your own copy that the deploy buttons can pull from, plus you'll be able to commit changes (custom commands, branding tweaks, environment defaults) without losing them on the next `git pull`.

After forking, your copy lives at `https://github.com/<YOUR-USERNAME>/Titan-MD-WhatsApp-Bot`. Use that URL everywhere below.

---

### 🔑 Step 2 — Generate your SESSION_ID

👉 **Visit [titan-md-session.onrender.com](https://titan-md-session.onrender.com/)** and click the big **Generate SESSION_ID →** button.

<p align="center">
  <a href="https://titan-md-session.onrender.com/"><img src="https://img.shields.io/badge/🚀%20Generate%20SESSION__ID-titan--md--session.onrender.com-7c5cff?style=for-the-badge" alt="Get SESSION_ID" /></a>
</p>

Pick **Pairing Code** *(type an 8-char code into WhatsApp)* or **QR Code** *(scan with your phone)*. Both methods produce the same `TITAN~...` string, which appears on the page **and** is sent to your own WhatsApp number as a backup.

> ⚠️ **Treat `SESSION_ID` like a password.** Anyone with it controls your WhatsApp account. Never commit it to git, never paste it in chats, never share screenshots of the full string.
>
> 💡 *First visit may take ~30s while the free-tier host wakes up. Subsequent visits are instant.*

---

### 🚀 Step 3 — Deploy to a hosting platform

Pick **one** platform below. All deploy buttons reference this repo; replace `tayyabali8677` with your username in the URL if you want them to deploy from your fork instead.

<details open>
<summary><b>🟩 Render</b> — free tier, recommended for first-timers</summary>

<br>

<a href="https://render.com/deploy?repo=https://github.com/tayyabali8677/Titan-MD-WhatsApp-Bot"><img src="https://img.shields.io/badge/Deploy%20to-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" /></a>

1. Click the button above.
2. Sign in with GitHub → authorize Render → pick your fork.
3. Service type: **Background Worker**.
4. Build command: `npm install`
5. Start command: `npm start`
6. Add **Environment Variables** (click "Add" for each):
   - `SESSION_ID` = `TITAN~...` (from Step 2)
   - `OWNER_NUMBER` = `923001234567` (your WA number, no `+`)
   - `SUDO` = `923001234567` (same number)
   - *(optional)* `GEMINI_API_KEY`, `GROQ_API_KEY`, etc.
7. Click **Create Web Service**. Wait ~3 min for first build.
8. Once status is "Live", proceed to Step 4.

</details>

<details>
<summary><b>🟪 Heroku</b> — classic, requires credit card on file</summary>

<br>

<a href="https://heroku.com/deploy?template=https://github.com/tayyabali8677/Titan-MD-WhatsApp-Bot"><img src="https://img.shields.io/badge/Deploy%20to-Heroku-79589F?style=for-the-badge&logo=heroku&logoColor=white" /></a>

1. Click the button above (or go to your fork → click **Deploy to Heroku**).
2. Pick an app name (e.g. `your-titan-md`) and region.
3. Fill the **Config Vars**:
   - `SESSION_ID` = `TITAN~...`
   - `OWNER_NUMBER` = `923001234567`
   - `SUDO` = `923001234567`
4. Click **Deploy app** → wait ~3 min.
5. Go to **Resources** tab → flip the **worker** dyno **ON**.
   - ⚠️ Do NOT enable the `web` dyno — this is a worker, not a web server.
6. Proceed to Step 4.

</details>

<details>
<summary><b>🐋 Koyeb</b> — generous free tier, no credit card</summary>

<br>

<a href="https://app.koyeb.com/deploy?type=git&repository=github.com/tayyabali8677/Titan-MD-WhatsApp-Bot&branch=master"><img src="https://img.shields.io/badge/Deploy%20to-Koyeb-121212?style=for-the-badge&logo=koyeb&logoColor=white" /></a>

1. Sign in with GitHub on Koyeb.
2. **Create Service** → **GitHub** → pick your fork.
3. Build command: `npm install`
4. Run command: `npm run docker`
5. Service type: **Worker**.
6. Environment variables: `SESSION_ID`, `OWNER_NUMBER`, `SUDO` (same as Render above).
7. Click **Deploy**.

</details>

<details>
<summary><b>🚂 Railway</b> — fastest deploys, $5 monthly free credit</summary>

<br>

<a href="https://railway.app/new/template?template=https://github.com/tayyabali8677/Titan-MD-WhatsApp-Bot"><img src="https://img.shields.io/badge/Deploy%20to-Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white" /></a>

1. Sign in with GitHub → **New Project** → **Deploy from GitHub repo** → pick your fork.
2. Railway auto-detects `package.json` + `Procfile`.
3. **Variables** tab → add `SESSION_ID`, `OWNER_NUMBER`, `SUDO`.
4. Click **Deploy**.

</details>

<details>
<summary><b>🖥️ VPS</b> (Ubuntu / Debian — full control)</summary>

<br>

```bash
# 1. SSH into your VPS
ssh root@your-vps-ip

# 2. Install Node.js 20 if not present
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git ffmpeg

# 3. Clone your fork
git clone https://github.com/<YOUR-USERNAME>/Titan-MD-WhatsApp-Bot.git
cd Titan-MD-WhatsApp-Bot

# 4. Install dependencies
npm install

# 5. Create config.env from template and edit
cp config.env.example config.env
nano config.env
# → paste SESSION_ID, OWNER_NUMBER, SUDO and save (Ctrl+O, Enter, Ctrl+X)

# 6. Start the bot (PM2-managed, auto-restart on crash)
npm start

# 7. Persist across reboots
pm2 save
pm2 startup    # follow the printed sudo command
```

To update later: `git pull && npm install && pm2 restart titan-md`

</details>

<details>
<summary><b>🐳 Docker</b> — runs anywhere</summary>

<br>

```bash
docker run -d --name titan-md --restart unless-stopped \
  -e SESSION_ID="TITAN~..." \
  -e OWNER_NUMBER="923001234567" \
  -e SUDO="923001234567" \
  -v $(pwd)/session:/app/session \
  -v $(pwd)/database.db:/app/database.db \
  -e NODE_ENV=production \
  node:20-slim sh -c "git clone https://github.com/<YOUR-USERNAME>/Titan-MD-WhatsApp-Bot /app && cd /app && npm install && npm run docker"
```

Or use the dedicated `web/Dockerfile` pattern in [`web/README.md`](./web/README.md).

</details>

---

### ✅ Step 4 — Verify your bot is alive

Within ~30 seconds of the deploy finishing, your bot should be online on WhatsApp.

From any chat where the bot is a participant (or your own chat with yourself), send:

```
.alive
```

You should get an instant reply like:
```
*Titan MD is alive!* 🚀
Uptime: 0d 0h 0m 30s
By TitanDev — titanmd.site
```

Then try a few more:

```
.help          ← full command list
.menu          ← bordered category view
.ping          ← latency check
.weather Karachi   ← any utility command
```

If `.alive` doesn't respond after 60 seconds:

1. Check your deploy logs — look for `Titan MD connected` or any errors.
2. Verify `SESSION_ID` was pasted **completely** (it's usually 800–1500 chars).
3. Make sure you only have **one** instance running (multiple instances on the same session invalidate each other).
4. If you forked: check that the deploy is pulling from your fork, not the source repo.

### 🛠️ Troubleshooting

<details>
<summary>Bot shows online but doesn't reply to any command</summary>

The `SESSION_ID` was truncated when you pasted it. Re-generate via Step 2 and paste the **full** string (it should start with `TITAN~` and be ~800–1500 chars long).
</details>

<details>
<summary>"Logged out" / "Connection closed" errors after deploy</summary>

Two common causes:
1. **Multiple deploys using the same SESSION_ID** — WhatsApp invalidates the session when it sees the same key from two places. Run only one instance.
2. **You scanned/paired the bot to another device** — anything that re-pairs your WA disconnects the bot. Re-run Step 2 to get a fresh SESSION_ID.

</details>

<details>
<summary>Commands work but say "Sudo only"</summary>

Set the `SUDO` env var to your phone number (no `+`, no spaces). Comma-separate if you want multiple sudo users: `SUDO=923001234567,919812345678`.
</details>

<details>
<summary>Heroku H10 dyno crash immediately on boot</summary>

You enabled the `web` dyno instead of `worker`. Go to Resources tab → disable `web` → enable `worker`.
</details>

<details>
<summary>Database errors on Heroku/Render</summary>

The bot defaults to SQLite (file-based, no config needed). If you want Postgres for persistence across container restarts:
- **Heroku**: add the *Heroku Postgres* add-on → `DATABASE_URL` is auto-provided.
- **Render**: create a Postgres instance → copy the External Database URL → paste as `DATABASE_URL` env var.
- The bot auto-detects and switches drivers based on the URL.

</details>

<details>
<summary>Want to update the bot to the latest version?</summary>

If you forked: go to your fork on GitHub → click **Sync fork** → **Update branch**. Your deploy auto-redeploys (on Render/Railway/Koyeb) or you click **Deploy latest** (Heroku).

If you cloned to a VPS: `git pull && npm install && pm2 restart titan-md`.

</details>

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
