import { createClient, fallback, http } from "viem";

import { CHAIN_NODE, CHAIN_VIEM, EVM_FOLKS_CHAIN_ID } from "../constants/chain.js";

import { isEVMChainId } from "./chain.js";

import type { EVMChainId, EVMFolksChainId } from "../types/chain.js";
import type { Client } from "viem";

export function initProviders(
  customProvider: Partial<Record<EVMFolksChainId, Client>>,
): Record<EVMFolksChainId, Client> {
  return Object.fromEntries(
    Object.values(EVM_FOLKS_CHAIN_ID).map((evmFolksChainId) => [
      evmFolksChainId,
      customProvider[evmFolksChainId] ??
        createClient({
          chain: CHAIN_VIEM[evmFolksChainId],
          transport: fallback(CHAIN_NODE[evmFolksChainId].map((url: string) => http(url))),
        }),
    ]),
  ) as Record<EVMFolksChainId, Client>;
}

export function getChainId(provider: Client): EVMChainId {
  const chainId = provider.chain?.id;

  if (chainId === undefined) {
    throw new Error("EVM provider chain id is undefined");
  }

  if (!isEVMChainId(chainId)) {
    throw new Error(`EVM provider chain id is not supported: ${chainId}`);
  }

  return chainId;
}
