import {
  createWalletClient,
  createPublicClient,
  http,
  keccak256,
  encodePacked,
  formatEther,
  type Hex,
  type Address,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import crypto from "crypto";

const ABI = [
  {
    name: "addCodes",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "codeHashes", type: "bytes32[]" }],
    outputs: [],
  },
] as const;

export interface AddCodeParams {
  privateKey: string;
  rpcUrl: string;
  contractAddress: Address;
  count?: number;
}

export interface AddCodeResult {
  codes: Hex[];
  transactionHash: Hex;
  ethSpent: string;
  ethSpentUsd: string;
}

export async function addCode(params: AddCodeParams): Promise<AddCodeResult> {
  const { privateKey, rpcUrl, contractAddress, count = 1 } = params;

  if (count < 1) {
    throw new Error("Count must be a positive integer");
  }

  const codes: Hex[] = [];
  const codeHashes: Hex[] = [];

  for (let i = 0; i < count; i++) {
    const code = `0x${crypto.randomBytes(32).toString("hex")}` as Hex;
    const codeHash = keccak256(encodePacked(["bytes32"], [code]));
    codes.push(code);
    codeHashes.push(codeHash);
  }

  const formattedKey = (privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`) as Hex;
  const account = privateKeyToAccount(formattedKey);

  const publicClient = createPublicClient({
    transport: http(rpcUrl),
  });

  const walletClient = createWalletClient({
    account,
    transport: http(rpcUrl),
  });

  const chainId = await publicClient.getChainId();

  const hash = await walletClient.writeContract({
    address: contractAddress,
    abi: ABI,
    functionName: "addCodes",
    args: [codeHashes],
    chain: {
      id: chainId,
      name: "Custom",
      nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
      rpcUrls: { default: { http: [rpcUrl] } },
    },
  });

  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  if (receipt.status !== "success") {
    throw new Error("Transaction failed!");
  }

  const ethSpent = formatEther(receipt.gasUsed * receipt.effectiveGasPrice);

  // Fetch ETH price from CoinGecko
  let ethSpentUsd = "N/A";
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
    const data = await res.json() as { ethereum: { usd: number } };
    const ethPrice = data.ethereum.usd;
    const usdValue = parseFloat(ethSpent) * ethPrice;
    ethSpentUsd = `$${usdValue.toFixed(2)}`;
  } catch {
    // Price fetch failed, leave as N/A
  }

  return { codes, transactionHash: hash, ethSpent, ethSpentUsd };
}
