import { EVM_FOLKS_CHAIN_ID } from "../constants/chain.js";

import type { EVMAddress } from "../../../common/types/address.js";
import type { EVMChainId } from "../types/chain.js";
import type { Account, WalletClient } from "viem";

export function getEVMSignerAddress(signer: WalletClient): EVMAddress {
  if (signer.account?.address) {
    return signer.account.address as EVMAddress;
  }

  throw new Error("EVM Signer address is not set");
}

export function getEVMSignerAccount(signer: WalletClient): Account {
  if (signer.account) {
    return signer.account;
  }

  throw new Error("EVM Signer account is not set");
}

export function isEVMChainId(chainId: number): chainId is EVMChainId {
  // @ts-expect-error -- this is made on purpose to have the type predicate
  return Object.values(EVM_FOLKS_CHAIN_ID).includes(chainId);
}
