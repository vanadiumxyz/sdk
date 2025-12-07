# Vanadium SDK

A TypeScript SDK for managing invite codes on EVM-compatible blockchains.

## Installation

```bash
npm install @vanadium/sdk
```

## Usage

### As a Library

```typescript
import { addCode } from "@vanadium/sdk";

const result = await addCode({
  privateKey: "0x...",
  rpcUrl: "https://rpc.example.com",
  contractAddress: "0x...",
  count: 5, // optional, defaults to 1
});

console.log(result.codes);           // Array of generated invite codes
console.log(result.transactionHash); // Transaction hash
```

### As a CLI

```bash
npx @vanadium/sdk add-code \
  -p <private-key> \
  -r <rpc-url> \
  -c <contract-address> \
  -n <number-of-codes>
```

#### Options

| Flag | Long | Description | Required |
|------|------|-------------|----------|
| `-p` | `--private-key` | Private key for signing transactions | Yes |
| `-r` | `--rpc-url` | RPC endpoint URL | Yes |
| `-c` | `--contract-addr` | Contract address | Yes |
| `-n` | `--number` | Number of codes to generate | No (default: 1) |

#### Example

```bash
npx @vanadium/sdk add-code \
  -p 0xabc123... \
  -r https://rpc.sepolia.org \
  -c 0xdef456... \
  -n 10
```

Generated codes are printed to the console and appended to `buyer_codes.txt` in the current directory.

## API

### `addCode(params: AddCodeParams): Promise<AddCodeResult>`

Generates invite codes, hashes them, and submits them to the contract.

#### Parameters

```typescript
interface AddCodeParams {
  privateKey: string;      // Wallet private key
  rpcUrl: string;          // RPC endpoint URL
  contractAddress: Address; // Contract address
  count?: number;          // Number of codes (default: 1)
}
```

#### Returns

```typescript
interface AddCodeResult {
  codes: Hex[];            // Generated invite codes
  transactionHash: Hex;    // Transaction hash
}
```

## License

ISC
