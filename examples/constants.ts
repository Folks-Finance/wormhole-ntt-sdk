import { TESTNET_FOLKS_CHAIN_ID, TransceiverType } from "../src/index.js";

import type { EVMAddress, NTTTokenId, AVMAsaId, AVMContractId } from "../src/index.js";

export const CUSTOM_NTT_TOKEN_TESTNET_ID = "MYTOKEN" as NTTTokenId;

export const CUSTOM_NTT_TOKEN_TESTNET_EVM = {
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

export const CUSTOM_NTT_TOKEN_TESTNET_AVM = {
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
};

export const CUSTOM_NTT_TOKEN_TESTNET = {
  [CUSTOM_NTT_TOKEN_TESTNET_ID]: {
    [TESTNET_FOLKS_CHAIN_ID.ALGORAND_TESTNET]: CUSTOM_NTT_TOKEN_TESTNET_AVM,
    [TESTNET_FOLKS_CHAIN_ID.AVALANCHE_FUJI]: CUSTOM_NTT_TOKEN_TESTNET_EVM,
    [TESTNET_FOLKS_CHAIN_ID.BASE_SEPOLIA]: CUSTOM_NTT_TOKEN_TESTNET_EVM,
    [TESTNET_FOLKS_CHAIN_ID.POLYGON_AMOY]: CUSTOM_NTT_TOKEN_TESTNET_EVM,
  },
};
