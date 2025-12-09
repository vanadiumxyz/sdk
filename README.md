# Vanadium SDK

Invite code management for EVM chains. Generates random 32-byte codes, hashes via `keccak256(abi.encodePacked(code))`, and submits to contract.

## Install

```bash
npm i @vanadium/sdk
```

## Library

```typescript
import { addCode } from "@vanadium/sdk";

const { codes, transactionHash } = await addCode({
  privateKey: "0x...",
  rpcUrl: "https://rpc.sepolia.org",
  contractAddress: "0x...",
  count: 5,
});
```

## CLI

```bash
npx @vanadium/sdk add-code -p <key> -r <rpc> -c <addr> [-n <count>]
```

Codes output to stdout and appended to `buyer_codes.txt`.

## Args

| Arg | CLI | Description |
|-----|-----|-------------|
| `privateKey` | `-p, --private-key` | Signing key (with or without `0x` prefix) |
| `rpcUrl` | `-r, --rpc-url` | JSON-RPC endpoint |
| `contractAddress` | `-c, --contract-addr` | Your gateway contract address |
| `count` | `-n, --number` | Number of codes to generate (default: 1) |
