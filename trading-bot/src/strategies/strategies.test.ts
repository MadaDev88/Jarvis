import { describe, expect, it } from "vitest";
import { smaCrossStrategy } from "./smaCross.js";
import { rsiReversionStrategy } from "./rsiReversion.js";
import type { Position } from "../types.js";

const position: Position = {
  baseQty: 1,
  avgEntryPrice: 10,
  costQuote: 10,
  openedAt: new Date().toISOString(),
};

describe("smaCrossStrategy", () => {
  const strategy = smaCrossStrategy(2, 3);

  it("buys on a bullish cross when flat", () => {
    const signal = strategy.evaluate({ prices: [10, 9, 8, 7, 12], position: null });
    expect(signal.action).toBe("buy");
  });

  it("does not buy when already holding", () => {
    const signal = strategy.evaluate({ prices: [10, 9, 8, 7, 12], position });
    expect(signal.action).toBe("hold");
  });

  it("sells on a bearish cross when holding", () => {
    const signal = strategy.evaluate({ prices: [7, 8, 9, 10, 5], position });
    expect(signal.action).toBe("sell");
  });

  it("does not sell when flat", () => {
    const signal = strategy.evaluate({ prices: [7, 8, 9, 10, 5], position: null });
    expect(signal.action).toBe("hold");
  });

  it("holds with insufficient history", () => {
    const signal = strategy.evaluate({ prices: [1, 2], position: null });
    expect(signal.action).toBe("hold");
    expect(signal.reason).toContain("insufficient");
  });
});

describe("rsiReversionStrategy", () => {
  const strategy = rsiReversionStrategy(14, 30, 70);

  it("buys when oversold and flat", () => {
    const falling = Array.from({ length: 20 }, (_, i) => 100 - i);
    const signal = strategy.evaluate({ prices: falling, position: null });
    expect(signal.action).toBe("buy");
  });

  it("sells when overbought and holding", () => {
    const rising = Array.from({ length: 20 }, (_, i) => 100 + i);
    const signal = strategy.evaluate({ prices: rising, position });
    expect(signal.action).toBe("sell");
  });

  it("holds in the neutral band", () => {
    const flat = Array.from({ length: 30 }, (_, i) => (i % 2 === 0 ? 100 : 101));
    expect(strategy.evaluate({ prices: flat, position: null }).action).toBe("hold");
    expect(strategy.evaluate({ prices: flat, position }).action).toBe("hold");
  });

  it("rejects inverted thresholds", () => {
    expect(() => rsiReversionStrategy(14, 70, 30)).toThrow();
  });
});
