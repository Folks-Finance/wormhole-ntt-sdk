import { chainToChainId } from "@wormhole-foundation/sdk";

import { ChainType, NetworkType } from "../../../common/types/chain.js";
import { ExecutorFeeType } from "../../../common/types/ntt.js";

import type { AVMAddress, AVMContractId } from "../../../common/types/address.js";
import type { AVMChainType, NTTChain } from "../../../common/types/chain.js";
import type { AVMChainName, MainnetAVMFolksChainId, TestnetAVMFolksChainId } from "../types/chain.js";
import type { ChainId as WormholeChainId } from "@wormhole-foundation/sdk";

export const MAINNET_AVM_CHAIN_NAMES = ["ALGORAND"] as const;

export const TESTNET_AVM_CHAIN_NAMES = ["ALGORAND_TESTNET"] as const;

export const AVM_CHAIN_NAMES = [...MAINNET_AVM_CHAIN_NAMES, ...TESTNET_AVM_CHAIN_NAMES] as const;

export const MAINNET_AVM_FOLKS_CHAIN_ID = {
  ALGORAND: "ALGORAND",
} as const;

export const TESTNET_AVM_FOLKS_CHAIN_ID = {
  ALGORAND_TESTNET: "ALGORAND_TESTNET",
} as const;

export const AVM_FOLKS_CHAIN_ID = {
  ...MAINNET_AVM_FOLKS_CHAIN_ID,
  ...TESTNET_AVM_FOLKS_CHAIN_ID,
} as const satisfies Record<AVMChainName, string>;

export const MAINNET_AVM_WORMHOLE_CHAIN_ID = {
  ALGORAND: chainToChainId("Algorand"),
} as const;

export const TESTNET_AVM_WORMHOLE_CHAIN_ID = {
  ALGORAND_TESTNET: chainToChainId("Algorand"),
} as const;

export const AVM_WORMHOLE_CHAIN_ID = {
  ...MAINNET_AVM_WORMHOLE_CHAIN_ID,
  ...TESTNET_AVM_WORMHOLE_CHAIN_ID,
} as const satisfies Record<AVMChainName, WormholeChainId>;

export const MAINNET_AVM_FOLKS_CHAIN: Record<MainnetAVMFolksChainId, NTTChain<AVMChainType>> = {
  [AVM_FOLKS_CHAIN_ID.ALGORAND]: {
    chainType: ChainType.AVM,
    wormholeChainId: AVM_WORMHOLE_CHAIN_ID.ALGORAND,
    folksChainId: AVM_FOLKS_CHAIN_ID.ALGORAND,
    chainName: "ALGORAND",
    network: NetworkType.MAINNET,
    opUp: 1167143153n as AVMContractId,
    wormholeCore: 842125965n as AVMContractId,
    guardianAddress: "XJC32PG73M4VIWAAZQZX6LRHPDAX2DMGVGQJJZSWJUZ5LECEVFMGJENX2M" as AVMAddress,
    transceiverManager: 3298383942n as AVMContractId,
    nttExecutors: {
      [ExecutorFeeType.NATIVE]: 3278916601n as AVMContractId,
      [ExecutorFeeType.TOKEN]: 3278916723n as AVMContractId,
    },
  },
};

export const TESTNET_AVM_FOLKS_CHAIN: Record<TestnetAVMFolksChainId, NTTChain<AVMChainType>> = {
  [AVM_FOLKS_CHAIN_ID.ALGORAND_TESTNET]: {
    chainType: ChainType.AVM,
    wormholeChainId: AVM_WORMHOLE_CHAIN_ID.ALGORAND_TESTNET,
    folksChainId: AVM_FOLKS_CHAIN_ID.ALGORAND_TESTNET,
    chainName: "ALGORAND_TESTNET",
    network: NetworkType.TESTNET,
    opUp: 397104542n as AVMContractId,
    wormholeCore: 86525623n as AVMContractId,
    guardianAddress: "Z7AISPXE4YFESMU35JXBEM6JZSKTVGPASEUQXLM7XTEKVUHOYTRVQHVYVQ" as AVMAddress,
    transceiverManager: 748800766n as AVMContractId,
    nttExecutors: {
      [ExecutorFeeType.NATIVE]: 748251968n as AVMContractId,
      [ExecutorFeeType.TOKEN]: 748251975n as AVMContractId,
    },
  },
};
