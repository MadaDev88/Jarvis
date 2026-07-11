/**
 * Thin client for the Jupiter aggregator lite API (price, quote, swap).
 * https://dev.jup.ag/docs/
 */

export interface JupiterQuote {
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  otherAmountThreshold: string;
  priceImpactPct: string;
  slippageBps: number;
  routePlan: unknown[];
  [key: string]: unknown;
}

export interface SwapTransactionResponse {
  swapTransaction: string;
  lastValidBlockHeight: number;
}

export class JupiterClient {
  constructor(private readonly baseUrl: string) {}

  private async getJson<T>(path: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      headers: { accept: "application/json" },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Jupiter GET ${path} failed: ${res.status} ${body.slice(0, 300)}`);
    }
    return (await res.json()) as T;
  }

  /** USD price for each mint, via the price v3 endpoint. */
  async getUsdPrices(mints: string[]): Promise<Record<string, number>> {
    const ids = mints.join(",");
    const data = await this.getJson<Record<string, { usdPrice: number }>>(
      `/price/v3?ids=${encodeURIComponent(ids)}`,
    );
    const prices: Record<string, number> = {};
    for (const mint of mints) {
      const entry = data[mint];
      if (!entry || !Number.isFinite(entry.usdPrice)) {
        throw new Error(`No price returned for mint ${mint}`);
      }
      prices[mint] = entry.usdPrice;
    }
    return prices;
  }

  /** Price of the base token denominated in the quote token. */
  async getPairPrice(baseMint: string, quoteMint: string): Promise<number> {
    const prices = await this.getUsdPrices([baseMint, quoteMint]);
    const base = prices[baseMint]!;
    const quote = prices[quoteMint]!;
    if (quote <= 0) throw new Error(`Quote mint ${quoteMint} has non-positive USD price`);
    return base / quote;
  }

  /** Swap quote for `amount` atoms of `inputMint` into `outputMint`. */
  async getQuote(
    inputMint: string,
    outputMint: string,
    amountAtoms: bigint,
    slippageBps: number,
  ): Promise<JupiterQuote> {
    const params = new URLSearchParams({
      inputMint,
      outputMint,
      amount: amountAtoms.toString(),
      slippageBps: String(slippageBps),
    });
    return this.getJson<JupiterQuote>(`/swap/v1/quote?${params.toString()}`);
  }

  /** Build an unsigned swap transaction for a quote. */
  async getSwapTransaction(
    quote: JupiterQuote,
    userPublicKey: string,
  ): Promise<SwapTransactionResponse> {
    const res = await fetch(`${this.baseUrl}/swap/v1/swap`, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        quoteResponse: quote,
        userPublicKey,
        dynamicComputeUnitLimit: true,
        dynamicSlippage: false,
        prioritizationFeeLamports: { priorityLevelWithMaxLamports: { priorityLevel: "medium", maxLamports: 1_000_000 } },
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Jupiter swap build failed: ${res.status} ${body.slice(0, 300)}`);
    }
    return (await res.json()) as SwapTransactionResponse;
  }
}
