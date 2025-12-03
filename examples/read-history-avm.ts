import { ChainType, convertToGenericAddress, FolksBridge, FolksCore, NetworkType } from "../src/index.js";

import type { AVMAddress, FolksCoreConfig } from "../src/index.js";

async function main() {
  const network = NetworkType.TESTNET;
  const folksConfig: FolksCoreConfig = {
    network,
    provider: { EVM: {}, AVM: {} },
  };

  FolksCore.init(folksConfig);
  FolksCore.setNetwork(network);

  const history = await FolksBridge.read.history(
    convertToGenericAddress("5F3UPPGBWR2KBH3B3TJYJXQYIRVVNOVGOJLOVY6ALHCIMDW2SWS4FA7VLU" as AVMAddress, ChainType.AVM),
    ChainType.AVM,
  );

  console.log(history);
}

main().catch(console.error);
