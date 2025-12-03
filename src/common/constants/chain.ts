import {
  MAINNET_AVM_FOLKS_CHAIN,
  MAINNET_AVM_FOLKS_CHAIN_ID,
  MAINNET_AVM_WORMHOLE_CHAIN_ID,
  TESTNET_AVM_FOLKS_CHAIN,
  TESTNET_AVM_FOLKS_CHAIN_ID,
  TESTNET_AVM_WORMHOLE_CHAIN_ID,
} from "../../chains/avm/constants/chain.js";
import {
  MAINNET_EVM_FOLKS_CHAIN,
  MAINNET_EVM_FOLKS_CHAIN_ID,
  MAINNET_EVM_WORMHOLE_CHAIN_ID,
  TESTNET_EVM_FOLKS_CHAIN,
  TESTNET_EVM_FOLKS_CHAIN_ID,
  TESTNET_EVM_WORMHOLE_CHAIN_ID,
} from "../../chains/evm/constants/chain.js";

import type {
  FolksChainId,
  FolksChainName,
  FolksNTTChain,
  MainnetFolksChainId,
  TestnetFolksChainId,
} from "../types/chain.js";
import type { ChainId as WormholeChainId } from "@wormhole-foundation/sdk";

export const MAINNET_FOLKS_CHAIN_ID = {
  ...MAINNET_EVM_FOLKS_CHAIN_ID,
  ...MAINNET_AVM_FOLKS_CHAIN_ID,
} as const;

export const TESTNET_FOLKS_CHAIN_ID = {
  ...TESTNET_EVM_FOLKS_CHAIN_ID,
  ...TESTNET_AVM_FOLKS_CHAIN_ID,
} as const;

export const FOLKS_CHAIN_ID = {
  ...MAINNET_FOLKS_CHAIN_ID,
  ...TESTNET_FOLKS_CHAIN_ID,
} as const satisfies Record<FolksChainName, string>;

export const MAINNET_WORMHOLE_CHAIN_ID = {
  ...MAINNET_EVM_WORMHOLE_CHAIN_ID,
  ...MAINNET_AVM_WORMHOLE_CHAIN_ID,
} as const;

export const TESTNET_WORMHOLE_CHAIN_ID = {
  ...TESTNET_EVM_WORMHOLE_CHAIN_ID,
  ...TESTNET_AVM_WORMHOLE_CHAIN_ID,
} as const;

export const WORMHOLE_CHAIN_ID = {
  ...MAINNET_WORMHOLE_CHAIN_ID,
  ...TESTNET_WORMHOLE_CHAIN_ID,
} as const satisfies Record<FolksChainName, WormholeChainId>;

export const TESTNET_FOLKS_CHAIN = {
  ...TESTNET_EVM_FOLKS_CHAIN,
  ...TESTNET_AVM_FOLKS_CHAIN,
} as const satisfies Record<TestnetFolksChainId, FolksNTTChain>;

export const MAINNET_FOLKS_CHAIN = {
  ...MAINNET_EVM_FOLKS_CHAIN,
  ...MAINNET_AVM_FOLKS_CHAIN,
} as const satisfies Record<MainnetFolksChainId, FolksNTTChain>;

export const FOLKS_CHAIN = {
  ...MAINNET_FOLKS_CHAIN,
  ...TESTNET_FOLKS_CHAIN,
} as const satisfies Record<FolksChainId, FolksNTTChain>;
