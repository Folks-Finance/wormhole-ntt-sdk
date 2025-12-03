# @folks-finance/wormhole-ntt-sdk

[![License: MIT][license-image]][license-url]
[![CI][ci-image]][ci-url]
[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]

JavaScript SDK for transferring Wormhole NTT tokens with support for Algorand.

## Table of Contents

- [Getting Started](#getting-started)
  - [Installation](#installation)
    - [Package manager](#package-manager)
  - [SDK Structure and Usage](#sdk-structure-and-usage)
    - [FolksCore](#folkscore)
    - [Modules](#modules)
  - [Basic Usage](#basic-usage)
  - [React Usage](#react-usage)
    - [Initializing FolksCore](#initializing-folkscore)
    - [Synchronizing FolksCore Signer](#synchronizing-folkscore-signer)

## Getting Started

### Installation

#### Package manager

Using npm:

```bash
npm install @folks-finance/wormhole-ntt-sdk
```

Using yarn:

```bash
yarn add @folks-finance/wormhole-ntt-sdk
```

Using pnpm:

```bash
pnpm add @folks-finance/wormhole-ntt-sdk
```

Using bun:

```bash
bun add @folks-finance/wormhole-ntt-sdk
```

### SDK Structure and Usage

The Wormhole NTT SDK consists of two main components:

1. `FolksCore`: This acts as the central context for the SDK, managing configuration and state that is shared across all modules.
2. `FolksBridge`: For interacting with API and smart-contracts.

#### FolksCore

`FolksCore` is responsible for initializing the SDK and maintaining the global context. It handles:

- Network selection (testnet/mainnet)
- Provider management
- Signer management

Any changes made to `FolksCore` will affect subsequent calls to the various modules. For example, changing the network or signer will impact how the modules interact with the blockchain.

#### FolksBridge

`FolksBridge` used for:

- Reading executor capabilities
- Requesting quotes for transfer execution
- Initiating transfers
- Read operations history

This module use the context provided by `FolksCore` internally, so they always operate based on the current state of `FolksCore`.

### Basic Usage

To start using the Folks Finance Wormhole NTT SDK:

1. Import and initialize `FolksCore`:

```ts
import { FolksCore, NetworkType } from "@folks-finance/xchain-sdk";

const folksConfig = {
  network: NetworkType.TESTNET, // or NetworkType.MAINNET
  provider: {
    evm: {
      // Add your EVM provider configuration here (optional)
      // If not provided, default providers will be used
    },
  },
};

FolksCore.init(folksConfig);

// For operations that require signing - set signer
const evmSigner = getEVMSigner(network, chain); // or getAVMSigner()
FolksCore.setFolksSigner({
  signer: evmSigner,
  folksChainId: TESTNET_FOLKS_CHAIN_ID.AVALANCHE_FUJI,
  chainType: ChainType.EVM,
});
```

2. Use `FolksBridge` module to transfer tokens:

```ts
const feePaymentToken = {
  tokenType: TokenType.GAS,
  tokenSymbol: "",
  tokenDecimals: 18,
};
const sourceChain = TESTNET_FOLKS_CHAIN_ID.AVALANCHE_FUJI;
const destChain = TESTNET_FOLKS_CHAIN_ID.ALGORAND_TESTNET;

const capabilities = await FolksBridge.read.capabilities();
const quote = await FolksBridge.read.quote(sourceChain, destChain, feePaymentToken);

const prepareCall = await FolksBridge.prepare.transfer(
  TESTNET_NTT_TOKEN_ID.FOLKS_TESTNET,
  1_000_000n,
  destChain,
  convertToGenericAddress("5F3UPPGBWR2KBH3B3TJYJXQYIRVVNOVGOJLOVY6ALHCIMDW2SWS4FA7VLU" as AVMAddress, ChainType.AVM),
  capabilities,
  quote,
  feePaymentToken,
);

const txHash = await FolksBridge.write.transfer(prepareCall);
console.log(txHash);
```

More examples provided in [`./examples`](./examples) folder.

[license-image]: https://img.shields.io/badge/License-MIT-brightgreen.svg?style=flat-square
[license-url]: https://opensource.org/licenses/MIT
[ci-image]: https://img.shields.io/github/actions/workflow/status/Folks-Finance/wormhole-ntt-sdk/lint-and-typecheck.yml?branch=main&logo=github&style=flat-square
[ci-url]: https://github.com/Folks-Finance/wormhole-ntt-sdk/actions/workflows/lint-and-typecheck.yml
[npm-image]: https://img.shields.io/npm/v/@folks-finance/wormhole-ntt-sdk.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@folks-finance/wormhole-ntt-sdk
[downloads-image]: https://img.shields.io/npm/dm/@folks-finance/wormhole-ntt-sdk.svg?style=flat-square
