import { waitForTransactionReceipt } from "viem/actions";

import { ChainType } from "../types/chain.js";

import { exhaustiveCheck } from "./exhaustive-check.js";

import type { FolksProvider } from "../types/core.js";
import type { Client, Hex, TransactionReceipt } from "viem";

export async function waitTransaction(
  chainType: ChainType,
  folksProvider: FolksProvider<typeof chainType>,
  txnHash: Hex,
  confirmations = 1,
): Promise<TransactionReceipt> {
  switch (chainType) {
    case ChainType.EVM: {
      return await waitForTransactionReceipt(folksProvider as Client, {
        hash: txnHash,
        confirmations,
      });
    }
    case ChainType.AVM: {
      throw new Error("AVM transaction waiting is not supported yet"); //TODO
    }
    default:
      return exhaustiveCheck(chainType);
  }
}
