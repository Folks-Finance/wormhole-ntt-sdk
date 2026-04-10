import { AVM_FOLKS_CHAIN_ID } from "../../../chains/avm/constants/chain.js";
import { EVM_FOLKS_CHAIN_ID } from "../../../chains/evm/constants/chain.js";
import { TransceiverType } from "../../types/ntt.js";

import type { AVMAsaId, AVMContractId, EVMAddress } from "../../types/address.js";
import type { NTTTokenConfig, NTTTokenId } from "../../types/ntt.js";

export const WBTC_NTT_TOKEN_ID = "WBTC" as NTTTokenId;

const WBTC_NTT_TOKEN_ETHEREUM_MAINNET = {
  nttTokenAddress: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599" as EVMAddress,
  decimals: 8,
  nttManagerAddress: "0x10DC78D083BcfDD4dc33E578a4aC16c9F52BCcA3" as EVMAddress,
  transceivers: [
    {
      transceiverType: TransceiverType.WORMHOLE,
      address: "0x1996F510A8d4a0AA433F733Af0ba37B81Dd9d960" as EVMAddress,
    },
  ],
  contractSlot: {
    allowance: 2n,
  },
};

const WBTC_NTT_TOKEN_AVM_MAINNET = {
  assetId: 3495558025n as AVMAsaId,
  nttTokenAddress: 3495557925n as AVMContractId,
  decimals: 8,
  nttManagerAddress: 3495558747n as AVMContractId,
  transceivers: [
    {
      transceiverType: TransceiverType.WORMHOLE,
      address: 3495558905n as AVMContractId,
    },
  ],
};

export const WBTC_NTT_TOKEN: NTTTokenConfig = {
  [EVM_FOLKS_CHAIN_ID.ETHEREUM]: WBTC_NTT_TOKEN_ETHEREUM_MAINNET,
  [AVM_FOLKS_CHAIN_ID.ALGORAND]: WBTC_NTT_TOKEN_AVM_MAINNET,
};
