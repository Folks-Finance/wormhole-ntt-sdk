import { FOLKS_CHAIN_ID } from "../../../common/constants/chain.js";
import { ChainType } from "../../../common/types/chain.js";
import { TokenType, TransceiverType } from "../../../common/types/ntt.js";
import { convertFromGenericAddress } from "../../../common/utils/address.js";
import { getFolksChain } from "../../../common/utils/chain.js";
import { exhaustiveCheck } from "../../../common/utils/exhaustive-check.js";
import { calcReferrerFeeAmount } from "../../../common/utils/formulae.js";
import { getNttChainToken } from "../../../common/utils/token.js";
import { DEFAULT_TRANSCEIVER_INSTRUCTIONS } from "../constants/ntt.js";
import { getPolygonFeeData } from "../helpers/polygon-gas.js";
import { getEVMSignerAccount } from "../utils/chain.js";
import {
  getNTTManagerContract,
  getNTTManagerWithExecutorContract,
  getNTTManagerWithTokenPaymentExecutorContract,
  getWormholeTransceiverContract,
  sendERC20Approve,
} from "../utils/contract.js";
import { getAllowanceStateOverride, getNttTokenAllowanceStateOverride } from "../utils/tokens.js";

import type { EVMAddress, GenericAddress } from "../../../common/types/address.js";
import type { Quote } from "../../../common/types/api.js";
import type { EVMChainType, FolksChainId, NTTChainEVM } from "../../../common/types/chain.js";
import type { FeePaymentToken, ReferrerFee, NTTTokenId } from "../../../common/types/ntt.js";
import type {
  PrepareManualCompleteTransferEVMCall,
  PrepareManualInitiateTransferEVMCall,
  PrepareTransferEVMCall,
} from "../types/module.js";
import type { EstimateGasParameters, Client as EVMProvider, WalletClient as EVMSigner, Hex, StateOverride } from "viem";

export const prepare = {
  async manualInitiateTransfer(
    provider: EVMProvider,
    sender: EVMAddress,
    sourceChain: NTTChainEVM,
    nttTokenId: NTTTokenId,
    amount: bigint,
    recipientChainId: FolksChainId,
    recipient: GenericAddress,
    transactionOptions: EstimateGasParameters = { account: sender },
  ): Promise<PrepareManualInitiateTransferEVMCall> {
    const { wormholeChainId: recipientWormholeChainId } = getFolksChain(recipientChainId);

    const sourceNttChainToken = getNttChainToken<EVMChainType>(nttTokenId, sourceChain.folksChainId);
    const { nttTokenAddress, nttManagerAddress } = sourceNttChainToken;

    const nttManager = getNTTManagerContract(provider, nttManagerAddress);
    const [, msgValue] = await nttManager.read.quoteDeliveryPrice([
      recipientWormholeChainId,
      DEFAULT_TRANSCEIVER_INSTRUCTIONS,
    ]);

    const stateOverride = getNttTokenAllowanceStateOverride([
      {
        erc20Address: nttTokenAddress,
        stateDiff: [
          {
            owner: sender,
            spender: nttManagerAddress,
            folksChainId: sourceChain.folksChainId,
            nttTokenId,
            amount,
          },
        ],
      },
    ]);
    const gasLimit = await nttManager.estimateGas.transfer(
      [amount, recipientWormholeChainId, recipient, recipient, false, DEFAULT_TRANSCEIVER_INSTRUCTIONS],
      {
        value: msgValue,
        ...transactionOptions,
        stateOverride,
      },
    );

    return {
      msgValue,
      gasLimit,
      amount,
      recipient,
      sourceNttChainToken,
      recipientWormholeChainId,
    };
  },

  async manualCompleteTransfer(
    provider: EVMProvider,
    sender: EVMAddress,
    destinationChain: NTTChainEVM,
    nttTokenId: NTTTokenId,
    vaaRaw: Hex,
    transactionOptions: EstimateGasParameters = { account: sender },
  ): Promise<PrepareManualCompleteTransferEVMCall> {
    const destinationNttChainToken = getNttChainToken<EVMChainType>(nttTokenId, destinationChain.folksChainId);
    const { transceivers } = destinationNttChainToken;

    const wormholeTransceiver = transceivers.find(
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      ({ transceiverType }) => transceiverType === TransceiverType.WORMHOLE,
    );
    if (!wormholeTransceiver) throw new Error(`No wormhole transceiver set for chain ${destinationChain.folksChainId}`);

    const contract = getWormholeTransceiverContract(provider, wormholeTransceiver.address);

    const gasLimit = await contract.estimateGas.receiveMessage([vaaRaw], {
      ...transactionOptions,
      value: undefined,
    });

    return {
      msgValue: 0n,
      gasLimit,
      wormholeTransceiverAddress: wormholeTransceiver.address,
      vaaHex: vaaRaw,
    };
  },

  async transfer(
    provider: EVMProvider,
    sender: EVMAddress,
    sourceChain: NTTChainEVM,
    nttTokenId: NTTTokenId,
    amount: bigint,
    recipientChainId: FolksChainId,
    recipient: GenericAddress,
    quote: Quote,
    feePaymentToken: FeePaymentToken,
    referrerFee: ReferrerFee,
    transactionOptions: EstimateGasParameters = { account: sender },
  ): Promise<PrepareTransferEVMCall> {
    const { nttExecutors } = sourceChain;
    const { wormholeChainId: recipientWormholeChainId } = getFolksChain(recipientChainId);
    const { tokenType } = feePaymentToken;

    const sourceNttChainToken = getNttChainToken<EVMChainType>(nttTokenId, sourceChain.folksChainId);
    const { nttTokenAddress, nttManagerAddress } = sourceNttChainToken;

    let nttExecutorAddress: EVMAddress | undefined;
    switch (tokenType) {
      case TokenType.GAS:
        nttExecutorAddress = nttExecutors.NATIVE;
        break;
      case TokenType.ERC20:
        nttExecutorAddress = nttExecutors.TOKEN;
        break;
      case TokenType.ASA:
        throw new Error("ASA not supported on EVM");
      default:
        exhaustiveCheck(tokenType);
    }
    if (!nttExecutorAddress) throw new Error("Cannot find NTT executor");

    const executorArgs = {
      value: quote.estimatedCost,
      refundAddress: sender,
      signedQuote: quote.signedQuote.raw,
      instructions: quote.relayInstructions,
    };
    const feeArgs = {
      dbps: Number(referrerFee.dbps),
      payee: convertFromGenericAddress(referrerFee.address, ChainType.EVM),
    };

    const nttManager = getNTTManagerContract(provider, nttManagerAddress);
    const [, nttFeePaymentAmount] = await nttManager.read.quoteDeliveryPrice([
      recipientWormholeChainId,
      DEFAULT_TRANSCEIVER_INSTRUCTIONS,
    ]);

    const stateOverride: StateOverride = [];
    if (feePaymentToken.tokenType === TokenType.ERC20 && feePaymentToken.tokenAddress === nttTokenAddress) {
      // handle special case where fee payment token is the same as ntt token
      // override the allowance for the ntt transfer amount + quote amount at same erc20 address
      stateOverride.push(
        ...getAllowanceStateOverride([
          {
            erc20Address: nttTokenAddress,
            stateDiff: [
              {
                owner: sender,
                spender: nttExecutorAddress,
                slot: feePaymentToken.allowanceContractSlot,
                amount: amount + quote.estimatedCost,
              },
            ],
          },
        ]),
      );
    } else {
      // if needed, override the allowance for the quote amount
      if (feePaymentToken.tokenType === TokenType.ERC20) {
        stateOverride.push(
          ...getAllowanceStateOverride([
            {
              erc20Address: feePaymentToken.tokenAddress,
              stateDiff: [
                {
                  owner: sender,
                  spender: nttExecutorAddress,
                  slot: feePaymentToken.allowanceContractSlot,
                  amount: quote.estimatedCost,
                },
              ],
            },
          ]),
        );
      }

      // always override the allowance for the ntt transfer amount
      stateOverride.push(
        ...getNttTokenAllowanceStateOverride([
          {
            erc20Address: nttTokenAddress,
            stateDiff: [
              {
                owner: sender,
                spender: nttExecutorAddress,
                folksChainId: sourceChain.folksChainId,
                nttTokenId,
                amount,
              },
            ],
          },
        ]),
      );
    }

    let msgValue = nttFeePaymentAmount;
    let gasLimit = 0n;
    let effectiveTransactionOptions = transactionOptions;
    if (sourceChain.folksChainId === FOLKS_CHAIN_ID.POLYGON)
      effectiveTransactionOptions = {
        ...(await getPolygonFeeData()),
        ...transactionOptions,
      } as EstimateGasParameters;

    switch (tokenType) {
      case TokenType.GAS: {
        nttExecutorAddress = nttExecutors.NATIVE;
        const nttExecutor = getNTTManagerWithExecutorContract(provider, nttExecutorAddress);
        msgValue += quote.estimatedCost;
        gasLimit = await nttExecutor.estimateGas.transfer(
          [
            nttManagerAddress,
            amount,
            recipientWormholeChainId,
            recipient,
            recipient,
            DEFAULT_TRANSCEIVER_INSTRUCTIONS,
            executorArgs,
            feeArgs,
          ],
          {
            value: msgValue,
            ...effectiveTransactionOptions,
            stateOverride,
          },
        );
        break;
      }
      case TokenType.ERC20: {
        nttExecutorAddress = nttExecutors.TOKEN;
        const nttExecutor = getNTTManagerWithTokenPaymentExecutorContract(provider, nttExecutorAddress);
        gasLimit = await nttExecutor.estimateGas.transfer(
          [
            quote.estimatedCost,
            nttManagerAddress,
            amount,
            recipientWormholeChainId,
            recipient,
            recipient,
            DEFAULT_TRANSCEIVER_INSTRUCTIONS,
            executorArgs,
            feeArgs,
          ],
          {
            value: msgValue,
            ...effectiveTransactionOptions,
            stateOverride,
          },
        );
        break;
      }
      default:
        exhaustiveCheck(tokenType);
    }

    return {
      msgValue,
      gasLimit,
      ...effectiveTransactionOptions,
      totalAmount: amount,
      recipient,
      recipientWormholeChainId,
      feePaymentToken,
      nttExecutorAddress,
      executorFeePaymentAmount: quote.estimatedCost,
      sourceNttChainToken,
      executorArgs,
      referrerFeeAmount: calcReferrerFeeAmount(amount, referrerFee.dbps),
      feeArgs,
    };
  },
};

export const write = {
  async manualInitiateTransfer(
    provider: EVMProvider,
    signer: EVMSigner,
    prepareCall: PrepareManualInitiateTransferEVMCall,
  ) {
    const {
      msgValue,
      gasLimit,
      maxFeePerGas,
      maxPriorityFeePerGas,
      amount,
      recipient,
      sourceNttChainToken,
      recipientWormholeChainId,
    } = prepareCall;
    const { nttTokenAddress, nttManagerAddress } = sourceNttChainToken;

    const nttManager = getNTTManagerContract(provider, nttManagerAddress, signer);

    await sendERC20Approve(provider, nttTokenAddress, signer, nttManagerAddress, amount);

    return await nttManager.write.transfer(
      [amount, recipientWormholeChainId, recipient, recipient, false, DEFAULT_TRANSCEIVER_INSTRUCTIONS],
      {
        account: getEVMSignerAccount(signer),
        chain: signer.chain,
        gas: gasLimit,
        maxFeePerGas,
        maxPriorityFeePerGas,
        value: msgValue,
      },
    );
  },

  async manualCompleteTransfer(
    provider: EVMProvider,
    signer: EVMSigner,
    prepareCall: PrepareManualCompleteTransferEVMCall,
  ) {
    const { gasLimit, maxFeePerGas, maxPriorityFeePerGas, wormholeTransceiverAddress, vaaHex } = prepareCall;

    const wormholeTransceiver = getWormholeTransceiverContract(provider, wormholeTransceiverAddress, signer);

    return await wormholeTransceiver.write.receiveMessage([vaaHex], {
      account: getEVMSignerAccount(signer),
      chain: signer.chain,
      gas: gasLimit,
      maxFeePerGas,
      maxPriorityFeePerGas,
    });
  },

  async transfer(provider: EVMProvider, signer: EVMSigner, prepareCall: PrepareTransferEVMCall) {
    const {
      msgValue,
      gasLimit,
      maxFeePerGas,
      maxPriorityFeePerGas,
      totalAmount,
      recipient,
      sourceNttChainToken,
      recipientWormholeChainId,
      nttExecutorAddress,
      feePaymentToken,
      executorFeePaymentAmount,
      executorArgs,
      referrerFeeAmount,
      feeArgs,
    } = prepareCall;
    const { tokenType } = feePaymentToken;
    const { nttTokenAddress, nttManagerAddress } = sourceNttChainToken;

    switch (tokenType) {
      case TokenType.GAS: {
        await sendERC20Approve(provider, nttTokenAddress, signer, nttExecutorAddress, totalAmount);

        const nttExecutor = getNTTManagerWithExecutorContract(provider, nttExecutorAddress, signer);
        return await nttExecutor.write.transfer(
          [
            nttManagerAddress,
            totalAmount,
            recipientWormholeChainId,
            recipient,
            recipient,
            DEFAULT_TRANSCEIVER_INSTRUCTIONS,
            executorArgs,
            feeArgs,
          ],
          {
            account: getEVMSignerAccount(signer),
            chain: signer.chain,
            gas: gasLimit,
            maxFeePerGas,
            maxPriorityFeePerGas,
            value: msgValue,
          },
        );
      }
      case TokenType.ERC20: {
        // one approval if special case where fee payment token is same as ntt token
        if (nttTokenAddress === feePaymentToken.tokenAddress) {
          await sendERC20Approve(
            provider,
            nttTokenAddress,
            signer,
            nttExecutorAddress,
            totalAmount + referrerFeeAmount + executorFeePaymentAmount,
          );
        } else {
          // two approvals otherwise
          // approve ntt token
          await sendERC20Approve(
            provider,
            nttTokenAddress,
            signer,
            nttExecutorAddress,
            totalAmount + referrerFeeAmount,
          );
          // approve fee payment token
          await sendERC20Approve(
            provider,
            feePaymentToken.tokenAddress,
            signer,
            nttExecutorAddress,
            executorFeePaymentAmount,
          );
        }

        const nttExecutor = getNTTManagerWithTokenPaymentExecutorContract(provider, nttExecutorAddress, signer);
        return await nttExecutor.write.transfer(
          [
            executorFeePaymentAmount,
            nttManagerAddress,
            totalAmount,
            recipientWormholeChainId,
            recipient,
            recipient,
            DEFAULT_TRANSCEIVER_INSTRUCTIONS,
            executorArgs,
            feeArgs,
          ],
          {
            account: getEVMSignerAccount(signer),
            chain: signer.chain,
            gas: gasLimit,
            maxFeePerGas,
            maxPriorityFeePerGas,
            value: msgValue,
          },
        );
      }
      default:
        exhaustiveCheck(tokenType);
    }
  },
};
