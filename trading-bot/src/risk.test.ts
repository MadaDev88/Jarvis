import { describe, expect, it } from "vitest";
import { canOpen, checkStops, dayKey } from "./risk.js";
import type { Position } from "./types.js";

const position: Position = {
  baseQty: 2,
  avgEntryPrice: 100,
  costQuote: 200,
  openedAt: new Date().toISOString(),
};

describe("checkStops", () => {
  const limits = { stopLossPct: 5, takeProfitPct: 10 };

  it("fires stop-loss at or below the threshold", () => {
    expect(checkStops(position, 95, limits)).toBe("stop-loss");
    expect(checkStops(position, 90, limits)).toBe("stop-loss");
  });

  it("fires take-profit at or above the threshold", () => {
    expect(checkStops(position, 110, limits)).toBe("take-profit");
    expect(checkStops(position, 120, limits)).toBe("take-profit");
  });

  it("returns null inside the band", () => {
    expect(checkStops(position, 100, limits)).toBeNull();
    expect(checkStops(position, 95.01, limits)).toBeNull();
    expect(checkStops(position, 109.99, limits)).toBeNull();
  });
});

describe("canOpen", () => {
  const limits = { maxPositionQuote: 100, maxDailyLossQuote: 50 };

  it("allows a normal entry", () => {
    const check = canOpen(
      { position: null, tradeSizeQuote: 25, realizedPnlToday: 0, availableQuote: 1000 },
      limits,
    );
    expect(check.ok).toBe(true);
  });

  it("blocks when the daily loss limit is hit", () => {
    const check = canOpen(
      { position: null, tradeSizeQuote: 25, realizedPnlToday: -50, availableQuote: 1000 },
      limits,
    );
    expect(check.ok).toBe(false);
    expect(check.reason).toContain("daily loss");
  });

  it("blocks when the position cap would be exceeded", () => {
    const existing: Position = { ...position, costQuote: 90 };
    const check = canOpen(
      { position: existing, tradeSizeQuote: 25, realizedPnlToday: 0, availableQuote: 1000 },
      limits,
    );
    expect(check.ok).toBe(false);
    expect(check.reason).toContain("max position");
  });

  it("blocks when the quote balance is insufficient", () => {
    const check = canOpen(
      { position: null, tradeSizeQuote: 25, realizedPnlToday: 0, availableQuote: 10 },
      limits,
    );
    expect(check.ok).toBe(false);
    expect(check.reason).toContain("insufficient");
  });
});

describe("dayKey", () => {
  it("buckets by UTC date", () => {
    expect(dayKey(new Date("2026-07-11T23:59:00Z"))).toBe("2026-07-11");
    expect(dayKey(new Date("2026-07-12T00:01:00Z"))).toBe("2026-07-12");
  });
});
