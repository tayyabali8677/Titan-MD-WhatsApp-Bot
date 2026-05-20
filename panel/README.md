# Titan MD — Panel deploy bootstrap

Pterodactyl-style panels (Bot-Hosting.net, MxGaming, SkyportPanel, etc.) don't
let you run arbitrary shell commands. Instead, you upload one `index.js` file
and the panel runs it as your "main file". This directory holds two such
bootstraps.

## Which file do I use?

| File | When to use it |
|---|---|
| `index-node.js` | Your panel only has Node.js (no PM2, no Yarn). The most common case. |
| `index-pm2.js`  | Your panel has PM2 or `npx pm2` works in the console. Better restart logic. |

If you don't know, **start with `index-node.js`**. It just works.

## How to deploy

1. **Download** one of the two files from your fork:
   - https://raw.githubusercontent.com/tayyabali8677/Titan-MD-WhatsApp-Bot/master/panel/index-node.js
   - https://raw.githubusercontent.com/tayyabali8677/Titan-MD-WhatsApp-Bot/master/panel/index-pm2.js

2. **Open the file in any text editor** and find this line near the top:
   ```js
   const SESSION_ID = 'TITAN~paste-your-session-id-here' // ← Edit this line only
   ```
   Replace `TITAN~paste-your-session-id-here` with your real `SESSION_ID`
   (from [titan-md-session.onrender.com](https://titan-md-session.onrender.com/)).

3. **Upload to your panel's file manager** as `index.js` at the root of your server's working directory.

4. **In the panel's Startup tab**, make sure:
   - Startup command: `node index.js` (or whatever the panel default is)
   - Main file: `index.js`

5. **Click Start**. The bot will:
   - Clone the repo into `./titan-md/` (only on first run)
   - Run `npm install` (may take 2–3 minutes the first time)
   - Boot the bot with your SESSION_ID

You should see `Titan MD v1.0.0 — plugins: 183` in the console within ~3 minutes.

## What about updates?

After the first run, the bot exists in `./titan-md/`. To pull the latest version,
either delete that folder (the bootstrap will re-clone on next start) or open
the panel console and run:

```bash
cd titan-md && git pull && npm install
```

Then restart your server in the panel.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `git: command not found` | Your panel doesn't have git. Try a different panel provider, or upload the repo zip manually. |
| `npm install` keeps failing | The panel's memory is too low. Pick a panel plan with ≥512 MB RAM. |
| Bot starts but doesn't respond | Check `SESSION_ID` in your `index.js` — it should match the one shown on the session site. |
| Constant restart loop | Open the panel console; look for the actual error. Common causes: missing `ffmpeg`, expired SESSION_ID. |
