import { initProviders as initAVMProviders } from "../../chains/avm/utils/provider.js";
import { initProviders as initEVMProviders } from "../../chains/evm/utils/provider.js";
import { FOLKS_CHAIN_ID } from "../../common/constants/chain.js";
import { DEFAULT_NTT_TOKENS } from "../../common/constants/token.js";
import { ChainType } from "../../common/types/chain.js";
import { getFolksChain } from "../../common/utils/chain.js";
import { exhaustiveCheck } from "../../common/utils/exhaustive-check.js";

import type { AVMFolksChainId } from "../../chains/avm/types/chain.js";
import type { EVMFolksChainId } from "../../chains/evm/types/chain.js";
import type {
  FolksChainIdType,
  FolksNTTChain,
  NetworkType,
  ChainIdToChainType,
  FolksChainId,
} from "../../common/types/chain.js";
import type {
  FolksCoreConfig,
  FolksCoreProvider,
  FolksProvider,
  FolksSigner,
  FolksSignerType,
} from "../../common/types/core.js";
import type { ChainToken, NTTTokenConfig, NTTTokenId } from "../../common/types/ntt.js";
import type { AlgorandClient as AVMProvider } from "@algorandfoundation/algokit-utils";
import type { Client as EVMProvider } from "viem";

export class FolksCore {
  private static instance: FolksCore | undefined;

  private folksCoreProvider: FolksCoreProvider;

  private selectedNetwork: NetworkType;

  private folksSigner?: FolksSigner<ChainType>;

  private nttTokens = Object.fromEntries(
    Object.values(FOLKS_CHAIN_ID).map((folksChainId) => [folksChainId, new Map()]),
  ) as {
    [ChainId in FolksChainId]: Map<NTTTokenId, ChainToken<ChainIdToChainType<ChainId>>>;
  };

  private constructor(folksCoreConfig: FolksCoreConfig) {
    this.selectedNetwork = folksCoreConfig.network;
    this.folksCoreProvider = {
      EVM: {} as Record<EVMFolksChainId, EVMProvider>,
      AVM: {} as Record<AVMFolksChainId, AVMProvider>,
    };
    this.folksCoreProvider.EVM = initEVMProviders(folksCoreConfig.provider.EVM);
    this.folksCoreProvider.AVM = initAVMProviders(folksCoreConfig.provider.AVM);
  }

  static init(folksCoreConfig: FolksCoreConfig): FolksCore {
    if (FolksCore.instance) {
      throw new Error("FolksCore is already initialized");
    }

    FolksCore.instance = new FolksCore(folksCoreConfig);
    FolksCore.addTokens(DEFAULT_NTT_TOKENS);

    return FolksCore.instance;
  }

  static isInitialized(): boolean {
    return !!FolksCore.instance;
  }

  static getInstance(): FolksCore {
    if (FolksCore.instance) {
      return FolksCore.instance;
    }

    throw new Error("FolksCore is not initialized");
  }

  static getProvider<T extends ChainType>(folksChainId: FolksChainIdType<T>): FolksProvider<T> {
    const { chainType } = getFolksChain(folksChainId);

    switch (chainType) {
      case ChainType.EVM:
        return FolksCore.getEVMProvider(folksChainId as EVMFolksChainId) as FolksProvider<T>;

      case ChainType.AVM:
        return FolksCore.getAVMProvider(folksChainId as AVMFolksChainId) as FolksProvider<T>;

      default:
        return exhaustiveCheck(chainType);
    }
  }

  static getFolksSigner<T extends ChainType>() {
    const instance = FolksCore.getInstance();

    if (!instance.folksSigner) {
      throw new Error("FolksSigner is not initialized");
    }

    return instance.folksSigner as FolksSigner<T>;
  }

  static getSigner<T extends ChainType>(): FolksSignerType<T> {
    const { signer } = FolksCore.getFolksSigner<T>();

    return signer as FolksSignerType<T>;
  }

  static getSelectedFolksChain(): FolksNTTChain {
    const { folksChainId } = FolksCore.getFolksSigner();

    return getFolksChain(folksChainId);
  }

  static getSelectedNetwork() {
    const instance = FolksCore.getInstance();

    return instance.selectedNetwork;
  }

  static setProvider<T extends ChainType>(folksChainId: FolksChainIdType<T>, provider: FolksProvider<T>) {
    const instance = FolksCore.getInstance();
    const { chainType } = getFolksChain(folksChainId);

    switch (chainType) {
      case ChainType.EVM:
        instance.folksCoreProvider.EVM[folksChainId as EVMFolksChainId] = provider as EVMProvider;
        break;

      case ChainType.AVM:
        instance.folksCoreProvider.AVM[folksChainId as AVMFolksChainId] = provider as AVMProvider;
        break;

      default:
        return exhaustiveCheck(chainType);
    }
  }

  static setNetwork(network: NetworkType) {
    const instance = FolksCore.getInstance();

    instance.selectedNetwork = network;
  }

  static setFolksSigner(folksSigner: NonNullable<FolksSigner<ChainType>>) {
    const instance = FolksCore.getInstance();
    const { chainType } = getFolksChain(folksSigner.folksChainId);

    switch (chainType) {
      case ChainType.EVM:
        instance.folksSigner = folksSigner;
        break;

      case ChainType.AVM:
        instance.folksSigner = folksSigner;
        break;

      default:
        return exhaustiveCheck(chainType);
    }
  }

  static getEVMProvider(folksChainId: EVMFolksChainId): EVMProvider {
    const instance = FolksCore.getInstance();
    const evmProvider = instance.folksCoreProvider.EVM[folksChainId];

    if (!evmProvider) {
      throw new Error(`EVM Provider not found for folksChainId: ${folksChainId}`);
    }

    return evmProvider;
  }

  static getAVMProvider(folksChainId: AVMFolksChainId): AVMProvider {
    const instance = FolksCore.getInstance();
    const avmProvider = instance.folksCoreProvider.AVM[folksChainId];

    if (!avmProvider) {
      throw new Error(`AVM Provider not found for folksChainId: ${folksChainId}`);
    }

    return avmProvider;
  }

  static addTokens(tokens: Record<NTTTokenId, { [ChainId in FolksChainId]?: NTTTokenConfig<ChainId> }>) {
    const instance = FolksCore.getInstance();
    for (const [nttTokenId, chains] of Object.entries(tokens)) {
      for (const [chainId, token] of Object.entries(chains)) {
        instance.nttTokens[chainId as FolksChainId].set(
          nttTokenId as NTTTokenId,
          {
            ...token,
            nttTokenId,
          } as ChainToken<ChainIdToChainType<typeof chainId>>,
        );
      }
    }
  }

  static removeTokens(tokens: Array<NTTTokenId>) {
    const instance = FolksCore.getInstance();
    for (const chainId of Object.keys(instance.nttTokens)) {
      for (const tokenId of tokens) {
        instance.nttTokens[chainId as FolksChainId].delete(tokenId);
      }
    }
  }

  static getTokens<T extends ChainType>(chainId: FolksChainIdType<T>): Array<ChainToken<T>> {
    const instance = FolksCore.getInstance();
    const tokens = instance.nttTokens[chainId];
    return [...tokens.values()] as Array<ChainToken<T>>;
  }

  static getToken<T extends ChainType>(chainId: FolksChainIdType<T>, nttTokenId: NTTTokenId): ChainToken<T> {
    const instance = FolksCore.getInstance();
    const token = instance.nttTokens[chainId].get(nttTokenId);
    if (!token) throw new Error(`NTT Token ${nttTokenId} not found for chain ${chainId}`);
    return token as ChainToken<T>;
  }
}
