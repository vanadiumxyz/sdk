# Vanadium SDK

And SDK for interaction with Vanadium smart contracts.

The target audience is developers using the vanadium network and technical deployers of Vanadium Gateways.

## Install

```bash
npm i @vanadiumxyz/sdk
```

## Usage

### Create invite codes for a Gateway
```typescript
import { addCode } from "@vanadiumxyz/sdk";

const { codes, transactionHash } = await addCode({
  privateKey: "0x...",
  rpcUrl: "https://rpc.sepolia.org",
  contractAddress: "0x...",
  count: 5,
});
```

Or with the cli:

```bash
npx @vanadiumxyz/sdk add-code -p <key> -r <rpc> -c <addr> [-n <count>]
```
| Arg | CLI | Description |
|-----|-----|-------------|
| `privateKey` | `-p, --private-key` | Signing key (with or without `0x` prefix) |
| `rpcUrl` | `-r, --rpc-url` | JSON-RPC endpoint |
| `contractAddress` | `-c, --contract-addr` | Your gateway contract address |
| `count` | `-n, --number` | Number of codes to generate (default: 1) |
> Codes output to stdout and appended to `buyer_codes.txt`.
 