/**
 * Simple moving average of the last `period` values ending at `endIndex`
 * (inclusive). Returns null when there is not enough data.
 */
export function smaAt(values: number[], period: number, endIndex: number): number | null {
  if (period <= 0 || endIndex < period - 1 || endIndex >= values.length) return null;
  let sum = 0;
  for (let i = endIndex - period + 1; i <= endIndex; i++) {
    sum += values[i]!;
  }
  return sum / period;
}

/** Simple moving average of the last `period` values. */
export function sma(values: number[], period: number): number | null {
  return smaAt(values, period, values.length - 1);
}

/**
 * Relative Strength Index using Wilder's smoothing over the whole series.
 * Returns null when there are fewer than `period + 1` values.
 */
export function rsi(values: number[], period: number): number | null {
  if (period <= 0 || values.length < period + 1) return null;

  let gainSum = 0;
  let lossSum = 0;
  for (let i = 1; i <= period; i++) {
    const change = values[i]! - values[i - 1]!;
    if (change >= 0) gainSum += change;
    else lossSum -= change;
  }
  let avgGain = gainSum / period;
  let avgLoss = lossSum / period;

  for (let i = period + 1; i < values.length; i++) {
    const change = values[i]! - values[i - 1]!;
    avgGain = (avgGain * (period - 1) + Math.max(change, 0)) / period;
    avgLoss = (avgLoss * (period - 1) + Math.max(-change, 0)) / period;
  }

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

export interface Crossover {
  fastPrev: number;
  slowPrev: number;
  fastNow: number;
  slowNow: number;
}

/**
 * Fast/slow SMA values at the latest and previous points, or null when there
 * is not enough history to compute all four.
 */
export function smaCrossState(
  values: number[],
  fastPeriod: number,
  slowPeriod: number,
): Crossover | null {
  const last = values.length - 1;
  const fastNow = smaAt(values, fastPeriod, last);
  const slowNow = smaAt(values, slowPeriod, last);
  const fastPrev = smaAt(values, fastPeriod, last - 1);
  const slowPrev = smaAt(values, slowPeriod, last - 1);
  if (fastNow === null || slowNow === null || fastPrev === null || slowPrev === null) {
    return null;
  }
  return { fastPrev, slowPrev, fastNow, slowNow };
}

export function crossedAbove(c: Crossover): boolean {
  return c.fastPrev <= c.slowPrev && c.fastNow > c.slowNow;
}

export function crossedBelow(c: Crossover): boolean {
  return c.fastPrev >= c.slowPrev && c.fastNow < c.slowNow;
}
