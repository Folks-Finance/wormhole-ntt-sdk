import { FolksBridge, FolksCore, NetworkType } from "../src/index.js";

import type { FolksCoreConfig } from "../src/index.js";

async function main() {
  const network = NetworkType.TESTNET;
  const folksConfig: FolksCoreConfig = {
    network,
    provider: { EVM: {}, AVM: {} },
  };

  FolksCore.init(folksConfig);
  FolksCore.setNetwork(network);

  const capabilities = await FolksBridge.read.capabilities();

  console.log(capabilities);
}

main().catch(console.error);
