# Titan MD — Session Generator (Web)

A hosted web UI for generating `SESSION_ID` strings via QR or pairing code.
Mirrors the flow of `scripts/getSession.js` as an HTTP service.

## Run locally

```bash
npm install
npm run web                   # boots on http://localhost:3000
```

Visit `http://localhost:3000`, pick a pairing method, and copy the generated
`TITAN~...` string.

## Deploy

### Render (one-click)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/tayyabali8677/Titan-MD-WhatsApp-Bot)

Render auto-detects `web/render.yaml`. Free tier works fine — the service
spins down after 15 min of inactivity but warms up in ~30s.

### Koyeb / Railway / Vercel

Use these settings:

- **Build command:** `npm install`
- **Start command:** `npm run web`
- **Health check:** `/healthz`
- **Port:** value of `$PORT` env var (default 3000)

### Docker

```bash
docker run -d --name titan-session \
  -p 3000:3000 \
  -e PORT=3000 \
  --restart unless-stopped \
  node:20 sh -c "git clone https://github.com/tayyabali8677/Titan-MD-WhatsApp-Bot /app && cd /app && npm install && npm run web"
```

## API

### `POST /api/session/start`
Body: `{ "method": "qr" | "pair", "phone"?: "923001234567" }`
Returns: `{ "sessionId": "<hex>" }`

### `GET /api/session/:id/events` *(Server-Sent Events)*
Streams JSON events:
```json
{ "status": "qr_ready", "qr": "2@<raw-baileys-qr-data>" }
{ "status": "pair_ready", "pairCode": "ABCD-EFGH" }
{ "status": "success", "sessionString": "TITAN~<base64>" }
{ "status": "error", "error": "Pairing timed out" }
```

### `POST /api/session/:id/cancel`
Aborts an in-progress pairing and cleans up the tmp session dir.

### `GET /healthz`
Returns `{ ok: true, sessions: <count>, uptime: <seconds> }`.

## Security notes

- Sessions are generated in a per-request tmp dir (`web/.tmp-sessions/<random>/`)
  and **deleted after 30 seconds** of being successfully delivered.
- TTL of 5 minutes for unpaired sessions — abandoned ones get cleaned up.
- **The server never logs, stores, or transmits the `SESSION_ID` anywhere
  except the SSE stream back to the client that requested it.**
- That said: if you self-host this, make sure your hosting provider is
  trustworthy. A malicious host could theoretically MITM the SSE response.
- Always run behind HTTPS in production.

## Architecture

```
┌──────────────┐                    ┌──────────────┐
│   Browser    │  POST start ────→  │   Express    │
│              │                    │              │
│              │  SSE stream  ←──── │   Baileys    │  ←─ WhatsApp WS
│              │  qr / code / sid   │  (one per    │
│              │                    │   request)   │
└──────────────┘                    └──────────────┘
```

Each visitor gets an isolated Baileys instance. No global state across visits.
```
