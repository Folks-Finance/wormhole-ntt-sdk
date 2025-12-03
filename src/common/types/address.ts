import type { Branded } from "./brand.js";
import type { ChainType } from "./chain.js";

export type GenericAddress = Branded<`0x${string}`, "GenericAddress">;

export type EVMAddress = Branded<`0x${string}`, "EVMAddress">;

export type AVMAddress = Branded<string, "AVMAddress">;

export type AVMContractId = Branded<bigint, "AVMContractId">;

export type AVMAsaId = Branded<bigint, "AVMAsaId">;

export const AddressType = {
  TOKEN: "TOKEN",
  CONTRACT: "CONTRACT",
  ACCOUNT: "ACCOUNT",
} as const;

export type AddressType = (typeof AddressType)[keyof typeof AddressType];
export type AccountAddressType = typeof AddressType.ACCOUNT;
export type TokenAddressType = typeof AddressType.TOKEN;
export type ContractAddressType = typeof AddressType.CONTRACT;

type AddressChainTypeMap = {
  [ChainType.EVM]: {
    [AddressType.ACCOUNT]: EVMAddress;
    [AddressType.TOKEN]: EVMAddress;
    [AddressType.CONTRACT]: EVMAddress;
  };
  [ChainType.AVM]: {
    [AddressType.ACCOUNT]: AVMAddress;
    [AddressType.TOKEN]: AVMAsaId;
    [AddressType.CONTRACT]: AVMContractId;
  };
};

export type AddressChainType<
  T extends ChainType,
  A extends AddressType = AccountAddressType,
> = AddressChainTypeMap[T][A];
