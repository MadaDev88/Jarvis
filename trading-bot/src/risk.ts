import type { Position } from "./types.js";

export interface RiskLimits {
  stopLossPct: number;
  takeProfitPct: number;
  maxPositionQuote: number;
  maxDailyLossQuote: number;
}

export type StopReason = "stop-loss" | "take-profit";

/**
 * Returns the stop that fired for an open position at the current price,
 * or null if neither stop-loss nor take-profit has been hit.
 */
export function checkStops(
  position: Position,
  price: number,
  limits: Pick<RiskLimits, "stopLossPct" | "takeProfitPct">,
): StopReason | null {
  const changePct = ((price - position.avgEntryPrice) / position.avgEntryPrice) * 100;
  if (changePct <= -limits.stopLossPct) return "stop-loss";
  if (changePct >= limits.takeProfitPct) return "take-profit";
  return null;
}

export interface OpenCheck {
  ok: boolean;
  reason: string;
}

/**
 * Pre-trade checks for opening (or adding to) a position.
 */
export function canOpen(
  args: {
    position: Position | null;
    tradeSizeQuote: number;
    realizedPnlToday: number;
    availableQuote: number;
  },
  limits: Pick<RiskLimits, "maxPositionQuote" | "maxDailyLossQuote">,
): OpenCheck {
  const currentCost = args.position?.costQuote ?? 0;
  if (args.realizedPnlToday <= -limits.maxDailyLossQuote) {
    return {
      ok: false,
      reason: `daily loss limit reached (${args.realizedPnlToday.toFixed(2)} <= -${limits.maxDailyLossQuote})`,
    };
  }
  if (currentCost + args.tradeSizeQuote > limits.maxPositionQuote) {
    return {
      ok: false,
      reason: `max position size would be exceeded (${(currentCost + args.tradeSizeQuote).toFixed(2)} > ${limits.maxPositionQuote})`,
    };
  }
  if (args.availableQuote < args.tradeSizeQuote) {
    return {
      ok: false,
      reason: `insufficient quote balance (${args.availableQuote.toFixed(2)} < ${args.tradeSizeQuote})`,
    };
  }
  return { ok: true, reason: "ok" };
}

/** UTC day key used for daily PnL bucketing. */
export function dayKey(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}
