import { avalancheFuji } from "viem/chains";

import { FOLKS_TESTNET_NTT_TOKEN_ID } from "../src/common/constants/token.js";
import {
  ChainType,
  convertToGenericAddress,
  FolksBridge,
  FolksCore,
  NetworkType,
  TESTNET_FOLKS_CHAIN_ID,
} from "../src/index.js";

import { getEVMSigner } from "./utils.js";

import type { AVMAddress, FolksCoreConfig } from "../src/index.js";

async function main() {
  const network = NetworkType.TESTNET;
  const chain = avalancheFuji;
  const folksConfig: FolksCoreConfig = {
    network,
    provider: { EVM: {}, AVM: {} },
  };

  FolksCore.init(folksConfig);
  FolksCore.setNetwork(network);

  const evmSigner = getEVMSigner(network, chain);
  FolksCore.setFolksSigner({
    signer: evmSigner,
    folksChainId: TESTNET_FOLKS_CHAIN_ID.AVALANCHE_FUJI,
    chainType: ChainType.EVM,
  });

  const prepareCall = await FolksBridge.prepare.manualInitiateTransfer(
    FOLKS_TESTNET_NTT_TOKEN_ID,
    1_000_000n,
    TESTNET_FOLKS_CHAIN_ID.ALGORAND_TESTNET,
    convertToGenericAddress("5F3UPPGBWR2KBH3B3TJYJXQYIRVVNOVGOJLOVY6ALHCIMDW2SWS4FA7VLU" as AVMAddress, ChainType.AVM),
  );
  console.log(prepareCall);

  const txHash = await FolksBridge.write.manualInitiateTransfer(prepareCall);
  console.log(txHash);
}

main().catch(console.error);
