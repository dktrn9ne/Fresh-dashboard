# polymarket-bot-dashboard (read-only)

Next.js dashboard that polls a bot metrics server.

## Why this design
Vercel deployments can't reliably reach your Windows PC unless you expose the bot metrics endpoint (LAN/VPN/Tunnel). This dashboard is **read-only** and assumes the bot runs a small HTTP server that exposes:
- `GET /health`
- `GET /summary`
- `GET /events?limit=200`

## Local dev
```bash
npm i
copy .env.example .env
npm run dev
```
Set `BOT_METRICS_URL` in `.env`.

## Deploy to Vercel
- Push this repo to GitHub
- Import into Vercel
- Set Environment Variables:
  - `BOT_METRICS_URL`
  - (optional) `BOT_METRICS_TOKEN`

## Exposing the bot metrics server
Options:
- Same network: set `BOT_METRICS_URL=http://<your-pc-lan-ip>:8787`
- Safest remote access: Cloudflare Tunnel (recommended) and keep it locked behind `BOT_METRICS_TOKEN`

If you want, I can add token auth + a tiny metrics server to the bot project.
