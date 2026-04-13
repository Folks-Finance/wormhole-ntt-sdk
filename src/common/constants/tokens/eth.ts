import { EVM_FOLKS_CHAIN_ID } from "../../../chains/evm/constants/chain.js";
import { TransceiverType } from "../../types/ntt.js";

import { WETH_NTT_TOKEN_ID } from "./weth.js";

import type { EVMAddress } from "../../types/address.js";
import type { NTTTokenConfig, NTTTokenId } from "../../types/ntt.js";

export const ETH_NTT_TOKEN_ID = "ETH" as NTTTokenId;

const ETH_NTT_TOKEN_ETHEREUM_MAINNET = {
  wrappedNttTokenId: WETH_NTT_TOKEN_ID,
  nttTokenAddress: "0x0000000000000000000000000000000000000000" as EVMAddress,
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

export const ETH_NTT_TOKEN: NTTTokenConfig = {
  [EVM_FOLKS_CHAIN_ID.ETHEREUM]: ETH_NTT_TOKEN_ETHEREUM_MAINNET,
};
