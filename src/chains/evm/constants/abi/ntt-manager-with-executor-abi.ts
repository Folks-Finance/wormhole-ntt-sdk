export const NttManagerWithExecutorAbi = [
  {
    inputs: [
      { internalType: "uint16", name: "_chainId", type: "uint16" },
      { internalType: "address", name: "_executor", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { inputs: [], name: "InvalidPeerDecimals", type: "error" },
  {
    inputs: [{ internalType: "uint256", name: "refundAmount", type: "uint256" }],
    name: "RefundFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "VERSION",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint16", name: "dbps", type: "uint16" },
    ],
    name: "calculateFee",
    outputs: [{ internalType: "uint256", name: "fee", type: "uint256" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "chainId",
    outputs: [{ internalType: "uint16", name: "", type: "uint16" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "executor",
    outputs: [{ internalType: "contract IExecutor", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "nttManager", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint16", name: "recipientChain", type: "uint16" },
      { internalType: "bytes32", name: "recipientAddress", type: "bytes32" },
      { internalType: "bytes32", name: "refundAddress", type: "bytes32" },
      { internalType: "bytes", name: "encodedInstructions", type: "bytes" },
      {
        components: [
          { internalType: "uint256", name: "value", type: "uint256" },
          { internalType: "address", name: "refundAddress", type: "address" },
          { internalType: "bytes", name: "signedQuote", type: "bytes" },
          { internalType: "bytes", name: "instructions", type: "bytes" },
        ],
        internalType: "struct ExecutorArgs",
        name: "executorArgs",
        type: "tuple",
      },
      {
        components: [
          { internalType: "uint16", name: "dbps", type: "uint16" },
          { internalType: "address", name: "payee", type: "address" },
        ],
        internalType: "struct FeeArgs",
        name: "feeArgs",
        type: "tuple",
      },
    ],
    name: "transfer",
    outputs: [{ internalType: "uint64", name: "msgId", type: "uint64" }],
    stateMutability: "payable",
    type: "function",
  },
  { stateMutability: "payable", type: "receive" },
] as const;
