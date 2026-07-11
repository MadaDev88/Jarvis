import type { ExecutionResult, Executor } from "../types.js";

/**
 * Simulated execution: fills at the live market price adjusted by the
 * configured slippage, so paper results stay conservative.
 */
export class PaperExecutor implements Executor {
  constructor(private readonly slippageBps: number) {}

  async buy(quoteQty: number, marketPrice: number): Promise<ExecutionResult> {
    const price = marketPrice * (1 + this.slippageBps / 10_000);
    return {
      price,
      baseQty: quoteQty / price,
      quoteQty,
      txid: null,
    };
  }

  async sell(baseQty: number, marketPrice: number): Promise<ExecutionResult> {
    const price = marketPrice * (1 - this.slippageBps / 10_000);
    return {
      price,
      baseQty,
      quoteQty: baseQty * price,
      txid: null,
    };
  }
}
