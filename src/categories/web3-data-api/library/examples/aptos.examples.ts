const Examples = {
  getBlockByHashOrNumber: {
    hash: "0x971aa252683ac7ea96a6268fbbd85742b1f3cb607493691a509324cddb634990",
    height: 384675329,
    timestamp: 1752560496293,
    firstVersion: 3062155220,
    lastVersion: 3062155232,
    transactionsCount: 13,
    transactions: [
      3062155220, 3062155221, 3062155222, 3062155223, 3062155224, 3062155225,
      3062155226, 3062155227, 3062155228, 3062155229, 3062155230, 3062155231,
      3062155232,
    ],
  },
  getBlocksWithinRange: {
    rpp: 3,
    page: 1,
    count: 389568507,
    items: [
      {
        hash: "0x9b1b1bdf360b087ab2cac0ae508b779ca81379760115a98b07ce7709882aefbb",
        height: 389568514,
        timestamp: 1753160832872,
        firstVersion: 3101841710,
        lastVersion: 3101841715,
        transactionsCount: 6,
        transactions: [
          3101841710, 3101841711, 3101841712, 3101841713, 3101841714,
          3101841715,
        ],
      },
      {
        hash: "0xc5f0e585af6bbeac1d610d2550de9051c37eb8a6f8075df10c9c110d0b29902b",
        height: 389568513,
        timestamp: 1753160832753,
        firstVersion: 3101841703,
        lastVersion: 3101841709,
        transactionsCount: 7,
        transactions: [
          3101841703, 3101841704, 3101841705, 3101841706, 3101841707,
          3101841708, 3101841709,
        ],
      },
      {
        hash: "0x698be67aeca5c3c079061071c1d8580f13efab1181c7aad10213ce9fd82ffb20",
        height: 389568512,
        timestamp: 1753160832642,
        firstVersion: 3101841689,
        lastVersion: 3101841702,
        transactionsCount: 14,
        transactions: [
          3101841689, 3101841690, 3101841691, 3101841692, 3101841693,
          3101841694, 3101841695, 3101841696, 3101841697, 3101841698,
          3101841699, 3101841700, 3101841701, 3101841702,
        ],
      },
    ],
  },
  getTransactionsInBlock: {
    "rpp": 1,
    "count": 1,
    "cursor": "eyJibG9ja0hlaWdodCI6NjI1OTUzMzQ1LCJ0cmFuc2FjdGlvblZlcnNpb24iOjQzNjEyMjgwOTR9",
    "items": [
      {
        "transactionHash": "0x6ae6cc696874207b343f62e9802b28c475d48ac65c1a0aea81f3a3691ecfb254",
        "transactionVersion": 4361228094,
        "blockHeight": 625953345,
        "blockTimestamp": 1771570339130,
        "sender": "0xa475ffd68ab045f530609598f42ae5efbe2d9b94c9bfa1d3eb739747e6481bf5",
        "success": false,
        "vmStatus": "Move abort in 0x5a96fab415f43721a44c5a761ecfcccc3dae9c21f34313f0e594b49d8d4564f4::kcash: EUSER_DO_NOT_HAVE_BUCKET_STORE(0x10002): ",
        "gasUnitPrice": "100",
        "gasUsed": "504",
        "maxGasAmount": "3000",
        "sequenceNumber": 0,
        "expirationTimestampSecs": 1771570939,
        "entryFunctionIdStr": "0x2387f5f16330dbb0236b1776a0d86c7a4901daaa25cd61ecb33709e025d3172f::esports_game_tracker::transfer_reward3_to_reward3_game_tracker",
        "entryFunctionContractAddress": "0x2387f5f16330dbb0236b1776a0d86c7a4901daaa25cd61ecb33709e025d3172f",
        "entryFunctionModuleName": "esports_game_tracker",
        "entryFunctionName": "transfer_reward3_to_reward3_game_tracker",
        "payload": {
          "type": "entry_function_payload",
          "function": "0x2387f5f16330dbb0236b1776a0d86c7a4901daaa25cd61ecb33709e025d3172f::esports_game_tracker::transfer_reward3_to_reward3_game_tracker",
          "typeArguments": [],
          "arguments": [
            "0x5a96fab415f43721a44c5a761ecfcccc3dae9c21f34313f0e594b49d8d4564f4",
            "15",
            "5f296814-b3cf-4710-b10f-f0e7a6a6fcb0"
          ]
        },
        "feePayer": "0x74990d57dc7aad693cec698d2199b5d5ff79facd10c97ce6eced8e59c76d1e0e",
        "secondarySigners": [],
        "events": [
          {
            "eventIndex": 0,
            "accountAddress": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "eventType": "0x1::transaction_fee::FeeStatement",
            "creationNumber": 0,
            "sequenceNumber": 0,
            "data": {
              "execution_gas_units": "9",
              "io_gas_units": "3",
              "storage_fee_octas": "49160",
              "storage_fee_refund_octas": "0",
              "total_charge_gas_units": "504"
            },
            "objectOwnerAddress": null,
            "objectAddress": null
          }
        ],
        "balanceInAccounts": [],
        "balanceOutAccounts": [
          "0x74990d57dc7aad693cec698d2199b5d5ff79facd10c97ce6eced8e59c76d1e0e"
        ],
        "balanceChangedTokens": [
          "0x1::aptos_coin::AptosCoin"
        ],
        "balanceChanges": [
          {
            "eventIndex": 0,
            "subEventIndex": 0,
            "accountAddress": "0x74990d57dc7aad693cec698d2199b5d5ff79facd10c97ce6eced8e59c76d1e0e",
            "assetType": "0x1::aptos_coin::AptosCoin",
            "changeValue": "-50400",
            "linkedAssetType": "0x000000000000000000000000000000000000000000000000000000000000000a",
            "tokenStandard": "v1",
            "transferType": "gas_fee",
            "eventType": "0x1::transaction_fee::FeeStatement",
            "transactionVersion": 4361228094,
            "blockHeight": 625953345,
            "blockTimestamp": 1771570339130,
            "transactionHash": "0x6ae6cc696874207b343f62e9802b28c475d48ac65c1a0aea81f3a3691ecfb254"
          }
        ]
      }
    ]
  },
  getTransactionsByAccount: {
    "rpp": 1,
    "count": 8506513,
    "cursor": "eyJibG9ja0hlaWdodCI6NjI1OTU0NTA2LCJ0cmFuc2FjdGlvblZlcnNpb24iOjQzNjEyMzI4Mjd9",
    "items": [
      {
        "transactionHash": "0xbd251f0ee4d3460086b380346f3ba7b07f0991880f7121627b98d843fc1ecf34",
        "transactionVersion": 4361232827,
        "blockHeight": 625954506,
        "blockTimestamp": 1771570400384,
        "sender": "0x28d22f7d88f2e1d1e35cd1e615bd087a2dd5b110c67863158edbc99cf428472f",
        "success": true,
        "vmStatus": "Executed successfully",
        "gasUnitPrice": "100",
        "gasUsed": "15",
        "maxGasAmount": "2000",
        "sequenceNumber": 1871,
        "expirationTimestampSecs": 1771613599,
        "entryFunctionIdStr": "0x1::primary_fungible_store::transfer",
        "entryFunctionContractAddress": "0x0000000000000000000000000000000000000000000000000000000000000001",
        "entryFunctionModuleName": "primary_fungible_store",
        "entryFunctionName": "transfer",
        "payload": {
          "type": "entry_function_payload",
          "function": "0x1::primary_fungible_store::transfer",
          "typeArguments": [
            "0x1::fungible_asset::Metadata"
          ],
          "arguments": [
            {
              "inner": "0x357b0b74bc833e95a115ad22604854d6b0fca151cecd94111770e5d6ffc9dc2b"
            },
            "0x51c6abe562e755582d268340b2cf0e2d8895a155dc9b7a7fb5465000d62d770b",
            "5210419800"
          ]
        },
        "secondarySigners": [],
        "events": [
          {
            "eventIndex": 0,
            "accountAddress": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "eventType": "0x1::fungible_asset::Withdraw",
            "creationNumber": 0,
            "sequenceNumber": 0,
            "data": {
              "amount": "5210419800",
              "store": "0xd25e6938c1f03aadbb99175b824eadfdd25cd9e9c9aaa1b4b502c29d784ac83b"
            },
            "objectOwnerAddress": "0x28d22f7d88f2e1d1e35cd1e615bd087a2dd5b110c67863158edbc99cf428472f",
            "objectAddress": "0xd25e6938c1f03aadbb99175b824eadfdd25cd9e9c9aaa1b4b502c29d784ac83b"
          },
          {
            "eventIndex": 1,
            "accountAddress": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "eventType": "0x1::fungible_asset::Deposit",
            "creationNumber": 0,
            "sequenceNumber": 0,
            "data": {
              "amount": "5210419800",
              "store": "0x1802d7a48647903b609a63fb8f7e719fe0f4fe0f58090768ca889e990b66a7d8"
            },
            "objectOwnerAddress": "0x51c6abe562e755582d268340b2cf0e2d8895a155dc9b7a7fb5465000d62d770b",
            "objectAddress": "0x1802d7a48647903b609a63fb8f7e719fe0f4fe0f58090768ca889e990b66a7d8"
          },
          {
            "eventIndex": 2,
            "accountAddress": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "eventType": "0x1::transaction_fee::FeeStatement",
            "creationNumber": 0,
            "sequenceNumber": 0,
            "data": {
              "storage_fee_refund_octas": "0",
              "total_charge_gas_units": "15",
              "execution_gas_units": "6",
              "io_gas_units": "9",
              "storage_fee_octas": "0"
            },
            "objectOwnerAddress": null,
            "objectAddress": null
          }
        ],
        "balanceInAccounts": [
          "0x51c6abe562e755582d268340b2cf0e2d8895a155dc9b7a7fb5465000d62d770b"
        ],
        "balanceOutAccounts": [
          "0x28d22f7d88f2e1d1e35cd1e615bd087a2dd5b110c67863158edbc99cf428472f"
        ],
        "balanceChangedTokens": [
          "0x357b0b74bc833e95a115ad22604854d6b0fca151cecd94111770e5d6ffc9dc2b",
          "0x1::aptos_coin::AptosCoin"
        ],
        "balanceChanges": [
          {
            "eventIndex": 0,
            "subEventIndex": 0,
            "accountAddress": "0x28d22f7d88f2e1d1e35cd1e615bd087a2dd5b110c67863158edbc99cf428472f",
            "assetType": "0x357b0b74bc833e95a115ad22604854d6b0fca151cecd94111770e5d6ffc9dc2b",
            "changeValue": "-5210419800",
            "linkedAssetType": "0x357b0b74bc833e95a115ad22604854d6b0fca151cecd94111770e5d6ffc9dc2b",
            "tokenStandard": "v2",
            "transferType": "withdraw",
            "eventType": "0x1::fungible_asset::Withdraw",
            "transactionVersion": 4361232827,
            "blockHeight": 625954506,
            "blockTimestamp": 1771570400384,
            "transactionHash": "0xbd251f0ee4d3460086b380346f3ba7b07f0991880f7121627b98d843fc1ecf34"
          },
          {
            "eventIndex": 1,
            "subEventIndex": 0,
            "accountAddress": "0x51c6abe562e755582d268340b2cf0e2d8895a155dc9b7a7fb5465000d62d770b",
            "assetType": "0x357b0b74bc833e95a115ad22604854d6b0fca151cecd94111770e5d6ffc9dc2b",
            "changeValue": "5210419800",
            "linkedAssetType": "0x357b0b74bc833e95a115ad22604854d6b0fca151cecd94111770e5d6ffc9dc2b",
            "tokenStandard": "v2",
            "transferType": "deposit",
            "eventType": "0x1::fungible_asset::Deposit",
            "transactionVersion": 4361232827,
            "blockHeight": 625954506,
            "blockTimestamp": 1771570400384,
            "transactionHash": "0xbd251f0ee4d3460086b380346f3ba7b07f0991880f7121627b98d843fc1ecf34"
          },
          {
            "eventIndex": 2,
            "subEventIndex": 0,
            "accountAddress": "0x28d22f7d88f2e1d1e35cd1e615bd087a2dd5b110c67863158edbc99cf428472f",
            "assetType": "0x1::aptos_coin::AptosCoin",
            "changeValue": "-1500",
            "linkedAssetType": "0x000000000000000000000000000000000000000000000000000000000000000a",
            "tokenStandard": "v1",
            "transferType": "gas_fee",
            "eventType": "0x1::transaction_fee::FeeStatement",
            "transactionVersion": 4361232827,
            "blockHeight": 625954506,
            "blockTimestamp": 1771570400384,
            "transactionHash": "0xbd251f0ee4d3460086b380346f3ba7b07f0991880f7121627b98d843fc1ecf34"
          }
        ]
      }
    ]
  },
  getTotalTransactionCountByAccount: {
    transactionCount: 465809,
  },
  getTransactionsByHashes: [
    {
      "transactionHash": "0xaf2fba4b6190c4b87d9479f3eb62c093f452f27c388dab4afeae98ae8ec00005",
      "transactionVersion": 3062155221,
      "blockHeight": 384675329,
      "blockTimestamp": 1752560496293,
      "sender": "0x49019bb2f30da7916a417e108f6c1fe5dc14a9b4c9d6582d65fad3c0c5373ab2",
      "success": true,
      "vmStatus": "Executed successfully",
      "gasUnitPrice": "100",
      "gasUsed": "10",
      "maxGasAmount": "2018",
      "sequenceNumber": 447152,
      "expirationTimestampSecs": 1752564095,
      "entryFunctionIdStr": "0x1::aptos_account::transfer",
      "entryFunctionContractAddress": "0x0000000000000000000000000000000000000000000000000000000000000001",
      "entryFunctionModuleName": "aptos_account",
      "entryFunctionName": "transfer",
      "payload": {
        "type": "entry_function_payload",
        "function": "0x1::aptos_account::transfer",
        "typeArguments": [],
        "arguments": [
          "0xaf21ac12caf6c3917b78166a6e0f762a0a4f8ef627c9b702bf6bb72eb93eb54",
          "70000"
        ]
      },
      "secondarySigners": [],
      "events": [
        {
          "eventIndex": 0,
          "accountAddress": "0x49019bb2f30da7916a417e108f6c1fe5dc14a9b4c9d6582d65fad3c0c5373ab2",
          "eventType": "0x1::coin::WithdrawEvent",
          "creationNumber": 3,
          "sequenceNumber": 447152,
          "data": {
            "amount": "70000"
          },
          "objectOwnerAddress": "0x49019bb2f30da7916a417e108f6c1fe5dc14a9b4c9d6582d65fad3c0c5373ab2",
          "objectAddress": null
        },
        {
          "eventIndex": 1,
          "accountAddress": "0x0af21ac12caf6c3917b78166a6e0f762a0a4f8ef627c9b702bf6bb72eb93eb54",
          "eventType": "0x1::coin::DepositEvent",
          "creationNumber": 2,
          "sequenceNumber": 21,
          "data": {
            "amount": "70000"
          },
          "objectOwnerAddress": "0x0af21ac12caf6c3917b78166a6e0f762a0a4f8ef627c9b702bf6bb72eb93eb54",
          "objectAddress": null
        },
        {
          "eventIndex": 2,
          "accountAddress": "0x0000000000000000000000000000000000000000000000000000000000000000",
          "eventType": "0x1::transaction_fee::FeeStatement",
          "creationNumber": 0,
          "sequenceNumber": 0,
          "data": {
            "execution_gas_units": "5",
            "io_gas_units": "5",
            "storage_fee_octas": "0",
            "storage_fee_refund_octas": "0",
            "total_charge_gas_units": "10"
          },
          "objectOwnerAddress": null,
          "objectAddress": null
        }
      ],
      "balanceInAccounts": [
        "0x0af21ac12caf6c3917b78166a6e0f762a0a4f8ef627c9b702bf6bb72eb93eb54"
      ],
      "balanceOutAccounts": [
        "0x49019bb2f30da7916a417e108f6c1fe5dc14a9b4c9d6582d65fad3c0c5373ab2"
      ],
      "balanceChangedTokens": [
        "0x1::aptos_coin::AptosCoin"
      ],
      "balanceChanges": [
        {
          "eventIndex": 0,
          "subEventIndex": 0,
          "accountAddress": "0x49019bb2f30da7916a417e108f6c1fe5dc14a9b4c9d6582d65fad3c0c5373ab2",
          "assetType": "0x1::aptos_coin::AptosCoin",
          "changeValue": "-70000",
          "linkedAssetType": "0x000000000000000000000000000000000000000000000000000000000000000a",
          "tokenStandard": "v1",
          "transferType": "withdraw",
          "eventType": "0x1::coin::WithdrawEvent",
          "transactionVersion": 3062155221,
          "blockHeight": 384675329,
          "blockTimestamp": 1752560496293,
          "transactionHash": "0xaf2fba4b6190c4b87d9479f3eb62c093f452f27c388dab4afeae98ae8ec00005"
        },
        {
          "eventIndex": 1,
          "subEventIndex": 0,
          "accountAddress": "0x0af21ac12caf6c3917b78166a6e0f762a0a4f8ef627c9b702bf6bb72eb93eb54",
          "assetType": "0x1::aptos_coin::AptosCoin",
          "changeValue": "70000",
          "linkedAssetType": "0x000000000000000000000000000000000000000000000000000000000000000a",
          "tokenStandard": "v1",
          "transferType": "deposit",
          "eventType": "0x1::coin::DepositEvent",
          "transactionVersion": 3062155221,
          "blockHeight": 384675329,
          "blockTimestamp": 1752560496293,
          "transactionHash": "0xaf2fba4b6190c4b87d9479f3eb62c093f452f27c388dab4afeae98ae8ec00005"
        },
        {
          "eventIndex": 2,
          "subEventIndex": 0,
          "accountAddress": "0x49019bb2f30da7916a417e108f6c1fe5dc14a9b4c9d6582d65fad3c0c5373ab2",
          "assetType": "0x1::aptos_coin::AptosCoin",
          "changeValue": "-1000",
          "linkedAssetType": "0x000000000000000000000000000000000000000000000000000000000000000a",
          "tokenStandard": "v1",
          "transferType": "gas_fee",
          "eventType": "0x1::transaction_fee::FeeStatement",
          "transactionVersion": 3062155221,
          "blockHeight": 384675329,
          "blockTimestamp": 1752560496293,
          "transactionHash": "0xaf2fba4b6190c4b87d9479f3eb62c093f452f27c388dab4afeae98ae8ec00005"
        }
      ]
    },
    {
      "transactionHash": "0x4a88f63c8ab07ccfdf9bc35a3a8a93a3fc4989f6a3692c4f58c26f08770b8046",
      "transactionVersion": 3102207414,
      "blockHeight": 389609337,
      "blockTimestamp": 1753165865776,
      "sender": "0x210f8db0f9201e0cec952a8794cacc34d983db7bd93848eb898e6b2fdb47a7d0",
      "success": true,
      "vmStatus": "Executed successfully",
      "gasUnitPrice": "100",
      "gasUsed": "10",
      "maxGasAmount": "2018",
      "sequenceNumber": 3,
      "expirationTimestampSecs": 1753169464,
      "entryFunctionIdStr": "0x1::aptos_account::transfer",
      "entryFunctionContractAddress": "0x0000000000000000000000000000000000000000000000000000000000000001",
      "entryFunctionModuleName": "aptos_account",
      "entryFunctionName": "transfer",
      "payload": {
        "type": "entry_function_payload",
        "function": "0x1::aptos_account::transfer",
        "typeArguments": [],
        "arguments": [
          "0x34ca84470e8d2907562f9a2f144c6c780282953b8b025ba220b0ecc5fc0aead9",
          "20000"
        ]
      },
      "feePayer": "0x34ca84470e8d2907562f9a2f144c6c780282953b8b025ba220b0ecc5fc0aead9",
      "secondarySigners": [],
      "events": [
        {
          "eventIndex": 0,
          "accountAddress": "0x210f8db0f9201e0cec952a8794cacc34d983db7bd93848eb898e6b2fdb47a7d0",
          "eventType": "0x1::coin::WithdrawEvent",
          "creationNumber": 3,
          "sequenceNumber": 3,
          "data": {
            "amount": "20000"
          },
          "objectOwnerAddress": "0x210f8db0f9201e0cec952a8794cacc34d983db7bd93848eb898e6b2fdb47a7d0",
          "objectAddress": null
        },
        {
          "eventIndex": 1,
          "accountAddress": "0x34ca84470e8d2907562f9a2f144c6c780282953b8b025ba220b0ecc5fc0aead9",
          "eventType": "0x1::coin::DepositEvent",
          "creationNumber": 2,
          "sequenceNumber": 51780811,
          "data": {
            "amount": "20000"
          },
          "objectOwnerAddress": "0x34ca84470e8d2907562f9a2f144c6c780282953b8b025ba220b0ecc5fc0aead9",
          "objectAddress": null
        },
        {
          "eventIndex": 2,
          "accountAddress": "0x0000000000000000000000000000000000000000000000000000000000000000",
          "eventType": "0x1::transaction_fee::FeeStatement",
          "creationNumber": 0,
          "sequenceNumber": 0,
          "data": {
            "storage_fee_octas": "0",
            "storage_fee_refund_octas": "0",
            "total_charge_gas_units": "10",
            "execution_gas_units": "5",
            "io_gas_units": "5"
          },
          "objectOwnerAddress": null,
          "objectAddress": null
        }
      ],
      "balanceInAccounts": [
        "0x34ca84470e8d2907562f9a2f144c6c780282953b8b025ba220b0ecc5fc0aead9"
      ],
      "balanceOutAccounts": [
        "0x210f8db0f9201e0cec952a8794cacc34d983db7bd93848eb898e6b2fdb47a7d0",
        "0x34ca84470e8d2907562f9a2f144c6c780282953b8b025ba220b0ecc5fc0aead9"
      ],
      "balanceChangedTokens": [
        "0x1::aptos_coin::AptosCoin"
      ],
      "balanceChanges": [
        {
          "eventIndex": 0,
          "subEventIndex": 0,
          "accountAddress": "0x210f8db0f9201e0cec952a8794cacc34d983db7bd93848eb898e6b2fdb47a7d0",
          "assetType": "0x1::aptos_coin::AptosCoin",
          "changeValue": "-20000",
          "linkedAssetType": "0x000000000000000000000000000000000000000000000000000000000000000a",
          "tokenStandard": "v1",
          "transferType": "withdraw",
          "eventType": "0x1::coin::WithdrawEvent",
          "transactionVersion": 3102207414,
          "blockHeight": 389609337,
          "blockTimestamp": 1753165865776,
          "transactionHash": "0x4a88f63c8ab07ccfdf9bc35a3a8a93a3fc4989f6a3692c4f58c26f08770b8046"
        },
        {
          "eventIndex": 1,
          "subEventIndex": 0,
          "accountAddress": "0x34ca84470e8d2907562f9a2f144c6c780282953b8b025ba220b0ecc5fc0aead9",
          "assetType": "0x1::aptos_coin::AptosCoin",
          "changeValue": "20000",
          "linkedAssetType": "0x000000000000000000000000000000000000000000000000000000000000000a",
          "tokenStandard": "v1",
          "transferType": "deposit",
          "eventType": "0x1::coin::DepositEvent",
          "transactionVersion": 3102207414,
          "blockHeight": 389609337,
          "blockTimestamp": 1753165865776,
          "transactionHash": "0x4a88f63c8ab07ccfdf9bc35a3a8a93a3fc4989f6a3692c4f58c26f08770b8046"
        },
        {
          "eventIndex": 2,
          "subEventIndex": 0,
          "accountAddress": "0x34ca84470e8d2907562f9a2f144c6c780282953b8b025ba220b0ecc5fc0aead9",
          "assetType": "0x1::aptos_coin::AptosCoin",
          "changeValue": "-1000",
          "linkedAssetType": "0x000000000000000000000000000000000000000000000000000000000000000a",
          "tokenStandard": "v1",
          "transferType": "gas_fee",
          "eventType": "0x1::transaction_fee::FeeStatement",
          "transactionVersion": 3102207414,
          "blockHeight": 389609337,
          "blockTimestamp": 1753165865776,
          "transactionHash": "0x4a88f63c8ab07ccfdf9bc35a3a8a93a3fc4989f6a3692c4f58c26f08770b8046"
        }
      ]
    }
  ],
  getTransactionByHash: {
    "transactionHash": "0xaf2fba4b6190c4b87d9479f3eb62c093f452f27c388dab4afeae98ae8ec00005",
    "transactionVersion": 3062155221,
    "blockHeight": 384675329,
    "blockTimestamp": 1752560496293,
    "sender": "0x49019bb2f30da7916a417e108f6c1fe5dc14a9b4c9d6582d65fad3c0c5373ab2",
    "success": true,
    "vmStatus": "Executed successfully",
    "gasUnitPrice": "100",
    "gasUsed": "10",
    "maxGasAmount": "2018",
    "sequenceNumber": 447152,
    "expirationTimestampSecs": 1752564095,
    "entryFunctionIdStr": "0x1::aptos_account::transfer",
    "entryFunctionContractAddress": "0x0000000000000000000000000000000000000000000000000000000000000001",
    "entryFunctionModuleName": "aptos_account",
    "entryFunctionName": "transfer",
    "payload": {
      "type": "entry_function_payload",
      "function": "0x1::aptos_account::transfer",
      "typeArguments": [],
      "arguments": [
        "0xaf21ac12caf6c3917b78166a6e0f762a0a4f8ef627c9b702bf6bb72eb93eb54",
        "70000"
      ]
    },
    "secondarySigners": [],
    "events": [
      {
        "eventIndex": 0,
        "accountAddress": "0x49019bb2f30da7916a417e108f6c1fe5dc14a9b4c9d6582d65fad3c0c5373ab2",
        "eventType": "0x1::coin::WithdrawEvent",
        "creationNumber": 3,
        "sequenceNumber": 447152,
        "data": {
          "amount": "70000"
        },
        "objectOwnerAddress": "0x49019bb2f30da7916a417e108f6c1fe5dc14a9b4c9d6582d65fad3c0c5373ab2",
        "objectAddress": null
      },
      {
        "eventIndex": 1,
        "accountAddress": "0x0af21ac12caf6c3917b78166a6e0f762a0a4f8ef627c9b702bf6bb72eb93eb54",
        "eventType": "0x1::coin::DepositEvent",
        "creationNumber": 2,
        "sequenceNumber": 21,
        "data": {
          "amount": "70000"
        },
        "objectOwnerAddress": "0x0af21ac12caf6c3917b78166a6e0f762a0a4f8ef627c9b702bf6bb72eb93eb54",
        "objectAddress": null
      },
      {
        "eventIndex": 2,
        "accountAddress": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "eventType": "0x1::transaction_fee::FeeStatement",
        "creationNumber": 0,
        "sequenceNumber": 0,
        "data": {
          "execution_gas_units": "5",
          "io_gas_units": "5",
          "storage_fee_octas": "0",
          "storage_fee_refund_octas": "0",
          "total_charge_gas_units": "10"
        },
        "objectOwnerAddress": null,
        "objectAddress": null
      }
    ],
    "balanceInAccounts": [
      "0x0af21ac12caf6c3917b78166a6e0f762a0a4f8ef627c9b702bf6bb72eb93eb54"
    ],
    "balanceOutAccounts": [
      "0x49019bb2f30da7916a417e108f6c1fe5dc14a9b4c9d6582d65fad3c0c5373ab2"
    ],
    "balanceChangedTokens": [
      "0x1::aptos_coin::AptosCoin"
    ],
    "balanceChanges": [
      {
        "eventIndex": 0,
        "subEventIndex": 0,
        "accountAddress": "0x49019bb2f30da7916a417e108f6c1fe5dc14a9b4c9d6582d65fad3c0c5373ab2",
        "assetType": "0x1::aptos_coin::AptosCoin",
        "changeValue": "-70000",
        "linkedAssetType": "0x000000000000000000000000000000000000000000000000000000000000000a",
        "tokenStandard": "v1",
        "transferType": "withdraw",
        "eventType": "0x1::coin::WithdrawEvent",
        "transactionVersion": 3062155221,
        "blockHeight": 384675329,
        "blockTimestamp": 1752560496293,
        "transactionHash": "0xaf2fba4b6190c4b87d9479f3eb62c093f452f27c388dab4afeae98ae8ec00005"
      },
      {
        "eventIndex": 1,
        "subEventIndex": 0,
        "accountAddress": "0x0af21ac12caf6c3917b78166a6e0f762a0a4f8ef627c9b702bf6bb72eb93eb54",
        "assetType": "0x1::aptos_coin::AptosCoin",
        "changeValue": "70000",
        "linkedAssetType": "0x000000000000000000000000000000000000000000000000000000000000000a",
        "tokenStandard": "v1",
        "transferType": "deposit",
        "eventType": "0x1::coin::DepositEvent",
        "transactionVersion": 3062155221,
        "blockHeight": 384675329,
        "blockTimestamp": 1752560496293,
        "transactionHash": "0xaf2fba4b6190c4b87d9479f3eb62c093f452f27c388dab4afeae98ae8ec00005"
      },
      {
        "eventIndex": 2,
        "subEventIndex": 0,
        "accountAddress": "0x49019bb2f30da7916a417e108f6c1fe5dc14a9b4c9d6582d65fad3c0c5373ab2",
        "assetType": "0x1::aptos_coin::AptosCoin",
        "changeValue": "-1000",
        "linkedAssetType": "0x000000000000000000000000000000000000000000000000000000000000000a",
        "tokenStandard": "v1",
        "transferType": "gas_fee",
        "eventType": "0x1::transaction_fee::FeeStatement",
        "transactionVersion": 3062155221,
        "blockHeight": 384675329,
        "blockTimestamp": 1752560496293,
        "transactionHash": "0xaf2fba4b6190c4b87d9479f3eb62c093f452f27c388dab4afeae98ae8ec00005"
      }
    ]
  },
  getTransactionsByVersions: [
    {
      "transactionHash": "0xaf2fba4b6190c4b87d9479f3eb62c093f452f27c388dab4afeae98ae8ec00005",
      "transactionVersion": 3062155221,
      "blockHeight": 384675329,
      "blockTimestamp": 1752560496293,
      "sender": "0x49019bb2f30da7916a417e108f6c1fe5dc14a9b4c9d6582d65fad3c0c5373ab2",
      "success": true,
      "vmStatus": "Executed successfully",
      "gasUnitPrice": "100",
      "gasUsed": "10",
      "maxGasAmount": "2018",
      "sequenceNumber": 447152,
      "expirationTimestampSecs": 1752564095,
      "entryFunctionIdStr": "0x1::aptos_account::transfer",
      "entryFunctionContractAddress": "0x0000000000000000000000000000000000000000000000000000000000000001",
      "entryFunctionModuleName": "aptos_account",
      "entryFunctionName": "transfer",
      "payload": {
        "type": "entry_function_payload",
        "function": "0x1::aptos_account::transfer",
        "typeArguments": [],
        "arguments": [
          "0xaf21ac12caf6c3917b78166a6e0f762a0a4f8ef627c9b702bf6bb72eb93eb54",
          "70000"
        ]
      },
      "secondarySigners": [],
      "events": [
        {
          "eventIndex": 0,
          "accountAddress": "0x49019bb2f30da7916a417e108f6c1fe5dc14a9b4c9d6582d65fad3c0c5373ab2",
          "eventType": "0x1::coin::WithdrawEvent",
          "creationNumber": 3,
          "sequenceNumber": 447152,
          "data": {
            "amount": "70000"
          },
          "objectOwnerAddress": "0x49019bb2f30da7916a417e108f6c1fe5dc14a9b4c9d6582d65fad3c0c5373ab2",
          "objectAddress": null
        },
        {
          "eventIndex": 1,
          "accountAddress": "0x0af21ac12caf6c3917b78166a6e0f762a0a4f8ef627c9b702bf6bb72eb93eb54",
          "eventType": "0x1::coin::DepositEvent",
          "creationNumber": 2,
          "sequenceNumber": 21,
          "data": {
            "amount": "70000"
          },
          "objectOwnerAddress": "0x0af21ac12caf6c3917b78166a6e0f762a0a4f8ef627c9b702bf6bb72eb93eb54",
          "objectAddress": null
        },
        {
          "eventIndex": 2,
          "accountAddress": "0x0000000000000000000000000000000000000000000000000000000000000000",
          "eventType": "0x1::transaction_fee::FeeStatement",
          "creationNumber": 0,
          "sequenceNumber": 0,
          "data": {
            "execution_gas_units": "5",
            "io_gas_units": "5",
            "storage_fee_octas": "0",
            "storage_fee_refund_octas": "0",
            "total_charge_gas_units": "10"
          },
          "objectOwnerAddress": null,
          "objectAddress": null
        }
      ],
      "balanceInAccounts": [
        "0x0af21ac12caf6c3917b78166a6e0f762a0a4f8ef627c9b702bf6bb72eb93eb54"
      ],
      "balanceOutAccounts": [
        "0x49019bb2f30da7916a417e108f6c1fe5dc14a9b4c9d6582d65fad3c0c5373ab2"
      ],
      "balanceChangedTokens": [
        "0x1::aptos_coin::AptosCoin"
      ],
      "balanceChanges": [
        {
          "eventIndex": 0,
          "subEventIndex": 0,
          "accountAddress": "0x49019bb2f30da7916a417e108f6c1fe5dc14a9b4c9d6582d65fad3c0c5373ab2",
          "assetType": "0x1::aptos_coin::AptosCoin",
          "changeValue": "-70000",
          "linkedAssetType": "0x000000000000000000000000000000000000000000000000000000000000000a",
          "tokenStandard": "v1",
          "transferType": "withdraw",
          "eventType": "0x1::coin::WithdrawEvent",
          "transactionVersion": 3062155221,
          "blockHeight": 384675329,
          "blockTimestamp": 1752560496293,
          "transactionHash": "0xaf2fba4b6190c4b87d9479f3eb62c093f452f27c388dab4afeae98ae8ec00005"
        },
        {
          "eventIndex": 1,
          "subEventIndex": 0,
          "accountAddress": "0x0af21ac12caf6c3917b78166a6e0f762a0a4f8ef627c9b702bf6bb72eb93eb54",
          "assetType": "0x1::aptos_coin::AptosCoin",
          "changeValue": "70000",
          "linkedAssetType": "0x000000000000000000000000000000000000000000000000000000000000000a",
          "tokenStandard": "v1",
          "transferType": "deposit",
          "eventType": "0x1::coin::DepositEvent",
          "transactionVersion": 3062155221,
          "blockHeight": 384675329,
          "blockTimestamp": 1752560496293,
          "transactionHash": "0xaf2fba4b6190c4b87d9479f3eb62c093f452f27c388dab4afeae98ae8ec00005"
        },
        {
          "eventIndex": 2,
          "subEventIndex": 0,
          "accountAddress": "0x49019bb2f30da7916a417e108f6c1fe5dc14a9b4c9d6582d65fad3c0c5373ab2",
          "assetType": "0x1::aptos_coin::AptosCoin",
          "changeValue": "-1000",
          "linkedAssetType": "0x000000000000000000000000000000000000000000000000000000000000000a",
          "tokenStandard": "v1",
          "transferType": "gas_fee",
          "eventType": "0x1::transaction_fee::FeeStatement",
          "transactionVersion": 3062155221,
          "blockHeight": 384675329,
          "blockTimestamp": 1752560496293,
          "transactionHash": "0xaf2fba4b6190c4b87d9479f3eb62c093f452f27c388dab4afeae98ae8ec00005"
        }
      ]
    },
    {
      "transactionHash": "0x4a88f63c8ab07ccfdf9bc35a3a8a93a3fc4989f6a3692c4f58c26f08770b8046",
      "transactionVersion": 3102207414,
      "blockHeight": 389609337,
      "blockTimestamp": 1753165865776,
      "sender": "0x210f8db0f9201e0cec952a8794cacc34d983db7bd93848eb898e6b2fdb47a7d0",
      "success": true,
      "vmStatus": "Executed successfully",
      "gasUnitPrice": "100",
      "gasUsed": "10",
      "maxGasAmount": "2018",
      "sequenceNumber": 3,
      "expirationTimestampSecs": 1753169464,
      "entryFunctionIdStr": "0x1::aptos_account::transfer",
      "entryFunctionContractAddress": "0x0000000000000000000000000000000000000000000000000000000000000001",
      "entryFunctionModuleName": "aptos_account",
      "entryFunctionName": "transfer",
      "payload": {
        "type": "entry_function_payload",
        "function": "0x1::aptos_account::transfer",
        "typeArguments": [],
        "arguments": [
          "0x34ca84470e8d2907562f9a2f144c6c780282953b8b025ba220b0ecc5fc0aead9",
          "20000"
        ]
      },
      "feePayer": "0x34ca84470e8d2907562f9a2f144c6c780282953b8b025ba220b0ecc5fc0aead9",
      "secondarySigners": [],
      "events": [
        {
          "eventIndex": 0,
          "accountAddress": "0x210f8db0f9201e0cec952a8794cacc34d983db7bd93848eb898e6b2fdb47a7d0",
          "eventType": "0x1::coin::WithdrawEvent",
          "creationNumber": 3,
          "sequenceNumber": 3,
          "data": {
            "amount": "20000"
          },
          "objectOwnerAddress": "0x210f8db0f9201e0cec952a8794cacc34d983db7bd93848eb898e6b2fdb47a7d0",
          "objectAddress": null
        },
        {
          "eventIndex": 1,
          "accountAddress": "0x34ca84470e8d2907562f9a2f144c6c780282953b8b025ba220b0ecc5fc0aead9",
          "eventType": "0x1::coin::DepositEvent",
          "creationNumber": 2,
          "sequenceNumber": 51780811,
          "data": {
            "amount": "20000"
          },
          "objectOwnerAddress": "0x34ca84470e8d2907562f9a2f144c6c780282953b8b025ba220b0ecc5fc0aead9",
          "objectAddress": null
        },
        {
          "eventIndex": 2,
          "accountAddress": "0x0000000000000000000000000000000000000000000000000000000000000000",
          "eventType": "0x1::transaction_fee::FeeStatement",
          "creationNumber": 0,
          "sequenceNumber": 0,
          "data": {
            "storage_fee_octas": "0",
            "storage_fee_refund_octas": "0",
            "total_charge_gas_units": "10",
            "execution_gas_units": "5",
            "io_gas_units": "5"
          },
          "objectOwnerAddress": null,
          "objectAddress": null
        }
      ],
      "balanceInAccounts": [
        "0x34ca84470e8d2907562f9a2f144c6c780282953b8b025ba220b0ecc5fc0aead9"
      ],
      "balanceOutAccounts": [
        "0x210f8db0f9201e0cec952a8794cacc34d983db7bd93848eb898e6b2fdb47a7d0",
        "0x34ca84470e8d2907562f9a2f144c6c780282953b8b025ba220b0ecc5fc0aead9"
      ],
      "balanceChangedTokens": [
        "0x1::aptos_coin::AptosCoin"
      ],
      "balanceChanges": [
        {
          "eventIndex": 0,
          "subEventIndex": 0,
          "accountAddress": "0x210f8db0f9201e0cec952a8794cacc34d983db7bd93848eb898e6b2fdb47a7d0",
          "assetType": "0x1::aptos_coin::AptosCoin",
          "changeValue": "-20000",
          "linkedAssetType": "0x000000000000000000000000000000000000000000000000000000000000000a",
          "tokenStandard": "v1",
          "transferType": "withdraw",
          "eventType": "0x1::coin::WithdrawEvent",
          "transactionVersion": 3102207414,
          "blockHeight": 389609337,
          "blockTimestamp": 1753165865776,
          "transactionHash": "0x4a88f63c8ab07ccfdf9bc35a3a8a93a3fc4989f6a3692c4f58c26f08770b8046"
        },
        {
          "eventIndex": 1,
          "subEventIndex": 0,
          "accountAddress": "0x34ca84470e8d2907562f9a2f144c6c780282953b8b025ba220b0ecc5fc0aead9",
          "assetType": "0x1::aptos_coin::AptosCoin",
          "changeValue": "20000",
          "linkedAssetType": "0x000000000000000000000000000000000000000000000000000000000000000a",
          "tokenStandard": "v1",
          "transferType": "deposit",
          "eventType": "0x1::coin::DepositEvent",
          "transactionVersion": 3102207414,
          "blockHeight": 389609337,
          "blockTimestamp": 1753165865776,
          "transactionHash": "0x4a88f63c8ab07ccfdf9bc35a3a8a93a3fc4989f6a3692c4f58c26f08770b8046"
        },
        {
          "eventIndex": 2,
          "subEventIndex": 0,
          "accountAddress": "0x34ca84470e8d2907562f9a2f144c6c780282953b8b025ba220b0ecc5fc0aead9",
          "assetType": "0x1::aptos_coin::AptosCoin",
          "changeValue": "-1000",
          "linkedAssetType": "0x000000000000000000000000000000000000000000000000000000000000000a",
          "tokenStandard": "v1",
          "transferType": "gas_fee",
          "eventType": "0x1::transaction_fee::FeeStatement",
          "transactionVersion": 3102207414,
          "blockHeight": 389609337,
          "blockTimestamp": 1753165865776,
          "transactionHash": "0x4a88f63c8ab07ccfdf9bc35a3a8a93a3fc4989f6a3692c4f58c26f08770b8046"
        }
      ]
    }
  ],
  getTransactionByVersion: {
    "transactionHash": "0xaf2fba4b6190c4b87d9479f3eb62c093f452f27c388dab4afeae98ae8ec00005",
    "transactionVersion": 3062155221,
    "blockHeight": 384675329,
    "blockTimestamp": 1752560496293,
    "sender": "0x49019bb2f30da7916a417e108f6c1fe5dc14a9b4c9d6582d65fad3c0c5373ab2",
    "success": true,
    "vmStatus": "Executed successfully",
    "gasUnitPrice": "100",
    "gasUsed": "10",
    "maxGasAmount": "2018",
    "sequenceNumber": 447152,
    "expirationTimestampSecs": 1752564095,
    "entryFunctionIdStr": "0x1::aptos_account::transfer",
    "entryFunctionContractAddress": "0x0000000000000000000000000000000000000000000000000000000000000001",
    "entryFunctionModuleName": "aptos_account",
    "entryFunctionName": "transfer",
    "payload": {
      "type": "entry_function_payload",
      "function": "0x1::aptos_account::transfer",
      "typeArguments": [],
      "arguments": [
        "0xaf21ac12caf6c3917b78166a6e0f762a0a4f8ef627c9b702bf6bb72eb93eb54",
        "70000"
      ]
    },
    "secondarySigners": [],
    "events": [
      {
        "eventIndex": 0,
        "accountAddress": "0x49019bb2f30da7916a417e108f6c1fe5dc14a9b4c9d6582d65fad3c0c5373ab2",
        "eventType": "0x1::coin::WithdrawEvent",
        "creationNumber": 3,
        "sequenceNumber": 447152,
        "data": {
          "amount": "70000"
        },
        "objectOwnerAddress": "0x49019bb2f30da7916a417e108f6c1fe5dc14a9b4c9d6582d65fad3c0c5373ab2",
        "objectAddress": null
      },
      {
        "eventIndex": 1,
        "accountAddress": "0x0af21ac12caf6c3917b78166a6e0f762a0a4f8ef627c9b702bf6bb72eb93eb54",
        "eventType": "0x1::coin::DepositEvent",
        "creationNumber": 2,
        "sequenceNumber": 21,
        "data": {
          "amount": "70000"
        },
        "objectOwnerAddress": "0x0af21ac12caf6c3917b78166a6e0f762a0a4f8ef627c9b702bf6bb72eb93eb54",
        "objectAddress": null
      },
      {
        "eventIndex": 2,
        "accountAddress": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "eventType": "0x1::transaction_fee::FeeStatement",
        "creationNumber": 0,
        "sequenceNumber": 0,
        "data": {
          "execution_gas_units": "5",
          "io_gas_units": "5",
          "storage_fee_octas": "0",
          "storage_fee_refund_octas": "0",
          "total_charge_gas_units": "10"
        },
        "objectOwnerAddress": null,
        "objectAddress": null
      }
    ],
    "balanceInAccounts": [
      "0x0af21ac12caf6c3917b78166a6e0f762a0a4f8ef627c9b702bf6bb72eb93eb54"
    ],
    "balanceOutAccounts": [
      "0x49019bb2f30da7916a417e108f6c1fe5dc14a9b4c9d6582d65fad3c0c5373ab2"
    ],
    "balanceChangedTokens": [
      "0x1::aptos_coin::AptosCoin"
    ],
    "balanceChanges": [
      {
        "eventIndex": 0,
        "subEventIndex": 0,
        "accountAddress": "0x49019bb2f30da7916a417e108f6c1fe5dc14a9b4c9d6582d65fad3c0c5373ab2",
        "assetType": "0x1::aptos_coin::AptosCoin",
        "changeValue": "-70000",
        "linkedAssetType": "0x000000000000000000000000000000000000000000000000000000000000000a",
        "tokenStandard": "v1",
        "transferType": "withdraw",
        "eventType": "0x1::coin::WithdrawEvent",
        "transactionVersion": 3062155221,
        "blockHeight": 384675329,
        "blockTimestamp": 1752560496293,
        "transactionHash": "0xaf2fba4b6190c4b87d9479f3eb62c093f452f27c388dab4afeae98ae8ec00005"
      },
      {
        "eventIndex": 1,
        "subEventIndex": 0,
        "accountAddress": "0x0af21ac12caf6c3917b78166a6e0f762a0a4f8ef627c9b702bf6bb72eb93eb54",
        "assetType": "0x1::aptos_coin::AptosCoin",
        "changeValue": "70000",
        "linkedAssetType": "0x000000000000000000000000000000000000000000000000000000000000000a",
        "tokenStandard": "v1",
        "transferType": "deposit",
        "eventType": "0x1::coin::DepositEvent",
        "transactionVersion": 3062155221,
        "blockHeight": 384675329,
        "blockTimestamp": 1752560496293,
        "transactionHash": "0xaf2fba4b6190c4b87d9479f3eb62c093f452f27c388dab4afeae98ae8ec00005"
      },
      {
        "eventIndex": 2,
        "subEventIndex": 0,
        "accountAddress": "0x49019bb2f30da7916a417e108f6c1fe5dc14a9b4c9d6582d65fad3c0c5373ab2",
        "assetType": "0x1::aptos_coin::AptosCoin",
        "changeValue": "-1000",
        "linkedAssetType": "0x000000000000000000000000000000000000000000000000000000000000000a",
        "tokenStandard": "v1",
        "transferType": "gas_fee",
        "eventType": "0x1::transaction_fee::FeeStatement",
        "transactionVersion": 3062155221,
        "blockHeight": 384675329,
        "blockTimestamp": 1752560496293,
        "transactionHash": "0xaf2fba4b6190c4b87d9479f3eb62c093f452f27c388dab4afeae98ae8ec00005"
      }
    ]
  },
  getTokenBalanceChangesByAccount: {
    rpp: 2,
    page: 1,
    count: 932144,
    items: [
      {
        eventIndex: 2,
        subEventIndex: 0,
        accountAddress:
          "0x49019bb2f30da7916a417e108f6c1fe5dc14a9b4c9d6582d65fad3c0c5373ab2",
        assetType: "0x1::aptos_coin::AptosCoin",
        changeValue: "-1300",
        linkedAssetType:
          "0x000000000000000000000000000000000000000000000000000000000000000a",
        tokenStandard: "v1",
        transferType: "gas_fee",
        eventType: "0x1::transaction_fee::FeeStatement",
        transactionVersion: 3102674923,
        blockHeight: 389659187,
        blockTimestamp: 1753172049206,
        transactionHash:
          "0x9f3aa0cecf4141944e4c39abf65d596b831bf31e61ce858e820e1a7d8bff597c",
      },
      {
        eventIndex: 0,
        subEventIndex: 0,
        accountAddress:
          "0x49019bb2f30da7916a417e108f6c1fe5dc14a9b4c9d6582d65fad3c0c5373ab2",
        assetType: "0x1::aptos_coin::AptosCoin",
        changeValue: "-80000",
        linkedAssetType:
          "0x000000000000000000000000000000000000000000000000000000000000000a",
        tokenStandard: "v1",
        transferType: "withdraw",
        eventType: "0x1::coin::WithdrawEvent",
        transactionVersion: 3102674923,
        blockHeight: 389659187,
        blockTimestamp: 1753172049206,
        transactionHash:
          "0x9f3aa0cecf4141944e4c39abf65d596b831bf31e61ce858e820e1a7d8bff597c",
      },
    ],
  },
  getTokenBalanceChangesByAssetType: {
    rpp: 2,
    page: 1,
    count: 3145474938,
    items: [
      {
        eventIndex: 0,
        subEventIndex: 0,
        accountAddress:
          "0x31deb490728ae8e1a89675ee4c1877af8e5849c526d2c9a64238c49d8ece08a0",
        assetType: "0x1::aptos_coin::AptosCoin",
        changeValue: "-19482",
        linkedAssetType:
          "0x000000000000000000000000000000000000000000000000000000000000000a",
        tokenStandard: "v1",
        transferType: "gas_fee",
        eventType: "0x1::transaction_fee::FeeStatement",
        transactionVersion: 3102713187,
        blockHeight: 389662497,
        blockTimestamp: 1753172463548,
        transactionHash:
          "0x3ed0f74bca2c44567c746bac39045aa8c9b52d23f88e88a61b26a47f0d697d2c",
      },
      {
        eventIndex: 0,
        subEventIndex: 0,
        accountAddress:
          "0x31deb490728ae8e1a89675ee4c1877af8e5849c526d2c9a64238c49d8ece08a0",
        assetType: "0x1::aptos_coin::AptosCoin",
        changeValue: "-17952",
        linkedAssetType:
          "0x000000000000000000000000000000000000000000000000000000000000000a",
        tokenStandard: "v1",
        transferType: "gas_fee",
        eventType: "0x1::transaction_fee::FeeStatement",
        transactionVersion: 3102713186,
        blockHeight: 389662497,
        blockTimestamp: 1753172463548,
        transactionHash:
          "0xab24ee038fa7e6ea6f37d6f4c8a062720de23d6424d5a7264d31ffa8c9e20714",
      },
    ],
  },
  getTokenBalanceChangesWithinRange: {
    rpp: 2,
    page: 1,
    count: 5212591288,
    items: [
      {
        eventIndex: 12,
        subEventIndex: 0,
        accountAddress:
          "0x0847702922d69e8c93b2b48d6fbbcb5a5250b99d44844d878cad997007f3aa70",
        assetType: "0x1::aptos_coin::AptosCoin",
        changeValue: "-5200",
        linkedAssetType:
          "0x000000000000000000000000000000000000000000000000000000000000000a",
        tokenStandard: "v1",
        transferType: "gas_fee",
        eventType: "0x1::transaction_fee::FeeStatement",
        transactionVersion: 3102744848,
        blockHeight: 389665638,
        blockTimestamp: 1753172853685,
        transactionHash:
          "0x1a17e2bdae29909770ff4b68e8f431ef40c5764011ff75149e4fa8a614011a28",
      },
      {
        eventIndex: 8,
        subEventIndex: 0,
        accountAddress:
          "0x0847702922d69e8c93b2b48d6fbbcb5a5250b99d44844d878cad997007f3aa70",
        assetType:
          "0xbae207659db88bea0cbead6da0ed00aac12edcdda169e591cd41c94180b46f3b",
        changeValue: "-197",
        linkedAssetType:
          "0xbae207659db88bea0cbead6da0ed00aac12edcdda169e591cd41c94180b46f3b",
        tokenStandard: "v2",
        transferType: "withdraw",
        eventType: "0x1::fungible_asset::Withdraw",
        transactionVersion: 3102744848,
        blockHeight: 389665638,
        blockTimestamp: 1753172853685,
        transactionHash:
          "0x1a17e2bdae29909770ff4b68e8f431ef40c5764011ff75149e4fa8a614011a28",
      },
    ],
  },
  getTokensOwnedByAccount: {
    rpp: 10,
    page: 1,
    count: 2,
    items: [
      {
        ownerAddress:
          "0x49019bb2f30da7916a417e108f6c1fe5dc14a9b4c9d6582d65fad3c0c5373ab2",
        objectAddress:
          "0x49019bb2f30da7916a417e108f6c1fe5dc14a9b4c9d6582d65fad3c0c5373ab2",
        value: "39000000000",
        isFrozen: false,
        isPrimary: true,
        assetType:
          "0x50788befc1107c0cc4473848a92e5c783c635866ce3c98de71d2eeb7d2a34f85::aptos_coin::AptosCoin",
        tokenStandard: "v1",
        linkedAssetType:
          "0xa4cfc96b4fbf4b71279a78543367a0e6600a1de5290832cc694c331b011af275",
        metadata: {
          assetType:
            "0x50788befc1107c0cc4473848a92e5c783c635866ce3c98de71d2eeb7d2a34f85::aptos_coin::AptosCoin",
          tokenStandard: "v1",
          name: "Aptos Coin",
          symbol: "APT",
          decimals: 8,
          totalSupply: null,
          maximumSupply: null,
          creatorAddress:
            "0x50788befc1107c0cc4473848a92e5c783c635866ce3c98de71d2eeb7d2a34f85",
          projectURI: "",
          iconURI: "",
        },
      },
      {
        ownerAddress:
          "0x49019bb2f30da7916a417e108f6c1fe5dc14a9b4c9d6582d65fad3c0c5373ab2",
        objectAddress:
          "0x49019bb2f30da7916a417e108f6c1fe5dc14a9b4c9d6582d65fad3c0c5373ab2",
        value: "431319400",
        isFrozen: false,
        isPrimary: true,
        assetType: "0x1::aptos_coin::AptosCoin",
        tokenStandard: "v1",
        linkedAssetType:
          "0x000000000000000000000000000000000000000000000000000000000000000a",
        metadata: {
          assetType: "0x1::aptos_coin::AptosCoin",
          tokenStandard: "v1",
          name: "Aptos Coin",
          symbol: "APT",
          decimals: 8,
          totalSupply: "",
          maximumSupply: null,
          creatorAddress:
            "0x0000000000000000000000000000000000000000000000000000000000000001",
          projectURI: "",
          iconURI: "",
        },
      },
    ],
  },
  getTokenAccountsByAssetType: {
    rpp: 10,
    page: 1,
    count: 47678558,
    items: [
      {
        ownerAddress:
          "0xed8c46bec9dbc2b23c60568f822b95b87ea395f7e3fdb5e3adc0a30c55c0a60e",
        objectAddress:
          "0xed8c46bec9dbc2b23c60568f822b95b87ea395f7e3fdb5e3adc0a30c55c0a60e",
        value: "4130687141100604",
        isFrozen: false,
        isPrimary: true,
        assetType: "0x1::aptos_coin::AptosCoin",
        tokenStandard: "v1",
        linkedAssetType:
          "0x000000000000000000000000000000000000000000000000000000000000000a",
        metadata: null,
      },
      {
        ownerAddress:
          "0xcc03e04e08c028a4848ce270b8d8077ad9ec14f8586727b9ed7792039f1b207e",
        objectAddress:
          "0xcc03e04e08c028a4848ce270b8d8077ad9ec14f8586727b9ed7792039f1b207e",
        value: "1687357444789796",
        isFrozen: false,
        isPrimary: true,
        assetType: "0x1::aptos_coin::AptosCoin",
        tokenStandard: "v1",
        linkedAssetType:
          "0x000000000000000000000000000000000000000000000000000000000000000a",
        metadata: null,
      },
      {
        ownerAddress:
          "0x84b1675891d370d5de8f169031f9c3116d7add256ecf50a4bc71e3135ddba6e0",
        objectAddress:
          "0x84b1675891d370d5de8f169031f9c3116d7add256ecf50a4bc71e3135ddba6e0",
        value: "1011151272736049",
        isFrozen: false,
        isPrimary: true,
        assetType: "0x1::aptos_coin::AptosCoin",
        tokenStandard: "v1",
        linkedAssetType:
          "0x000000000000000000000000000000000000000000000000000000000000000a",
        metadata: null,
      },
      {
        ownerAddress:
          "0x10dbe04766a3809c911e865a88a87ff42956ba1edcd5798c861543548be4bad5",
        objectAddress:
          "0x10dbe04766a3809c911e865a88a87ff42956ba1edcd5798c861543548be4bad5",
        value: "1007342486517827",
        isFrozen: false,
        isPrimary: true,
        assetType: "0x1::aptos_coin::AptosCoin",
        tokenStandard: "v1",
        linkedAssetType:
          "0x000000000000000000000000000000000000000000000000000000000000000a",
        metadata: null,
      },
      {
        ownerAddress:
          "0x23a2c6f1b3e14bcc90f6484eeeca318e23790879242b06c81ba33cb3ed84580c",
        objectAddress:
          "0x23a2c6f1b3e14bcc90f6484eeeca318e23790879242b06c81ba33cb3ed84580c",
        value: "1007342374474424",
        isFrozen: false,
        isPrimary: true,
        assetType: "0x1::aptos_coin::AptosCoin",
        tokenStandard: "v1",
        linkedAssetType:
          "0x000000000000000000000000000000000000000000000000000000000000000a",
        metadata: null,
      },
      {
        ownerAddress:
          "0x6dd484cf0a72f61d2cb7cd0530633f8e1fe05dcb69b4c29dd0257d3d2639377d",
        objectAddress:
          "0x6dd484cf0a72f61d2cb7cd0530633f8e1fe05dcb69b4c29dd0257d3d2639377d",
        value: "612523016591784",
        isFrozen: false,
        isPrimary: true,
        assetType: "0x1::aptos_coin::AptosCoin",
        tokenStandard: "v1",
        linkedAssetType:
          "0x000000000000000000000000000000000000000000000000000000000000000a",
        metadata: null,
      },
      {
        ownerAddress:
          "0x51c6abe562e755582d268340b2cf0e2d8895a155dc9b7a7fb5465000d62d770b",
        objectAddress:
          "0x0b17800fdd21fa68351b3793bad638b0764b1e72c01cb5af4af0ecfe3a787b57",
        value: "449621994572460",
        isFrozen: false,
        isPrimary: false,
        assetType:
          "0x000000000000000000000000000000000000000000000000000000000000000a",
        tokenStandard: "v2",
        linkedAssetType:
          "0x000000000000000000000000000000000000000000000000000000000000000a",
        metadata: null,
      },
      {
        ownerAddress:
          "0x1d5cd3452e5f78b1696fa0c64d7ea9eb620b7292ccd395922517da5e07106963",
        objectAddress:
          "0x1d5cd3452e5f78b1696fa0c64d7ea9eb620b7292ccd395922517da5e07106963",
        value: "448698985679083",
        isFrozen: false,
        isPrimary: true,
        assetType: "0x1::aptos_coin::AptosCoin",
        tokenStandard: "v1",
        linkedAssetType:
          "0x000000000000000000000000000000000000000000000000000000000000000a",
        metadata: null,
      },
      {
        ownerAddress:
          "0xdc7adffa09da5736ce1303f7441f4367fa423617c6822ad2fbc8522d9efd8fa4",
        objectAddress:
          "0xdc7adffa09da5736ce1303f7441f4367fa423617c6822ad2fbc8522d9efd8fa4",
        value: "425198055685366",
        isFrozen: false,
        isPrimary: true,
        assetType: "0x1::aptos_coin::AptosCoin",
        tokenStandard: "v1",
        linkedAssetType:
          "0x000000000000000000000000000000000000000000000000000000000000000a",
        metadata: null,
      },
      {
        ownerAddress:
          "0xb51d9c2f2ace16e07edda15cd94148bea87be07e73f7f922bd4d631c9f5c852d",
        objectAddress:
          "0xb51d9c2f2ace16e07edda15cd94148bea87be07e73f7f922bd4d631c9f5c852d",
        value: "381634131669799",
        isFrozen: false,
        isPrimary: true,
        assetType: "0x1::aptos_coin::AptosCoin",
        tokenStandard: "v1",
        linkedAssetType:
          "0x000000000000000000000000000000000000000000000000000000000000000a",
        metadata: null,
      },
    ],
  },
  getTokenMetadataByAssetTypes: [
    {
      assetType: "0x1::aptos_coin::AptosCoin",
      tokenStandard: "v1",
      name: "Aptos Coin",
      symbol: "APT",
      decimals: 8,
      totalSupply: "",
      maximumSupply: null,
      creatorAddress:
        "0x0000000000000000000000000000000000000000000000000000000000000001",
      projectURI: "",
      iconURI: "",
    },
    {
      assetType:
        "0x000000000000000000000000000000000000000000000000000000000000000a",
      tokenStandard: "v2",
      name: "Aptos Coin",
      symbol: "APT",
      decimals: 8,
      totalSupply: "1553556591615492",
      maximumSupply: "340282366920938463463374607431768211455",
      creatorAddress:
        "0x0000000000000000000000000000000000000000000000000000000000000001",
      projectURI: "",
      iconURI: "",
    },
  ],
  getTokenPairByAssetType: {
    coinAssetType: "0x1::aptos_coin::AptosCoin",
    fungibleAssetType:
      "0x000000000000000000000000000000000000000000000000000000000000000a",
    linkedAssetType:
      "0x000000000000000000000000000000000000000000000000000000000000000a",
  },
  getAccountStats: {
    transactionCounts: 466576,
    transferCounts: {
      tokens: 933102,
    },
    assets: {
      tokens: 2,
    },
  },
  getEventsByAccount: {
    page: 1,
    rpp: 2,
    count: 2930146,
    items: [
      {
        blockHeight: 599423645,
        blockTimestamp: 1770021277945,
        transactionHash:
          "0x70367bc8a7341996a41e578e1f38ad975ca23ee1d70abb688fc8d6f03b6ac7b8",
        transactionVersion: 4235651487,
        eventIndex: 6,
        accountAddress:
          "0x0000000000000000000000000000000000000000000000000000000000000000",
        eventType: "0x1::fungible_asset::Deposit",
        creationNumber: 0,
        sequenceNumber: 0,
        data: {
          amount: "300000",
          store:
            "0x6d5bfa430a2d689ab1698a51ef4f473d323704f536169fd9afdd20196d8eeb79",
        },
        objectOwnerAddress:
          "0x7a17ee0e26f1a8a09a5379d1daa0eb41b2b7c185b101d00f733f2dc5da43e59f",
        objectAddress:
          "0x6d5bfa430a2d689ab1698a51ef4f473d323704f536169fd9afdd20196d8eeb79",
      },
      {
        blockHeight: 599423540,
        blockTimestamp: 1770021271790,
        transactionHash:
          "0x4f255217d53741878a9c50566019184eaa96c875e72fb8372a0f7339c2b4dabb",
        transactionVersion: 4235651116,
        eventIndex: 4,
        accountAddress:
          "0x0000000000000000000000000000000000000000000000000000000000000000",
        eventType: "0x1::fungible_asset::Deposit",
        creationNumber: 0,
        sequenceNumber: 0,
        data: {
          amount: "772000000",
          store:
            "0x6d5bfa430a2d689ab1698a51ef4f473d323704f536169fd9afdd20196d8eeb79",
        },
        objectOwnerAddress:
          "0x7a17ee0e26f1a8a09a5379d1daa0eb41b2b7c185b101d00f733f2dc5da43e59f",
        objectAddress:
          "0x6d5bfa430a2d689ab1698a51ef4f473d323704f536169fd9afdd20196d8eeb79",
      },
    ],
  },
  getEventsByType: {
    page: 1,
    rpp: 2,
    count: 5114581,
    items: [
      {
        blockHeight: 550513856,
        blockTimestamp: 1767139195465,
        transactionHash:
          "0x84784546a8b0ae5fb9ee76734ac4b0ca28491d56112721bcc6bf4ff555dda00b",
        transactionVersion: 4022134250,
        eventIndex: 2,
        accountAddress:
          "0x7e783b349d3e89cf5931af376ebeadbfab855b3fa239b7ada8f5a92fbea6b387",
        eventType:
          "0x7e783b349d3e89cf5931af376ebeadbfab855b3fa239b7ada8f5a92fbea6b387::event::PriceFeedUpdate",
        creationNumber: 2,
        sequenceNumber: 611805882,
        data: {
          price_feed: {
            ema_price: {
              conf: "55118668",
              expo: {
                magnitude: "8",
                negative: true,
              },
              price: {
                magnitude: "52741874000",
                negative: false,
              },
              timestamp: "1767139192",
            },
            price: {
              conf: "50364324",
              expo: {
                magnitude: "8",
                negative: true,
              },
              price: {
                magnitude: "52916463193",
                negative: false,
              },
              timestamp: "1767139192",
            },
            price_identifier: {
              bytes:
                "0xbe9b59d178f0d6a97ab4c343bff2aa69caa1eaae3e9048a65788c529b125bb24",
            },
          },
          timestamp: "1767139195465631",
        },
        objectOwnerAddress: null,
        objectAddress: null,
      },
      {
        blockHeight: 550513800,
        blockTimestamp: 1767139192275,
        transactionHash:
          "0x28f023b963bc65e1582366faa4cda6d9f9eaa74a639ba2835e666063afa338eb",
        transactionVersion: 4022134063,
        eventIndex: 1,
        accountAddress:
          "0x7e783b349d3e89cf5931af376ebeadbfab855b3fa239b7ada8f5a92fbea6b387",
        eventType:
          "0x7e783b349d3e89cf5931af376ebeadbfab855b3fa239b7ada8f5a92fbea6b387::event::PriceFeedUpdate",
        creationNumber: 2,
        sequenceNumber: 611805881,
        data: {
          price_feed: {
            ema_price: {
              conf: "1",
              expo: {
                magnitude: "8",
                negative: true,
              },
              price: {
                magnitude: "106220287",
                negative: false,
              },
              timestamp: "1767139190",
            },
            price: {
              conf: "1",
              expo: {
                magnitude: "8",
                negative: true,
              },
              price: {
                magnitude: "106229000",
                negative: false,
              },
              timestamp: "1767139190",
            },
            price_identifier: {
              bytes:
                "0x12aa9a44a5f0695ccf5a9e3ded5c646b13b4013047182ca6db0aacfea8b252ef",
            },
          },
          timestamp: "1767139192275571",
        },
        objectOwnerAddress: null,
        objectAddress: null,
      },
    ],
  },
};

export default Examples;
