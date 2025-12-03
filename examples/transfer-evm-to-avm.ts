import { avalancheFuji } from "viem/chains";

import {
  ChainType,
  convertToGenericAddress,
  FolksBridge,
  FolksCore,
  NetworkType,
  TESTNET_FOLKS_CHAIN_ID,
  TokenType,
  FOLKS_TESTNET_NTT_TOKEN_ID,
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

  const feePaymentToken = {
    tokenType: TokenType.GAS,
    tokenSymbol: "",
    tokenDecimals: 18,
  };
  const sourceChain = TESTNET_FOLKS_CHAIN_ID.AVALANCHE_FUJI;
  const destChain = TESTNET_FOLKS_CHAIN_ID.ALGORAND_TESTNET;

  const capabilities = await FolksBridge.read.capabilities();
  const quote = await FolksBridge.read.quote(sourceChain, destChain, feePaymentToken);

  const prepareCall = await FolksBridge.prepare.transfer(
    FOLKS_TESTNET_NTT_TOKEN_ID,
    1_000_000n,
    destChain,
    convertToGenericAddress("5F3UPPGBWR2KBH3B3TJYJXQYIRVVNOVGOJLOVY6ALHCIMDW2SWS4FA7VLU" as AVMAddress, ChainType.AVM),
    capabilities,
    quote,
    feePaymentToken,
  );
  console.log(prepareCall);

  const txHash = await FolksBridge.write.transfer(prepareCall);
  console.log(txHash);
}

main().catch(console.error);
