import { ETH_NTT_TOKEN, ETH_NTT_TOKEN_ID } from "./tokens/eth.js";
import {
  FOLKS_NTT_TOKEN,
  FOLKS_NTT_TOKEN_ID,
  FOLKS_NTT_TOKEN_TESTNET,
  FOLKS_TESTNET_NTT_TOKEN_ID,
} from "./tokens/folks.js";
import { WBTC_NTT_TOKEN, WBTC_NTT_TOKEN_ID } from "./tokens/wbtc.js";
import { WETH_NTT_TOKEN, WETH_NTT_TOKEN_ID } from "./tokens/weth.js";
import { XALGO_NTT_TOKEN, XALGO_NTT_TOKEN_ID } from "./tokens/xalgo.js";

import type { NTTTokenConfig, NTTTokenId } from "../types/ntt.js";

export const DEFAULT_NTT_TOKENS: Record<NTTTokenId, NTTTokenConfig> = {
  // Mainnet
  [FOLKS_NTT_TOKEN_ID]: FOLKS_NTT_TOKEN,
  [XALGO_NTT_TOKEN_ID]: XALGO_NTT_TOKEN,
  [WBTC_NTT_TOKEN_ID]: WBTC_NTT_TOKEN,
  [ETH_NTT_TOKEN_ID]: ETH_NTT_TOKEN,
  [WETH_NTT_TOKEN_ID]: WETH_NTT_TOKEN,
  // Testnet
  [FOLKS_TESTNET_NTT_TOKEN_ID]: FOLKS_NTT_TOKEN_TESTNET,
};
