import { FOLKS_TESTNET_NTT_TOKEN_ID } from "../src/common/constants/token.js";
import {
  ChainType,
  convertToGenericAddress,
  FolksBridge,
  FolksCore,
  NetworkType,
  TESTNET_FOLKS_CHAIN_ID,
} from "../src/index.js";

import { getAVMSigner } from "./utils.js";

import type { EVMAddress, FolksCoreConfig } from "../src/index.js";

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

  const prepareCall = await FolksBridge.prepare.manualInitiateTransfer(
    FOLKS_TESTNET_NTT_TOKEN_ID,
    1_000_000n,
    TESTNET_FOLKS_CHAIN_ID.AVALANCHE_FUJI,
    convertToGenericAddress("0x16870a6A85cD152229B97d018194d66740f932d6" as EVMAddress, ChainType.EVM),
  );
  console.log(prepareCall);

  const txHash = await FolksBridge.write.manualInitiateTransfer(prepareCall);
  console.log(txHash);
}

main().catch(console.error);
