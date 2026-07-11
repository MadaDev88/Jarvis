import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { Engine } from "./engine.js";
import { PaperExecutor } from "./executors/paper.js";
import { initialState, loadState, saveState } from "./state.js";
import { smaCrossStrategy } from "./strategies/smaCross.js";
import type { Config } from "./config.js";
import type { BotState, Strategy } from "./types.js";

let tmpDir: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "bot-test-"));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

function makeConfig(overrides: Partial<Config> = {}): Config {
  return {
    mode: "paper",
    rpcUrl: "http://localhost",
    jupiterBaseUrl: "http://localhost",
    baseMint: "BASE",
    quoteMint: "QUOTE",
    baseSymbol: "SOL",
    quoteSymbol: "USDC",
    baseDecimals: 9,
    quoteDecimals: 6,
    strategy: "sma-cross",
    pollIntervalSec: 30,
    tradeSizeQuote: 100,
    maxPositionQuote: 400,
    stopLossPct: 5,
    takeProfitPct: 10,
    maxDailyLossQuote: 50,
    slippageBps: 0,
    smaFast: 2,
    smaSlow: 3,
    rsiPeriod: 14,
    rsiOversold: 30,
    rsiOverbought: 70,
    paperStartingQuote: 1000,
    stateFile: path.join(tmpDir, "state.json"),
    tradeLogFile: path.join(tmpDir, "trades.csv"),
    privateKey: null,
    liveAck: null,
    ...overrides,
  };
}

function makeMarket(prices: number[]) {
  let i = 0;
  return {
    async getPairPrice(): Promise<number> {
      const price = prices[Math.min(i, prices.length - 1)]!;
      i += 1;
      return price;
    },
  };
}

function makeEngine(prices: number[], configOverrides: Partial<Config> = {}, strategy?: Strategy) {
  const config = makeConfig(configOverrides);
  const state: BotState = initialState("paper", "SOL/USDC", config.paperStartingQuote);
  const engine = new Engine(
    config,
    state,
    strategy ?? smaCrossStrategy(config.smaFast, config.smaSlow),
    new PaperExecutor(config.slippageBps),
    makeMarket(prices),
  );
  return { engine, state, config };
}

async function runTicks(engine: Engine, n: number): Promise<void> {
  for (let i = 0; i < n; i++) await engine.tick();
}

describe("Engine (paper mode)", () => {
  it("opens a position on a bullish SMA cross and debits the paper balance", async () => {
    const { engine, state } = makeEngine([10, 9, 8, 7, 12]);
    await runTicks(engine, 5);

    expect(state.position).not.toBeNull();
    expect(state.position!.baseQty).toBeCloseTo(100 / 12, 6);
    expect(state.paperQuoteBalance).toBeCloseTo(900, 6);
    expect(state.trades).toHaveLength(1);
    expect(state.trades[0]!.side).toBe("buy");
  });

  it("closes the position on a bearish cross and realizes PnL", async () => {
    // Cross up at 12, then fall back so the fast SMA crosses below the slow.
    // Stops are disabled (wide) so only the strategy exit fires.
    const { engine, state } = makeEngine([10, 9, 8, 7, 12, 12, 11.7, 11.4], {
      stopLossPct: 90,
      takeProfitPct: 900,
    });
    await runTicks(engine, 8);

    expect(state.position).toBeNull();
    const sells = state.trades.filter((t) => t.side === "sell");
    expect(sells).toHaveLength(1);
    expect(sells[0]!.realizedPnl).not.toBeNull();
    // Bought at 12, sold at 11.4: a loss.
    expect(sells[0]!.realizedPnl!).toBeLessThan(0);
    expect(state.paperQuoteBalance).toBeCloseTo(1000 + sells[0]!.realizedPnl!, 6);
  });

  it("fires the stop-loss before consulting the strategy", async () => {
    const { engine, state } = makeEngine([10, 9, 8, 7, 12, 6]);
    await runTicks(engine, 6);

    expect(state.position).toBeNull();
    const sell = state.trades.find((t) => t.side === "sell");
    expect(sell).toBeDefined();
    expect(sell!.reason).toBe("stop-loss");
    expect(sell!.realizedPnl!).toBeLessThan(0);
  });

  it("fires the take-profit", async () => {
    const { engine, state } = makeEngine([10, 9, 8, 7, 12, 14]);
    await runTicks(engine, 6);

    const sell = state.trades.find((t) => t.side === "sell");
    expect(sell).toBeDefined();
    expect(sell!.reason).toBe("take-profit");
    expect(sell!.realizedPnl!).toBeGreaterThan(0);
  });

  it("blocks new entries after the daily loss limit is hit", async () => {
    // First round-trip loses ~50% (buy at 12, stop out at 6): -50 realized.
    // A second bullish cross follows; the entry must be blocked.
    const { engine, state } = makeEngine([10, 9, 8, 7, 12, 6, 5, 4, 9], {
      tradeSizeQuote: 100,
      maxDailyLossQuote: 40,
    });
    await runTicks(engine, 9);

    const buys = state.trades.filter((t) => t.side === "buy");
    expect(buys).toHaveLength(1);
    expect(state.position).toBeNull();
  });

  it("writes a CSV trade log", async () => {
    const { engine, config } = makeEngine([10, 9, 8, 7, 12]);
    await runTicks(engine, 5);

    const csv = fs.readFileSync(config.tradeLogFile, "utf8");
    const lines = csv.trim().split("\n");
    expect(lines[0]).toContain("time,mode,side");
    expect(lines).toHaveLength(2);
    expect(lines[1]).toContain("buy");
  });

  it("applies simulated slippage to paper fills", async () => {
    const { engine, state } = makeEngine([10, 9, 8, 7, 12], { slippageBps: 100 });
    await runTicks(engine, 5);

    // 1% slippage: filled at 12.12, not 12.
    expect(state.position!.avgEntryPrice).toBeCloseTo(12 * 1.01, 6);
  });
});

describe("state persistence", () => {
  it("round-trips state through the file", () => {
    const file = path.join(tmpDir, "state.json");
    const state = initialState("paper", "SOL/USDC", 1000);
    state.paperQuoteBalance = 875.5;
    saveState(file, state);

    const loaded = loadState(file, "paper", "SOL/USDC", 1000);
    expect(loaded.paperQuoteBalance).toBe(875.5);
    expect(loaded.updatedAt).not.toBeNull();
  });

  it("refuses to load a state file for a different mode or pair", () => {
    const file = path.join(tmpDir, "state.json");
    saveState(file, initialState("paper", "SOL/USDC", 1000));

    expect(() => loadState(file, "live", "SOL/USDC", 1000)).toThrow(/state file/i);
    expect(() => loadState(file, "paper", "BONK/USDC", 1000)).toThrow(/state file/i);
  });
});
