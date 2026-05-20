/*
 * Titan MD — Panel bootstrap (PM2 version)
 *
 * Upload this file to a Pterodactyl-style panel as your server's `index.js`.
 * Edit the SESSION_ID line below, then click Start in the panel.
 *
 * What this does:
 *   1. Clones the Titan MD repo into ./titan-md if missing
 *   2. Writes ./titan-md/config.env with SESSION_ID + VPS=true
 *   3. Runs `npm install`
 *   4. Starts the bot via PM2 for better process management (memory limits,
 *      restart-on-crash with backoff, log rotation). Falls back to plain
 *      `node index.js` if PM2 isn't available or keeps restart-looping.
 *
 * Use this version if your panel has PM2 (or Node.js with npx access).
 * For panels that only support plain Node.js, use index-node.js instead.
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

function startPm2() {
  const pm2 = spawn('npx', ['pm2', 'start', 'index.js', '--name', 'titan-md', '--attach'], {
    cwd: APP_DIR,
    stdio: ['pipe', 'pipe', 'pipe'],
    shell: process.platform === 'win32',
  })

  let restartCount = 0
  const maxRestarts = 5

  pm2.on('exit', (code) => {
    if (code !== 0) {
      console.log('[titan-md] PM2 exited — falling back to node.')
      startNode()
    }
  })
  pm2.on('error', (e) => {
    console.error('[titan-md] PM2 error: ' + e.message + ' — falling back to node.')
    startNode()
  })

  if (pm2.stderr) {
    pm2.stderr.on('data', (data) => {
      const out = data.toString()
      process.stderr.write(out)
      if (/restart/i.test(out)) {
        restartCount++
        if (restartCount > maxRestarts) {
          console.log('[titan-md] PM2 restart loop — switching to plain node.')
          spawnSync('npx', ['pm2', 'delete', 'titan-md'], { cwd: APP_DIR, stdio: 'inherit', shell: process.platform === 'win32' })
          startNode()
        }
      }
    })
  }
  if (pm2.stdout) {
    pm2.stdout.on('data', (data) => {
      const out = data.toString()
      process.stdout.write(out)
      if (/connected|titan md/i.test(out)) restartCount = 0
    })
  }
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
    console.error('[titan-md] package.json missing — clone failed?')
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

startPm2()
