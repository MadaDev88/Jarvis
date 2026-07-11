import "dotenv/config";
import type { Mode } from "./types.js";

export const WELL_KNOWN_MINTS = {
  SOL: "So11111111111111111111111111111111111111112",
  USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  USDT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
} as const;

export interface Config {
  mode: Mode;
  rpcUrl: string;
  jupiterBaseUrl: string;
  baseMint: string;
  quoteMint: string;
  baseSymbol: string;
  quoteSymbol: string;
  baseDecimals: number;
  quoteDecimals: number;
  strategy: "sma-cross" | "rsi";
  pollIntervalSec: number;
  tradeSizeQuote: number;
  maxPositionQuote: number;
  stopLossPct: number;
  takeProfitPct: number;
  maxDailyLossQuote: number;
  slippageBps: number;
  smaFast: number;
  smaSlow: number;
  rsiPeriod: number;
  rsiOversold: number;
  rsiOverbought: number;
  paperStartingQuote: number;
  stateFile: string;
  tradeLogFile: string;
  privateKey: string | null;
  liveAck: string | null;
}

function num(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  const value = Number(raw);
  if (!Number.isFinite(value)) {
    throw new Error(`Environment variable ${name} must be a number, got "${raw}"`);
  }
  return value;
}

function str(name: string, fallback: string): string {
  const raw = process.env[name];
  return raw === undefined || raw === "" ? fallback : raw;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const mode = str("MODE", "paper");
  if (mode !== "paper" && mode !== "live") {
    throw new Error(`MODE must be "paper" or "live", got "${mode}"`);
  }
  const strategy = str("STRATEGY", "sma-cross");
  if (strategy !== "sma-cross" && strategy !== "rsi") {
    throw new Error(`STRATEGY must be "sma-cross" or "rsi", got "${strategy}"`);
  }

  const config: Config = {
    mode,
    rpcUrl: str("RPC_URL", "https://api.mainnet-beta.solana.com"),
    jupiterBaseUrl: str("JUPITER_BASE_URL", "https://lite-api.jup.ag"),
    baseMint: str("BASE_MINT", WELL_KNOWN_MINTS.SOL),
    quoteMint: str("QUOTE_MINT", WELL_KNOWN_MINTS.USDC),
    baseSymbol: str("BASE_SYMBOL", "SOL"),
    quoteSymbol: str("QUOTE_SYMBOL", "USDC"),
    baseDecimals: num("BASE_DECIMALS", 9),
    quoteDecimals: num("QUOTE_DECIMALS", 6),
    strategy,
    pollIntervalSec: num("POLL_INTERVAL_SEC", 30),
    tradeSizeQuote: num("TRADE_SIZE_QUOTE", 25),
    maxPositionQuote: num("MAX_POSITION_QUOTE", 100),
    stopLossPct: num("STOP_LOSS_PCT", 5),
    takeProfitPct: num("TAKE_PROFIT_PCT", 10),
    maxDailyLossQuote: num("MAX_DAILY_LOSS_QUOTE", 50),
    slippageBps: num("SLIPPAGE_BPS", 50),
    smaFast: num("SMA_FAST", 9),
    smaSlow: num("SMA_SLOW", 21),
    rsiPeriod: num("RSI_PERIOD", 14),
    rsiOversold: num("RSI_OVERSOLD", 30),
    rsiOverbought: num("RSI_OVERBOUGHT", 70),
    paperStartingQuote: num("PAPER_STARTING_QUOTE", 1000),
    stateFile: str("STATE_FILE", "data/state.json"),
    tradeLogFile: str("TRADE_LOG_FILE", "data/trades.csv"),
    privateKey: env.SOLANA_PRIVATE_KEY ?? null,
    liveAck: env.LIVE_TRADING_ACKNOWLEDGED ?? null,
  };

  validateConfig(config);
  return config;
}

export function validateConfig(config: Config): void {
  if (config.tradeSizeQuote <= 0) throw new Error("TRADE_SIZE_QUOTE must be > 0");
  if (config.maxPositionQuote <= 0) throw new Error("MAX_POSITION_QUOTE must be > 0");
  if (config.pollIntervalSec < 5) throw new Error("POLL_INTERVAL_SEC must be >= 5");
  if (config.stopLossPct <= 0 || config.stopLossPct >= 100) {
    throw new Error("STOP_LOSS_PCT must be between 0 and 100");
  }
  if (config.takeProfitPct <= 0) throw new Error("TAKE_PROFIT_PCT must be > 0");
  if (config.slippageBps < 0 || config.slippageBps > 1000) {
    throw new Error("SLIPPAGE_BPS must be between 0 and 1000");
  }
  if (config.smaFast >= config.smaSlow) {
    throw new Error("SMA_FAST must be smaller than SMA_SLOW");
  }
  if (config.baseMint === config.quoteMint) {
    throw new Error("BASE_MINT and QUOTE_MINT must differ");
  }
  if (config.mode === "live") {
    if (!config.privateKey) {
      throw new Error("Live mode requires SOLANA_PRIVATE_KEY to be set");
    }
    if (config.liveAck !== "I_UNDERSTAND_THE_RISKS") {
      throw new Error(
        "Live mode requires LIVE_TRADING_ACKNOWLEDGED=I_UNDERSTAND_THE_RISKS. " +
          "Live trading spends real funds and can lose money.",
      );
    }
  }
}
