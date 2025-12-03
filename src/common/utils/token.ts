import { isAddressEqual } from "viem";

import { FolksCore } from "../../ntt/core/folks-core.js";
import { AddressType } from "../types/address.js";
import { ChainType } from "../types/chain.js";

import { convertFromGenericAddress } from "./address.js";
import { getFolksChain } from "./chain.js";
import { exhaustiveCheck } from "./exhaustive-check.js";

import type { GenericAddress } from "../types/address.js";
import type { FolksChainId, AVMChainType, EVMChainType, FolksChainIdType } from "../types/chain.js";
import type { ChainToken, NTTTokenId } from "../types/ntt.js";

export function isNttTokenSupported(nttTokenId: NTTTokenId, folksChainId: FolksChainId): boolean {
  return FolksCore.getTokens(folksChainId).find((token) => token.nttTokenId === nttTokenId) !== undefined;
}

export function assertNttTokenSupported(nttTokenId: NTTTokenId, folksChainId: FolksChainId): void {
  if (!isNttTokenSupported(nttTokenId, folksChainId)) {
    throw new Error(`NTT Token ${nttTokenId} not found for chain ${folksChainId}`);
  }
}

export function getNttChainToken<T extends ChainType>(
  nttTokenId: NTTTokenId,
  folksChainId: FolksChainIdType<T>,
): ChainToken<T> {
  return FolksCore.getToken<T>(folksChainId, nttTokenId);
}

export function isAddressAnNttToken(folksChainId: FolksChainId, address: GenericAddress): boolean {
  const { chainType } = getFolksChain(folksChainId);
  const nttTokens = FolksCore.getTokens(folksChainId);

  switch (chainType) {
    case ChainType.EVM: {
      const tokenAddress = convertFromGenericAddress(address, chainType, AddressType.TOKEN);
      return nttTokens.some((nttToken) =>
        isAddressEqual(tokenAddress, (nttToken as ChainToken<EVMChainType>).nttTokenAddress),
      );
    }
    case ChainType.AVM: {
      const tokenAddress = convertFromGenericAddress(address, chainType, AddressType.TOKEN);
      return nttTokens.some((nttToken) => tokenAddress === (nttToken as ChainToken<AVMChainType>).assetId);
    }
    default:
      return exhaustiveCheck(chainType);
  }
}

export function getNttTokenFromAddress<T extends ChainType>(
  folksChainId: FolksChainIdType<T>,
  address: GenericAddress,
): ChainToken<T> {
  const { chainType } = getFolksChain(folksChainId);
  const nttTokens = FolksCore.getTokens<T>(folksChainId);

  let chainToken: ChainToken<T> | undefined;
  switch (chainType) {
    case ChainType.EVM: {
      const tokenAddress = convertFromGenericAddress(address, chainType, AddressType.TOKEN);
      chainToken = nttTokens.find((nttToken) =>
        isAddressEqual(tokenAddress, (nttToken as ChainToken<EVMChainType>).nttTokenAddress),
      );
      break;
    }
    case ChainType.AVM: {
      const tokenAddress = convertFromGenericAddress(address, chainType, AddressType.TOKEN);
      chainToken = nttTokens.find((nttToken) => tokenAddress === (nttToken as ChainToken<AVMChainType>).assetId);
      break;
    }
    default:
      return exhaustiveCheck(chainType);
  }

  if (!chainToken) throw new Error(`NTT Token not found for ${address} on folks chain ${folksChainId}`);
  return chainToken;
}
