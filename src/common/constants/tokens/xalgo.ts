import { AVM_FOLKS_CHAIN_ID } from "../../../chains/avm/constants/chain.js";
import { EVM_FOLKS_CHAIN_ID } from "../../../chains/evm/constants/chain.js";
import { TransceiverType } from "../../types/ntt.js";

import type { AVMAsaId, AVMContractId, EVMAddress } from "../../types/address.js";
import type { NTTTokenConfig, NTTTokenId } from "../../types/ntt.js";

export const XALGO_NTT_TOKEN_ID = "XALGO" as NTTTokenId;

const XALGO_NTT_TOKEN_EVM_MAINNET = {
  isNativeTokenWrapped: false,
  nttTokenAddress: "0x23614eD94c202D487eB317Dac4501094C8b36141" as EVMAddress,
  decimals: 6,
  nttManagerAddress: "0xc28CF5A9DB85Abd47062625D9CB38830553168DD" as EVMAddress,
  transceivers: [
    {
      transceiverType: TransceiverType.WORMHOLE,
      address: "0xB6aC1a1e3eb9407349525bA9bbcB72721777fE17" as EVMAddress,
    },
  ],
  contractSlot: {
    allowance: 1n,
  },
};

const XALGO_NTT_TOKEN_AVM_MAINNET = {
  assetId: 1134696561n as AVMAsaId,
  nttTokenAddress: 3495531977n as AVMContractId,
  decimals: 6,
  nttManagerAddress: 3495532393n as AVMContractId,
  transceivers: [
    {
      transceiverType: TransceiverType.WORMHOLE,
      address: 3495532818n as AVMContractId,
    },
  ],
};

export const XALGO_NTT_TOKEN: NTTTokenConfig = {
  [EVM_FOLKS_CHAIN_ID.ETHEREUM]: XALGO_NTT_TOKEN_EVM_MAINNET,
  [EVM_FOLKS_CHAIN_ID.AVALANCHE]: XALGO_NTT_TOKEN_EVM_MAINNET,
  [EVM_FOLKS_CHAIN_ID.BASE]: XALGO_NTT_TOKEN_EVM_MAINNET,
  [EVM_FOLKS_CHAIN_ID.ARBITRUM]: XALGO_NTT_TOKEN_EVM_MAINNET,
  [EVM_FOLKS_CHAIN_ID.BSC]: XALGO_NTT_TOKEN_EVM_MAINNET,
  [EVM_FOLKS_CHAIN_ID.POLYGON]: XALGO_NTT_TOKEN_EVM_MAINNET,
  [AVM_FOLKS_CHAIN_ID.ALGORAND]: XALGO_NTT_TOKEN_AVM_MAINNET,
};
