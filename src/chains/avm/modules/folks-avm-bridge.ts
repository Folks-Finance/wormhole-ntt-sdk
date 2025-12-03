import { bigIntToBytes, getApplicationAddress } from "algosdk";
import { hexToBytes } from "viem";

import { ChainType } from "../../../common/types/chain.js";
import { TokenType, TransceiverType } from "../../../common/types/ntt.js";
import { convertAVMAddressToHex, convertFromGenericAddress } from "../../../common/utils/address.js";
import { getRandomHex } from "../../../common/utils/bytes.js";
import { getFolksChain } from "../../../common/utils/chain.js";
import { exhaustiveCheck } from "../../../common/utils/exhaustive-check.js";
import { calcReferrerFeeAmount } from "../../../common/utils/formulae.js";
import { getNttChainToken } from "../../../common/utils/token.js";
import { GUARDIAN_KEY_LENGTH } from "../constants/ntt.js";
import { getAVMSignerAddress } from "../utils/chain.js";
import {
  createOpUpTxn,
  getNttManagerContract,
  getNttManagerWithExecutorContract,
  getNttManagerWithTokenPaymentExecutorContract,
  getTransceiverManagerContract,
  getVerifierSigsLogicSig,
  getWormholeTransceiverContract,
} from "../utils/contract.js";
import { decodeVaa } from "../utils/ntt.js";
import { getLocalStateAsBytes } from "../utils/state.js";

import type { AVMAddress, AVMContractId, GenericAddress } from "../../../common/types/address.js";
import type { Quote } from "../../../common/types/api.js";
import type { AVMChainType, FolksChainId, NTTChainAVM } from "../../../common/types/chain.js";
import type { FeePaymentToken, ReferrerFee, NTTTokenId } from "../../../common/types/ntt.js";
import type { MessageToSend } from "../constants/client/transceiver-manager.client.js";
import type {
  PrepareManualCompleteTransferAVMCall,
  PrepareManualInitiateTransferAVMCall,
  PrepareTransferAVMCall,
} from "../types/module.js";
import type { AlgorandClient } from "@algorandfoundation/algokit-utils";
import type { BaseWallet as AVMSigner } from "@txnlab/use-wallet";
import type { Hex } from "viem";

export const prepare = {
  async manualInitiateTransfer(
    provider: AlgorandClient,
    sender: AVMAddress,
    sourceChain: NTTChainAVM,
    nttTokenId: NTTTokenId,
    amount: bigint,
    recipientChainId: FolksChainId,
    recipient: GenericAddress,
  ): Promise<PrepareManualInitiateTransferAVMCall> {
    const { opUp, transceiverManager } = sourceChain;
    const { wormholeChainId: recipientWormholeChainId } = getFolksChain(recipientChainId);

    const sourceNttChainToken = getNttChainToken<AVMChainType>(nttTokenId, sourceChain.folksChainId);
    const { nttManagerAddress } = sourceNttChainToken;

    const transceiverManagerClient = getTransceiverManagerContract(provider, transceiverManager);

    // construct dummy message as placeholder
    const message: MessageToSend = {
      id: hexToBytes(getRandomHex(32)),
      userAddress: hexToBytes(convertAVMAddressToHex(sender)),
      sourceAddress: getApplicationAddress(nttManagerAddress).publicKey,
      destinationChainId: recipientWormholeChainId,
      handlerAddress: hexToBytes(getRandomHex(32)),
      payload: new Uint8Array(),
    };

    // extra fee assumes single transceiver configured
    const feePaymentAmount = await transceiverManagerClient.quoteDeliveryPrices({
      sender,
      args: [nttManagerAddress, message, []],
      extraFee: (1000).microAlgos(),
    });

    const numOpUpTxns = 1;

    return {
      numOpUpTxns,
      opUpContract: opUp,
      feePaymentAmount: feePaymentAmount.microAlgo(),
      amount,
      recipient: hexToBytes(recipient),
      sourceNttChainToken,
      recipientWormholeChainId,
    };
  },

  async manualCompleteTransfer(
    provider: AlgorandClient,
    destinationChain: NTTChainAVM,
    nttTokenId: NTTTokenId,
    vaaRaw: Hex,
  ): Promise<PrepareManualCompleteTransferAVMCall> {
    const { opUp, wormholeCore, guardianAddress, transceiverManager } = destinationChain;

    const destinationNttChainToken = getNttChainToken<AVMChainType>(nttTokenId, destinationChain.folksChainId);
    const { nttManagerAddress, transceivers } = destinationNttChainToken;

    const wormholeTransceiver = transceivers.find(
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      ({ transceiverType }) => transceiverType === TransceiverType.WORMHOLE,
    );
    if (!wormholeTransceiver) throw new Error(`No wormhole transceiver set for chain ${destinationChain.folksChainId}`);

    const vaa = decodeVaa(vaaRaw);
    const guardianLocalState = await getLocalStateAsBytes(provider, wormholeCore, guardianAddress);
    const guardianSignatures = Uint8Array.from(
      vaa.signatures.flatMap(({ guardianIndex, signature }) => [...bigIntToBytes(guardianIndex, 1), ...signature]),
    );
    const guardianKeys = Uint8Array.from(
      vaa.signatures.flatMap(({ guardianIndex }) => [
        ...guardianLocalState.slice(
          Number(guardianIndex) * GUARDIAN_KEY_LENGTH + 1,
          (Number(guardianIndex) + 1) * GUARDIAN_KEY_LENGTH + 1,
        ),
      ]),
    );

    const numOpUpTxns = 0;

    return {
      numOpUpTxns,
      opUpContract: opUp,
      wormholeCoreContract: wormholeCore,
      guardianAddress,
      wormholeTransceiverContract: wormholeTransceiver.address,
      transceiverManagerContract: transceiverManager,
      nttManagerContract: nttManagerAddress,
      guardianSignatures,
      guardianKeys,
      vaaBytes: hexToBytes(vaaRaw),
      vaaDigest: vaa.digest,
      message: vaa.message,
    };
  },

  async transfer(
    provider: AlgorandClient,
    sender: AVMAddress,
    sourceChain: NTTChainAVM,
    nttTokenId: NTTTokenId,
    amount: bigint,
    recipientChainId: FolksChainId,
    recipient: GenericAddress,
    quote: Quote,
    feePaymentToken: FeePaymentToken,
    referrerFee: ReferrerFee,
  ): Promise<PrepareTransferAVMCall> {
    const { opUp, transceiverManager, nttExecutors } = sourceChain;
    const { wormholeChainId: recipientWormholeChainId } = getFolksChain(recipientChainId);
    const { tokenType } = feePaymentToken;

    const sourceNttChainToken = getNttChainToken<AVMChainType>(nttTokenId, sourceChain.folksChainId);
    const { nttManagerAddress } = sourceNttChainToken;

    const transceiverManagerClient = getTransceiverManagerContract(provider, transceiverManager);

    // construct dummy message as placeholder
    const message: MessageToSend = {
      id: hexToBytes(getRandomHex(32)),
      userAddress: hexToBytes(convertAVMAddressToHex(sender)),
      sourceAddress: getApplicationAddress(nttManagerAddress).publicKey,
      destinationChainId: recipientWormholeChainId,
      handlerAddress: hexToBytes(getRandomHex(32)),
      payload: new Uint8Array(),
    };

    // extra fee assumes single transceiver configured
    const nttFeePaymentAmount = await transceiverManagerClient.quoteDeliveryPrices({
      sender,
      args: [nttManagerAddress, message, []],
      extraFee: (1000).microAlgos(),
    });

    let nttExecutorContract: AVMContractId | undefined;
    switch (tokenType) {
      case TokenType.GAS:
        nttExecutorContract = nttExecutors.NATIVE;
        break;
      case TokenType.ASA:
        nttExecutorContract = nttExecutors.TOKEN;
        break;
      case TokenType.ERC20:
        throw new Error("ERC20 not supported on AVM");
      default:
        exhaustiveCheck(tokenType);
    }
    if (!nttExecutorContract) throw new Error("Cannot find NTT executor");

    const referrerFeeAmount = calcReferrerFeeAmount(amount, referrerFee.dbps);
    const nttTokenAmount = amount - referrerFeeAmount;

    const executorArgs = {
      refundAddress: sender,
      signedQuoteBytes: hexToBytes(quote.signedQuote.raw),
      relayInstructions: hexToBytes(quote.relayInstructions),
    };
    const feeArgs = {
      dbps: Number(referrerFee.dbps),
      payee: convertFromGenericAddress(referrerFee.address, ChainType.AVM),
    };

    const numOpUpTxns = 1;

    return {
      numOpUpTxns,
      opUpContract: opUp,
      nttFeePaymentAmount: nttFeePaymentAmount.microAlgo(),
      totalAmount: amount,
      nttTokenAmount,
      recipient: hexToBytes(recipient),
      sourceNttChainToken,
      recipientWormholeChainId,
      feePaymentToken,
      nttExecutorContract,
      executorFeePaymentAmount: quote.estimatedCost,
      executorArgs,
      referrerFeeAmount,
      feeArgs,
    };
  },
};

export const write = {
  async manualInitiateTransfer(
    provider: AlgorandClient,
    signer: AVMSigner,
    prepareCall: PrepareManualInitiateTransferAVMCall,
  ): Promise<string> {
    const {
      numOpUpTxns,
      opUpContract,
      feePaymentAmount,
      amount,
      recipient,
      sourceNttChainToken,
      recipientWormholeChainId,
    } = prepareCall;
    const { assetId, nttTokenAddress, nttManagerAddress } = sourceNttChainToken;

    const nttManagerClient = getNttManagerContract(provider, nttManagerAddress);
    const senderAddress = getAVMSignerAddress(signer);

    // add opup if specified
    const group = nttManagerClient.newGroup();
    let txIdx = 2;
    if (numOpUpTxns >= 1) {
      const opUpTxn = await createOpUpTxn(provider, opUpContract, senderAddress, numOpUpTxns);
      group.addTransaction(opUpTxn, signer.transactionSigner);
      txIdx += 1;
    }

    const feePaymentTxn = await provider.createTransaction.payment({
      sender: senderAddress,
      signer: signer.transactionSigner,
      receiver: getApplicationAddress(nttManagerAddress),
      amount: feePaymentAmount,
    });
    const sendTokenTxn = await provider.createTransaction.assetTransfer({
      sender: senderAddress,
      signer: signer.transactionSigner,
      receiver: getApplicationAddress(nttTokenAddress),
      assetId,
      amount,
    });
    const { txIds } = await group
      .transfer({
        sender: senderAddress,
        signer: signer.transactionSigner,
        args: [feePaymentTxn, sendTokenTxn, amount, recipientWormholeChainId, recipient],
        extraFee: (9000).microAlgos(),
      })
      .send();
    return txIds[txIdx] ?? "";
  },

  async manualCompleteTransfer(
    provider: AlgorandClient,
    signer: AVMSigner,
    prepareCall: PrepareManualCompleteTransferAVMCall,
  ): Promise<string> {
    const {
      numOpUpTxns,
      opUpContract,
      wormholeCoreContract,
      guardianAddress,
      wormholeTransceiverContract,
      transceiverManagerContract,
      nttManagerContract,
      guardianSignatures,
      guardianKeys,
      vaaBytes,
      vaaDigest,
      message,
    } = prepareCall;

    const verifierSigsLogicSig = getVerifierSigsLogicSig(provider);
    const wormholeTransceiverClient = getWormholeTransceiverContract(provider, wormholeTransceiverContract, signer);
    const nttManagerClient = getNttManagerContract(provider, nttManagerContract, signer);
    const senderAddress = getAVMSignerAddress(signer);

    // add opup if specified
    const group = wormholeTransceiverClient.newGroup();
    let txIdx = 6;
    if (numOpUpTxns >= 1) {
      const opUpTxn = await createOpUpTxn(provider, opUpContract, senderAddress, numOpUpTxns);
      group.addTransaction(opUpTxn, signer.transactionSigner);
      txIdx += 1;
    }

    // receive message
    const fundWormholeTransceiverTxn = await provider.createTransaction.payment({
      sender: senderAddress,
      receiver: getApplicationAddress(wormholeTransceiverContract),
      amount: (21_300).microAlgos(),
    });
    const fundTransceiverManagerTxn = await provider.createTransaction.payment({
      sender: senderAddress,
      receiver: getApplicationAddress(transceiverManagerContract),
      amount: (49_400).microAlgos(),
    });
    const fundNttManagerTxn = await provider.createTransaction.payment({
      sender: senderAddress,
      receiver: getApplicationAddress(nttManagerContract),
      amount: (22_900).microAlgos(),
    });
    const verifySigsTxn = await provider.createTransaction.appCall({
      sender: verifierSigsLogicSig,
      appId: wormholeCoreContract,
      args: [new TextEncoder().encode("verifySigs"), guardianSignatures, guardianKeys, vaaDigest],
      accountReferences: [senderAddress, guardianAddress],
      staticFee: (0).microAlgo(),
    });
    const verifyVAATxn = await provider.createTransaction.appCall({
      sender: senderAddress,
      appId: wormholeCoreContract,
      args: [new TextEncoder().encode("verifyVAA"), vaaBytes],
      accountReferences: [senderAddress, guardianAddress],
      staticFee: (0).microAlgo(),
    });
    group
      .addTransaction(fundWormholeTransceiverTxn, signer.transactionSigner)
      .addTransaction(fundTransceiverManagerTxn, signer.transactionSigner)
      .addTransaction(fundNttManagerTxn, signer.transactionSigner)
      .addTransaction(verifySigsTxn, verifierSigsLogicSig.signer)
      .receiveMessage({
        sender: senderAddress,
        signer: signer.transactionSigner,
        args: [verifyVAATxn],
        extraFee: (4000).microAlgos(),
      });

    // execute message
    const {
      transactions: [executeMessageTxn],
    } = await nttManagerClient.createTransaction.executeMessage({
      sender: senderAddress,
      args: [message],
      extraFee: (3000).microAlgos(),
    });
    if (!executeMessageTxn) throw new Error("Execute Message txn is undefined");

    const { txIds } = await group.addTransaction(executeMessageTxn, signer.transactionSigner).send();
    return txIds[txIdx] ?? "";
  },

  async transfer(provider: AlgorandClient, signer: AVMSigner, prepareCall: PrepareTransferAVMCall): Promise<string> {
    const {
      numOpUpTxns,
      opUpContract,
      nttFeePaymentAmount,
      totalAmount,
      nttTokenAmount,
      recipient,
      sourceNttChainToken,
      recipientWormholeChainId,
      nttExecutorContract,
      feePaymentToken,
      executorFeePaymentAmount,
      executorArgs,
      referrerFeeAmount,
      feeArgs,
    } = prepareCall;
    const { tokenType } = feePaymentToken;
    const { assetId, nttTokenAddress, nttManagerAddress } = sourceNttChainToken;

    const nttManagerClient = getNttManagerContract(provider, nttManagerAddress);
    const senderAddress = getAVMSignerAddress(signer);

    // add opup if specified
    const group = provider.newGroup();
    let txIdx = 2;
    if (numOpUpTxns >= 1) {
      const opUpTxn = await createOpUpTxn(provider, opUpContract, senderAddress, numOpUpTxns);
      group.addTransaction(opUpTxn, signer.transactionSigner);
      txIdx += 1;
    }

    // common txns
    const nttFeePaymentTxn = await provider.createTransaction.payment({
      sender: senderAddress,
      signer: signer.transactionSigner,
      receiver: getApplicationAddress(nttManagerAddress),
      amount: nttFeePaymentAmount,
    });
    const nttSendTokenTxn = await provider.createTransaction.assetTransfer({
      sender: senderAddress,
      signer: signer.transactionSigner,
      receiver: getApplicationAddress(nttTokenAddress),
      assetId,
      amount: nttTokenAmount,
    });
    const { transactions: nttTransferTxns } = await nttManagerClient.createTransaction.transfer({
      sender: senderAddress,
      signer: signer.transactionSigner,
      args: [nttFeePaymentTxn, nttSendTokenTxn, nttTokenAmount, recipientWormholeChainId, recipient],
      extraFee: (9000).microAlgos(),
    });
    const nttTransferTxn = nttTransferTxns[2];
    if (!nttTransferTxn) throw new Error("NTT Transfer txn is undefined");

    const payReferrerTxn = await provider.createTransaction.assetTransfer({
      sender: senderAddress,
      signer: signer.transactionSigner,
      receiver: feeArgs.payee,
      assetId,
      amount: referrerFeeAmount,
    });

    switch (tokenType) {
      case TokenType.GAS: {
        const executorClient = getNttManagerWithExecutorContract(provider, nttExecutorContract, signer);
        const payExecutorTxn = await provider.createTransaction.payment({
          sender: senderAddress,
          signer: signer.transactionSigner,
          receiver: getApplicationAddress(nttExecutorContract),
          amount: executorFeePaymentAmount.microAlgo(),
        });

        const { transactions } = await executorClient.createTransaction.transfer({
          sender: senderAddress,
          signer: signer.transactionSigner,
          args: [nttSendTokenTxn, nttTransferTxn, payExecutorTxn, payReferrerTxn, totalAmount, executorArgs, feeArgs],
          extraFee: (4000).microAlgos(),
        });

        group.addTransaction(nttFeePaymentTxn, signer.transactionSigner);
        for (const txn of transactions) {
          group.addTransaction(txn, signer.transactionSigner);
        }
        break;
      }
      case TokenType.ASA: {
        const executorClient = getNttManagerWithTokenPaymentExecutorContract(provider, nttExecutorContract, signer);
        const payExecutorTxn = await provider.createTransaction.assetTransfer({
          sender: senderAddress,
          signer: signer.transactionSigner,
          receiver: getApplicationAddress(nttExecutorContract),
          assetId: feePaymentToken.assetId,
          amount: executorFeePaymentAmount,
        });

        const { transactions } = await executorClient.createTransaction.transfer({
          sender: senderAddress,
          signer: signer.transactionSigner,
          args: [nttSendTokenTxn, nttTransferTxn, payExecutorTxn, payReferrerTxn, totalAmount, executorArgs, feeArgs],
          extraFee: (7000).microAlgos(),
        });

        group.addTransaction(nttFeePaymentTxn, signer.transactionSigner);
        for (const txn of transactions) {
          group.addTransaction(txn, signer.transactionSigner);
        }
        break;
      }
      default:
        exhaustiveCheck(tokenType);
    }

    const { txIds } = await group.send();
    return txIds[txIdx] ?? "";
  },
};
