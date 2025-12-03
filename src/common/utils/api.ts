import { concat, hexToBigInt, hexToNumber, isAddressEqual, sliceHex, stringToHex } from "viem";

import { EXECUTOR_API_URL, WH_SCAN_API_URL } from "../constants/api.js";
import { UINT8_LENGTH, UINT128_LENGTH } from "../constants/bytes.js";
import { AddressType } from "../types/address.js";
import { ChainType } from "../types/chain.js";
import { TokenType } from "../types/ntt.js";

import { convertToGenericAddress } from "./address.js";
import { convertNumberToHex } from "./bytes.js";
import { exhaustiveCheck } from "./exhaustive-check.js";

import type { EVMAddress, GenericAddress } from "../types/address.js";
import type { SignedQuoteDecoded } from "../types/api.js";
import type { NetworkType } from "../types/chain.js";
import type {
  AsaPaymentToken,
  Erc20PaymentToken,
  FeePaymentToken,
  GasDropOffInstruction,
  GasInstruction,
} from "../types/ntt.js";
import type { Hex } from "viem";

export function getWormholeScanApiUrl(network: NetworkType): string {
  return WH_SCAN_API_URL[network];
}

export function getExecutorApiUrl(network: NetworkType): string {
  return EXECUTOR_API_URL[network];
}

export function isFeePaymentTokenEqual(a: FeePaymentToken, b: FeePaymentToken): boolean {
  if (a.tokenType !== b.tokenType) return false;
  const { tokenType } = a;
  switch (tokenType) {
    case TokenType.GAS:
      return true;
    case TokenType.ERC20:
      return isAddressEqual(a.tokenAddress, (b as Erc20PaymentToken).tokenAddress);
    case TokenType.ASA:
      return a.assetId === (b as AsaPaymentToken).assetId;
    default:
      exhaustiveCheck(tokenType);
  }
  return false;
}

export function getFeePaymentTokenGenericAddress(feePaymentToken: FeePaymentToken): GenericAddress | undefined {
  const { tokenType } = feePaymentToken;
  switch (tokenType) {
    case TokenType.GAS:
      return;
    case TokenType.ERC20:
      return convertToGenericAddress(feePaymentToken.tokenAddress, ChainType.EVM, AddressType.TOKEN);
    case TokenType.ASA:
      return convertToGenericAddress(feePaymentToken.assetId, ChainType.AVM, AddressType.TOKEN);
    default:
      exhaustiveCheck(tokenType);
  }
}

export function buildRelayInstructions(
  gasInstruction: GasInstruction,
  gasDropOffInstructions: Array<GasDropOffInstruction> = [],
): Hex {
  return concat([
    convertNumberToHex(gasInstruction.instructionType, UINT8_LENGTH),
    convertNumberToHex(gasInstruction.gasLimit, UINT128_LENGTH),
    convertNumberToHex(gasInstruction.msgValue, UINT128_LENGTH),
    gasDropOffInstructions.reduce<Hex>(
      (hex, gasDropOffInstruction) =>
        concat([
          hex,
          concat([
            convertNumberToHex(gasDropOffInstruction.instructionType, UINT8_LENGTH),
            convertNumberToHex(gasDropOffInstruction.dropOff, UINT128_LENGTH),
            gasDropOffInstruction.recipient,
          ]),
        ]),
      "0x",
    ),
  ]);
}

const NATIVE_GAS_TOKEN_FEE_PREFIX = stringToHex("EQ01");
const CUSTOM_TOKEN_FEE_PREFIX = stringToHex("EQC1");

export function decodeSignedQuote(signedQuote: Hex): SignedQuoteDecoded {
  const prefix = sliceHex(signedQuote, 0, 4);
  const quoterAddress = sliceHex(signedQuote, 4, 24) as EVMAddress;
  const payeeAddress = sliceHex(signedQuote, 24, 56) as GenericAddress;
  const wormholeSourceChain = hexToNumber(sliceHex(signedQuote, 56, 58));
  const wormholeDestinationChain = hexToNumber(sliceHex(signedQuote, 58, 60));
  const expiryTimestamp = hexToNumber(sliceHex(signedQuote, 60, 68));
  const baseFee = hexToBigInt(sliceHex(signedQuote, 68, 76));
  const destinationGasPrice = hexToBigInt(sliceHex(signedQuote, 76, 84));
  const sourcePrice = hexToBigInt(sliceHex(signedQuote, 84, 92));
  const destinationPrice = hexToBigInt(sliceHex(signedQuote, 92, 100));

  let tokenAddress: GenericAddress | undefined;
  switch (prefix) {
    case NATIVE_GAS_TOKEN_FEE_PREFIX:
      break;
    case CUSTOM_TOKEN_FEE_PREFIX:
      tokenAddress = sliceHex(signedQuote, 100, 132) as GenericAddress;
      break;
    default:
      throw new Error(`Unknown prefix ${prefix}`);
  }

  return {
    prefix,
    quoterAddress,
    payeeAddress,
    wormholeSourceChain,
    wormholeDestinationChain,
    expiryTimestamp,
    baseFee,
    destinationGasPrice,
    sourcePrice,
    destinationPrice,
    tokenAddress,
  };
}
