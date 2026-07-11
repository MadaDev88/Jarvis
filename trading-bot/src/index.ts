import { Connection } from "@solana/web3.js";
import { loadConfig } from "./config.js";
import { JupiterClient } from "./market/jupiter.js";
import { createStrategy } from "./strategies/index.js";
import { PaperExecutor } from "./executors/paper.js";
import { LiveExecutor } from "./executors/live.js";
import { loadKeypair } from "./wallet.js";
import { loadState } from "./state.js";
import { Engine } from "./engine.js";
import { error, log, warn } from "./logger.js";
import type { Executor } from "./types.js";

async function main(): Promise<void> {
  const args = new Set(process.argv.slice(2));
  const config = loadConfig();
  const pair = `${config.baseSymbol}/${config.quoteSymbol}`;
  const state = loadState(config.stateFile, config.mode, pair, config.paperStartingQuote);
  const strategy = createStrategy(config);
  const jupiter = new JupiterClient(config.jupiterBaseUrl);

  let executor: Executor;
  if (config.mode === "live") {
    const keypair = loadKeypair(config.privateKey!);
    const connection = new Connection(config.rpcUrl, "confirmed");
    executor = new LiveExecutor(connection, keypair, jupiter, config);
    warn("LIVE MODE: trades will spend real funds from wallet " + keypair.publicKey.toBase58());
    warn("Stop the bot with Ctrl+C. Only trade funds you can afford to lose.");
  } else {
    executor = new PaperExecutor(config.slippageBps);
    log(`Paper mode: simulated fills, starting balance ${state.paperQuoteBalance.toFixed(2)} ${config.quoteSymbol}`);
  }

  const engine = new Engine(config, state, strategy, executor, jupiter);

  if (args.has("--status")) {
    console.log(engine.statusSummary());
    return;
  }

  log(`Starting bot: ${pair}, strategy ${strategy.name}, poll every ${config.pollIntervalSec}s`);

  let running = true;
  const shutdown = (signal: string) => {
    log(`${signal} received, shutting down after current tick…`);
    running = false;
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));

  do {
    try {
      await engine.tick();
    } catch (err) {
      error(`tick failed: ${err instanceof Error ? err.message : String(err)}`);
    }
    if (args.has("--once")) break;
    if (running) {
      await new Promise((resolve) => setTimeout(resolve, config.pollIntervalSec * 1000));
    }
  } while (running);

  console.log("\n" + engine.statusSummary());
}

main().catch((err) => {
  error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
