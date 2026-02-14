import styles from './page.module.css';
import { fetchEvents, fetchHealth, fetchSummary } from '@/lib/botFetch';

function money(n: number) {
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
}

export default async function Home() {
  let health: any = null;
  let summary: any = null;
  let events: any[] = [];
  let error: string | null = null;

  try {
    health = await fetchHealth();
    summary = await fetchSummary();
    events = await fetchEvents(200);
  } catch (e: any) {
    error = e?.message ?? String(e);
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.h1}>Polymarket Bot Dashboard (read-only)</h1>

        {error ? (
          <div className={styles.card}>
            <h2>Not connected</h2>
            <p>
              Set <code>BOT_METRICS_URL</code> (and optionally <code>BOT_METRICS_TOKEN</code>) in your environment.
            </p>
            <pre className={styles.pre}>{error}</pre>
          </div>
        ) : (
          <>
            <div className={styles.grid}>
              <div className={styles.card}>
                <h2>Health</h2>
                <div><b>OK:</b> {String(health?.ok)}</div>
                <div><b>Name:</b> {health?.name ?? '—'}</div>
                <div><b>Version:</b> {health?.version ?? '—'}</div>
                <div><b>Time:</b> {health?.ts ?? '—'}</div>
              </div>

              <div className={styles.card}>
                <h2>Mode</h2>
                <div><b>DRY_RUN:</b> {String(summary?.mode?.dryRun)}</div>
                <div><b>LIVE_TRADING:</b> {String(summary?.mode?.liveTrading)}</div>
                <div><b>STOP_TRADING:</b> {String(summary?.mode?.stopTrading)}</div>
              </div>

              <div className={styles.card}>
                <h2>Exposure</h2>
                <div><b>Total exposure:</b> {money(summary?.exposure?.totalExposureUsd ?? 0)}</div>
                <div><b>Open orders:</b> {summary?.exposure?.openOrders ?? 0}</div>
                <div><b>Realized PnL today:</b> {money(summary?.exposure?.realizedPnlTodayUsd ?? 0)}</div>
              </div>

              <div className={styles.card}>
                <h2>Risk caps</h2>
                <div><b>Max per trade:</b> {money(summary?.risk?.maxPerTradeUsd ?? 0)}</div>
                <div><b>Max per market:</b> {money(summary?.risk?.maxPerMarketUsd ?? 0)}</div>
                <div><b>Max total:</b> {money(summary?.risk?.maxTotalExposureUsd ?? 0)}</div>
                <div><b>Max daily loss:</b> {money(summary?.risk?.maxDailyLossUsd ?? 0)}</div>
              </div>
            </div>

            <div className={styles.card}>
              <h2>Recent events</h2>
              <div className={styles.events}>
                {events.slice(0, 200).map((ev, idx) => (
                  <div key={idx} className={styles.eventRow}>
                    <div className={styles.eventTs}>{ev.ts}</div>
                    <div className={styles.eventLvl}>{ev.level}</div>
                    <div className={styles.eventMsg}>{ev.msg}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
