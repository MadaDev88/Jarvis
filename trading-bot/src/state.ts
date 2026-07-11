import fs from "node:fs";
import path from "node:path";
import type { BotState, Mode, Trade } from "./types.js";
import { dayKey } from "./risk.js";

export function initialState(mode: Mode, pair: string, paperStartingQuote: number): BotState {
  return {
    mode,
    pair,
    paperQuoteBalance: paperStartingQuote,
    position: null,
    trades: [],
    realizedPnlByDay: {},
    lastPrice: null,
    updatedAt: null,
  };
}

export function loadState(
  file: string,
  mode: Mode,
  pair: string,
  paperStartingQuote: number,
): BotState {
  if (!fs.existsSync(file)) {
    return initialState(mode, pair, paperStartingQuote);
  }
  const raw = JSON.parse(fs.readFileSync(file, "utf8")) as BotState;
  if (raw.mode !== mode || raw.pair !== pair) {
    throw new Error(
      `State file ${file} was created for ${raw.mode}/${raw.pair}, but the bot is configured for ` +
        `${mode}/${pair}. Move or delete the state file (open positions are tracked there) before switching.`,
    );
  }
  return raw;
}

export function saveState(file: string, state: BotState): void {
  state.updatedAt = new Date().toISOString();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(state, null, 2));
  fs.renameSync(tmp, file);
}

export function recordRealizedPnl(state: BotState, pnl: number, date: Date = new Date()): void {
  const key = dayKey(date);
  state.realizedPnlByDay[key] = (state.realizedPnlByDay[key] ?? 0) + pnl;
}

export function realizedPnlToday(state: BotState, date: Date = new Date()): number {
  return state.realizedPnlByDay[dayKey(date)] ?? 0;
}

export function totalRealizedPnl(state: BotState): number {
  return Object.values(state.realizedPnlByDay).reduce((sum, v) => sum + v, 0);
}

export function appendTradeLog(file: string, trade: Trade): void {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (!fs.existsSync(file)) {
    fs.writeFileSync(
      file,
      "time,mode,side,pair,price,baseQty,quoteQty,realizedPnl,reason,txid\n",
    );
  }
  const csvField = (value: string): string =>
    /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
  const row = [
    trade.time,
    trade.mode,
    trade.side,
    trade.pair,
    String(trade.price),
    String(trade.baseQty),
    String(trade.quoteQty),
    trade.realizedPnl === null ? "" : String(trade.realizedPnl),
    csvField(trade.reason),
    trade.txid ?? "",
  ].join(",");
  fs.appendFileSync(file, `${row}\n`);
}
