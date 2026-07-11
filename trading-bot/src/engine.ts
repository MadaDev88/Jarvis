import crypto from "node:crypto";
import type { Config } from "./config.js";
import type { JupiterClient } from "./market/jupiter.js";
import type { BotState, Executor, Strategy, Trade } from "./types.js";
import { canOpen, checkStops } from "./risk.js";
import {
  appendTradeLog,
  realizedPnlToday,
  recordRealizedPnl,
  saveState,
  totalRealizedPnl,
} from "./state.js";
import { log, warn } from "./logger.js";

const MAX_HISTORY = 500;

export class Engine {
  private readonly prices: number[] = [];

  constructor(
    private readonly config: Config,
    private readonly state: BotState,
    private readonly strategy: Strategy,
    private readonly executor: Executor,
    private readonly market: Pick<JupiterClient, "getPairPrice">,
  ) {}

  get priceHistory(): readonly number[] {
    return this.prices;
  }

  /** One full poll → evaluate → (maybe) trade cycle. */
  async tick(): Promise<void> {
    const price = await this.market.getPairPrice(this.config.baseMint, this.config.quoteMint);
    this.prices.push(price);
    if (this.prices.length > MAX_HISTORY) this.prices.shift();
    this.state.lastPrice = price;

    // Protective stops take priority over strategy signals.
    if (this.state.position) {
      const stop = checkStops(this.state.position, price, this.config);
      if (stop) {
        await this.closePosition(price, stop);
        this.persist();
        return;
      }
    }

    if (this.prices.length < this.strategy.minHistory) {
      log(
        `${this.state.pair} @ ${price.toFixed(4)} — warming up ` +
          `(${this.prices.length}/${this.strategy.minHistory} samples)`,
      );
      this.persist();
      return;
    }

    const signal = this.strategy.evaluate({ prices: this.prices, position: this.state.position });

    if (signal.action === "buy" && !this.state.position) {
      await this.openPosition(price, signal.reason);
    } else if (signal.action === "sell" && this.state.position) {
      await this.closePosition(price, signal.reason);
    } else {
      const pos = this.state.position;
      const posText = pos
        ? `position ${pos.baseQty.toFixed(6)} ${this.config.baseSymbol} @ ${pos.avgEntryPrice.toFixed(4)}`
        : "flat";
      log(`${this.state.pair} @ ${price.toFixed(4)} — hold (${signal.reason}); ${posText}`);
    }
    this.persist();
  }

  private async openPosition(price: number, reason: string): Promise<void> {
    const availableQuote =
      this.config.mode === "paper" ? this.state.paperQuoteBalance : Number.POSITIVE_INFINITY;
    const check = canOpen(
      {
        position: this.state.position,
        tradeSizeQuote: this.config.tradeSizeQuote,
        realizedPnlToday: realizedPnlToday(this.state),
        availableQuote,
      },
      this.config,
    );
    if (!check.ok) {
      warn(`buy signal skipped: ${check.reason}`);
      return;
    }

    const fill = await this.executor.buy(this.config.tradeSizeQuote, price);
    if (this.config.mode === "paper") {
      this.state.paperQuoteBalance -= fill.quoteQty;
    }
    this.state.position = {
      baseQty: fill.baseQty,
      avgEntryPrice: fill.price,
      costQuote: fill.quoteQty,
      openedAt: new Date().toISOString(),
    };
    this.recordTrade("buy", fill.price, fill.baseQty, fill.quoteQty, null, reason, fill.txid);
    log(
      `BUY ${fill.baseQty.toFixed(6)} ${this.config.baseSymbol} @ ${fill.price.toFixed(4)} ` +
        `(${fill.quoteQty.toFixed(2)} ${this.config.quoteSymbol}) — ${reason}` +
        (fill.txid ? ` [${fill.txid}]` : ""),
    );
  }

  private async closePosition(price: number, reason: string): Promise<void> {
    const position = this.state.position;
    if (!position) return;

    const fill = await this.executor.sell(position.baseQty, price);
    const realizedPnl = fill.quoteQty - position.costQuote;
    if (this.config.mode === "paper") {
      this.state.paperQuoteBalance += fill.quoteQty;
    }
    this.state.position = null;
    recordRealizedPnl(this.state, realizedPnl);
    this.recordTrade("sell", fill.price, fill.baseQty, fill.quoteQty, realizedPnl, reason, fill.txid);
    log(
      `SELL ${fill.baseQty.toFixed(6)} ${this.config.baseSymbol} @ ${fill.price.toFixed(4)} ` +
        `(${fill.quoteQty.toFixed(2)} ${this.config.quoteSymbol}) — ${reason}; ` +
        `PnL ${realizedPnl >= 0 ? "+" : ""}${realizedPnl.toFixed(2)} ${this.config.quoteSymbol}` +
        (fill.txid ? ` [${fill.txid}]` : ""),
    );
  }

  private recordTrade(
    side: Trade["side"],
    price: number,
    baseQty: number,
    quoteQty: number,
    realizedPnl: number | null,
    reason: string,
    txid: string | null,
  ): void {
    const trade: Trade = {
      id: crypto.randomUUID(),
      time: new Date().toISOString(),
      mode: this.config.mode,
      side,
      pair: this.state.pair,
      price,
      baseQty,
      quoteQty,
      realizedPnl,
      reason,
      txid,
    };
    this.state.trades.push(trade);
    appendTradeLog(this.config.tradeLogFile, trade);
  }

  private persist(): void {
    saveState(this.config.stateFile, this.state);
  }

  statusSummary(): string {
    const lines: string[] = [];
    lines.push(`mode:            ${this.state.mode}`);
    lines.push(`pair:            ${this.state.pair}`);
    lines.push(`strategy:        ${this.strategy.name}`);
    lines.push(`last price:      ${this.state.lastPrice?.toFixed(4) ?? "n/a"}`);
    if (this.config.mode === "paper") {
      lines.push(`paper balance:   ${this.state.paperQuoteBalance.toFixed(2)} ${this.config.quoteSymbol}`);
    }
    const pos = this.state.position;
    lines.push(
      pos
        ? `position:        ${pos.baseQty.toFixed(6)} ${this.config.baseSymbol} @ ${pos.avgEntryPrice.toFixed(4)} (cost ${pos.costQuote.toFixed(2)})`
        : "position:        flat",
    );
    lines.push(`trades:          ${this.state.trades.length}`);
    lines.push(`realized today:  ${realizedPnlToday(this.state).toFixed(2)} ${this.config.quoteSymbol}`);
    lines.push(`realized total:  ${totalRealizedPnl(this.state).toFixed(2)} ${this.config.quoteSymbol}`);
    return lines.join("\n");
  }
}
