import styles from './page.module.css';
import { fetchEvents, fetchHealth, fetchSummary } from '@/lib/botFetch';

function money(n: number) {
  return n.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  });
}

function safe(n: any, fallback: string) {
  return n == null ? fallback : String(n);
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

  // Simple faux stats for the HUD style (until your API exposes these explicitly)
  const os = safe(health?.os ?? health?.platform, '—');
  const mem = safe(health?.memoryMb ?? health?.memMb, '—');
  const cpu = safe(health?.cpu ?? health?.cpuModel, '—');
  const tasks = safe(summary?.tasks?.total ?? summary?.tasksTotal, '—');
  const running = safe(summary?.tasks?.running ?? summary?.tasksRunning, '—');
  const uptime = safe(health?.uptimeDays != null ? `${health.uptimeDays} DAYS` : health?.uptime, '—');

  return (
    <div className={styles.screen}>
      <div className={styles.frame}>
        <div className={styles.grid}>
          {/* HUD TOP */}
          <div className={styles.hudLeft}>
            <div className={styles.hash}>9eab62e327dbff6ca4d071f9ff0dfc9</div>
            <div className={styles.khz}>
              <div className={styles.khzRow}>
                <span className={styles.khzArrow}>&gt;</span>
                <span>2.10032 Khz</span>
              </div>
              <div className={styles.khzRow}>
                <span className={styles.khzArrow}>&gt;</span>
                <span>5.66421 Khz</span>
              </div>
            </div>
          </div>

          <div className={styles.hudCenter}>
            <div className={styles.gaugeLabel}>LOAD</div>
            <div className={styles.gauge}>
              <div className={styles.gaugeMarker} />
            </div>
          </div>

          <div className={styles.hudRight}>
            <div className={styles.sysTitle}>System Information</div>
            <div className={styles.sysGrid}>
              <div className={styles.sysRow}>
                <div className={styles.sysKey}>OS:</div>
                <div className={styles.sysVal}>{os}</div>
              </div>
              <div className={styles.sysRow}>
                <div className={styles.sysKey}>MEMORY:</div>
                <div className={styles.sysVal}>{mem}</div>
              </div>
              <div className={styles.sysRow}>
                <div className={styles.sysKey}>CPU:</div>
                <div className={styles.sysVal}>{cpu}</div>
              </div>
              <div className={styles.sysRow}>
                <div className={styles.sysKey}>TASKS:</div>
                <div className={styles.sysVal}>
                  {tasks} TOTAL ({running} RUNNING)
                </div>
              </div>
              <div className={styles.sysRow}>
                <div className={styles.sysKey}>UPTIME:</div>
                <div className={styles.sysVal}>{uptime}</div>
              </div>
            </div>
          </div>

          {/* MENU */}
          <div className={styles.menu}>
            {[
              ['F1', 'Menu'],
              ['F2', 'Analyzer'],
              ['F3', 'Data'],
              ['F4', 'Search'],
              ['F5', 'Settings'],
              ['F6', 'Help'],
              ['F7', 'Quit'],
            ].map(([k, label]) => (
              <div key={k} className={styles.menuItem}>
                <div className={styles.menuKey}>{k}</div>
                <div className={styles.menuName}>{label}</div>
              </div>
            ))}
          </div>

          {/* CENTER */}
          <div className={styles.center}>
            <div className={styles.hero}>
              <span>DKTR N9NE</span>
              <span>SYSTEMS</span>
            </div>
          </div>

          {/* BOTTOM LEFT */}
          <div className={styles.bottomLeft}>
            <div className={styles.panel}>
              <div className={styles.panelTitle}>Memory Usage</div>
              <div className={styles.memMeta}>
                <div>In use: {safe(health?.memoryInUseMb, '—')} MB</div>
                <div>Available: {safe(health?.memoryAvailableMb, '—')} MB</div>
                {!connected && <div style={{ color: 'rgba(255, 255, 255, 0.55)' }}>Not connected</div>}
              </div>
              <div className={styles.miniBars}>
                {[0.82, 0.38, 0.58, 0.22, 0.66].map((h, i) => (
                  <div key={i} className={styles.bar} style={{ height: `${Math.round(h * 84)}px` }} />
                ))}
              </div>
            </div>

            <div className={styles.panel}>
              <div className={styles.panelTitle}>Grid</div>
              <div className={styles.gridMini}>
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className={styles.gridCell} />
                ))}
              </div>
            </div>
          </div>

          {/* BOTTOM RIGHT */}
          <div className={styles.bottomRight}>
            <div className={styles.chartHead}>
              <div className={styles.chartTitle}>Network Analyzer</div>
              <div className={styles.chartSub}>{safe(summary?.net?.mbps ?? summary?.mbps, '—')} Mbps</div>
            </div>
            <div className={styles.spark} />
          </div>
        </div>

        {/* Data panels below (optional) */}
        {connected && (
          <div style={{ marginTop: 14, display: 'grid', gap: 14 }}>
            {/* Quick summary strip */}
            <div className={styles.panel}>
              <div className={styles.panelTitle}>Bot Summary</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginTop: 10 }}>
                <div>
                  <div style={{ opacity: 0.7, fontSize: 12 }}>Total exposure</div>
                  <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.92)' }}>
                    {money(summary?.exposure?.totalExposureUsd ?? 0)}
                  </div>
                </div>
                <div>
                  <div style={{ opacity: 0.7, fontSize: 12 }}>Open orders</div>
                  <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.92)' }}>
                    {summary?.exposure?.openOrders ?? 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Events */}
            <div className={styles.panel}>
              <div className={styles.panelTitle}>Recent Events</div>
              <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
                {events.slice(0, 20).map((ev, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '160px 86px 1fr',
                      gap: 12,
                      padding: '10px 12px',
                      borderRadius: 10,
                      border: '1px solid rgba(255,77,0,0.18)',
                      background: 'rgba(0,0,0,0.18)',
                    }}
                  >
                    <div style={{ opacity: 0.65, fontSize: 12 }}>{ev.ts}</div>
                    <div style={{ opacity: 0.85, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      {ev.level}
                    </div>
                    <div style={{ opacity: 0.9, fontSize: 12, lineHeight: 1.35 }}>{ev.msg}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!connected && (
          <div style={{ marginTop: 14 }} className={styles.panel}>
            <div className={styles.panelTitle}>Not connected</div>
            <div style={{ marginTop: 10, opacity: 0.75, fontSize: 12 }}>
              Set <code>BOT_METRICS_URL</code> (and optionally <code>BOT_METRICS_TOKEN</code>) in your environment.
            </div>
            <pre style={{ marginTop: 10, overflow: 'auto', opacity: 0.85, fontSize: 12 }}>{error}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
