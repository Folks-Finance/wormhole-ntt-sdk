import type { AddressChainType, ContractAddressType, GenericAddress, TokenAddressType } from "./address.js";
import type { Branded } from "./brand.js";
import type { AVMChainType, ChainIdToChainType, ChainType, EVMChainType, FolksChainId } from "./chain.js";
import type { Erc20ContractSlot } from "../../chains/evm/types/tokens.js";

export const TokenType = {
  ERC20: "ERC20",
  ASA: "ASA",
  GAS: "GAS",
} as const;

export type NTTTokenId = Branded<string, "NTTTokenId">;

export type TokenType = (typeof TokenType)[keyof typeof TokenType];
export type Erc20TokenType = typeof TokenType.ERC20;
export type AsaTokenType = typeof TokenType.ASA;
export type GasTokenType = typeof TokenType.GAS;

export const TransceiverType = {
  WORMHOLE: "WORMHOLE",
} as const;

export type TransceiverType = (typeof TransceiverType)[keyof typeof TransceiverType];

export const ExecutorFeeType = {
  NATIVE: "NATIVE",
  TOKEN: "TOKEN",
} as const;

export type ExecutorFeeType = (typeof ExecutorFeeType)[keyof typeof ExecutorFeeType];

type BaseFeePaymentToken = {
  tokenType: TokenType;
  tokenSymbol: string;
  tokenDecimals: number;
};

export type GasFeePaymentToken = BaseFeePaymentToken & {
  tokenType: GasTokenType;
};

export type Erc20PaymentToken = BaseFeePaymentToken & {
  tokenType: Erc20TokenType;
  tokenAddress: AddressChainType<EVMChainType, TokenAddressType>;
  allowanceContractSlot: bigint;
};

export type AsaPaymentToken = BaseFeePaymentToken & {
  tokenType: AsaTokenType;
  assetId: AddressChainType<AVMChainType, TokenAddressType>;
};

export type FeePaymentToken = GasFeePaymentToken | Erc20PaymentToken | AsaPaymentToken;

export type NTTExecutor<C extends ChainType> = {
  [ChainType.EVM]: {
    [ExecutorFeeType.NATIVE]: AddressChainType<EVMChainType, ContractAddressType>;
    [ExecutorFeeType.TOKEN]: AddressChainType<EVMChainType, ContractAddressType>;
  };
  [ChainType.AVM]: {
    [ExecutorFeeType.NATIVE]: AddressChainType<AVMChainType, ContractAddressType>;
    [ExecutorFeeType.TOKEN]: AddressChainType<AVMChainType, ContractAddressType>;
  };
}[C];

export type Transceiver<C extends ChainType> = {
  [ChainType.EVM]: {
    transceiverType: TransceiverType;
    address: AddressChainType<EVMChainType, ContractAddressType>;
  };
  [ChainType.AVM]: {
    transceiverType: TransceiverType;
    address: AddressChainType<AVMChainType, ContractAddressType>;
  };
}[C];

export type ChainToken<C extends ChainType> = {
  [ChainType.EVM]: {
    nttTokenId: NTTTokenId;
    nttTokenAddress: AddressChainType<EVMChainType, TokenAddressType>;
    decimals: number;
    nttManagerAddress: AddressChainType<EVMChainType, ContractAddressType>;
    transceivers: Array<Transceiver<EVMChainType>>;
    contractSlot: Erc20ContractSlot;
  };
  [ChainType.AVM]: {
    nttTokenId: NTTTokenId;
    assetId: AddressChainType<AVMChainType, TokenAddressType>;
    nttTokenAddress: AddressChainType<AVMChainType, ContractAddressType>;
    decimals: number;
    nttManagerAddress: AddressChainType<AVMChainType, ContractAddressType>;
    transceivers: Array<Transceiver<AVMChainType>>;
  };
}[C];

export const RelayInstructionType = {
  GasInstruction: 1,
  GasDropOffInstruction: 2,
} as const;

export type RelayInstructionType = (typeof RelayInstructionType)[keyof typeof RelayInstructionType];
export type GasInstructionType = typeof RelayInstructionType.GasInstruction;
export type GasDropOffInstructionType = typeof RelayInstructionType.GasDropOffInstruction;

export type GasInstruction = {
  instructionType: GasInstructionType;
  gasLimit: bigint;
  msgValue: bigint;
};

export type GasDropOffInstruction = {
  instructionType: GasDropOffInstructionType;
  dropOff: bigint;
  recipient: GenericAddress;
};

export type ReferrerFee = {
  dbps: bigint;
  address: GenericAddress;
};

export type NTTTokenConfig<ChainId extends FolksChainId> = Omit<ChainToken<ChainIdToChainType<ChainId>>, "nttTokenId">;
