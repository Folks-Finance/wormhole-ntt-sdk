import { encodeAbiParameters } from "viem";

import { getNttChainToken } from "../../../common/utils/token.js";

import { getAllowanceSlotHash } from "./contract.js";

import type { EVMChainType } from "../../../common/types/chain.js";
import type { NTTTokenId } from "../../../common/types/ntt.js";
import type { EVMFolksChainId } from "../types/chain.js";
import type { AllowanceStateOverride, NttAllowanceStateOverride } from "../types/tokens.js";
import type { StateOverride } from "viem";

export function getNTTTokenContractSlot(folksChainId: EVMFolksChainId, nttTokenId: NTTTokenId) {
  const token = getNttChainToken<EVMChainType>(nttTokenId, folksChainId);
  return token.contractSlot;
}

export function getAllowanceStateOverride(allowanceStatesOverride: Array<AllowanceStateOverride>): StateOverride {
  return allowanceStatesOverride.map((aso) => ({
    address: aso.erc20Address,
    stateDiff: aso.stateDiff.map((sd) => ({
      slot: getAllowanceSlotHash(sd.owner, sd.spender, sd.slot),
      value: encodeAbiParameters([{ type: "uint256" }], [sd.amount]),
    })),
  }));
}

export function getNttTokenAllowanceStateOverride(
  allowanceStatesOverride: Array<NttAllowanceStateOverride>,
): StateOverride {
  return allowanceStatesOverride.map((aso) => ({
    address: aso.erc20Address,
    stateDiff: aso.stateDiff.map((sd) => ({
      slot: getAllowanceSlotHash(
        sd.owner,
        sd.spender,
        getNTTTokenContractSlot(sd.folksChainId, sd.nttTokenId).allowance,
      ),
      value: encodeAbiParameters([{ type: "uint256" }], [sd.amount]),
    })),
  }));
}
