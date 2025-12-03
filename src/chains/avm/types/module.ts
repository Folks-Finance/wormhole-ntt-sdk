import type { AVMAddress, AVMContractId } from "../../../common/types/address.js";
import type { AVMChainType, WormholeChainId } from "../../../common/types/chain.js";
import type { AsaPaymentToken, ChainToken, GasFeePaymentToken } from "../../../common/types/ntt.js";
import type { MessageReceived } from "../constants/client/ntt-manager.client.js";
import type { AlgoAmount } from "@algorandfoundation/algokit-utils/types/amount";

export type PrepareAVMCall = {
  numOpUpTxns: number;
  opUpContract: AVMContractId;
};

export type PrepareManualInitiateTransferAVMCall = {
  feePaymentAmount: AlgoAmount;
  amount: bigint;
  recipient: Uint8Array;
  sourceNttChainToken: ChainToken<AVMChainType>;
  recipientWormholeChainId: WormholeChainId;
} & PrepareAVMCall;

export type PrepareManualCompleteTransferAVMCall = {
  wormholeCoreContract: AVMContractId;
  guardianAddress: AVMAddress;
  wormholeTransceiverContract: AVMContractId;
  transceiverManagerContract: AVMContractId;
  nttManagerContract: AVMContractId;
  guardianSignatures: Uint8Array;
  guardianKeys: Uint8Array;
  vaaBytes: Uint8Array;
  vaaDigest: Uint8Array;
  message: MessageReceived;
} & PrepareAVMCall;

export type PrepareTransferAVMCall = {
  nttFeePaymentAmount: AlgoAmount;
  totalAmount: bigint;
  nttTokenAmount: bigint;
  recipient: Uint8Array;
  sourceNttChainToken: ChainToken<AVMChainType>;
  recipientWormholeChainId: WormholeChainId;
  nttExecutorContract: AVMContractId;
  feePaymentToken: GasFeePaymentToken | AsaPaymentToken;
  executorFeePaymentAmount: bigint;
  executorArgs: {
    refundAddress: AVMAddress;
    signedQuoteBytes: Uint8Array;
    relayInstructions: Uint8Array;
  };
  referrerFeeAmount: bigint;
  feeArgs: {
    dbps: number;
    payee: AVMAddress;
  };
} & PrepareAVMCall;
