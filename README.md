# Trading Bot Operations Dashboard

A read-only Next.js control surface for monitoring a locally or remotely hosted trading bot. The dashboard turns health, exposure, risk, watchlist, and event APIs into a single operational view without giving the web interface permission to execute trades.

The repository name is historical; the application itself is a focused bot observability dashboard.

## What this project demonstrates

- Server-rendered operational dashboards with Next.js and TypeScript
- API integration with explicit response types
- Read-only architecture for safer production monitoring
- Bearer-token authentication for protected metrics endpoints
- Risk, exposure, PnL, order, and stop-state visualization
- Health monitoring and graceful disconnected-state handling
- Event-feed and agent-watchlist interfaces
- Environment-based configuration for local and hosted deployments

## Dashboard signals

The interface consumes four bot endpoints:

- `GET /health` — service and system health
- `GET /summary` — operating mode, risk caps, exposure, PnL, and orders
- `GET /events?limit=200` — recent operational events
- `GET /agent-watchlist` — monitored wallets and performance data

If the metrics server is unavailable, the page renders a clear disconnected state and setup guidance instead of presenting stale data as live.

## Safety model

This dashboard intentionally has no trade-execution controls. It is an observability layer with optional bearer-token access to the upstream metrics API. Separating monitoring from execution reduces the impact of a compromised public deployment.

## Architecture

```text
src/
├── app/page.tsx             # Server-rendered dashboard
├── app/page.module.css      # Responsive HUD visual system
├── lib/botFetch.ts          # Authenticated, no-cache API client
└── lib/botTypes.ts          # Health, summary, event, and watchlist types
```

Every request is made server-side with `cache: 'no-store'`, ensuring the interface asks the source system for current operational data.

## Technology

Next.js 16 · React 19 · TypeScript · CSS Modules · Vercel

## Run locally

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Create `.env.local` with:

```env
BOT_METRICS_URL=http://127.0.0.1:8787
BOT_METRICS_TOKEN=replace-with-your-token
```

Open `http://localhost:3000`.

`BOT_METRICS_TOKEN` is optional when the upstream service does not require authentication, but authenticated access is recommended whenever the endpoint leaves a trusted local network.

## Deployment

Set `BOT_METRICS_URL` and `BOT_METRICS_TOKEN` in the hosting environment. A hosted dashboard must be able to reach the metrics service; common options include a private network or a locked-down tunnel.

## Validate

```bash
npm run lint
npm run build
```

## Portfolio focus

This project demonstrates the ability to design a useful monitoring surface around an existing automation system while preserving security boundaries, typed API contracts, and honest failure states.
