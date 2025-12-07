#!/usr/bin/env node

import { addCode } from "./add_code";
import type { Address } from "viem";
import fs from "fs";
import path from "path";

interface AddCodeArgs {
  privateKey?: string;
  rpcUrl?: string;
  contractAddress?: Address;
  count: number;
}

function parseAddCodeArgs(args: string[]): AddCodeArgs {
  const result: AddCodeArgs = { count: 1 };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const next = args[i + 1];

    switch (arg) {
      case "-p":
      case "--private-key":
        result.privateKey = next;
        i++;
        break;
      case "-r":
      case "--rpc-url":
        result.rpcUrl = next;
        i++;
        break;
      case "-c":
      case "--contract-addr":
        result.contractAddress = next as Address;
        i++;
        break;
      case "-n":
      case "--number":
        result.count = parseInt(next, 10);
        i++;
        break;
    }
  }

  return result;
}

function printUsage(): void {
  console.log(`
Usage: vanadium-sdk <command> [options]

Commands:
  add-code    Add invite codes to contract

add-code options:
  -p, --private-key <key>     Private key for signing
  -r, --rpc-url <url>         RPC endpoint URL
  -c, --contract-addr <addr>  Contract address
  -n, --number <count>        Number of codes to generate (default: 1)

Example:
  vanadium-sdk add-code -p 0x... -r https://rpc.example.com -c 0x... -n 5
`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === "--help" || command === "-h") {
    printUsage();
    process.exit(0);
  }

  if (command === "add-code") {
    const params = parseAddCodeArgs(args.slice(1));

    if (!params.privateKey || !params.rpcUrl || !params.contractAddress) {
      console.error("Error: Missing required arguments");
      console.error("Required: --private-key, --rpc-url, --contract-addr");
      process.exit(1);
    }

    if (params.count < 1 || isNaN(params.count)) {
      console.error("Error: --number must be a positive integer");
      process.exit(1);
    }

    try {
      const result = await addCode({
        privateKey: params.privateKey,
        rpcUrl: params.rpcUrl,
        contractAddress: params.contractAddress,
        count: params.count,
      });

      console.log("\n========================================");
      console.log("INVITE CODES (share these with people you want to join your gateway):");
      console.log("========================================");

      result.codes.forEach((code, i) => {
        console.log(`${i + 1}. ${code}`);
      });

      const filePath = path.join(process.cwd(), "buyer_codes.txt");
      fs.appendFileSync(filePath, "\n" + result.codes.join("\n") + "\n");
      console.log(`\nCodes appended to ${filePath}`);
      console.log(`Total ETH spent: ${result.ethSpent} (${result.ethSpentUsd})`);
      console.log("========================================\n");
    } catch (err) {
      console.error("Error:", err instanceof Error ? err.message : err);
      process.exit(1);
    }
  } else {
    console.error(`Unknown command: ${command}`);
    printUsage();
    process.exit(1);
  }
}

main();
