import { ChainType, convertToGenericAddress, FolksBridge, FolksCore, NetworkType } from "../src/index.js";

import type { EVMAddress, FolksCoreConfig } from "../src/index.js";

async function main() {
  const network = NetworkType.TESTNET;
  const folksConfig: FolksCoreConfig = {
    network,
    provider: { EVM: {}, AVM: {} },
  };

  FolksCore.init(folksConfig);
  FolksCore.setNetwork(network);

  const history = await FolksBridge.read.history(
    convertToGenericAddress("0x16870a6A85cD152229B97d018194d66740f932d6" as EVMAddress, ChainType.EVM),
    ChainType.EVM,
  );

  console.log(history);
}

main().catch(console.error);
