import { FolksBridge, FolksCore, MAINNET_FOLKS_CHAIN_ID, NetworkType, TokenType } from "../src/index.js";

import type { FolksCoreConfig } from "../src/index.js";

async function main() {
  const network = NetworkType.MAINNET;
  const folksConfig: FolksCoreConfig = {
    network,
    provider: { EVM: {}, AVM: {} },
  };

  FolksCore.init(folksConfig);
  FolksCore.setNetwork(network);

  const quote = await FolksBridge.read.quote(MAINNET_FOLKS_CHAIN_ID.BASE, MAINNET_FOLKS_CHAIN_ID.AVALANCHE, {
    tokenType: TokenType.GAS,
    tokenSymbol: "",
    tokenDecimals: 18,
  });

  console.log(quote);
}

main().catch(console.error);
