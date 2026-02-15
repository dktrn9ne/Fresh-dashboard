import { AgentWatchlist, BotEvent, BotHealth, BotSummary } from './botTypes';

function baseUrl() {
  const url = process.env.BOT_METRICS_URL;
  if (!url) throw new Error('BOT_METRICS_URL is not set');
  return url.replace(/\/$/, '');
}

function headers() {
  const token = process.env.BOT_METRICS_TOKEN;
  return token ? { 'Authorization': `Bearer ${token}` } : undefined;
}

export async function fetchHealth(): Promise<BotHealth> {
  const res = await fetch(`${baseUrl()}/health`, { headers: headers(), cache: 'no-store' });
  if (!res.ok) throw new Error(`health: HTTP ${res.status}`);
  return res.json();
}

export async function fetchSummary(): Promise<BotSummary> {
  const res = await fetch(`${baseUrl()}/summary`, { headers: headers(), cache: 'no-store' });
  if (!res.ok) throw new Error(`summary: HTTP ${res.status}`);
  return res.json();
}

export async function fetchEvents(limit = 200): Promise<BotEvent[]> {
  const res = await fetch(`${baseUrl()}/events?limit=${limit}`, { headers: headers(), cache: 'no-store' });
  if (!res.ok) throw new Error(`events: HTTP ${res.status}`);
  return res.json();
}

export async function fetchAgentWatchlist(): Promise<AgentWatchlist> {
  const res = await fetch(`${baseUrl()}/agent-watchlist`, { headers: headers(), cache: 'no-store' });
  if (!res.ok) throw new Error(`agent-watchlist: HTTP ${res.status}`);
  return res.json();
}
