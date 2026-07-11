import { describe, expect, it } from "vitest";
import { crossedAbove, crossedBelow, rsi, sma, smaAt, smaCrossState } from "./indicators.js";

describe("sma", () => {
  it("computes the average of the trailing window", () => {
    expect(sma([1, 2, 3, 4, 5], 5)).toBe(3);
    expect(sma([1, 2, 3, 4, 5], 2)).toBe(4.5);
  });

  it("returns null with insufficient data or bad period", () => {
    expect(sma([1, 2], 3)).toBeNull();
    expect(sma([], 1)).toBeNull();
    expect(sma([1, 2, 3], 0)).toBeNull();
  });

  it("smaAt computes at arbitrary end indices", () => {
    expect(smaAt([1, 2, 3, 4], 2, 2)).toBe(2.5);
    expect(smaAt([1, 2, 3, 4], 2, 0)).toBeNull();
    expect(smaAt([1, 2, 3, 4], 2, 4)).toBeNull();
  });
});

describe("rsi", () => {
  it("is 100 for a strictly rising series", () => {
    const values = Array.from({ length: 20 }, (_, i) => 100 + i);
    expect(rsi(values, 14)).toBe(100);
  });

  it("is low for a strictly falling series", () => {
    const values = Array.from({ length: 20 }, (_, i) => 100 - i);
    expect(rsi(values, 14)).toBe(0);
  });

  it("hovers near 50 for alternating equal gains and losses", () => {
    // Wilder smoothing oscillates slightly around 50 on an alternating
    // series depending on which side the series ends on.
    const values = Array.from({ length: 30 }, (_, i) => (i % 2 === 0 ? 100 : 101));
    const value = rsi(values, 14)!;
    expect(value).toBeGreaterThan(45);
    expect(value).toBeLessThan(55);
  });

  it("returns null with insufficient data", () => {
    expect(rsi([1, 2, 3], 14)).toBeNull();
  });

  it("matches a hand-checked Wilder RSI value", () => {
    // Classic worked example (Wilder's 14-period RSI).
    const closes = [
      44.34, 44.09, 44.15, 43.61, 44.33, 44.83, 45.1, 45.42, 45.84, 46.08, 45.89, 46.03, 45.61,
      46.28, 46.28,
    ];
    const value = rsi(closes, 14);
    expect(value).not.toBeNull();
    expect(value!).toBeGreaterThan(69);
    expect(value!).toBeLessThan(71);
  });
});

describe("sma crossover", () => {
  it("detects a bullish cross", () => {
    // Fast SMA (2) below slow (3), then price jumps and fast crosses above.
    const prices = [10, 9, 8, 7, 12];
    const cross = smaCrossState(prices, 2, 3)!;
    expect(crossedAbove(cross)).toBe(true);
    expect(crossedBelow(cross)).toBe(false);
  });

  it("detects a bearish cross", () => {
    const prices = [7, 8, 9, 10, 5];
    const cross = smaCrossState(prices, 2, 3)!;
    expect(crossedBelow(cross)).toBe(true);
    expect(crossedAbove(cross)).toBe(false);
  });

  it("returns null with insufficient history", () => {
    expect(smaCrossState([1, 2, 3], 2, 3)).toBeNull();
  });
});
