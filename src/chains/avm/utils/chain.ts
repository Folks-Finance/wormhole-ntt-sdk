import type { AVMAddress } from "../../../common/types/address.js";
import type { BaseWallet, WalletAccount } from "@txnlab/use-wallet";

export function getAVMSignerAddress(signer: BaseWallet): AVMAddress {
  if (signer.activeAddress) {
    return signer.activeAddress as AVMAddress;
  }

  throw new Error("AVM Signer address is not set");
}

export function getAVMSignerAccount(signer: BaseWallet): WalletAccount {
  if (signer.activeAccount) {
    return signer.activeAccount;
  }

  throw new Error("AVM Signer account is not set");
}
