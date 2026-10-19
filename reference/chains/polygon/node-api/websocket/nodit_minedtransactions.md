Use this subscription type to receive mined transactions in real time as they are included in blocks. You can filter transactions by their `from` or `to` address, choose whether to include transactions removed by a re-organization, and select the response format (hashes only or full transaction objects).

`nodit_minedTransactions` is used by passing it as the subscription type in the `params` of the `eth_subscribe` method.

> info Usage Notes
> - You must use a `wss` endpoint when connecting. HTTPS is not supported.
> - Transactions are delivered once they are included in the latest block.
> - If no address filter is specified, every transaction on the chain is delivered, which can consume a very large amount of CUs. Filter only the addresses you need, and set `hashesOnly` to `true` unless you require full transaction data.
> - Compute Unit (CU) consumption scales with the volume of subscribed data. See the [Compute Unit](/guides/compute-unit) documentation for details.
>

## 1. Request Parameters

All subscription requests share the following common parameters.

| Parameter | Type              | Required | Description                                                                                                                                                   |
| --------- | ----------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id        | integer or string | required | A unique identifier for each request. Used by the client to match requests with server responses.                                                             |
| jsonrpc   | string            | required | Specifies the JSON-RPC protocol version. Always use `"2.0"`.                                                                                                  |
| method    | string            | required | The name of the JSON-RPC method to invoke. Enter `"eth_subscribe"` here.                                                                                      |
| params    | array             | required | Provide the subscription type `"nodit_minedTransactions"` as the first element and a filter options object as the second element. The filter object is optional. |

### Subscription Arguments

The table below describes the arguments by their position in the `params` array. `params` is a positional array, so enter only the values in order, without key names.

| Position | Type | Required | Description |
| --- | --- | --- | --- |
| `params[0]` | string | required | The event type to subscribe to. Enter `"nodit_minedTransactions"` here. |
| `params[1]` | object | optional | Filtering options (`addresses`, `includeRemoved`, `hashesOnly`) for transactions. If omitted, every transaction on the chain is delivered. See the table below for the available fields. |

The fields of the `params[1]` filter option object are as follows.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `addresses` | array of objects | optional | A list of addresses to filter mined transactions for, specified by `to` or `from` in the following format: `[{"to": "string", "from": "string"}]`. Transactions are delivered without omission only within the WebSocket Bandwidth specified in [Plans](/guides/plans). |
| `includeRemoved` | boolean | optional | Specifies whether to include transactions that have been removed from the canonical chain (re-orged). |
| `hashesOnly` | boolean | optional | Specifies the response format. The default value is `false`, where the response returns a full transaction object matching the payload of `eth_getTransactionByHash`. If set to `true`, the payload contains only the hashes of the transactions that are mined. Prefer `true` unless you need full transaction objects immediately. |

```json nodit_minedTransactions example
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "eth_subscribe",
  "params": [
    "nodit_minedTransactions",
    {
      "addresses": [
        { "to": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "from": "0x28C6c06298d514Db089934071355E5743bf21d60" },
        { "to": "0xdAC17F958D2ee523a2206206994597C13D831ec7" }
      ],
      "includeRemoved": false,
      "hashesOnly": true
    }
  ]
}
```

## 2. Response

When a subscription is created, the first response returns the subscription ID.

```json first response example
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0xf13f7073ddef66a8c1b0c9c9f0e543c3"
}
```

After that, the following response is delivered each time a transaction matching the filter is mined in the `latest` block. The `removed` field indicates whether the transaction was removed by a re-organization.

```json hashesOnly: true
{
  "jsonrpc": "2.0",
  "method": "eth_subscription",
  "params": {
    "subscription": "0xf13f7073ddef66a8c1b0c9c9f0e543c3",
    "result": {
      "removed": false,
      "hash": "0xa8f2cf69e302da6c8100b80298ed77c37b6e75eed1177ca22acd5772c9fb9876"
    }
  }
}
```

```json hashesOnly: false
{
  "jsonrpc": "2.0",
  "method": "eth_subscription",
  "params": {
    "subscription": "0xf13f7073ddef66a8c1b0c9c9f0e543c3",
    "result": {
      "removed": false,
      "transaction": {
        "blockHash": "0x492384316ea319b4f929306492746155d011f08a3b173e6e4eee9e82faeef207",
        "blockNumber": "0x13c5e92",
        "from": "0x28c6c06298d514db089934071355e5743bf21d60",
        "gas": "0x1061f",
        "gasPrice": "0xb2d05e00",
        "hash": "0xa8f2cf69e302da6c8100b80298ed77c37b6e75eed1177ca22acd5772c9fb9876",
        "input": "0xa9059cbb00000000000000000000000046e0e692e8cf2aecb75cdece4be2e110a82069b000000000000000000000000000000000000000000000000009f593793582b31c",
        "nonce": "0x8",
        "to": "0xdac17f958d2ee523a2206206994597c13d831ec7",
        "transactionIndex": "0x1",
        "value": "0x0",
        "v": "0x25",
        "r": "0xa0fbb1a0613b7e07b49b1e6585f75a0d92df71ee8482551a5d9dfbd82011a1eb",
        "s": "0x1271bfa29a4306b02d8d4c09dc467c540d5837110d8f43b3fd52bfed09351b59"
      }
    }
  }
}
```

### Response Fields

With `hashesOnly: true`, `result` consists of the following fields.

| Field        | Type    | Description                                                    |
| ------------ | ------- | -------------------------------------------------------------- |
| removed      | boolean | Specifies whether the transaction has been removed (re-orged). |
| hash         | string  | The hash of the mined transaction.                             |
| subscription | string  | The subscription ID.                                           |

With `hashesOnly: false`, `result.transaction` is a full transaction object matching the payload of `eth_getTransactionByHash`, consisting of the following fields.

| Field            | Type              | Description                                                                 |
| ---------------- | ----------------- | --------------------------------------------------------------------------- |
| blockHash        | DATA, 32 Bytes    | Hash of the block that the transaction was mined in.                        |
| blockNumber      | QUANTITY          | Block number of the block that the transaction was mined in. `null` when it is pending. |
| from             | DATA, 20 Bytes    | Address of the sender.                                                      |
| gas              | QUANTITY          | Gas provided by the sender.                                                 |
| gasPrice         | QUANTITY          | Gas price provided by the sender in Wei.                                    |
| hash             | DATA, 32 Bytes    | Hash of the transaction.                                                    |
| input            | DATA              | The data sent along with the transaction.                                   |
| nonce            | QUANTITY          | The number of transactions made by the sender prior to this one.            |
| to               | DATA, 20 Bytes    | Address of the receiver. `null` when it is a contract creation transaction. |
| transactionIndex | QUANTITY          | Index of the transaction in the block. `null` when it is pending.           |
| value            | QUANTITY          | Value transferred in Wei.                                                   |
| v                | QUANTITY          | ECDSA recovery id.                                                          |
| r                | DATA, 32 Bytes    | ECDSA signature r.                                                          |
| s                | DATA, 32 Bytes    | ECDSA signature s.                                                          |

## 3. Supported Networks

`nodit_minedTransactions` is available on the following chains and networks.

| Chain           | Network                 |
| --------------- | ----------------------- |
| Ethereum        | mainnet, sepolia, hoodi |
| Polygon         | mainnet                 |
| BNB Smart Chain | mainnet, testnet        |
| Kaia            | mainnet, kairos         |
| Avalanche       | mainnet                 |
| Arbitrum        | mainnet, sepolia        |
| Base            | mainnet, sepolia        |
| Optimism        | mainnet, sepolia        |
| Giwa            | sepolia                 |
| Arc             | mainnet, testnet        |

## 4. How to use

This is a WebSocket-based API that you can subscribe to with a WebSocket client tool such as wscat. For the complete procedure of connecting to the channel, subscribing, receiving responses, and unsubscribing, see the How to use section of the [eth_subscribe](/chains/polygon/rpc-api/eth_subscribe) documentation.

```sh wscat
# Set protocol, network and your api key in the URL to connect (e.g., wss://ethereum-mainnet.nodit.io/FwG...)
wscat -c wss://{protocol}-{network}.nodit.io/{your_api_key}
```

Once connected, send the request example above to start the subscription. To cancel it, pass the subscription ID to `eth_unsubscribe`.
