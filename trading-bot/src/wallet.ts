import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

/**
 * Load a keypair from SOLANA_PRIVATE_KEY. Accepts either a base58-encoded
 * secret key (Phantom export format) or a JSON byte array (solana-keygen
 * file contents).
 */
export function loadKeypair(privateKey: string): Keypair {
  const trimmed = privateKey.trim();
  if (trimmed.startsWith("[")) {
    const bytes = JSON.parse(trimmed) as number[];
    return Keypair.fromSecretKey(Uint8Array.from(bytes));
  }
  return Keypair.fromSecretKey(bs58.decode(trimmed));
}
