import { getAVMSignerAddress } from "../../chains/avm/utils/chain.js";
import { getEVMSignerAddress } from "../../chains/evm/utils/chain.js";
import { FOLKS_CHAIN } from "../constants/chain.js";
import { ChainType } from "../types/chain.js";

import { convertToGenericAddress } from "./address.js";
import { exhaustiveCheck } from "./exhaustive-check.js";

import type { GenericAddress } from "../types/address.js";
import type { FolksChainId, FolksNTTChain, NetworkType, NTTChain, WormholeChainId } from "../types/chain.js";
import type { FolksChainSigner } from "../types/core.js";

export function getFolksChain<T extends ChainType>(folksChainId: FolksChainId): NTTChain<T> {
  const folksChain = FOLKS_CHAIN[folksChainId] as NTTChain<T>;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!folksChain) throw new Error(`Folks Chain ${folksChainId} not found`);

  return folksChain;
}

export function getFolksChainsByNetwork(network: NetworkType): Array<FolksNTTChain> {
  return Object.values(FOLKS_CHAIN).filter((chain) => chain.network === network);
}

export function getFolksChainIdsByNetwork(networkType: NetworkType): Array<FolksChainId> {
  return getFolksChainsByNetwork(networkType).map((folksChain) => folksChain.folksChainId);
}

export function isWormholeChainSupported(networkType: NetworkType, wormholeChainId: WormholeChainId): boolean {
  const folksChains = getFolksChainsByNetwork(networkType);
  return Object.values(folksChains).some((chain) => chain.wormholeChainId === wormholeChainId);
}

export function getFolksChainFromWormholeChain(
  networkType: NetworkType,
  wormholeChainId: WormholeChainId,
): FolksNTTChain {
  const folksChains = getFolksChainsByNetwork(networkType);
  const folksChain = Object.values(folksChains).find((chain) => chain.wormholeChainId === wormholeChainId);
  if (!folksChain) throw new Error(`Wormhole chain ${wormholeChainId} not found`);
  return folksChain;
}

export function getSignerGenericAddress(folksChainSigner: FolksChainSigner): GenericAddress {
  const chainType = folksChainSigner.chainType;

  switch (chainType) {
    case ChainType.EVM:
      return convertToGenericAddress(getEVMSignerAddress(folksChainSigner.signer), chainType);

    case ChainType.AVM:
      return convertToGenericAddress(getAVMSignerAddress(folksChainSigner.signer), chainType);

    default:
      return exhaustiveCheck(chainType);
  }
}
