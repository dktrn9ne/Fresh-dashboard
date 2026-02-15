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

  const connected = !error;

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandKicker}>FRESH DASHBOARD</div>
          <div className={styles.brandTitle}>Polymarket Bot</div>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navItem}>
            <div className={styles.navItemLabel}>Overview</div>
            <div className={styles.navItemKey}>F1</div>
          </div>
          <div className={styles.navItem}>
            <div className={styles.navItemLabel}>Analyzer</div>
            <div className={styles.navItemKey}>F2</div>
          </div>
          <div className={styles.navItem}>
            <div className={styles.navItemLabel}>Data</div>
            <div className={styles.navItemKey}>F3</div>
          </div>
          <div className={styles.navItem}>
            <div className={styles.navItemLabel}>Search</div>
            <div className={styles.navItemKey}>F4</div>
          </div>
          <div className={styles.navItem}>
            <div className={styles.navItemLabel}>Settings</div>
            <div className={styles.navItemKey}>F5</div>
          </div>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.statusPill}>
            <span className={`${styles.dot} ${connected ? styles.dotOk : styles.dotBad}`} />
            {connected ? 'Connected' : 'Not connected'}
          </div>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.h1}>Dashboard</h1>
            <div className={styles.sub}>
              Read-only telemetry from your bot. Theme: <b>orange/black</b>.
            </div>
          </div>

          <div className={styles.metrics}>
            <div className={styles.chip}>
              OS <b>{health?.os ?? '—'}</b>
            </div>
            <div className={styles.chip}>
              Uptime <b>{health?.uptimeDays != null ? `${health.uptimeDays}d` : '—'}</b>
            </div>
            <div className={styles.chip}>
              Version <b>{health?.version ?? '—'}</b>
            </div>
          </div>
        </header>

        {error ? (
          <div className={`${styles.card} ${styles.span12}`}>
            <h2>Not connected</h2>
            <div className={styles.bigSub}>
              Set <code>BOT_METRICS_URL</code> (and optionally <code>BOT_METRICS_TOKEN</code>) in your environment.
            </div>
            <pre className={styles.pre}>{error}</pre>
          </div>
        ) : (
          <>
            <section className={styles.grid}>
              <div className={`${styles.card} ${styles.span4}`}>
                <h2>Health</h2>
                <div className={styles.cardRow}>
                  <div className={styles.cardLabel}>OK</div>
                  <div className={styles.cardValue}>{String(health?.ok)}</div>
                </div>
                <div className={styles.cardRow}>
                  <div className={styles.cardLabel}>Name</div>
                  <div className={styles.cardValue}>{health?.name ?? '—'}</div>
                </div>
                <div className={styles.cardRow}>
                  <div className={styles.cardLabel}>Time</div>
                  <div className={styles.cardValue}>{health?.ts ?? '—'}</div>
                </div>
              </div>

              <div className={`${styles.card} ${styles.span4}`}>
                <h2>Exposure</h2>
                <div className={styles.bigNumber}>{money(summary?.exposure?.totalExposureUsd ?? 0)}</div>
                <div className={styles.bigSub}>Total exposure</div>
                <div className={styles.cardRow}>
                  <div className={styles.cardLabel}>Open orders</div>
                  <div className={styles.cardValue}>{summary?.exposure?.openOrders ?? 0}</div>
                </div>
                <div className={styles.cardRow}>
                  <div className={styles.cardLabel}>Realized PnL today</div>
                  <div className={styles.cardValue}>{money(summary?.exposure?.realizedPnlTodayUsd ?? 0)}</div>
                </div>
              </div>

              <div className={`${styles.card} ${styles.span4}`}>
                <h2>Mode</h2>
                <div className={styles.cardRow}>
                  <div className={styles.cardLabel}>DRY_RUN</div>
                  <div className={styles.cardValue}>{String(summary?.mode?.dryRun)}</div>
                </div>
                <div className={styles.cardRow}>
                  <div className={styles.cardLabel}>LIVE_TRADING</div>
                  <div className={styles.cardValue}>{String(summary?.mode?.liveTrading)}</div>
                </div>
                <div className={styles.cardRow}>
                  <div className={styles.cardLabel}>STOP_TRADING</div>
                  <div className={styles.cardValue}>{String(summary?.mode?.stopTrading)}</div>
                </div>
              </div>

              <div className={`${styles.card} ${styles.span6}`}>
                <h2>Risk caps</h2>
                <div className={styles.cardRow}>
                  <div className={styles.cardLabel}>Max per trade</div>
                  <div className={styles.cardValue}>{money(summary?.risk?.maxPerTradeUsd ?? 0)}</div>
                </div>
                <div className={styles.cardRow}>
                  <div className={styles.cardLabel}>Max per market</div>
                  <div className={styles.cardValue}>{money(summary?.risk?.maxPerMarketUsd ?? 0)}</div>
                </div>
                <div className={styles.cardRow}>
                  <div className={styles.cardLabel}>Max total</div>
                  <div className={styles.cardValue}>{money(summary?.risk?.maxTotalExposureUsd ?? 0)}</div>
                </div>
                <div className={styles.cardRow}>
                  <div className={styles.cardLabel}>Max daily loss</div>
                  <div className={styles.cardValue}>{money(summary?.risk?.maxDailyLossUsd ?? 0)}</div>
                </div>
              </div>

              <div className={`${styles.card} ${styles.span6}`}>
                <h2>Events</h2>
                <div className={styles.bigSub}>Last 200 (newest first)</div>
                <div className={styles.events}>
                  {events.slice(0, 200).map((ev, idx) => {
                    const lvl = String(ev.level || '').toLowerCase();
                    const lvlClass = lvl.includes('error')
                      ? styles.lvlError
                      : lvl.includes('warn')
                      ? styles.lvlWarn
                      : styles.lvlInfo;
                    return (
                      <div key={idx} className={styles.eventRow}>
                        <div className={styles.eventTs}>{ev.ts}</div>
                        <div className={`${styles.eventLvl} ${lvlClass}`}>{ev.level}</div>
                        <div className={styles.eventMsg}>{ev.msg}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
