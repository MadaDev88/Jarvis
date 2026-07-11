export type Mode = "paper" | "live";

export type Side = "buy" | "sell";

export type SignalAction = "buy" | "sell" | "hold";

export interface Signal {
  action: SignalAction;
  reason: string;
}

export interface Position {
  /** Base token quantity held (UI units, e.g. SOL). */
  baseQty: number;
  /** Average entry price in quote units per base unit. */
  avgEntryPrice: number;
  /** Total quote spent to open the position (cost basis). */
  costQuote: number;
  openedAt: string;
}

export interface Trade {
  id: string;
  time: string;
  mode: Mode;
  side: Side;
  pair: string;
  /** Execution price in quote units per base unit. */
  price: number;
  baseQty: number;
  quoteQty: number;
  /** Realized profit/loss in quote units (sells only). */
  realizedPnl: number | null;
  reason: string;
  txid: string | null;
}

export interface BotState {
  mode: Mode;
  pair: string;
  /** Paper-mode quote balance (e.g. USDC). Unused in live mode. */
  paperQuoteBalance: number;
  position: Position | null;
  trades: Trade[];
  /** Realized PnL per UTC day, keyed by YYYY-MM-DD. */
  realizedPnlByDay: Record<string, number>;
  lastPrice: number | null;
  updatedAt: string | null;
}

export interface StrategyContext {
  /** Chronological price series, most recent last. */
  prices: number[];
  position: Position | null;
}

export interface Strategy {
  name: string;
  /** Minimum number of price points needed before the strategy can emit signals. */
  minHistory: number;
  evaluate(ctx: StrategyContext): Signal;
}

export interface ExecutionResult {
  price: number;
  baseQty: number;
  quoteQty: number;
  txid: string | null;
}

export interface Executor {
  /** Spend `quoteQty` of the quote token buying the base token. */
  buy(quoteQty: number, marketPrice: number): Promise<ExecutionResult>;
  /** Sell `baseQty` of the base token for the quote token. */
  sell(baseQty: number, marketPrice: number): Promise<ExecutionResult>;
}
