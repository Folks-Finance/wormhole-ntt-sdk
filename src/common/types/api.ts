import { bytesToHex } from "viem";
import { z } from "zod";

import { hexString, preprocessBigInt } from "../utils/zod.js";

import type { EVMAddress, GenericAddress } from "./address.js";
import type { FolksChainId } from "./chain.js";
import type { FeePaymentToken, NTTTokenId } from "./ntt.js";
import type { ChainId as WormholeChainId } from "@wormhole-foundation/sdk";
import type { Hex } from "viem";

export const CapabilitiesResponseScheme = z.record(
  z.string(),
  z.object({
    requestPrefixes: z.array(z.string()),
    gasDropOffLimit: z.preprocess(preprocessBigInt, z.bigint()),
    maxGasLimit: z.preprocess(preprocessBigInt, z.bigint()),
    maxMsgValue: z.preprocess(preprocessBigInt, z.bigint()),
    feePaymentTokens: z.array(
      z.union([
        z.object({
          tokenType: z.literal(["GAS"]),
          tokenSymbol: z.string(),
          tokenDecimals: z.number(),
        }),
        z.object({
          tokenType: z.literal(["ERC20"]),
          tokenSymbol: z.string(),
          tokenDecimals: z.number(),
          tokenAddress: z.string(),
          allowanceContractSlot: z.preprocess(preprocessBigInt, z.bigint()),
        }),
        z.object({
          tokenType: z.literal(["ASA"]),
          tokenSymbol: z.string(),
          tokenDecimals: z.number(),
          tokenAddress: z.number(),
        }),
      ]),
    ),
  }),
);

export type ExecutorCapabilities = Partial<
  Record<
    FolksChainId,
    {
      folksChainId: FolksChainId;
      gasDropOffLimit: bigint;
      maxGasLimit: bigint;
      maxMsgValue: bigint;
      feePaymentTokens: Array<FeePaymentToken>;
    }
  >
>;

export const HistoryResponseSchema = z.object({
  operations: z.array(
    z.object({
      id: z.string(),
      vaa: z.optional(
        z.object({
          raw: z.string().transform((val) => bytesToHex(Buffer.from(val, "base64"))),
        }),
      ),
      content: z.object({
        standarizedProperties: z.optional(
          z.object({
            appIds: z.nullable(z.array(z.string())), // skip if not "NATIVE_TOKEN_TRANSFER" present in array
            tokenAddress: z.string(),
            fromChain: z.number(),
            fromAddress: z.string(),
            toChain: z.number(),
            toAddress: z.string(),
            amount: z.preprocess(preprocessBigInt, z.bigint()),
            normalizedDecimals: z.nullable(z.number()),
          }),
        ),
      }),
      sourceChain: z.object({
        chainId: z.number(),
        timestamp: z.string(),
        transaction: z.object({
          txHash: z.string(),
        }),
      }),
      targetChain: z.optional(
        z.object({
          chainId: z.number(),
          timestamp: z.string(),
          transaction: z.object({
            txHash: z.string(),
          }),
        }),
      ),
    }),
  ),
});

export const NTTOperationStatus = {
  IN_PROGRESS: "IN_PROGRESS",
  WAITING_RELAY: "WAITING_RELAY",
  COMPLETED: "COMPLETED",
} as const;

export type NTTOperationStatus = (typeof NTTOperationStatus)[keyof typeof NTTOperationStatus];

export type NTTOperation = {
  id: string;
  status: NTTOperationStatus;
  nttTokenId: NTTTokenId;
  sourceChain: {
    folksChainId: FolksChainId;
    fromAddress: GenericAddress;
    amount: bigint;
    transaction: {
      txHash: string;
      timestamp: string;
    };
  };
  destinationChain: {
    folksChainId: FolksChainId;
    toAddress: GenericAddress;
    amount: bigint;
    transaction?: {
      txHash: string;
      timestamp: string;
    };
  };
  vaaRaw?: Hex;
};

export type QuoteRequest = {
  srcChain: WormholeChainId;
  dstChain: WormholeChainId;
  relayInstructions: Hex;
  tokenAddress?: GenericAddress;
};

export const QuoteResponseSchema = z.object({
  signedQuote: hexString().transform((val) => val as Hex),
  estimatedCost: z.preprocess(preprocessBigInt, z.bigint()),
});

export type SignedQuoteDecoded = {
  prefix: Hex;
  quoterAddress: EVMAddress;
  payeeAddress: GenericAddress;
  wormholeSourceChain: number;
  wormholeDestinationChain: number;
  expiryTimestamp: number;
  baseFee: bigint;
  destinationGasPrice: bigint;
  sourcePrice: bigint;
  destinationPrice: bigint;
  tokenAddress?: GenericAddress;
};

export type Quote = {
  signedQuote: {
    raw: Hex;
    decoded: SignedQuoteDecoded;
  };
  feePaymentToken: FeePaymentToken;
  relayInstructions: Hex;
  estimatedCost: bigint;
};
