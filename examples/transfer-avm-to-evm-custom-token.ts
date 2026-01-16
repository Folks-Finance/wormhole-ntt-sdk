import {
  ChainType,
  convertToGenericAddress,
  FolksBridge,
  FolksCore,
  NetworkType,
  TESTNET_FOLKS_CHAIN_ID,
  TokenType,
} from "../src/index.js";

import { CUSTOM_NTT_TOKENS_TESTNET, CUSTOM_NTT_TOKEN_TESTNET_ID } from "./constants.js";
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

  FolksCore.addTokens(CUSTOM_NTT_TOKENS_TESTNET);

  const feePaymentToken = {
    tokenType: TokenType.GAS,
    tokenSymbol: "",
    tokenDecimals: 6,
  };
  const sourceChain = TESTNET_FOLKS_CHAIN_ID.ALGORAND_TESTNET;
  const destChain = TESTNET_FOLKS_CHAIN_ID.AVALANCHE_FUJI;

  const capabilities = await FolksBridge.read.capabilities();
  const quote = await FolksBridge.read.quote(sourceChain, destChain, feePaymentToken);

  const prepareCall = await FolksBridge.prepare.transfer(
    CUSTOM_NTT_TOKEN_TESTNET_ID,
    1_000_000n,
    destChain,
    convertToGenericAddress("0x16870a6A85cD152229B97d018194d66740f932d6" as EVMAddress, ChainType.EVM),
    capabilities,
    quote,
    feePaymentToken,
  );
  console.log(prepareCall);

  const txHash = await FolksBridge.write.transfer(prepareCall);
  console.log(txHash);
}

main().catch(console.error);
