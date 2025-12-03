import { bytesToHex } from "viem";
import { avalancheFuji } from "viem/chains";

import {
  ChainType,
  FOLKS_TESTNET_NTT_TOKEN_ID,
  FolksBridge,
  FolksCore,
  NetworkType,
  TESTNET_FOLKS_CHAIN_ID,
} from "../src/index.js";

import { getEVMSigner } from "./utils.js";

import type { FolksCoreConfig } from "../src/index.js";

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

  const vaaRaw = Buffer.from(
    "AQAAAAABAEy47Y54tZ2/Gnm7L/kaZp1igPdJKP9woZkdig2YjBVdRwHcIhhIUgQVwZIWFl0Y/w05SqvwaQTgEaw8V2sx3AcBaPYQPwAAAAAACFp7Vm/RD3I/7mYPVa5c5AHh+tIBvIkF1xjKKpGXt0adAAAAAAAAAAEAmUX/EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAslq7iAAAAAAAAAAAAAAAAwue1bZbT+vpUmvqF0qKNoyFrV0EAkWwx/BVCLrrSiq+QicMGcC9nVAtTx+6ot9KUEESwJxAP6XdHvMG0dKCfYdzThN4YRGtWuqZyVurjwFnEhg7alaUAT5lOVFQGAAAAAAAPQkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALGsBPwAAAAAAAAAAAAAAABaHCmqFzRUiKbl9AYGU1mdA+TLWAAYAAA==",
    "base64",
  );
  const prepareCall = await FolksBridge.prepare.manualCompleteTransfer(FOLKS_TESTNET_NTT_TOKEN_ID, bytesToHex(vaaRaw));
  console.log(prepareCall);

  const txHash = await FolksBridge.write.manualCompleteTransfer(prepareCall);
  console.log(txHash);
}

main().catch(console.error);
