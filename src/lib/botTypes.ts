export type BotHealth = {
  ok: boolean;
  name?: string;
  ts?: string;
  version?: string;
};

export type BotSummary = {
  mode: {
    dryRun: boolean;
    liveTrading: boolean;
    stopTrading: boolean;
  };
  risk: {
    maxPerTradeUsd: number;
    maxPerMarketUsd: number;
    maxTotalExposureUsd: number;
    maxDailyLossUsd: number;
    maxOpenOrders: number;
  };
  exposure: {
    totalExposureUsd: number;
    realizedPnlTodayUsd: number;
    openOrders: number;
    perMarketExposureUsd: Record<string, number>;
  };
  lastEventTs?: string;
};

export type BotEvent = {
  ts: string;
  level: 'debug'|'info'|'warn'|'error';
  msg: string;
  data?: any;
};
