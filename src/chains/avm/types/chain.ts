import type {
  AVM_CHAIN_NAMES,
  AVM_FOLKS_CHAIN_ID,
  AVM_WORMHOLE_CHAIN_ID,
  MAINNET_AVM_CHAIN_NAMES,
  MAINNET_AVM_FOLKS_CHAIN_ID,
  TESTNET_AVM_CHAIN_NAMES,
  TESTNET_AVM_FOLKS_CHAIN_ID,
} from "../constants/chain.js";

export type MainnetAVMChainName = (typeof MAINNET_AVM_CHAIN_NAMES)[number];

export type TestnetAVMChainName = (typeof TESTNET_AVM_CHAIN_NAMES)[number];

export type AVMChainName = (typeof AVM_CHAIN_NAMES)[number];

// No chain id is defined for AVM chains

export type MainnetAVMFolksChainId = (typeof MAINNET_AVM_FOLKS_CHAIN_ID)[keyof typeof MAINNET_AVM_FOLKS_CHAIN_ID];

export type TestnetAVMFolksChainId = (typeof TESTNET_AVM_FOLKS_CHAIN_ID)[keyof typeof TESTNET_AVM_FOLKS_CHAIN_ID];

export type AVMFolksChainId = (typeof AVM_FOLKS_CHAIN_ID)[keyof typeof AVM_FOLKS_CHAIN_ID];

export type AVMWormholeChainId = (typeof AVM_WORMHOLE_CHAIN_ID)[keyof typeof AVM_WORMHOLE_CHAIN_ID];
