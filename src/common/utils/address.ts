import { decodeAddress, encodeAddress } from "algosdk";
import { getAddress, pad, sliceHex } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

import { BYTES16_LENGTH, BYTES32_LENGTH, BYTES64_LENGTH, EVM_ADDRESS_BYTES_LENGTH } from "../constants/bytes.js";
import { AddressType } from "../types/address.js";
import { ChainType } from "../types/chain.js";

import { exhaustiveCheck } from "./exhaustive-check.js";

import type {
  AccountAddressType,
  AddressChainType,
  AVMAddress,
  AVMAsaId,
  AVMContractId,
  EVMAddress,
  GenericAddress,
} from "../types/address.js";
import type { Hex } from "viem";

export function getRandomGenericAddress(): GenericAddress {
  return pad(privateKeyToAccount(generatePrivateKey()).address, {
    size: BYTES32_LENGTH,
  }).toLowerCase() as GenericAddress;
}

export function isGenericAddress(address: GenericAddress): boolean {
  return address.length === BYTES64_LENGTH + 2;
}

export function toAlgorandContractOrAsa(genericAddress: GenericAddress): AVMAsaId | AVMContractId {
  return BigInt(genericAddress) as AVMAsaId | AVMContractId;
}

export function fromAlgorandContractOrAsa(asaId: AVMAsaId): string {
  return `0x${asaId.toString(BYTES16_LENGTH).padStart(BYTES64_LENGTH, "0")}`;
}

export function convertAVMAddressToHex(address: string): Hex {
  return `0x${Buffer.from(decodeAddress(address).publicKey).toString("hex")}`;
}

export function convertHexToAVMAddress(hex: Hex): string {
  return encodeAddress(new Uint8Array(Buffer.from(hex.slice(2), "hex")));
}

export function convertToGenericAddress<T extends ChainType, A extends AddressType>(
  address: AddressChainType<T, A>,
  fromChainType: T,
  addressType: A = AddressType.ACCOUNT as A,
): GenericAddress {
  switch (fromChainType) {
    case ChainType.EVM:
      return pad(address as EVMAddress, {
        size: BYTES32_LENGTH,
      }).toLowerCase() as GenericAddress;

    case ChainType.AVM:
      switch (addressType) {
        case AddressType.TOKEN:
        case AddressType.CONTRACT:
          return fromAlgorandContractOrAsa(address as AVMAsaId) as GenericAddress;
        case AddressType.ACCOUNT:
          return convertAVMAddressToHex(address as AVMAddress) as GenericAddress;
        default:
          return exhaustiveCheck(addressType);
      }

    default:
      return exhaustiveCheck(fromChainType);
  }
}

export function convertFromGenericAddress<T extends ChainType, A extends AddressType = AccountAddressType>(
  address: GenericAddress,
  toChainType: T,
  addressType: A = AddressType.ACCOUNT as A,
): AddressChainType<T, A> {
  switch (toChainType) {
    case ChainType.EVM:
      return getAddress(sliceHex(address, BYTES32_LENGTH - EVM_ADDRESS_BYTES_LENGTH)) as AddressChainType<T, A>;

    case ChainType.AVM:
      switch (addressType) {
        case AddressType.TOKEN:
        // fall through
        case AddressType.CONTRACT:
          return toAlgorandContractOrAsa(address) as AddressChainType<T, A>;

        case AddressType.ACCOUNT:
          return convertHexToAVMAddress(address) as AddressChainType<T, A>;

        default:
          return exhaustiveCheck(addressType);
      }

    default:
      return exhaustiveCheck(toChainType);
  }
}
