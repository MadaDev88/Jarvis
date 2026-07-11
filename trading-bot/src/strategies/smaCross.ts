import { crossedAbove, crossedBelow, smaCrossState } from "../indicators.js";
import type { Strategy, StrategyContext, Signal } from "../types.js";

/**
 * Trend-following: buy when the fast SMA crosses above the slow SMA,
 * sell when it crosses back below.
 */
export function smaCrossStrategy(fastPeriod: number, slowPeriod: number): Strategy {
  return {
    name: `sma-cross(${fastPeriod}/${slowPeriod})`,
    minHistory: slowPeriod + 1,
    evaluate({ prices, position }: StrategyContext): Signal {
      const cross = smaCrossState(prices, fastPeriod, slowPeriod);
      if (!cross) return { action: "hold", reason: "insufficient history" };

      if (!position && crossedAbove(cross)) {
        return {
          action: "buy",
          reason: `SMA${fastPeriod} crossed above SMA${slowPeriod}`,
        };
      }
      if (position && crossedBelow(cross)) {
        return {
          action: "sell",
          reason: `SMA${fastPeriod} crossed below SMA${slowPeriod}`,
        };
      }
      return {
        action: "hold",
        reason: `fast=${cross.fastNow.toFixed(4)} slow=${cross.slowNow.toFixed(4)}`,
      };
    },
  };
}
