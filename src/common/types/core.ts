import type { AVMChainType, ChainType, EVMChainType, NetworkType } from "./chain.js";
import type { AVMFolksChainId } from "../../chains/avm/types/chain.js";
import type { EVMFolksChainId } from "../../chains/evm/types/chain.js";
import type { AlgorandClient as AVMProvider } from "@algorandfoundation/algokit-utils";
import type { BaseWallet as AVMSigner } from "@txnlab/use-wallet";
import type { Client as EVMProvider, WalletClient as EVMSigner } from "viem";

type FolksProviderTypeMap = {
  [ChainType.EVM]: EVMProvider;
  [ChainType.AVM]: AVMProvider;
};
type FolksSignerTypeMap = {
  [ChainType.EVM]: EVMSigner;
  [ChainType.AVM]: AVMSigner;
};
type FolksChainSignerTypeMap = {
  [ChainType.EVM]: {
    signer: EVMSigner;
    folksChainId: EVMFolksChainId;
    chainType: EVMChainType;
  };
  [ChainType.AVM]: {
    signer: AVMSigner;
    folksChainId: AVMFolksChainId;
    chainType: AVMChainType;
  };
};

export type FolksSignerType<T extends ChainType> = FolksSignerTypeMap[T];

export type FolksChainSignerType<T extends ChainType> = FolksChainSignerTypeMap[T];

export type FolksProvider<T extends ChainType> = FolksProviderTypeMap[T];

export type FolksSigner<T extends ChainType> = FolksChainSignerTypeMap[T];

export type FolksCoreProvider = {
  EVM: Partial<Record<EVMFolksChainId, EVMProvider>>;
  AVM: Partial<Record<AVMFolksChainId, AVMProvider>>;
};

export type FolksCoreConfig = {
  network: NetworkType;
  provider: FolksCoreProvider;
};

export type FolksEVMSigner = {
  signer: EVMSigner;
  chainType: EVMChainType;
};

export type FolksAVMSigner = {
  signer: AVMSigner;
  chainType: AVMChainType;
};

export type FolksChainSigner = FolksEVMSigner | FolksAVMSigner;
