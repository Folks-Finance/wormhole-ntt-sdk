import { AVM_FOLKS_CHAIN_ID } from "../../../chains/avm/constants/chain.js";
import { EVM_FOLKS_CHAIN_ID } from "../../../chains/evm/constants/chain.js";
import { TransceiverType } from "../../types/ntt.js";

import type { AVMAsaId, AVMContractId, EVMAddress } from "../../types/address.js";
import type { NTTTokenConfig, NTTTokenId } from "../../types/ntt.js";

export const WETH_NTT_TOKEN_ID = "WETH" as NTTTokenId;

const WETH_NTT_TOKEN_ETHEREUM_MAINNET = {
  nttTokenAddress: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" as EVMAddress,
  decimals: 18,
  nttManagerAddress: "0x112154b98AaaBF6F0Bf9b541477dC312A6250F52" as EVMAddress,
  transceivers: [
    {
      transceiverType: TransceiverType.WORMHOLE,
      address: "0xa4E0270Aee1a894275Ff80811Cfa5bea86CE4B7E" as EVMAddress,
    },
  ],
  contractSlot: {
    allowance: 4n,
  },
};

const WETH_NTT_TOKEN_AVM_MAINNET = {
  assetId: 3495722210n as AVMAsaId,
  nttTokenAddress: 3495722155n as AVMContractId,
  decimals: 8,
  nttManagerAddress: 3495722627n as AVMContractId,
  transceivers: [
    {
      transceiverType: TransceiverType.WORMHOLE,
      address: 3495722798n as AVMContractId,
    },
  ],
};

export const WETH_NTT_TOKEN: NTTTokenConfig = {
  [EVM_FOLKS_CHAIN_ID.ETHEREUM]: WETH_NTT_TOKEN_ETHEREUM_MAINNET,
  [AVM_FOLKS_CHAIN_ID.ALGORAND]: WETH_NTT_TOKEN_AVM_MAINNET,
};
