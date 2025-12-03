import { bytesToHex } from "viem";

import {
  ChainType,
  FOLKS_TESTNET_NTT_TOKEN_ID,
  FolksBridge,
  FolksCore,
  NetworkType,
  TESTNET_FOLKS_CHAIN_ID,
} from "../src/index.js";

import { getAVMSigner } from "./utils.js";

import type { FolksCoreConfig } from "../src/index.js";

async function main() {
  const network = NetworkType.TESTNET;
  const folksConfig: FolksCoreConfig = {
    network,
    provider: { EVM: {}, AVM: {} },
  };

  FolksCore.init(folksConfig);
  FolksCore.setNetwork(network);

  const avmSigner = await getAVMSigner(network);
  FolksCore.setFolksSigner({
    signer: avmSigner,
    folksChainId: TESTNET_FOLKS_CHAIN_ID.ALGORAND_TESTNET,
    chainType: ChainType.AVM,
  });

  const vaaRaw = Buffer.from(
    "AQAAAAABAPJOyfUH4y53q4JUCCy8W/TNLXK9xqm/yXtkALked0saSncJOGZ8dZ/EIlkP5gXzHNetyZILwXDP/9EtJzvqvoMBaPYP/wAAAAAABgAAAAAAAAAAAAAAAFqT4Vken8om856zvtrehKBSxRMMAAAAAAAAAAMPmUX/EAAAAAAAAAAAAAAAAMLntW2W0/r6VJr6hdKijaMha1dBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACyWruIAkQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFocKaoXNFSIpuX0BgZTWZ0D5MtYAT5lOVFQGAAAAAAAPQkAAAAAAAAAAAAAAAAA6WcWpH6idruNE4+wPmAGaxuNw3ul3R7zBtHSgn2Hc04TeGERrVrqmclbq48BZxIYO2pWlAAgAAA==",
    "base64",
  );
  const prepareCall = await FolksBridge.prepare.manualCompleteTransfer(FOLKS_TESTNET_NTT_TOKEN_ID, bytesToHex(vaaRaw));
  console.log(prepareCall);

  const txHash = await FolksBridge.write.manualCompleteTransfer(prepareCall);
  console.log(txHash);
}

main().catch(console.error);
