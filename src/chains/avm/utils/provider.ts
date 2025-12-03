import { AlgorandClient } from "@algorandfoundation/algokit-utils";

import { AVM_FOLKS_CHAIN_ID } from "../constants/chain.js";
import { DEFAULT_VALIDITY_WINDOW } from "../constants/txn.js";

import type { AVMFolksChainId } from "../types/chain.js";
import type { AlgorandClient as AVMProvider } from "@algorandfoundation/algokit-utils";

const AVM_PROVIDER = {
  [AVM_FOLKS_CHAIN_ID.ALGORAND]: AlgorandClient.mainNet(),
  [AVM_FOLKS_CHAIN_ID.ALGORAND_TESTNET]: AlgorandClient.testNet(),
};

export function initProviders(
  customProvider: Partial<Record<AVMFolksChainId, AVMProvider>>,
): Record<AVMFolksChainId, AVMProvider> {
  return Object.fromEntries(
    Object.values(AVM_FOLKS_CHAIN_ID).map((avmFolksChainId) => {
      const provider = customProvider[avmFolksChainId] ?? AVM_PROVIDER[avmFolksChainId];
      provider.setDefaultValidityWindow(DEFAULT_VALIDITY_WINDOW);

      return [avmFolksChainId, provider];
    }),
  ) as Record<AVMFolksChainId, AVMProvider>;
}
