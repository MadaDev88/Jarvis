# Solana Trading Bot

A TypeScript trading bot for Solana that trades a token pair (SOL/USDC by
default) through the [Jupiter](https://jup.ag) aggregator. It ships with two
strategies, protective stops, a daily loss limit, and — most importantly — a
**paper-trading mode that is the default**, so you can watch it trade with
simulated money before ever risking real funds.

> ⚠️ **Risk disclaimer.** Automated crypto trading can lose money, quickly.
> Strategies that back-test well still lose in live markets. Nothing here is
> financial advice. If you enable live mode, use a dedicated hot wallet funded
> with only what you are fully prepared to lose.

## Features

- **Paper mode by default** — simulated fills at live market prices (with
  simulated slippage), a virtual USDC balance, and full trade logging.
- **Live mode** through Jupiter swap routing (quote → build → sign → send →
  confirm), gated behind an explicit `LIVE_TRADING_ACKNOWLEDGED` interlock.
- **Two pluggable strategies**
  - `sma-cross` — trend following: buy when the fast SMA crosses above the
    slow SMA, exit when it crosses back below.
  - `rsi` — mean reversion: buy oversold (RSI ≤ 30), exit overbought (RSI ≥ 70).
- **Risk controls that run before every trade**
  - stop-loss and take-profit on the open position (checked before the
    strategy on every tick),
  - fixed trade size and a max position cap,
  - a daily realized-loss limit that halts new entries,
  - slippage cap on every swap.
- **Persistent state** (`data/state.json`) — position, balances, and PnL
  survive restarts; a CSV trade log (`data/trades.csv`) records every fill.
- **Unit tested** — indicators, strategies, risk checks, and the full
  paper-trading engine loop are covered by Vitest.

## Quick start (paper trading)

```bash
cd trading-bot
npm install
npm start
```

That's it — no keys, no wallet. The bot polls the SOL/USDC price every 30
seconds, warms up its indicators, and starts paper trading a virtual 1,000
USDC balance. Stop it with `Ctrl+C`; state is saved and it resumes where it
left off.

Useful commands:

```bash
npm start          # run the bot loop
npm run once       # run a single tick (handy for cron)
npm run status     # print balances, position, and PnL without trading
npm test           # run the unit tests
npm run typecheck  # TypeScript type check
```

## Configuration

Copy `.env.example` to `.env` and adjust. Everything has a sensible default;
the key knobs:

| Variable | Default | Meaning |
| --- | --- | --- |
| `MODE` | `paper` | `paper` (simulated) or `live` (real funds) |
| `STRATEGY` | `sma-cross` | `sma-cross` or `rsi` |
| `POLL_INTERVAL_SEC` | `30` | Price polling interval |
| `TRADE_SIZE_QUOTE` | `25` | USDC spent per entry |
| `MAX_POSITION_QUOTE` | `100` | Cap on total position cost basis |
| `STOP_LOSS_PCT` | `5` | Exit if price falls this % below entry |
| `TAKE_PROFIT_PCT` | `10` | Exit if price rises this % above entry |
| `MAX_DAILY_LOSS_QUOTE` | `50` | Halt new entries after this much realized daily loss |
| `SLIPPAGE_BPS` | `50` | Max slippage per swap (0.5%) |
| `BASE_MINT` / `QUOTE_MINT` | SOL / USDC | Any Jupiter-routable pair (set decimals too) |

## Going live (only after paper trading)

1. Paper trade until you trust the strategy and settings. Check results with
   `npm run status` and review `data/trades.csv`.
2. Create a **dedicated hot wallet** and fund it with a small amount of the
   quote token (plus ~0.01 SOL for fees). Never use your main wallet.
3. Use a proper RPC provider — the public mainnet endpoint will rate-limit you.
4. Set in `.env`:

   ```bash
   MODE=live
   RPC_URL=<your provider RPC url>
   SOLANA_PRIVATE_KEY=<base58 secret key or JSON byte array>
   LIVE_TRADING_ACKNOWLEDGED=I_UNDERSTAND_THE_RISKS
   ```

   The bot refuses to start in live mode without the acknowledgement value.
5. Start small: keep `TRADE_SIZE_QUOTE` and `MAX_POSITION_QUOTE` low.

The private key is read from the environment only — it is never written to
the state file or logs, and `.env` is gitignored.

## How it works

Every `POLL_INTERVAL_SEC` seconds the engine runs one tick:

1. Fetch the pair price from Jupiter's price API.
2. If a position is open, check the stop-loss / take-profit first — protective
   exits always outrank strategy signals.
3. Ask the strategy for a signal (`buy` / `sell` / `hold`).
4. On `buy`: run risk checks (daily loss limit, position cap, balance), then
   execute — simulated in paper mode, a real Jupiter swap in live mode.
5. On `sell`: close the position and record realized PnL.
6. Persist state and append any fills to the CSV log.

```
src/
  index.ts             CLI entry (start / --once / --status)
  engine.ts            tick loop: price → stops → signal → execute → persist
  config.ts            env config + validation (live-mode interlock)
  indicators.ts        SMA, RSI (Wilder), crossover detection
  strategies/          sma-cross, rsi (pluggable Strategy interface)
  risk.ts              stops, position cap, daily loss limit
  executors/paper.ts   simulated fills with slippage
  executors/live.ts    Jupiter quote → swap tx → sign → send → confirm
  market/jupiter.ts    Jupiter price/quote/swap API client
  state.ts             JSON state persistence + CSV trade log
  wallet.ts            keypair loading (base58 or JSON array)
```

## Extending

Add a strategy by implementing the `Strategy` interface (`src/types.ts`) —
one `evaluate({ prices, position })` function returning
`buy` / `sell` / `hold` — and registering it in `src/strategies/index.ts`.

## Limitations

- Spot prices are polled, not streamed; very short-period strategies will be
  noisy at 30-second sampling.
- One position at a time, long-only (no shorting, no leverage).
- Live-mode balance is not reconciled against the chain; if you trade the
  wallet manually while the bot runs, the bot's position record will drift.
- No back-testing harness (the strategy interface is pure, so adding one is
  straightforward).
