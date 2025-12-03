import { WalletId, WalletManager } from "@txnlab/use-wallet";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { NetworkType } from "../src/index.js";

import type { Chain, Hex } from "viem";

export async function getAVMSigner(network: NetworkType) {
  const AVM_MNEMONIC =
    process.env[
      network === NetworkType.MAINNET ? "ALGORAND_MAINNET_ACCOUNT_MNEMONIC" : "ALGORAND_TESTNET_ACCOUNT_MNEMONIC"
    ];
  if (!AVM_MNEMONIC) throw new Error("Failed to get mnemonic from .env");

  const manager = new WalletManager({
    wallets: [
      {
        id: WalletId.MNEMONIC,
        options: {
          promptForMnemonic: () => Promise.resolve(AVM_MNEMONIC),
        },
      },
    ],
  });

  const avmSigner = manager.getWallet(WalletId.MNEMONIC);
  await avmSigner?.connect();
  if (!avmSigner) throw new Error("Failed to get AVM signer");
  return avmSigner;
}

export function getEVMSigner(network: NetworkType, chain: Chain) {
  const PRIVATE_KEY =
    process.env[network === NetworkType.MAINNET ? "EVM_MAINNET_PRIVATE_KEY" : "EVM_TESTNET_PRIVATE_KEY"];
  if (!PRIVATE_KEY) throw new Error("Failed to get private key from .env");

  const account = privateKeyToAccount(PRIVATE_KEY as Hex);

  return createWalletClient({
    account,
    chain,
    transport: http(),
  });
}
