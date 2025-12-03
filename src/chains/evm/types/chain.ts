import type {
  EVM_CHAIN_ID,
  EVM_CHAIN_NAMES,
  EVM_FOLKS_CHAIN_ID,
  EVM_WORMHOLE_CHAIN_ID,
  MAINNET_EVM_CHAIN_ID,
  MAINNET_EVM_CHAIN_NAMES,
  MAINNET_EVM_FOLKS_CHAIN_ID,
  TESTNET_EVM_CHAIN_ID,
  TESTNET_EVM_CHAIN_NAMES,
  TESTNET_EVM_FOLKS_CHAIN_ID,
} from "../constants/chain.js";

export type MainnetEVMChainName = (typeof MAINNET_EVM_CHAIN_NAMES)[number];

export type TestnetEVMChainName = (typeof TESTNET_EVM_CHAIN_NAMES)[number];

export type EVMChainName = (typeof EVM_CHAIN_NAMES)[number];

export type MainnetEVMChainId = (typeof MAINNET_EVM_CHAIN_ID)[keyof typeof MAINNET_EVM_CHAIN_ID];

export type TestnetEVMChainId = (typeof TESTNET_EVM_CHAIN_ID)[keyof typeof TESTNET_EVM_CHAIN_ID];

export type EVMChainId = (typeof EVM_CHAIN_ID)[keyof typeof EVM_CHAIN_ID];

export type MainnetEVMFolksChainId = (typeof MAINNET_EVM_FOLKS_CHAIN_ID)[keyof typeof MAINNET_EVM_FOLKS_CHAIN_ID];

export type TestnetEVMFolksChainId = (typeof TESTNET_EVM_FOLKS_CHAIN_ID)[keyof typeof TESTNET_EVM_FOLKS_CHAIN_ID];

export type EVMFolksChainId = (typeof EVM_FOLKS_CHAIN_ID)[keyof typeof EVM_FOLKS_CHAIN_ID];

export type EVMWormholeChainId = (typeof EVM_WORMHOLE_CHAIN_ID)[keyof typeof EVM_WORMHOLE_CHAIN_ID];
