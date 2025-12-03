import { bytesToBigInt, hexToBytes, keccak256, numberToBytes } from "viem";

import type { MessageReceived } from "../constants/client/ntt-manager.client.js";
import type { Hex } from "viem";

export function calculateMessageDigest(message: MessageReceived): Hex {
  return keccak256(
    Uint8Array.from([
      ...message.id,
      ...message.userAddress,
      ...numberToBytes(message.sourceChainId, { size: 2 }),
      ...message.sourceAddress,
      ...message.handlerAddress,
      ...numberToBytes(message.payload.length, { size: 2 }),
      ...message.payload,
    ]),
  );
}

export function decodeVaa(vaaRaw: Hex) {
  const vaaBytes = hexToBytes(vaaRaw);

  let index = 0;
  const version = bytesToBigInt(vaaBytes.slice(index, index + 1));
  index += 1;
  const guardianSetIndex = bytesToBigInt(vaaBytes.slice(index, index + 4));
  index += 4;
  const numSigs = bytesToBigInt(vaaBytes.slice(index, index + 1));
  index += 1;

  const signatures: Array<{ guardianIndex: bigint; signature: Uint8Array }> = [];
  for (let i = 1n; i <= numSigs; i++) {
    signatures.push({
      guardianIndex: bytesToBigInt(vaaBytes.slice(index, index + 1)),
      signature: vaaBytes.slice(index + 1, index + 66),
    });
    index += 66;
  }

  const digest = hexToBytes(keccak256(keccak256(vaaBytes.slice(index))));
  const timestamp = bytesToBigInt(vaaBytes.slice(index, index + 4));
  index += 4;
  const nonce = bytesToBigInt(vaaBytes.slice(index, index + 4));
  index += 4;
  const emitterChain = bytesToBigInt(vaaBytes.slice(index, index + 2));
  index += 2;
  const emitterAddress = vaaBytes.slice(index, index + 32);
  index += 32;
  const sequence = bytesToBigInt(vaaBytes.slice(index, index + 8));
  index += 8;
  const consistencyLevel = bytesToBigInt(vaaBytes.slice(index, index + 1));
  index += 1;
  const payload = vaaBytes.slice(index);

  index = 4; // skip prefix
  const sourceAddress = payload.slice(index, index + 32);
  index += 32;
  const handlerAddress = payload.slice(index, index + 32);
  index += 32;
  const handlerPayloadLength = bytesToBigInt(payload.slice(index, index + 2));
  index += 2;
  const handlerPayload = payload.slice(index, index + Number(handlerPayloadLength));

  index = 0;
  const messageId = handlerPayload.slice(index, index + 32);
  index += 32;
  const userAddress = handlerPayload.slice(index, index + 32);
  index += 34; // skip message payload length since added back by client when encoding dynamic bytes
  const messagePayload = handlerPayload.slice(index);

  const message: MessageReceived = {
    id: messageId,
    userAddress,
    sourceChainId: Number(emitterChain),
    sourceAddress,
    handlerAddress,
    payload: messagePayload,
  };

  return {
    version,
    guardianSetIndex,
    numSigs,
    signatures,
    digest,
    timestamp,
    nonce,
    emitterChain,
    emitterAddress,
    sequence,
    consistencyLevel,
    messageDigest: calculateMessageDigest(message),
    message,
  };
}
