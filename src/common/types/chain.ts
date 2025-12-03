import type { AVMAddress, AVMContractId } from "./address.js";
import type { NTTExecutor } from "./ntt.js";
import type { AVMChainName, AVMFolksChainId, AVMWormholeChainId } from "../../chains/avm/types/chain.js";
import type { EVMChainName, EVMFolksChainId, EVMWormholeChainId } from "../../chains/evm/types/chain.js";
import type {
  FOLKS_CHAIN_ID,
  MAINNET_FOLKS_CHAIN_ID,
  MAINNET_WORMHOLE_CHAIN_ID,
  TESTNET_FOLKS_CHAIN_ID,
  TESTNET_WORMHOLE_CHAIN_ID,
  WORMHOLE_CHAIN_ID,
} from "../constants/chain.js";

export const ChainType = {
  EVM: "EVM",
  AVM: "AVM",
} as const;

export type ChainType = (typeof ChainType)[keyof typeof ChainType];
export type EVMChainType = typeof ChainType.EVM;
export type AVMChainType = typeof ChainType.AVM;

export const NetworkType = {
  MAINNET: "MAINNET",
  TESTNET: "TESTNET",
} as const;

export type NetworkType = (typeof NetworkType)[keyof typeof NetworkType];
export type MainnetNetworkType = typeof NetworkType.MAINNET;
export type TestnetNetworkType = typeof NetworkType.TESTNET;

export type FolksChainName = EVMChainName | AVMChainName;

export type MainnetFolksChainId = (typeof MAINNET_FOLKS_CHAIN_ID)[keyof typeof MAINNET_FOLKS_CHAIN_ID];

export type TestnetFolksChainId = (typeof TESTNET_FOLKS_CHAIN_ID)[keyof typeof TESTNET_FOLKS_CHAIN_ID];

export type FolksChainId = (typeof FOLKS_CHAIN_ID)[keyof typeof FOLKS_CHAIN_ID];

export type FolksChainIdMap = {
  [ChainType.EVM]: EVMFolksChainId;
  [ChainType.AVM]: AVMFolksChainId;
};

export type FolksChainIdType<T extends ChainType> = FolksChainIdMap[T];

export type MainnetWormholeChainId = (typeof MAINNET_WORMHOLE_CHAIN_ID)[keyof typeof MAINNET_WORMHOLE_CHAIN_ID];

export type TestnetWormholeChainId = (typeof TESTNET_WORMHOLE_CHAIN_ID)[keyof typeof TESTNET_WORMHOLE_CHAIN_ID];

export type WormholeChainId = (typeof WORMHOLE_CHAIN_ID)[keyof typeof WORMHOLE_CHAIN_ID];

export type WormholeChainIdMap = {
  [ChainType.EVM]: EVMWormholeChainId;
  [ChainType.AVM]: AVMWormholeChainId;
};

export type WormholeChainIdType<T extends ChainType> = WormholeChainIdMap[T];

export type IFolksChain = {
  chainName: FolksChainName;
  network: NetworkType;
};

export type NTTChainEVM = {
  chainType: EVMChainType;
  folksChainId: EVMFolksChainId;
  wormholeChainId: EVMWormholeChainId;
  nttExecutors: NTTExecutor<EVMChainType>;
} & IFolksChain;

export type NTTChainAVM = {
  chainType: AVMChainType;
  folksChainId: AVMFolksChainId;
  wormholeChainId: AVMWormholeChainId;
  opUp: AVMContractId;
  wormholeCore: AVMContractId;
  guardianAddress: AVMAddress;
  transceiverManager: AVMContractId;
  nttExecutors: NTTExecutor<AVMChainType>;
} & IFolksChain;

export type NTTChain<C extends ChainType> = {
  [ChainType.EVM]: NTTChainEVM;
  [ChainType.AVM]: NTTChainAVM;
}[C];

export type ChainIdToChainType<K> = K extends EVMFolksChainId
  ? EVMChainType
  : K extends AVMFolksChainId
    ? AVMChainType
    : never;

export type NetworkToChainId<K extends NetworkType> = K extends typeof NetworkType.MAINNET
  ? MainnetFolksChainId
  : K extends typeof NetworkType.TESTNET
    ? TestnetFolksChainId
    : never;

export type FolksNTTChain = NTTChain<EVMChainType> | NTTChain<AVMChainType>;
