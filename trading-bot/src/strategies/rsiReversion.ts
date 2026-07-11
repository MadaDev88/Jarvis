import { rsi } from "../indicators.js";
import type { Strategy, StrategyContext, Signal } from "../types.js";

/**
 * Mean-reversion: buy when RSI drops below the oversold threshold,
 * sell when it rises above the overbought threshold.
 */
export function rsiReversionStrategy(
  period: number,
  oversold: number,
  overbought: number,
): Strategy {
  if (oversold >= overbought) {
    throw new Error("RSI oversold threshold must be below the overbought threshold");
  }
  return {
    name: `rsi(${period}, ${oversold}/${overbought})`,
    minHistory: period + 1,
    evaluate({ prices, position }: StrategyContext): Signal {
      const value = rsi(prices, period);
      if (value === null) return { action: "hold", reason: "insufficient history" };

      if (!position && value <= oversold) {
        return { action: "buy", reason: `RSI ${value.toFixed(1)} <= ${oversold} (oversold)` };
      }
      if (position && value >= overbought) {
        return { action: "sell", reason: `RSI ${value.toFixed(1)} >= ${overbought} (overbought)` };
      }
      return { action: "hold", reason: `RSI ${value.toFixed(1)}` };
    },
  };
}
