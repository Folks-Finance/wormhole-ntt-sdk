import { AVM_FOLKS_CHAIN_ID } from "../../chains/avm/constants/chain.js";
import { EVM_FOLKS_CHAIN_ID } from "../../chains/evm/constants/chain.js";
import { TransceiverType } from "../types/ntt.js";

import type { AVMAsaId, AVMContractId, EVMAddress } from "../types/address.js";
import type { FolksChainId } from "../types/chain.js";
import type { NTTTokenConfig, NTTTokenId } from "../types/ntt.js";

export const FOLKS_NTT_TOKEN_ID = "FOLKS" as NTTTokenId;
export const FOLKS_TESTNET_NTT_TOKEN_ID = "FOLKS_TESTNET" as NTTTokenId;

export const FOLKS_NTT_TOKEN_EVM_TESTNET = {
  nttTokenAddress: "0x090972399c8DFfFa24690b7a21B6C48630d8703d" as EVMAddress,
  decimals: 6,
  nttManagerAddress: "0x6a4e5Ad2b3FdD76A81575106809cC31ad63f7D04" as EVMAddress,
  transceivers: [
    {
      transceiverType: TransceiverType.WORMHOLE,
      address: "0xd34577D329221aB146940e59F1BB15aC31446161" as EVMAddress,
    },
  ],
  contractSlot: {
    allowance: 37439836327923360225337895871394760624280537466773280374265222508165906222593n,
  },
};
export const FOLKS_NTT_TOKEN_EVM_MAINNET = {
  nttTokenAddress: "0xFF7F8F301F7A706E3CfD3D2275f5dc0b9EE8009B" as EVMAddress,
  decimals: 6,
  nttManagerAddress: "0xd15274c3910600a8246C86a198DE18618Cd47401" as EVMAddress,
  transceivers: [
    {
      transceiverType: TransceiverType.WORMHOLE,
      address: "0xcEd94Bb2dEAdd11B645b840Ab17F503b93848121" as EVMAddress,
    },
  ],
  contractSlot: {
    allowance: 37439836327923360225337895871394760624280537466773280374265222508165906222593n,
  },
};

export const DEFAULT_NTT_TOKENS: Record<NTTTokenId, { [ChainId in FolksChainId]?: NTTTokenConfig<ChainId> }> = {
  [FOLKS_NTT_TOKEN_ID]: {
    [EVM_FOLKS_CHAIN_ID.ETHEREUM]: FOLKS_NTT_TOKEN_EVM_MAINNET,
    [EVM_FOLKS_CHAIN_ID.AVALANCHE]: FOLKS_NTT_TOKEN_EVM_MAINNET,
    [EVM_FOLKS_CHAIN_ID.BASE]: FOLKS_NTT_TOKEN_EVM_MAINNET,
    [EVM_FOLKS_CHAIN_ID.ARBITRUM]: FOLKS_NTT_TOKEN_EVM_MAINNET,
    [EVM_FOLKS_CHAIN_ID.BSC]: FOLKS_NTT_TOKEN_EVM_MAINNET,
    [EVM_FOLKS_CHAIN_ID.POLYGON]: FOLKS_NTT_TOKEN_EVM_MAINNET,
    [EVM_FOLKS_CHAIN_ID.SEI_EVM]: FOLKS_NTT_TOKEN_EVM_MAINNET,
    [EVM_FOLKS_CHAIN_ID.MONAD]: FOLKS_NTT_TOKEN_EVM_MAINNET,
    [AVM_FOLKS_CHAIN_ID.ALGORAND]: {
      assetId: 3203964481n as AVMAsaId,
      nttTokenAddress: 3298396274n as AVMContractId,
      decimals: 6,
      nttManagerAddress: 3298422643n as AVMContractId,
      transceivers: [
        {
          transceiverType: TransceiverType.WORMHOLE,
          address: 3298432402n as AVMContractId,
        },
      ],
    },
  },

  [FOLKS_TESTNET_NTT_TOKEN_ID]: {
    [EVM_FOLKS_CHAIN_ID.ETHEREUM_SEPOLIA]: FOLKS_NTT_TOKEN_EVM_TESTNET,
    [EVM_FOLKS_CHAIN_ID.AVALANCHE_FUJI]: FOLKS_NTT_TOKEN_EVM_TESTNET,
    [EVM_FOLKS_CHAIN_ID.BASE_SEPOLIA]: FOLKS_NTT_TOKEN_EVM_TESTNET,
    [EVM_FOLKS_CHAIN_ID.ARBITRUM_SEPOLIA]: FOLKS_NTT_TOKEN_EVM_TESTNET,
    [EVM_FOLKS_CHAIN_ID.BSC_TESTNET]: FOLKS_NTT_TOKEN_EVM_TESTNET,
    [EVM_FOLKS_CHAIN_ID.POLYGON_AMOY]: FOLKS_NTT_TOKEN_EVM_TESTNET,
    [EVM_FOLKS_CHAIN_ID.SEI_EVM_TESTNET]: FOLKS_NTT_TOKEN_EVM_TESTNET,
    [AVM_FOLKS_CHAIN_ID.ALGORAND_TESTNET]: {
      assetId: 745557597n as AVMAsaId,
      nttTokenAddress: 748801113n as AVMContractId,
      decimals: 6,
      nttManagerAddress: 748802948n as AVMContractId,
      transceivers: [
        {
          transceiverType: TransceiverType.WORMHOLE,
          address: 748803521n as AVMContractId,
        },
      ],
    },
  },
};
