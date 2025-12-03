import type { EVMFolksChainId } from "./chain.js";
import type { EVMAddress } from "../../../common/types/address.js";
import type { NTTTokenId } from "../../../common/types/ntt.js";

export type Erc20ContractSlot = {
  allowance: bigint;
};

export type AllowanceStateOverride = {
  erc20Address: EVMAddress;
  stateDiff: Array<{
    owner: EVMAddress;
    spender: EVMAddress;
    slot: bigint;
    amount: bigint;
  }>;
};

export type NttAllowanceStateOverride = {
  erc20Address: EVMAddress;
  stateDiff: Array<{
    owner: EVMAddress;
    spender: EVMAddress;
    folksChainId: EVMFolksChainId;
    nttTokenId: NTTTokenId;
    amount: bigint;
  }>;
};
