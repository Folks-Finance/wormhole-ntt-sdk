import { hexToBytes } from "viem";

import { UINT64_LENGTH } from "../../../common/constants/bytes.js";
import { convertNumberToHex } from "../../../common/utils/bytes.js";
import { NttManagerWithExecutorClient } from "../constants/client/ntt-manager-with-executor.client.js";
import { NttManagerWithTokenPaymentExecutorClient } from "../constants/client/ntt-manager-with-token-payment-executor.client.js";
import { NttManagerClient } from "../constants/client/ntt-manager.client.js";
import { TransceiverManagerClient } from "../constants/client/transceiver-manager.client.js";
import { WormholeTransceiverClient } from "../constants/client/wormhole-transceiver.client.js";

import type { AVMContractId } from "../../../common/types/address.js";
import type { AlgorandClient } from "@algorandfoundation/algokit-utils";
import type { BaseWallet as AVMSigner } from "@txnlab/use-wallet";

export function getVerifierSigsLogicSig(provider: AlgorandClient) {
  return provider.account.logicsig(
    Buffer.from(
      "BiAEAQAgFCYBADEgMgMSRDEBIxJEMRCBBhJENhoBNhoDNhoCiAADRCJDNQI1ATUAKDXwKDXxNAAVNQUjNQMjNQQ0AzQFDEEARDQBNAA0A4FBCCJYFzQANAMiCCRYNAA0A4EhCCRYBwA18TXwNAI0BCVYNPA08VACVwwUEkQ0A4FCCDUDNAQlCDUEQv+0Iok=",
      "base64",
    ),
  );
}

export function getTransceiverManagerContract(provider: AlgorandClient, appId: AVMContractId, signer?: AVMSigner) {
  return provider.client.getTypedAppClientById(TransceiverManagerClient, {
    appId,
    defaultSender: signer?.activeAddress ?? undefined,
    defaultSigner: signer?.transactionSigner,
  });
}

export function getNttManagerContract(provider: AlgorandClient, appId: AVMContractId, signer?: AVMSigner) {
  return provider.client.getTypedAppClientById(NttManagerClient, {
    appId,
    defaultSender: signer?.activeAddress ?? undefined,
    defaultSigner: signer?.transactionSigner,
  });
}

export function getNttManagerWithExecutorContract(provider: AlgorandClient, appId: AVMContractId, signer?: AVMSigner) {
  return provider.client.getTypedAppClientById(NttManagerWithExecutorClient, {
    appId,
    defaultSender: signer?.activeAddress ?? undefined,
    defaultSigner: signer?.transactionSigner,
  });
}

export function getNttManagerWithTokenPaymentExecutorContract(
  provider: AlgorandClient,
  appId: AVMContractId,
  signer?: AVMSigner,
) {
  return provider.client.getTypedAppClientById(NttManagerWithTokenPaymentExecutorClient, {
    appId,
    defaultSender: signer?.activeAddress ?? undefined,
    defaultSigner: signer?.transactionSigner,
  });
}

export function getWormholeTransceiverContract(provider: AlgorandClient, appId: AVMContractId, signer?: AVMSigner) {
  return provider.client.getTypedAppClientById(WormholeTransceiverClient, {
    appId,
    defaultSender: signer?.activeAddress ?? undefined,
    defaultSigner: signer?.transactionSigner,
  });
}

export async function createOpUpTxn(
  provider: AlgorandClient,
  appId: AVMContractId,
  senderAddress: string,
  numOpUpTxns: number,
) {
  const numInnerTxns = numOpUpTxns - 1;
  return await provider.createTransaction.appCall({
    sender: senderAddress,
    appId,
    args: [hexToBytes(convertNumberToHex(numInnerTxns, UINT64_LENGTH))],
    extraFee: (numInnerTxns * 1000).microAlgos(),
  });
}
