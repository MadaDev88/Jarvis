import type { Config } from "../config.js";
import type { Strategy } from "../types.js";
import { smaCrossStrategy } from "./smaCross.js";
import { rsiReversionStrategy } from "./rsiReversion.js";

export function createStrategy(config: Config): Strategy {
  switch (config.strategy) {
    case "sma-cross":
      return smaCrossStrategy(config.smaFast, config.smaSlow);
    case "rsi":
      return rsiReversionStrategy(config.rsiPeriod, config.rsiOversold, config.rsiOverbought);
  }
}
