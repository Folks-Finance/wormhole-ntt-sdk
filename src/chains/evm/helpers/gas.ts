import { FOLKS_CHAIN_ID } from "../../../common/constants/chain.js";
import { ChainType } from "../../../common/types/chain.js";
import { exhaustiveCheck } from "../../../common/utils/exhaustive-check.js";
import { DEFAULT_EVM_GAS_INSTRUCTION_GAS_LIMIT, DEFAULT_MONAD_GAS_INSTRUCTION_GAS_LIMIT } from "../constants/ntt.js";

import type { FolksChainId } from "../../../common/types/chain.js";

export function getGasInstructionGasLimit(destFolksChainId: FolksChainId, chainType: ChainType) {
  switch (chainType) {
    case ChainType.EVM:
      // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
      switch (destFolksChainId) {
        case FOLKS_CHAIN_ID.MONAD:
          return DEFAULT_MONAD_GAS_INSTRUCTION_GAS_LIMIT;
        default:
          return DEFAULT_EVM_GAS_INSTRUCTION_GAS_LIMIT;
      }
    case ChainType.AVM:
      return 0n;
    default:
      return exhaustiveCheck(chainType);
  }
}
