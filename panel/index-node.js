/*
 * Titan MD — Panel bootstrap (Node.js version)
 *
 * Upload this file to a Pterodactyl-style panel as your server's `index.js`.
 * Edit the SESSION_ID line below, then click Start in the panel.
 *
 * What this does:
 *   1. Clones the Titan MD repo into ./titan-md if missing
 *   2. Writes ./titan-md/config.env with SESSION_ID + VPS=true
 *   3. Runs `npm install` (auto-retried if it fails the first time)
 *   4. Starts the bot via `node index.js` with auto-restart on crash
 *
 * Use this version if your panel only has Node.js (no PM2 / Yarn).
 * For panels with PM2 support, use index-pm2.js instead.
 */
const { spawnSync, spawn } = require('child_process')
const { existsSync, writeFileSync } = require('fs')
const path = require('path')

const SESSION_ID = 'TITAN~paste-your-session-id-here' // ← Edit this line only

const REPO_URL = 'https://github.com/tayyabali8677/Titan-MD-WhatsApp-Bot.git'
const APP_DIR = 'titan-md'

let nodeRestartCount = 0
const maxNodeRestarts = 5
const restartWindow = 30000
let lastRestartTime = Date.now()

function startNode() {
  const child = spawn('node', ['index.js'], { cwd: APP_DIR, stdio: 'inherit' })
  child.on('exit', (code) => {
    if (code !== 0) {
      const now = Date.now()
      if (now - lastRestartTime > restartWindow) nodeRestartCount = 0
      lastRestartTime = now
      nodeRestartCount++
      if (nodeRestartCount > maxNodeRestarts) {
        console.error('[titan-md] crashing in a loop — stopping retries.')
        return
      }
      console.log(`[titan-md] exit ${code}, restarting (attempt ${nodeRestartCount})`)
      startNode()
    }
  })
}

function installDependencies() {
  console.log('[titan-md] installing dependencies (npm install)...')
  const r = spawnSync('npm', ['install', '--no-audit', '--no-fund', '--loglevel', 'error'], {
    cwd: APP_DIR,
    stdio: 'inherit',
    env: { ...process.env, CI: 'true' },
    shell: process.platform === 'win32',
  })
  if (r.error || r.status !== 0) {
    console.error('[titan-md] dependency install failed: ' + (r.error ? r.error.message : 'exit ' + r.status))
    process.exit(1)
  }
}

function ensureDependencies() {
  if (!existsSync(path.resolve(APP_DIR, 'package.json'))) {
    console.error('[titan-md] package.json missing from ' + APP_DIR + ' — clone failed?')
    process.exit(1)
  }
  if (!existsSync(path.resolve(APP_DIR, 'node_modules'))) {
    installDependencies()
  }
}

function cloneRepository() {
  console.log('[titan-md] cloning ' + REPO_URL + ' into ./' + APP_DIR + ' ...')
  const r = spawnSync('git', ['clone', REPO_URL, APP_DIR], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })
  if (r.error || r.status !== 0) {
    console.error('[titan-md] clone failed: ' + (r.error ? r.error.message : 'exit ' + r.status))
    process.exit(1)
  }
  try {
    writeFileSync(path.resolve(APP_DIR, 'config.env'), `VPS=true\nSESSION_ID=${SESSION_ID}\n`)
  } catch (e) {
    console.error('[titan-md] could not write config.env: ' + e.message)
    process.exit(1)
  }
  installDependencies()
}

if (!existsSync(APP_DIR)) {
  cloneRepository()
} else {
  ensureDependencies()
}

startNode()
