import { avalancheFuji } from "viem/chains";

import {
  ChainType,
  convertToGenericAddress,
  FolksBridge,
  FolksCore,
  NetworkType,
  TESTNET_FOLKS_CHAIN_ID,
  TokenType,
} from "../src/index.js";

import { CUSTOM_NTT_TOKEN_TESTNET, CUSTOM_NTT_TOKEN_TESTNET_ID } from "./constants.js";
import { getEVMSigner } from "./utils.js";

import type { AVMAddress, FolksCoreConfig } from "../src/index.js";

async function main() {
  const network = NetworkType.TESTNET;
  const chain = avalancheFuji;
  const folksChainId = TESTNET_FOLKS_CHAIN_ID.AVALANCHE_FUJI;
  const folksConfig: FolksCoreConfig = {
    network,
    provider: { EVM: {}, AVM: {} },
  };

  FolksCore.init(folksConfig);
  FolksCore.setNetwork(network);

  const evmSigner = getEVMSigner(network, chain);
  FolksCore.setFolksSigner({
    signer: evmSigner,
    folksChainId,
    chainType: ChainType.EVM,
  });

  FolksCore.addTokens(CUSTOM_NTT_TOKEN_TESTNET);

  const capabilities = await FolksBridge.read.capabilities();
  const feePaymentToken = capabilities[folksChainId]?.feePaymentTokens.find(
    (token) => token.tokenSymbol === "FOLKS",
  ) ?? {
    tokenType: TokenType.GAS,
    tokenSymbol: "",
    tokenDecimals: 18,
  };

  const sourceChain = TESTNET_FOLKS_CHAIN_ID.AVALANCHE_FUJI;
  const destChain = TESTNET_FOLKS_CHAIN_ID.ALGORAND_TESTNET;

  const quote = await FolksBridge.read.quote(sourceChain, destChain, feePaymentToken);

  const prepareCall = await FolksBridge.prepare.transfer(
    CUSTOM_NTT_TOKEN_TESTNET_ID,
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
