import { Connection, Keypair, VersionedTransaction } from "@solana/web3.js";
import type { ExecutionResult, Executor } from "../types.js";
import type { JupiterClient } from "../market/jupiter.js";
import type { Config } from "../config.js";

/**
 * Real on-chain execution through Jupiter swaps. Every call spends real
 * funds from the configured wallet.
 */
export class LiveExecutor implements Executor {
  constructor(
    private readonly connection: Connection,
    private readonly keypair: Keypair,
    private readonly jupiter: JupiterClient,
    private readonly config: Config,
  ) {}

  async buy(quoteQty: number, _marketPrice: number): Promise<ExecutionResult> {
    const inAtoms = toAtoms(quoteQty, this.config.quoteDecimals);
    const quote = await this.jupiter.getQuote(
      this.config.quoteMint,
      this.config.baseMint,
      inAtoms,
      this.config.slippageBps,
    );
    const txid = await this.signAndSend(quote);
    const baseQty = fromAtoms(BigInt(quote.outAmount), this.config.baseDecimals);
    const quoteSpent = fromAtoms(BigInt(quote.inAmount), this.config.quoteDecimals);
    return { price: quoteSpent / baseQty, baseQty, quoteQty: quoteSpent, txid };
  }

  async sell(baseQty: number, _marketPrice: number): Promise<ExecutionResult> {
    const inAtoms = toAtoms(baseQty, this.config.baseDecimals);
    const quote = await this.jupiter.getQuote(
      this.config.baseMint,
      this.config.quoteMint,
      inAtoms,
      this.config.slippageBps,
    );
    const txid = await this.signAndSend(quote);
    const baseSold = fromAtoms(BigInt(quote.inAmount), this.config.baseDecimals);
    const quoteReceived = fromAtoms(BigInt(quote.outAmount), this.config.quoteDecimals);
    return { price: quoteReceived / baseSold, baseQty: baseSold, quoteQty: quoteReceived, txid };
  }

  private async signAndSend(
    quote: Awaited<ReturnType<JupiterClient["getQuote"]>>,
  ): Promise<string> {
    const { swapTransaction, lastValidBlockHeight } = await this.jupiter.getSwapTransaction(
      quote,
      this.keypair.publicKey.toBase58(),
    );
    const tx = VersionedTransaction.deserialize(Buffer.from(swapTransaction, "base64"));
    tx.sign([this.keypair]);

    const signature = await this.connection.sendRawTransaction(tx.serialize(), {
      skipPreflight: false,
      maxRetries: 3,
    });
    const confirmation = await this.connection.confirmTransaction(
      {
        signature,
        blockhash: tx.message.recentBlockhash,
        lastValidBlockHeight,
      },
      "confirmed",
    );
    if (confirmation.value.err) {
      throw new Error(`Swap ${signature} failed on-chain: ${JSON.stringify(confirmation.value.err)}`);
    }
    return signature;
  }
}

export function toAtoms(uiAmount: number, decimals: number): bigint {
  return BigInt(Math.round(uiAmount * 10 ** decimals));
}

export function fromAtoms(atoms: bigint, decimals: number): number {
  return Number(atoms) / 10 ** decimals;
}
