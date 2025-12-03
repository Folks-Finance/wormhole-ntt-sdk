import { encodeAbiParameters, getContract, keccak256 } from "viem";
import { waitForTransactionReceipt } from "viem/actions";

import { ERC20Abi } from "../constants/abi/erc-20-abi.js";
import { NttManagerAbi } from "../constants/abi/ntt-manager-abi.js";
import { NttManagerWithExecutorAbi } from "../constants/abi/ntt-manager-with-executor-abi.js";
import { NttManagerWithTokenPaymentExecutorAbi } from "../constants/abi/ntt-manager-with-token-payment-executor-abi.js";
import { WormholeTransceiverAbi } from "../constants/abi/wormhole-transceiver-abi.js";

import { getEVMSignerAccount, getEVMSignerAddress } from "./chain.js";

import type { EVMAddress } from "../../../common/types/address.js";
import type { GetReadContractReturnType } from "../types/contract.js";
import type { Client, GetContractReturnType, Hex, WalletClient } from "viem";

export function getERC20Contract(
  provider: Client,
  address: EVMAddress,
  signer: WalletClient,
): GetContractReturnType<typeof ERC20Abi, Client> {
  return getContract({
    abi: ERC20Abi,
    address,
    client: { wallet: signer, public: provider },
  });
}

export async function sendERC20Approve(
  provider: Client,
  address: EVMAddress,
  signer: WalletClient,
  spender: EVMAddress,
  amount: bigint,
): Promise<Hex | null> {
  const erc20 = getERC20Contract(provider, address, signer);
  const allowance = await erc20.read.allowance([getEVMSignerAddress(signer), spender]);

  // approve if not enough
  if (allowance < amount) {
    const hash = await erc20.write.approve([spender, amount], {
      account: getEVMSignerAccount(signer),
      chain: signer.chain,
    });
    const { transactionHash } = await waitForTransactionReceipt(provider, {
      hash,
    });
    return transactionHash;
  }
  return null;
}

export function getTokenPaymentExecutorContract(
  provider: Client,
  address: EVMAddress,
  signer: WalletClient,
): GetContractReturnType<typeof NttManagerAbi, Client> {
  return getContract({
    abi: NttManagerAbi,
    address,
    client: { wallet: signer, public: provider },
  });
}

export function getNTTManagerContract(
  provider: Client,
  address: EVMAddress,
): GetReadContractReturnType<typeof NttManagerAbi>;
export function getNTTManagerContract(
  provider: Client,
  address: EVMAddress,
  signer: WalletClient,
): GetContractReturnType<typeof NttManagerAbi, Client>;
export function getNTTManagerContract(
  provider: Client,
  address: EVMAddress,
  signer?: WalletClient,
): GetContractReturnType<typeof NttManagerAbi> {
  return getContract({
    abi: NttManagerAbi,
    address,
    client: { wallet: signer, public: provider },
  });
}

export function getNTTManagerWithExecutorContract(
  provider: Client,
  address: EVMAddress,
): GetReadContractReturnType<typeof NttManagerWithExecutorAbi>;
export function getNTTManagerWithExecutorContract(
  provider: Client,
  address: EVMAddress,
  signer: WalletClient,
): GetContractReturnType<typeof NttManagerWithExecutorAbi, Client>;
export function getNTTManagerWithExecutorContract(
  provider: Client,
  address: EVMAddress,
  signer?: WalletClient,
): GetContractReturnType<typeof NttManagerWithExecutorAbi> {
  return getContract({
    abi: NttManagerWithExecutorAbi,
    address,
    client: { wallet: signer, public: provider },
  });
}

export function getNTTManagerWithTokenPaymentExecutorContract(
  provider: Client,
  address: EVMAddress,
): GetReadContractReturnType<typeof NttManagerWithTokenPaymentExecutorAbi>;
export function getNTTManagerWithTokenPaymentExecutorContract(
  provider: Client,
  address: EVMAddress,
  signer: WalletClient,
): GetContractReturnType<typeof NttManagerWithTokenPaymentExecutorAbi, Client>;
export function getNTTManagerWithTokenPaymentExecutorContract(
  provider: Client,
  address: EVMAddress,
  signer?: WalletClient,
): GetContractReturnType<typeof NttManagerWithTokenPaymentExecutorAbi> {
  return getContract({
    abi: NttManagerWithTokenPaymentExecutorAbi,
    address,
    client: { wallet: signer, public: provider },
  });
}

export function getWormholeTransceiverContract(
  provider: Client,
  address: EVMAddress,
): GetReadContractReturnType<typeof WormholeTransceiverAbi>;
export function getWormholeTransceiverContract(
  provider: Client,
  address: EVMAddress,
  signer: WalletClient,
): GetContractReturnType<typeof WormholeTransceiverAbi, Client>;
export function getWormholeTransceiverContract(
  provider: Client,
  address: EVMAddress,
  signer?: WalletClient,
): GetContractReturnType<typeof WormholeTransceiverAbi> {
  return getContract({
    abi: WormholeTransceiverAbi,
    address,
    client: { wallet: signer, public: provider },
  });
}

export function getAllowanceSlotHash(owner: EVMAddress, spender: EVMAddress, slot: bigint) {
  return keccak256(
    encodeAbiParameters(
      [{ type: "address" }, { type: "bytes32" }],
      [spender, keccak256(encodeAbiParameters([{ type: "address" }, { type: "uint256" }], [owner, slot]))],
    ),
  );
}
