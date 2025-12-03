import { NetworkType } from "../types/chain.js";

export const MAINNET_WH_SCAN_API_URL = "https://api.wormholescan.io/api/v1";
export const TESTNET_WH_SCAN_API_URL = "https://api.testnet.wormholescan.io/api/v1";
export const WH_SCAN_API_URL: Record<NetworkType, string> = {
  [NetworkType.MAINNET]: MAINNET_WH_SCAN_API_URL,
  [NetworkType.TESTNET]: TESTNET_WH_SCAN_API_URL,
};

export const MAINNET_EXECUTOR_API_URL = "https://api.executor.folks.finance/v0";
export const TESTNET_EXECUTOR_API_URL = "https://api.testnet.executor.folks.finance/v0";
export const EXECUTOR_API_URL: Record<NetworkType, string> = {
  [NetworkType.MAINNET]: MAINNET_EXECUTOR_API_URL,
  [NetworkType.TESTNET]: TESTNET_EXECUTOR_API_URL,
};
