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
      [ExecutorFeeType.NATIVE]: "0xF2a1133eD83ace6EC097d12aaaf971582A84FD9e" as EVMAddress,
      [ExecutorFeeType.TOKEN]: "0x7652088A4A57CdaDDcF6Acf245ea824Feb852515" as EVMAddress,
    },
  },
  [EVM_FOLKS_CHAIN_ID.AVALANCHE]: {
    chainType: ChainType.EVM,
    wormholeChainId: EVM_WORMHOLE_CHAIN_ID.AVALANCHE,
    folksChainId: EVM_FOLKS_CHAIN_ID.AVALANCHE,
    chainName: "AVALANCHE",
    network: NetworkType.MAINNET,
    nttExecutors: {
      [ExecutorFeeType.NATIVE]: "0xaf1Daf89193828FEeE988e5F56cbe8c574EB1e66" as EVMAddress,
      [ExecutorFeeType.TOKEN]: "0x73758b457564a7505C56d93aBd3fEd23A0623974" as EVMAddress,
    },
  },
  [EVM_FOLKS_CHAIN_ID.BASE]: {
    chainType: ChainType.EVM,
    wormholeChainId: EVM_WORMHOLE_CHAIN_ID.BASE,
    folksChainId: EVM_FOLKS_CHAIN_ID.BASE,
    chainName: "BASE",
    network: NetworkType.MAINNET,
    nttExecutors: {
      [ExecutorFeeType.NATIVE]: "0xc23a812f64D9771D590468e1Af95448173Be1E43" as EVMAddress,
      [ExecutorFeeType.TOKEN]: "0x8aef0b7Bf7b66335F577d642f5b95Da3321FD42b" as EVMAddress,
    },
  },
  [EVM_FOLKS_CHAIN_ID.ARBITRUM]: {
    chainType: ChainType.EVM,
    wormholeChainId: EVM_WORMHOLE_CHAIN_ID.ARBITRUM,
    folksChainId: EVM_FOLKS_CHAIN_ID.ARBITRUM,
    chainName: "ARBITRUM",
    network: NetworkType.MAINNET,
    nttExecutors: {
      [ExecutorFeeType.NATIVE]: "0x3995892bd8171C141ca7110BE167221511106fcc" as EVMAddress,
      [ExecutorFeeType.TOKEN]: "0x8205c2A79748614cE601402aB0ccBEa573ea237b" as EVMAddress,
    },
  },
  [EVM_FOLKS_CHAIN_ID.BSC]: {
    chainType: ChainType.EVM,
    wormholeChainId: EVM_WORMHOLE_CHAIN_ID.BSC,
    folksChainId: EVM_FOLKS_CHAIN_ID.BSC,
    chainName: "BSC",
    network: NetworkType.MAINNET,
    nttExecutors: {
      [ExecutorFeeType.NATIVE]: "0xD11CA301D59454ec68Eb62fc8Cbb8093f92C76b7" as EVMAddress,
      [ExecutorFeeType.TOKEN]: "0x4e637270976bfb52edb699698312b57868367ae7" as EVMAddress,
    },
  },
  [EVM_FOLKS_CHAIN_ID.POLYGON]: {
    chainType: ChainType.EVM,
    wormholeChainId: EVM_WORMHOLE_CHAIN_ID.POLYGON,
    folksChainId: EVM_FOLKS_CHAIN_ID.POLYGON,
    chainName: "POLYGON",
    network: NetworkType.MAINNET,
    nttExecutors: {
      [ExecutorFeeType.NATIVE]: "0x6351d80EF98b287fd011F7b07Efa9b4086937d8b" as EVMAddress,
      [ExecutorFeeType.TOKEN]: "0x00f4E536846f6b5C30adb2D83560E6adb37CF667" as EVMAddress,
    },
  },
  [EVM_FOLKS_CHAIN_ID.SEI_EVM]: {
    chainType: ChainType.EVM,
    wormholeChainId: EVM_WORMHOLE_CHAIN_ID.SEI_EVM,
    folksChainId: EVM_FOLKS_CHAIN_ID.SEI_EVM,
    chainName: "SEI_EVM",
    network: NetworkType.MAINNET,
    nttExecutors: {
      [ExecutorFeeType.NATIVE]: "0x53f2873a4FDEBF0D23Ac350128ED63eF092Cb6FE" as EVMAddress,
      [ExecutorFeeType.TOKEN]: "0xA00eA5C8Ed582C2c1E5e0da471a6d37fb840a401" as EVMAddress,
    },
  },
  [EVM_FOLKS_CHAIN_ID.MONAD]: {
    chainType: ChainType.EVM,
    wormholeChainId: EVM_WORMHOLE_CHAIN_ID.MONAD,
    folksChainId: EVM_FOLKS_CHAIN_ID.MONAD,
    chainName: "MONAD",
    network: NetworkType.MAINNET,
    nttExecutors: {
      [ExecutorFeeType.NATIVE]: "0x0e310fd9738118c593bb266af02ef11f21d9ca3f" as EVMAddress,
      [ExecutorFeeType.TOKEN]: "0xfb3416edd66622dba6d58c43d039a6a23379d808" as EVMAddress,
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
      [ExecutorFeeType.NATIVE]: "0x7297b6dbc43F265241631d6342F94244189ECa3B" as EVMAddress,
      [ExecutorFeeType.TOKEN]: "0xb51B0AB26fCCC19D31835AC912dd734C9B1c53d9" as EVMAddress,
    },
  },
  [EVM_FOLKS_CHAIN_ID.AVALANCHE_FUJI]: {
    chainType: ChainType.EVM,
    wormholeChainId: EVM_WORMHOLE_CHAIN_ID.AVALANCHE_FUJI,
    folksChainId: EVM_FOLKS_CHAIN_ID.AVALANCHE_FUJI,
    chainName: "AVALANCHE_FUJI",
    network: NetworkType.TESTNET,
    nttExecutors: {
      [ExecutorFeeType.NATIVE]: "0x5C4FF2D5E4fBec700313D26f453Af85C9bCA65B5" as EVMAddress,
      [ExecutorFeeType.TOKEN]: "0x8B51c3F4c8BDBEcac9b724c0762Efee6E556c0fF" as EVMAddress,
    },
  },
  [EVM_FOLKS_CHAIN_ID.BASE_SEPOLIA]: {
    chainType: ChainType.EVM,
    wormholeChainId: EVM_WORMHOLE_CHAIN_ID.BASE_SEPOLIA,
    folksChainId: EVM_FOLKS_CHAIN_ID.BASE_SEPOLIA,
    chainName: "BASE_SEPOLIA",
    network: NetworkType.TESTNET,
    nttExecutors: {
      [ExecutorFeeType.NATIVE]: "0xE51966C47Ff2403C58E2bC2155892ed2b5023757" as EVMAddress,
      [ExecutorFeeType.TOKEN]: "0x5191a77Cc7CC60C38A1b405A53a212d0B9E0FC81" as EVMAddress,
    },
  },
  [EVM_FOLKS_CHAIN_ID.ARBITRUM_SEPOLIA]: {
    chainType: ChainType.EVM,
    wormholeChainId: EVM_WORMHOLE_CHAIN_ID.ARBITRUM_SEPOLIA,
    folksChainId: EVM_FOLKS_CHAIN_ID.ARBITRUM_SEPOLIA,
    chainName: "ARBITRUM_SEPOLIA",
    network: NetworkType.TESTNET,
    nttExecutors: {
      [ExecutorFeeType.NATIVE]: "0x1E8F9D289FdE82185824948Ca19965cD489e1616" as EVMAddress,
      [ExecutorFeeType.TOKEN]: "0xdFE620E233a37Ab3bb63A4f4DBdfc5c7B308DD9e" as EVMAddress,
    },
  },
  [EVM_FOLKS_CHAIN_ID.BSC_TESTNET]: {
    chainType: ChainType.EVM,
    wormholeChainId: EVM_WORMHOLE_CHAIN_ID.BSC_TESTNET,
    folksChainId: EVM_FOLKS_CHAIN_ID.BSC_TESTNET,
    chainName: "BSC_TESTNET",
    network: NetworkType.TESTNET,
    nttExecutors: {
      [ExecutorFeeType.NATIVE]: "0xfe46d849b58778cd309cb92b78dd6de03aceac50" as EVMAddress,
      [ExecutorFeeType.TOKEN]: "0x84C5161A75643376F75FFB1196a54291b997cA2f" as EVMAddress,
    },
  },
  [EVM_FOLKS_CHAIN_ID.POLYGON_AMOY]: {
    chainType: ChainType.EVM,
    wormholeChainId: EVM_WORMHOLE_CHAIN_ID.POLYGON_AMOY,
    folksChainId: EVM_FOLKS_CHAIN_ID.POLYGON_AMOY,
    chainName: "POLYGON_AMOY",
    network: NetworkType.TESTNET,
    nttExecutors: {
      [ExecutorFeeType.NATIVE]: "0x774BC7C4e327F497fa625388d917809896BfcC82" as EVMAddress,
      [ExecutorFeeType.TOKEN]: "0x4256138F227726F80692fAa4F01D184FC0fd97D4" as EVMAddress,
    },
  },
  [EVM_FOLKS_CHAIN_ID.SEI_EVM_TESTNET]: {
    chainType: ChainType.EVM,
    wormholeChainId: EVM_WORMHOLE_CHAIN_ID.SEI_EVM_TESTNET,
    folksChainId: EVM_FOLKS_CHAIN_ID.SEI_EVM_TESTNET,
    chainName: "SEI_EVM_TESTNET",
    network: NetworkType.TESTNET,
    nttExecutors: {
      [ExecutorFeeType.NATIVE]: "0x9535644ebbBd31DbEE91cD1B7bbE4A3b5a896A49" as EVMAddress,
      [ExecutorFeeType.TOKEN]: "0x88742B4F42c3B4E85d605443DAC9227c70D8cf7b" as EVMAddress,
    },
  },
};
