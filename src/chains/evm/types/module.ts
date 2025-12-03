import type { EVMAddress, GenericAddress } from "../../../common/types/address.js";
import type { EVMChainType, WormholeChainId } from "../../../common/types/chain.js";
import type { ChainToken, Erc20PaymentToken, GasFeePaymentToken } from "../../../common/types/ntt.js";
import type { Hex } from "viem";

export type PrepareEVMCall = {
  msgValue: bigint;
  gasLimit: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
};

export type PrepareManualInitiateTransferEVMCall = {
  amount: bigint;
  recipient: GenericAddress;
  sourceNttChainToken: ChainToken<EVMChainType>;
  recipientWormholeChainId: WormholeChainId;
} & PrepareEVMCall;

export type PrepareManualCompleteTransferEVMCall = {
  wormholeTransceiverAddress: EVMAddress;
  vaaHex: Hex;
} & PrepareEVMCall;

export type PrepareTransferEVMCall = {
  totalAmount: bigint;
  recipient: GenericAddress;
  sourceNttChainToken: ChainToken<EVMChainType>;
  recipientWormholeChainId: WormholeChainId;
  nttExecutorAddress: EVMAddress;
  feePaymentToken: GasFeePaymentToken | Erc20PaymentToken;
  executorFeePaymentAmount: bigint;
  executorArgs: {
    value: bigint;
    refundAddress: EVMAddress;
    signedQuote: Hex;
    instructions: Hex;
  };
  referrerFeeAmount: bigint;
  feeArgs: {
    dbps: number;
    payee: EVMAddress;
  };
} & PrepareEVMCall;
