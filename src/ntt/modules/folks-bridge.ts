import { FolksAVMBridge } from "../../chains/avm/modules/index.js";
import { getGasInstructionGasLimit } from "../../chains/evm/helpers/gas.js";
import { FolksEVMBridge } from "../../chains/evm/modules/index.js";
import { BYTES32_LENGTH } from "../../common/constants/bytes.js";
import { DEFAULT_GAS_INSTRUCTION_MSG_VALUE } from "../../common/constants/ntt.js";
import {
  CapabilitiesResponseScheme,
  HistoryResponseSchema,
  NTTOperationStatus,
  QuoteResponseSchema,
} from "../../common/types/api.js";
import { ChainType } from "../../common/types/chain.js";
import { RelayInstructionType, TokenType } from "../../common/types/ntt.js";
import { convertFromGenericAddress, convertToGenericAddress } from "../../common/utils/address.js";
import {
  buildRelayInstructions,
  decodeSignedQuote,
  getExecutorApiUrl,
  getFeePaymentTokenGenericAddress,
  getWormholeScanApiUrl,
  isFeePaymentTokenEqual,
} from "../../common/utils/api.js";
import { getEmptyHex } from "../../common/utils/bytes.js";
import {
  getFolksChain,
  getFolksChainFromWormholeChain,
  getSignerGenericAddress,
  isWormholeChainSupported,
} from "../../common/utils/chain.js";
import { exhaustiveCheck } from "../../common/utils/exhaustive-check.js";
import { createDecimalAmount } from "../../common/utils/formulae.js";
import { isDefined } from "../../common/utils/is-defined.js";
import {
  getNttChainToken,
  getNttTokenFromAddress,
  isAddressAnNttToken,
  isNttTokenSupported,
} from "../../common/utils/token.js";
import { FolksCore } from "../core/folks-core.js";

import type { AVMAddress, AVMAsaId, EVMAddress, GenericAddress } from "../../common/types/address.js";
import type { ExecutorCapabilities, NTTOperation, Quote, QuoteRequest } from "../../common/types/api.js";
import type { AVMChainType, EVMChainType, FolksChainId, WormholeChainId } from "../../common/types/chain.js";
import type {
  PrepareManualCompleteTransferCall,
  PrepareManualInitiateTransferCall,
  PrepareTransferCall,
} from "../../common/types/module.js";
import type { FeePaymentToken, GasDropOffInstruction, ReferrerFee, NTTTokenId } from "../../common/types/ntt.js";
import type { Hex } from "viem";

export const read = {
  async capabilities(): Promise<ExecutorCapabilities> {
    const network = FolksCore.getSelectedNetwork();

    const url = new URL(`${getExecutorApiUrl(network)}/capabilities`);
    const response = await fetch(url, { method: "GET" });
    if (!response.ok) throw new Error(response.statusText);

    const capabilities = CapabilitiesResponseScheme.parse(await response.json());

    const executorCapabilities: ExecutorCapabilities = {};
    for (const [whChainId, { gasDropOffLimit, maxGasLimit, maxMsgValue, feePaymentTokens: tokens }] of Object.entries(
      capabilities,
    )) {
      const wormholeChainId = Number(whChainId) as WormholeChainId;
      if (!isWormholeChainSupported(network, wormholeChainId)) continue;
      const { folksChainId } = getFolksChainFromWormholeChain(network, wormholeChainId);

      const feePaymentTokens = tokens
        .map((token) => {
          switch (token.tokenType) {
            case TokenType.GAS:
              return {
                tokenType: token.tokenType,
                tokenSymbol: token.tokenSymbol,
                tokenDecimals: token.tokenDecimals,
              };
            case TokenType.ERC20:
              return {
                tokenType: token.tokenType,
                tokenSymbol: token.tokenSymbol,
                tokenDecimals: token.tokenDecimals,
                tokenAddress: token.tokenAddress as EVMAddress,
                allowanceContractSlot: token.allowanceContractSlot,
              };
            case TokenType.ASA:
              return {
                tokenType: token.tokenType,
                tokenSymbol: token.tokenSymbol,
                tokenDecimals: token.tokenDecimals,
                assetId: BigInt(token.tokenAddress) as AVMAsaId,
              };
            default:
              return exhaustiveCheck(token);
          }
        })
        .filter(isDefined);

      executorCapabilities[folksChainId] = {
        folksChainId,
        gasDropOffLimit,
        maxGasLimit,
        maxMsgValue,
        feePaymentTokens,
      };
    }

    return executorCapabilities;
  },

  async quote(
    sourceChainId: FolksChainId,
    destinationChainId: FolksChainId,
    feePaymentToken: FeePaymentToken,
    gasDropOff?: GasDropOffInstruction,
  ): Promise<Quote> {
    const network = FolksCore.getSelectedNetwork();
    const sourceChain = getFolksChain(sourceChainId);
    const destinationChain = getFolksChain(destinationChainId);
    const gasLimit = getGasInstructionGasLimit(destinationChainId, destinationChain.chainType);

    const relayInstructions = buildRelayInstructions(
      {
        instructionType: RelayInstructionType.GasInstruction,
        gasLimit,
        msgValue: DEFAULT_GAS_INSTRUCTION_MSG_VALUE,
      },
      gasDropOff ? [gasDropOff] : undefined,
    );

    const url = new URL(`${getExecutorApiUrl(network)}/quote`);
    const params: QuoteRequest = {
      srcChain: sourceChain.wormholeChainId,
      dstChain: destinationChain.wormholeChainId,
      relayInstructions,
      tokenAddress: getFeePaymentTokenGenericAddress(feePaymentToken),
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (!response.ok) throw new Error(response.statusText);

    const { signedQuote, estimatedCost } = QuoteResponseSchema.parse(await response.json());
    return {
      signedQuote: {
        raw: signedQuote,
        decoded: decodeSignedQuote(signedQuote),
      },
      relayInstructions,
      feePaymentToken,
      estimatedCost,
    };
  },

  async history(address: GenericAddress, chainType: ChainType): Promise<Array<NTTOperation>> {
    const network = FolksCore.getSelectedNetwork();
    const searchAddress = convertFromGenericAddress(address, chainType);

    const url = new URL(`${getWormholeScanApiUrl(network)}/operations`);
    url.searchParams.append("address", searchAddress);
    const response = await fetch(url, { method: "GET" });
    if (!response.ok) throw new Error(response.statusText);

    const history = HistoryResponseSchema.parse(await response.json());

    return history.operations
      .filter(({ content }) => {
        const { standarizedProperties } = content;
        if (!standarizedProperties) return false;

        // skip if not ntt transfer
        const { appIds, tokenAddress, fromChain, toChain } = standarizedProperties;
        if (!appIds?.some((appId) => appId === "NATIVE_TOKEN_TRANSFER")) return false;

        // skip if from chain or to chain is unknown
        if (
          !(
            isWormholeChainSupported(network, fromChain as WormholeChainId) &&
            isWormholeChainSupported(network, toChain as WormholeChainId)
          )
        )
          return false;
        const sourceFolksChain = getFolksChainFromWormholeChain(network, fromChain as WormholeChainId);
        const { folksChainId: sourceFolksChainId } = sourceFolksChain;
        const { folksChainId: destinationFolksChainId } = getFolksChainFromWormholeChain(
          network,
          toChain as WormholeChainId,
        );

        // skip if token not supported
        const nttTokenAddress = convertToGenericAddress(
          sourceFolksChain.chainType === ChainType.EVM ? (tokenAddress as EVMAddress) : (tokenAddress as AVMAddress),
          sourceFolksChain.chainType,
        );
        if (!isAddressAnNttToken(sourceFolksChainId, nttTokenAddress)) return false;
        const nttToken = getNttTokenFromAddress(sourceFolksChainId, nttTokenAddress);
        return isNttTokenSupported(nttToken.nttTokenId, destinationFolksChainId);
      })
      .map(({ id, vaa, content, sourceChain, targetChain }) => {
        const { standarizedProperties } = content;
        if (!standarizedProperties) throw new Error("Unknown standarized properties");

        const { tokenAddress, fromChain, fromAddress, toChain, toAddress, amount, normalizedDecimals } =
          standarizedProperties;

        if (normalizedDecimals === null) throw new Error("Unknown decimals");

        const sourceFolksChain = getFolksChainFromWormholeChain(network, fromChain as WormholeChainId);
        const destFolksChain = getFolksChainFromWormholeChain(network, toChain as WormholeChainId);
        const nttTokenAddress = convertToGenericAddress(
          sourceFolksChain.chainType === ChainType.EVM ? (tokenAddress as EVMAddress) : (tokenAddress as AVMAddress),
          sourceFolksChain.chainType,
        );
        const { nttTokenId, decimals: sourceDecimals } = getNttTokenFromAddress(
          sourceFolksChain.folksChainId,
          nttTokenAddress,
        );
        const { decimals: destDecimals } = getNttChainToken(nttTokenId, destFolksChain.folksChainId);

        // if destination transaction is present then transfer has completed
        // else if vaa is present then it has been signed by guardians but not yet relayed
        // else waiting for guardian signatures before it can be relayed
        let status: NTTOperationStatus;
        if (targetChain) {
          status = NTTOperationStatus.COMPLETED;
        } else if (vaa) {
          status = NTTOperationStatus.WAITING_RELAY;
        } else {
          status = NTTOperationStatus.IN_PROGRESS;
        }

        return {
          id,
          status,
          nttTokenId,
          sourceChain: {
            folksChainId: sourceFolksChain.folksChainId,
            chainType: sourceFolksChain.chainType,
            fromAddress: convertToGenericAddress(
              sourceFolksChain.chainType === ChainType.EVM ? (fromAddress as EVMAddress) : (fromAddress as AVMAddress),
              sourceFolksChain.chainType,
            ),
            amount: createDecimalAmount(amount, sourceDecimals),
            transaction: {
              txHash: sourceChain.transaction.txHash,
              timestamp: sourceChain.timestamp,
            },
          },
          destinationChain: {
            folksChainId: destFolksChain.folksChainId,
            chainType: destFolksChain.chainType,
            toAddress: convertToGenericAddress(
              destFolksChain.chainType === ChainType.EVM ? (toAddress as EVMAddress) : (toAddress as AVMAddress),
              destFolksChain.chainType,
            ),
            amount: createDecimalAmount(amount, destDecimals),
            transaction: targetChain
              ? {
                  txHash: targetChain.transaction.txHash,
                  timestamp: targetChain.timestamp,
                }
              : undefined,
          },
          vaaRaw: vaa?.raw,
        };
      });
  },
};

export const prepare = {
  async manualInitiateTransfer<T extends ChainType>(
    nttTokenId: NTTTokenId,
    amount: bigint,
    recipientChainId: FolksChainId,
    recipient: GenericAddress,
  ): Promise<PrepareManualInitiateTransferCall<T>> {
    const folksChain = FolksCore.getSelectedFolksChain();
    const { chainType, folksChainId } = folksChain;

    const senderAddress = getSignerGenericAddress(FolksCore.getFolksSigner());

    switch (chainType) {
      case ChainType.EVM:
        return (await FolksEVMBridge.prepare.manualInitiateTransfer(
          FolksCore.getProvider<EVMChainType>(folksChainId),
          convertFromGenericAddress(senderAddress, chainType),
          folksChain,
          nttTokenId,
          amount,
          recipientChainId,
          recipient,
        )) as PrepareManualInitiateTransferCall<T>;
      case ChainType.AVM:
        return (await FolksAVMBridge.prepare.manualInitiateTransfer(
          FolksCore.getProvider<AVMChainType>(folksChainId),
          convertFromGenericAddress(senderAddress, chainType),
          folksChain,
          nttTokenId,
          amount,
          recipientChainId,
          recipient,
        )) as PrepareManualInitiateTransferCall<T>;
      default:
        return exhaustiveCheck(chainType);
    }
  },

  async manualCompleteTransfer<T extends ChainType>(
    nttTokenId: NTTTokenId,
    vaaRaw: Hex,
  ): Promise<PrepareManualCompleteTransferCall<T>> {
    const folksChain = FolksCore.getSelectedFolksChain();
    const { chainType } = folksChain;

    const senderAddress = getSignerGenericAddress(FolksCore.getFolksSigner());

    switch (chainType) {
      case ChainType.EVM:
        return (await FolksEVMBridge.prepare.manualCompleteTransfer(
          FolksCore.getProvider<EVMChainType>(folksChain.folksChainId),
          convertFromGenericAddress(senderAddress, chainType),
          folksChain,
          nttTokenId,
          vaaRaw,
        )) as PrepareManualCompleteTransferCall<T>;
      case ChainType.AVM:
        return (await FolksAVMBridge.prepare.manualCompleteTransfer(
          FolksCore.getProvider<AVMChainType>(folksChain.folksChainId),
          folksChain,
          nttTokenId,
          vaaRaw,
        )) as PrepareManualCompleteTransferCall<T>;
      default:
        return exhaustiveCheck(chainType);
    }
  },

  async transfer<T extends ChainType>(
    nttTokenId: NTTTokenId,
    amount: bigint,
    recipientChainId: FolksChainId,
    recipient: GenericAddress,
    executorCapabilities: ExecutorCapabilities,
    quote: Quote,
    feePaymentToken: FeePaymentToken,
    referrerFee?: ReferrerFee,
  ): Promise<PrepareTransferCall<T>> {
    const sourceChain = FolksCore.getSelectedFolksChain();
    const destinationChain = getFolksChain(recipientChainId);
    const { folksChainId: sourceFolksChainId, chainType } = sourceChain;
    const { folksChainId: destFolksChainId } = destinationChain;

    const senderAddress = getSignerGenericAddress(FolksCore.getFolksSigner());

    const feePaymentTokenAddress = getFeePaymentTokenGenericAddress(feePaymentToken);
    if (feePaymentTokenAddress !== quote.signedQuote.decoded.tokenAddress) {
      throw new Error("Quote is for a different fee token");
    }

    const sourceCapabilities = executorCapabilities[sourceFolksChainId];
    const destinationCapabilities = executorCapabilities[destFolksChainId];
    if (!sourceCapabilities) throw new Error(`Source chain ${sourceFolksChainId} not supported by executor`);
    if (!destinationCapabilities) throw new Error(`Recipient chain ${destFolksChainId} not supported by executor`);
    if (!sourceCapabilities.feePaymentTokens.some((token) => isFeePaymentTokenEqual(token, feePaymentToken)))
      throw new Error("Fee payment token not supported by executor");

    const referrerFeeDefault: ReferrerFee = referrerFee ?? {
      dbps: 0n,
      address: getEmptyHex(BYTES32_LENGTH) as GenericAddress,
    };

    switch (chainType) {
      case ChainType.EVM:
        return (await FolksEVMBridge.prepare.transfer(
          FolksCore.getProvider<EVMChainType>(sourceFolksChainId),
          convertFromGenericAddress(senderAddress, chainType),
          sourceChain,
          nttTokenId,
          amount,
          recipientChainId,
          recipient,
          quote,
          feePaymentToken,
          referrerFeeDefault,
        )) as PrepareTransferCall<T>;
      case ChainType.AVM:
        return (await FolksAVMBridge.prepare.transfer(
          FolksCore.getProvider<AVMChainType>(sourceFolksChainId),
          convertFromGenericAddress(senderAddress, chainType),
          sourceChain,
          nttTokenId,
          amount,
          recipientChainId,
          recipient,
          quote,
          feePaymentToken,
          referrerFeeDefault,
        )) as PrepareTransferCall<T>;
      default:
        return exhaustiveCheck(chainType);
    }
  },
};

export const write = {
  async manualInitiateTransfer<T extends ChainType>(prepareCall: PrepareManualInitiateTransferCall<T>) {
    const folksChain = FolksCore.getSelectedFolksChain();
    const { chainType } = folksChain;

    switch (chainType) {
      case ChainType.EVM:
        return await FolksEVMBridge.write.manualInitiateTransfer(
          FolksCore.getProvider<EVMChainType>(folksChain.folksChainId),
          FolksCore.getSigner<EVMChainType>(),
          prepareCall as PrepareManualInitiateTransferCall<EVMChainType>,
        );
      case ChainType.AVM:
        return await FolksAVMBridge.write.manualInitiateTransfer(
          FolksCore.getProvider<AVMChainType>(folksChain.folksChainId),
          FolksCore.getSigner<AVMChainType>(),
          prepareCall as PrepareManualInitiateTransferCall<AVMChainType>,
        );
      default:
        return exhaustiveCheck(chainType);
    }
  },

  async manualCompleteTransfer<T extends ChainType>(prepareCall: PrepareManualCompleteTransferCall<T>) {
    const folksChain = FolksCore.getSelectedFolksChain();
    const { chainType } = folksChain;

    switch (chainType) {
      case ChainType.EVM:
        return await FolksEVMBridge.write.manualCompleteTransfer(
          FolksCore.getProvider<EVMChainType>(folksChain.folksChainId),
          FolksCore.getSigner<EVMChainType>(),
          prepareCall as PrepareManualCompleteTransferCall<EVMChainType>,
        );
      case ChainType.AVM:
        return await FolksAVMBridge.write.manualCompleteTransfer(
          FolksCore.getProvider<AVMChainType>(folksChain.folksChainId),
          FolksCore.getSigner<AVMChainType>(),
          prepareCall as PrepareManualCompleteTransferCall<AVMChainType>,
        );
      default:
        return exhaustiveCheck(chainType);
    }
  },

  async transfer<T extends ChainType>(prepareCall: PrepareTransferCall<T>) {
    const folksChain = FolksCore.getSelectedFolksChain();
    const { chainType } = folksChain;

    switch (chainType) {
      case ChainType.EVM:
        return await FolksEVMBridge.write.transfer(
          FolksCore.getProvider<EVMChainType>(folksChain.folksChainId),
          FolksCore.getSigner<EVMChainType>(),
          prepareCall as PrepareTransferCall<EVMChainType>,
        );
      case ChainType.AVM:
        return await FolksAVMBridge.write.transfer(
          FolksCore.getProvider<AVMChainType>(folksChain.folksChainId),
          FolksCore.getSigner<AVMChainType>(),
          prepareCall as PrepareTransferCall<AVMChainType>,
        );
      default:
        return exhaustiveCheck(chainType);
    }
  },
};
