import { chainToChainId } from "@wormhole-foundation/sdk";
import {
  arbitrum,
  arbitrumSepolia,
  avalanche,
  avalancheFuji,
  base,
  baseSepolia,
  bsc,
  bscTestnet,
  mainnet,
  monad,
  polygon,
  polygonAmoy,
  sei,
  seiTestnet,
  sepolia,
} from "viem/chains";

import { ChainType, NetworkType } from "../../../common/types/chain.js";
import { ExecutorFeeType } from "../../../common/types/ntt.js";

import type { EVMAddress } from "../../../common/types/address.js";
import type { EVMChainType, NTTChain } from "../../../common/types/chain.js";
import type { EVMChainName, EVMFolksChainId, MainnetEVMFolksChainId, TestnetEVMFolksChainId } from "../types/chain.js";
import type { ChainId as WormholeChainId } from "@wormhole-foundation/sdk";
import type { Chain } from "viem";

export const MAINNET_EVM_CHAIN_ID = {
  ETHEREUM: mainnet.id,
  AVALANCHE: avalanche.id,
  BASE: base.id,
  ARBITRUM: arbitrum.id,
  BSC: bsc.id,
  POLYGON: polygon.id,
  SEI_EVM: sei.id,
  MONAD: monad.id,
} as const satisfies Record<keyof typeof MAINNET_EVM_FOLKS_CHAIN_ID, number>;

export const TESTNET_EVM_CHAIN_ID = {
  ETHEREUM_SEPOLIA: sepolia.id,
  AVALANCHE_FUJI: avalancheFuji.id,
  BASE_SEPOLIA: baseSepolia.id,
  ARBITRUM_SEPOLIA: arbitrumSepolia.id,
  BSC_TESTNET: bscTestnet.id,
  POLYGON_AMOY: polygonAmoy.id,
  SEI_EVM_TESTNET: seiTestnet.id,
} as const satisfies Record<keyof typeof TESTNET_EVM_FOLKS_CHAIN_ID, number>;

export const EVM_CHAIN_ID = {
  ...MAINNET_EVM_CHAIN_ID,
  ...TESTNET_EVM_CHAIN_ID,
} as const satisfies Record<EVMChainName, number>;

export const MAINNET_EVM_FOLKS_CHAIN_ID = {
  ETHEREUM: "ETHEREUM",
  AVALANCHE: "AVALANCHE",
  BASE: "BASE",
  ARBITRUM: "ARBITRUM",
  BSC: "BSC",
  POLYGON: "POLYGON",
  SEI_EVM: "SEI_EVM",
  MONAD: "MONAD",
} as const;

export const TESTNET_EVM_FOLKS_CHAIN_ID = {
  ETHEREUM_SEPOLIA: "ETHEREUM_SEPOLIA",
  AVALANCHE_FUJI: "AVALANCHE_FUJI",
  BASE_SEPOLIA: "BASE_SEPOLIA",
  ARBITRUM_SEPOLIA: "ARBITRUM_SEPOLIA",
  BSC_TESTNET: "BSC_TESTNET",
  POLYGON_AMOY: "POLYGON_AMOY",
  SEI_EVM_TESTNET: "SEI_EVM_TESTNET",
} as const;

export const EVM_FOLKS_CHAIN_ID = {
  ...MAINNET_EVM_FOLKS_CHAIN_ID,
  ...TESTNET_EVM_FOLKS_CHAIN_ID,
} as const satisfies Record<EVMChainName, string>;

export const MAINNET_EVM_CHAIN_NAMES = Object.values(MAINNET_EVM_FOLKS_CHAIN_ID);
export const TESTNET_EVM_CHAIN_NAMES = Object.values(TESTNET_EVM_FOLKS_CHAIN_ID);

export const EVM_CHAIN_NAMES = [...MAINNET_EVM_CHAIN_NAMES, ...TESTNET_EVM_CHAIN_NAMES] as const;

export const MAINNET_CHAIN_VIEM = {
  [EVM_FOLKS_CHAIN_ID.ETHEREUM]: mainnet,
  [EVM_FOLKS_CHAIN_ID.AVALANCHE]: avalanche,
  [EVM_FOLKS_CHAIN_ID.BASE]: base,
  [EVM_FOLKS_CHAIN_ID.ARBITRUM]: arbitrum,
  [EVM_FOLKS_CHAIN_ID.BSC]: bsc,
  [EVM_FOLKS_CHAIN_ID.POLYGON]: polygon,
  [EVM_FOLKS_CHAIN_ID.SEI_EVM]: sei,
  [EVM_FOLKS_CHAIN_ID.MONAD]: monad,
};

export const TESTNET_CHAIN_VIEM = {
  [EVM_FOLKS_CHAIN_ID.ETHEREUM_SEPOLIA]: sepolia,
  [EVM_FOLKS_CHAIN_ID.AVALANCHE_FUJI]: avalancheFuji,
  [EVM_FOLKS_CHAIN_ID.BASE_SEPOLIA]: baseSepolia,
  [EVM_FOLKS_CHAIN_ID.ARBITRUM_SEPOLIA]: arbitrumSepolia,
  [EVM_FOLKS_CHAIN_ID.BSC_TESTNET]: bscTestnet,
  [EVM_FOLKS_CHAIN_ID.POLYGON_AMOY]: polygonAmoy,
  [EVM_FOLKS_CHAIN_ID.SEI_EVM_TESTNET]: seiTestnet,
} as const;

export const CHAIN_VIEM = {
  ...MAINNET_CHAIN_VIEM,
  ...TESTNET_CHAIN_VIEM,
} as const satisfies Record<EVMFolksChainId, Chain>;

export const MAINNET_CHAIN_NODE = {
  [EVM_FOLKS_CHAIN_ID.ETHEREUM]: [...mainnet.rpcUrls.default.http],
  [EVM_FOLKS_CHAIN_ID.AVALANCHE]: [...avalanche.rpcUrls.default.http],
  [EVM_FOLKS_CHAIN_ID.BASE]: [...base.rpcUrls.default.http],
  [EVM_FOLKS_CHAIN_ID.ARBITRUM]: [...arbitrum.rpcUrls.default.http],
  [EVM_FOLKS_CHAIN_ID.BSC]: [...bsc.rpcUrls.default.http],
  [EVM_FOLKS_CHAIN_ID.POLYGON]: [...polygon.rpcUrls.default.http],
  [EVM_FOLKS_CHAIN_ID.SEI_EVM]: [...sei.rpcUrls.default.http],
  [EVM_FOLKS_CHAIN_ID.MONAD]: [...monad.rpcUrls.default.http],
};

export const TESTNET_CHAIN_NODE = {
  [EVM_FOLKS_CHAIN_ID.ETHEREUM_SEPOLIA]: [...sepolia.rpcUrls.default.http],
  [EVM_FOLKS_CHAIN_ID.AVALANCHE_FUJI]: [...avalancheFuji.rpcUrls.default.http],
  [EVM_FOLKS_CHAIN_ID.BASE_SEPOLIA]: [...baseSepolia.rpcUrls.default.http],
  [EVM_FOLKS_CHAIN_ID.ARBITRUM_SEPOLIA]: [...arbitrumSepolia.rpcUrls.default.http],
  [EVM_FOLKS_CHAIN_ID.BSC_TESTNET]: [...bscTestnet.rpcUrls.default.http],
  [EVM_FOLKS_CHAIN_ID.POLYGON_AMOY]: [...polygonAmoy.rpcUrls.default.http],
  [EVM_FOLKS_CHAIN_ID.SEI_EVM_TESTNET]: [...seiTestnet.rpcUrls.default.http],
};

export const CHAIN_NODE = {
  ...MAINNET_CHAIN_NODE,
  ...TESTNET_CHAIN_NODE,
} as const satisfies Record<EVMFolksChainId, Array<string>>;

export const MAINNET_EVM_WORMHOLE_CHAIN_ID = {
  [EVM_FOLKS_CHAIN_ID.ETHEREUM]: chainToChainId("Ethereum"),
  [EVM_FOLKS_CHAIN_ID.AVALANCHE]: chainToChainId("Avalanche"),
  [EVM_FOLKS_CHAIN_ID.BASE]: chainToChainId("Base"),
  [EVM_FOLKS_CHAIN_ID.ARBITRUM]: chainToChainId("Arbitrum"),
  [EVM_FOLKS_CHAIN_ID.BSC]: chainToChainId("Bsc"),
  [EVM_FOLKS_CHAIN_ID.POLYGON]: chainToChainId("Polygon"),
  [EVM_FOLKS_CHAIN_ID.SEI_EVM]: chainToChainId("Seievm"),
  [EVM_FOLKS_CHAIN_ID.MONAD]: chainToChainId("Monad"),
};

export const TESTNET_EVM_WORMHOLE_CHAIN_ID = {
  [EVM_FOLKS_CHAIN_ID.ETHEREUM_SEPOLIA]: chainToChainId("Sepolia"),
  [EVM_FOLKS_CHAIN_ID.AVALANCHE_FUJI]: chainToChainId("Avalanche"),
  [EVM_FOLKS_CHAIN_ID.BASE_SEPOLIA]: chainToChainId("BaseSepolia"),
  [EVM_FOLKS_CHAIN_ID.ARBITRUM_SEPOLIA]: chainToChainId("ArbitrumSepolia"),
  [EVM_FOLKS_CHAIN_ID.BSC_TESTNET]: chainToChainId("Bsc"),
  [EVM_FOLKS_CHAIN_ID.POLYGON_AMOY]: chainToChainId("PolygonSepolia"),
  [EVM_FOLKS_CHAIN_ID.SEI_EVM_TESTNET]: chainToChainId("Seievm"),
};

export const EVM_WORMHOLE_CHAIN_ID = {
  ...MAINNET_EVM_WORMHOLE_CHAIN_ID,
  ...TESTNET_EVM_WORMHOLE_CHAIN_ID,
} as const satisfies Record<EVMFolksChainId, WormholeChainId>;

export const MAINNET_EVM_FOLKS_CHAIN: Record<MainnetEVMFolksChainId, NTTChain<EVMChainType>> = {
  [EVM_FOLKS_CHAIN_ID.ETHEREUM]: {
    chainType: ChainType.EVM,
    wormholeChainId: EVM_WORMHOLE_CHAIN_ID.ETHEREUM,
    folksChainId: EVM_FOLKS_CHAIN_ID.ETHEREUM,
    chainName: "ETHEREUM",
    network: NetworkType.MAINNET,
    nttExecutors: {
      [ExecutorFeeType.NATIVE]: "0xD2D9c936165a85F27a5a7e07aFb974D022B89463" as EVMAddress,
      [ExecutorFeeType.TOKEN]: "0x8E4dB410c77300c077385C344BeD5B902c9Df71d" as EVMAddress,
    },
  },
  [EVM_FOLKS_CHAIN_ID.AVALANCHE]: {
    chainType: ChainType.EVM,
    wormholeChainId: EVM_WORMHOLE_CHAIN_ID.AVALANCHE,
    folksChainId: EVM_FOLKS_CHAIN_ID.AVALANCHE,
    chainName: "AVALANCHE",
    network: NetworkType.MAINNET,
    nttExecutors: {
      [ExecutorFeeType.NATIVE]: "0x4e9Af03fbf1aa2b79A2D4babD3e22e09f18Bb8EE" as EVMAddress,
      [ExecutorFeeType.TOKEN]: "0x501C95e5E7B0661Dd4c2D8625D13112ad337271F" as EVMAddress,
    },
  },
  [EVM_FOLKS_CHAIN_ID.BASE]: {
    chainType: ChainType.EVM,
    wormholeChainId: EVM_WORMHOLE_CHAIN_ID.BASE,
    folksChainId: EVM_FOLKS_CHAIN_ID.BASE,
    chainName: "BASE",
    network: NetworkType.MAINNET,
    nttExecutors: {
      [ExecutorFeeType.NATIVE]: "0x83216747fC21b86173D800E2960c0D5395de0F30" as EVMAddress,
      [ExecutorFeeType.TOKEN]: "0x4bbe096C7530B218ba001C6d84798F01ea917868" as EVMAddress,
    },
  },
  [EVM_FOLKS_CHAIN_ID.ARBITRUM]: {
    chainType: ChainType.EVM,
    wormholeChainId: EVM_WORMHOLE_CHAIN_ID.ARBITRUM,
    folksChainId: EVM_FOLKS_CHAIN_ID.ARBITRUM,
    chainName: "ARBITRUM",
    network: NetworkType.MAINNET,
    nttExecutors: {
      [ExecutorFeeType.NATIVE]: "0x0Af42A597b0C201D4dcf450DcD0c06d55ddC1C77" as EVMAddress,
      [ExecutorFeeType.TOKEN]: "0x6352Ece82D55ccd2159E9B221b2299cAEefF54E9" as EVMAddress,
    },
  },
  [EVM_FOLKS_CHAIN_ID.BSC]: {
    chainType: ChainType.EVM,
    wormholeChainId: EVM_WORMHOLE_CHAIN_ID.BSC,
    folksChainId: EVM_FOLKS_CHAIN_ID.BSC,
    chainName: "BSC",
    network: NetworkType.MAINNET,
    nttExecutors: {
      [ExecutorFeeType.NATIVE]: "0x39B57Dd9908F8be02CfeE283b67eA1303Bc29fe1" as EVMAddress,
      [ExecutorFeeType.TOKEN]: "0xd5b2957F63eEB809A77ED3EBAd6bf5BAC9A818C8" as EVMAddress,
    },
  },
  [EVM_FOLKS_CHAIN_ID.POLYGON]: {
    chainType: ChainType.EVM,
    wormholeChainId: EVM_WORMHOLE_CHAIN_ID.POLYGON,
    folksChainId: EVM_FOLKS_CHAIN_ID.POLYGON,
    chainName: "POLYGON",
    network: NetworkType.MAINNET,
    nttExecutors: {
      [ExecutorFeeType.NATIVE]: "0x6762157b73941e36cEd0AEf54614DdE545d0F990" as EVMAddress,
      [ExecutorFeeType.TOKEN]: "0x5288ac81Ec57A3DF7feBBa8c305506c28b0B05B6" as EVMAddress,
    },
  },
  [EVM_FOLKS_CHAIN_ID.SEI_EVM]: {
    chainType: ChainType.EVM,
    wormholeChainId: EVM_WORMHOLE_CHAIN_ID.SEI_EVM,
    folksChainId: EVM_FOLKS_CHAIN_ID.SEI_EVM,
    chainName: "SEI_EVM",
    network: NetworkType.MAINNET,
    nttExecutors: {
      [ExecutorFeeType.NATIVE]: "0x3F2D6441C7a59Dfe80f8e14142F9E28F6D440445" as EVMAddress,
      [ExecutorFeeType.TOKEN]: "0x3F2647cc4aff2A8342e1C8306Ad4B7c72a850E91" as EVMAddress,
    },
  },
  [EVM_FOLKS_CHAIN_ID.MONAD]: {
    chainType: ChainType.EVM,
    wormholeChainId: EVM_WORMHOLE_CHAIN_ID.MONAD,
    folksChainId: EVM_FOLKS_CHAIN_ID.MONAD,
    chainName: "MONAD",
    network: NetworkType.MAINNET,
    nttExecutors: {
      [ExecutorFeeType.NATIVE]: "0x93FE94Ad887a1B04DBFf1f736bfcD1698D4cfF66" as EVMAddress,
      [ExecutorFeeType.TOKEN]: "0x028864F9CE26E76aFb748Ed08F7631d879a774Ad" as EVMAddress,
    },
  },
};

export const TESTNET_EVM_FOLKS_CHAIN: Record<TestnetEVMFolksChainId, NTTChain<EVMChainType>> = {
  [EVM_FOLKS_CHAIN_ID.ETHEREUM_SEPOLIA]: {
    chainType: ChainType.EVM,
    wormholeChainId: EVM_WORMHOLE_CHAIN_ID.ETHEREUM_SEPOLIA,
    folksChainId: EVM_FOLKS_CHAIN_ID.ETHEREUM_SEPOLIA,
    chainName: "ETHEREUM_SEPOLIA",
    network: NetworkType.TESTNET,
    nttExecutors: {
      [ExecutorFeeType.NATIVE]: "0x54DD7080aE169DD923fE56d0C4f814a0a17B8f41" as EVMAddress,
      [ExecutorFeeType.TOKEN]: "0xCBf6FA72a15D97aa3a0C08873ACEaEB7DAb51DCd" as EVMAddress,
    },
  },
  [EVM_FOLKS_CHAIN_ID.AVALANCHE_FUJI]: {
    chainType: ChainType.EVM,
    wormholeChainId: EVM_WORMHOLE_CHAIN_ID.AVALANCHE_FUJI,
    folksChainId: EVM_FOLKS_CHAIN_ID.AVALANCHE_FUJI,
    chainName: "AVALANCHE_FUJI",
    network: NetworkType.TESTNET,
    nttExecutors: {
      [ExecutorFeeType.NATIVE]: "0x4e9Af03fbf1aa2b79A2D4babD3e22e09f18Bb8EE" as EVMAddress,
      [ExecutorFeeType.TOKEN]: "0x281d15aB59Eb82472Ba3b4819FCC57067d40b119" as EVMAddress,
    },
  },
  [EVM_FOLKS_CHAIN_ID.BASE_SEPOLIA]: {
    chainType: ChainType.EVM,
    wormholeChainId: EVM_WORMHOLE_CHAIN_ID.BASE_SEPOLIA,
    folksChainId: EVM_FOLKS_CHAIN_ID.BASE_SEPOLIA,
    chainName: "BASE_SEPOLIA",
    network: NetworkType.TESTNET,
    nttExecutors: {
      [ExecutorFeeType.NATIVE]: "0x5845E08d890E21687F7Ebf7CbAbD360cD91c6245" as EVMAddress,
      [ExecutorFeeType.TOKEN]: "0x23377e4A8824821c062A94D67aFad1370D0B8Ef9" as EVMAddress,
    },
  },
  [EVM_FOLKS_CHAIN_ID.ARBITRUM_SEPOLIA]: {
    chainType: ChainType.EVM,
    wormholeChainId: EVM_WORMHOLE_CHAIN_ID.ARBITRUM_SEPOLIA,
    folksChainId: EVM_FOLKS_CHAIN_ID.ARBITRUM_SEPOLIA,
    chainName: "ARBITRUM_SEPOLIA",
    network: NetworkType.TESTNET,
    nttExecutors: {
      [ExecutorFeeType.NATIVE]: "0xd048170F1ECB8D47E499D3459aC379DA023E2C1B" as EVMAddress,
      [ExecutorFeeType.TOKEN]: "0x7D80435D3CfDFeBcDDAccf465B5c4c3D2581a6DE" as EVMAddress,
    },
  },
  [EVM_FOLKS_CHAIN_ID.BSC_TESTNET]: {
    chainType: ChainType.EVM,
    wormholeChainId: EVM_WORMHOLE_CHAIN_ID.BSC_TESTNET,
    folksChainId: EVM_FOLKS_CHAIN_ID.BSC_TESTNET,
    chainName: "BSC_TESTNET",
    network: NetworkType.TESTNET,
    nttExecutors: {
      [ExecutorFeeType.NATIVE]: "0x39B57Dd9908F8be02CfeE283b67eA1303Bc29fe1" as EVMAddress,
      [ExecutorFeeType.TOKEN]: "0x7eF21BaBB8e0b30B89e3159955c7136549B2813B" as EVMAddress,
    },
  },
  [EVM_FOLKS_CHAIN_ID.POLYGON_AMOY]: {
    chainType: ChainType.EVM,
    wormholeChainId: EVM_WORMHOLE_CHAIN_ID.POLYGON_AMOY,
    folksChainId: EVM_FOLKS_CHAIN_ID.POLYGON_AMOY,
    chainName: "POLYGON_AMOY",
    network: NetworkType.TESTNET,
    nttExecutors: {
      [ExecutorFeeType.NATIVE]: "0x2982B9566E912458fE711FB1Fd78158264596937" as EVMAddress,
      [ExecutorFeeType.TOKEN]: "0x1EB24152d84Ddb4C4BB34915488b13223f0fE88A" as EVMAddress,
    },
  },
  [EVM_FOLKS_CHAIN_ID.SEI_EVM_TESTNET]: {
    chainType: ChainType.EVM,
    wormholeChainId: EVM_WORMHOLE_CHAIN_ID.SEI_EVM_TESTNET,
    folksChainId: EVM_FOLKS_CHAIN_ID.SEI_EVM_TESTNET,
    chainName: "SEI_EVM_TESTNET",
    network: NetworkType.TESTNET,
    nttExecutors: {
      [ExecutorFeeType.NATIVE]: "0x3F2D6441C7a59Dfe80f8e14142F9E28F6D440445" as EVMAddress,
      [ExecutorFeeType.TOKEN]: "0x248ae411586401BECC3Be792bd893fF5AEA3c8E5" as EVMAddress,
    },
  },
};
