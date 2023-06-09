const ABI = [
  {
    inputs: [
      {
        indexed: true,
        name: "owner",
        internalType: "address",
        type: "address",
      },
      {
        indexed: true,
        name: "spender",
        internalType: "address",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        internalType: "uint256",
        type: "uint256",
      },
    ],
    name: "Approval",
    anonymous: false,
    type: "event",
  },
  {
    inputs: [
      {
        indexed: true,
        name: "delegator",
        internalType: "address",
        type: "address",
      },
      {
        indexed: true,
        name: "fromDelegate",
        internalType: "address",
        type: "address",
      },
      {
        indexed: true,
        name: "toDelegate",
        internalType: "address",
        type: "address",
      },
    ],
    name: "DelegateChanged",
    anonymous: false,
    type: "event",
  },
  {
    inputs: [
      {
        indexed: true,
        name: "delegate",
        internalType: "address",
        type: "address",
      },
      {
        indexed: false,
        name: "previousBalance",
        internalType: "uint256",
        type: "uint256",
      },
      {
        indexed: false,
        name: "newBalance",
        internalType: "uint256",
        type: "uint256",
      },
    ],
    name: "DelegateVotesChanged",
    anonymous: false,
    type: "event",
  },
  {
    inputs: [
      {
        indexed: true,
        name: "previousOwner",
        internalType: "address",
        type: "address",
      },
      {
        indexed: true,
        name: "newOwner",
        internalType: "address",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    anonymous: false,
    type: "event",
  },
  {
    inputs: [
      { indexed: true, name: "from", internalType: "address", type: "address" },
      { indexed: true, name: "to", internalType: "address", type: "address" },
      {
        indexed: false,
        name: "value",
        internalType: "uint256",
        type: "uint256",
      },
    ],
    name: "Transfer",
    anonymous: false,
    type: "event",
  },
  {
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    inputs: [],
    name: "DELEGATION_TYPEHASH",
    stateMutability: "view",
    type: "function",
  },
  {
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    inputs: [],
    name: "DOMAIN_TYPEHASH",
    stateMutability: "view",
    type: "function",
  },
  {
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    inputs: [
      { name: "owner", internalType: "address", type: "address" },
      { name: "spender", internalType: "address", type: "address" },
    ],
    name: "allowance",
    stateMutability: "view",
    type: "function",
  },
  {
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    inputs: [
      { name: "spender", internalType: "address", type: "address" },
      { name: "amount", internalType: "uint256", type: "uint256" },
    ],
    name: "approve",
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    inputs: [{ name: "account", internalType: "address", type: "address" }],
    name: "balanceOf",
    stateMutability: "view",
    type: "function",
  },
  {
    outputs: [
      { name: "fromBlock", internalType: "uint32", type: "uint32" },
      { name: "votes", internalType: "uint256", type: "uint256" },
    ],
    inputs: [
      { name: "", internalType: "address", type: "address" },
      { name: "", internalType: "uint32", type: "uint32" },
    ],
    name: "checkpoints",
    stateMutability: "view",
    type: "function",
  },
  {
    outputs: [{ name: "", internalType: "uint8", type: "uint8" }],
    inputs: [],
    name: "decimals",
    stateMutability: "view",
    type: "function",
  },
  {
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    inputs: [
      { name: "spender", internalType: "address", type: "address" },
      { name: "subtractedValue", internalType: "uint256", type: "uint256" },
    ],
    name: "decreaseAllowance",
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    outputs: [],
    inputs: [{ name: "delegatee", internalType: "address", type: "address" }],
    name: "delegate",
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    outputs: [],
    inputs: [
      { name: "delegatee", internalType: "address", type: "address" },
      { name: "nonce", internalType: "uint256", type: "uint256" },
      { name: "expiry", internalType: "uint256", type: "uint256" },
      { name: "v", internalType: "uint8", type: "uint8" },
      { name: "r", internalType: "bytes32", type: "bytes32" },
      { name: "s", internalType: "bytes32", type: "bytes32" },
    ],
    name: "delegateBySig",
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    outputs: [{ name: "", internalType: "address", type: "address" }],
    inputs: [{ name: "delegator", internalType: "address", type: "address" }],
    name: "delegates",
    stateMutability: "view",
    type: "function",
  },
  {
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    inputs: [{ name: "account", internalType: "address", type: "address" }],
    name: "getCurrentVotes",
    stateMutability: "view",
    type: "function",
  },
  {
    outputs: [{ name: "", internalType: "address", type: "address" }],
    inputs: [],
    name: "getOwner",
    stateMutability: "view",
    type: "function",
  },
  {
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    inputs: [
      { name: "account", internalType: "address", type: "address" },
      { name: "blockNumber", internalType: "uint256", type: "uint256" },
    ],
    name: "getPriorVotes",
    stateMutability: "view",
    type: "function",
  },
  {
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    inputs: [
      { name: "spender", internalType: "address", type: "address" },
      { name: "addedValue", internalType: "uint256", type: "uint256" },
    ],
    name: "increaseAllowance",
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    outputs: [],
    inputs: [
      { name: "_to", internalType: "address", type: "address" },
      { name: "_amount", internalType: "uint256", type: "uint256" },
    ],
    name: "mint",
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    inputs: [{ name: "amount", internalType: "uint256", type: "uint256" }],
    name: "mint",
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    outputs: [{ name: "", internalType: "string", type: "string" }],
    inputs: [],
    name: "name",
    stateMutability: "view",
    type: "function",
  },
  {
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    inputs: [{ name: "", internalType: "address", type: "address" }],
    name: "nonces",
    stateMutability: "view",
    type: "function",
  },
  {
    outputs: [{ name: "", internalType: "uint32", type: "uint32" }],
    inputs: [{ name: "", internalType: "address", type: "address" }],
    name: "numCheckpoints",
    stateMutability: "view",
    type: "function",
  },
  {
    outputs: [{ name: "", internalType: "address", type: "address" }],
    inputs: [],
    name: "owner",
    stateMutability: "view",
    type: "function",
  },
  {
    outputs: [],
    inputs: [],
    name: "renounceOwnership",
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    outputs: [{ name: "", internalType: "string", type: "string" }],
    inputs: [],
    name: "symbol",
    stateMutability: "view",
    type: "function",
  },
  {
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    inputs: [],
    name: "totalSupply",
    stateMutability: "view",
    type: "function",
  },
  {
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    inputs: [
      { name: "recipient", internalType: "address", type: "address" },
      { name: "amount", internalType: "uint256", type: "uint256" },
    ],
    name: "transfer",
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    inputs: [
      { name: "sender", internalType: "address", type: "address" },
      { name: "recipient", internalType: "address", type: "address" },
      { name: "amount", internalType: "uint256", type: "uint256" },
    ],
    name: "transferFrom",
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    outputs: [],
    inputs: [{ name: "newOwner", internalType: "address", type: "address" }],
    name: "transferOwnership",
    stateMutability: "nonpayable",
    type: "function",
  },
];

export default ABI;
