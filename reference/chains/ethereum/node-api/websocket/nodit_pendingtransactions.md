Use this subscription type to receive pending transactions in real time as they are submitted to the network but not yet included in a block. Unlike the standard `newPendingTransactions` subscription type, you can filter transactions by their `from` or `to` address and select the response format (hashes only or full transaction objects).

`nodit_pendingTransactions` is used by passing it as the subscription type in the `params` of the `eth_subscribe` method.

> info Usage Notes
> - You must use a `wss` endpoint when connecting. HTTPS is not supported.
> - Only pending transactions that enter the mempool of Nodit nodes are delivered.
> - If no address filter is specified, every pending transaction is delivered, which can consume a very large amount of CUs. Filter only the addresses you need, and set `hashesOnly` to `true` unless you require full transaction data.
> - Compute Unit (CU) consumption scales with the volume of subscribed data. See the [Compute Unit](/guides/compute-unit) documentation for details.
>

## 1. Request Parameters

All subscription requests share the following common parameters.

| Parameter | Type              | Required | Description                                                                                                                                                     |
| --------- | ----------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id        | integer or string | required | A unique identifier for each request. Used by the client to match requests with server responses.                                                               |
| jsonrpc   | string            | required | Specifies the JSON-RPC protocol version. Always use `"2.0"`.                                                                                                    |
| method    | string            | required | The name of the JSON-RPC method to invoke. Enter `"eth_subscribe"` here.                                                                                        |
| params    | array             | required | Provide the subscription type `"nodit_pendingTransactions"` as the first element and a filter options object as the second element. The filter object is optional. |

### Subscription Arguments

The table below describes the arguments by their position in the `params` array. `params` is a positional array, so enter only the values in order, without key names.

| Position | Type | Required | Description |
| --- | --- | --- | --- |
| `params[0]` | string | required | The event type to subscribe to. Enter `"nodit_pendingTransactions"` here. |
| `params[1]` | object | optional | Filtering options (`fromAddress`, `toAddress`, `hashesOnly`) for transactions. If omitted, every pending transaction is delivered. See the table below for the available fields. |

The fields of the `params[1]` filter option object are as follows.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `fromAddress` | string or array of strings | optional | Delivers only transactions originating from the specified address(es). Accepts a single address or an array of addresses. |
| `toAddress` | string or array of strings | optional | Delivers only transactions sent to the specified address(es). Accepts a single address or an array of addresses. |
| `hashesOnly` | boolean | optional | Specifies the response format. The default value is `false`, where the response is a full transaction object. If set to `true`, the payload contains only the hashes of the transactions that are added to the pending state, which matches the payload of `newPendingTransactions`. Prefer `true` unless you need full transaction objects immediately. |

- Transactions are delivered without omission only within the WebSocket Bandwidth specified in [Plans](/guides/plans).
- Excluding all parameters returns the transaction information for all transactions that are added to the pending state.
- If both `fromAddress` and `toAddress` are specified, transactions matching either condition are delivered (OR logic).

```json nodit_pendingTransactions example
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "eth_subscribe",
  "params": [
    "nodit_pendingTransactions",
    {
      "toAddress": ["0xdAC17F958D2ee523a2206206994597C13D831ec7"],
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

After that, the following response is delivered each time a pending transaction matching the filter arrives. Because the transaction has not yet been included in a block, the full transaction object does not contain `blockHash`, `blockNumber`, or `transactionIndex`.

```json hashesOnly: true
{
  "jsonrpc": "2.0",
  "method": "eth_subscription",
  "params": {
    "subscription": "0xf13f7073ddef66a8c1b0c9c9f0e543c3",
    "result": "0x10466101bd8979f3dcba18eb72155be87bdcd4962527d97c84ad93fc4ad5d461"
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
      "from": "0x194981ee45d9ead1f67e7b2299153f0cf06ed542",
      "gas": "0x1061f",
      "gasPrice": "0xb2d05e00",
      "hash": "0x10466101bd8979f3dcba18eb72155be87bdcd4962527d97c84ad93fc4ad5d461",
      "input": "0xa9059cbb00000000000000000000000046e0e692e8cf2aecb75cdece4be2e110a82069b000000000000000000000000000000000000000000000000009f593793582b31c",
      "nonce": "0x8",
      "to": "0xdac17f958d2ee523a2206206994597c13d831ec7",
      "value": "0x0",
      "v": "0x25",
      "r": "0xa0fbb1a0613b7e07b49b1e6585f75a0d92df71ee8482551a5d9dfbd82011a1eb",
      "s": "0x1271bfa29a4306b02d8d4c09dc467c540d5837110d8f43b3fd52bfed09351b59"
    }
  }
}
```

### Response Fields

With `hashesOnly: true`, `result` is the transaction hash (string) of the pending transaction, and `subscription` is the subscription ID (string).

With `hashesOnly: false`, `result` is a full transaction object consisting of the following fields.

| Field            | Type              | Description                                                                 |
| ---------------- | ----------------- | --------------------------------------------------------------------------- |
| from             | DATA, 20 Bytes    | Address of the sender.                                                      |
| gas              | QUANTITY          | Gas provided by the sender.                                                 |
| gasPrice         | QUANTITY          | Gas price provided by the sender in Wei.                                    |
| hash             | DATA, 32 Bytes    | Hash of the transaction.                                                    |
| input            | DATA              | The data sent along with the transaction.                                   |
| nonce            | QUANTITY          | The number of transactions made by the sender prior to this one.            |
| to               | DATA, 20 Bytes    | Address of the receiver. `null` when it is a contract creation transaction. |
| value            | QUANTITY          | Value transferred in Wei.                                                   |
| v                | QUANTITY          | ECDSA recovery id.                                                          |
| r                | DATA, 32 Bytes    | ECDSA signature r.                                                          |
| s                | DATA, 32 Bytes    | ECDSA signature s.                                                          |

## 3. Supported Networks

`nodit_pendingTransactions` is available only on the following networks. It is not supported on other chains or networks, including Ethereum Hoodi.

| Chain    | Network          |
| -------- | ---------------- |
| Ethereum | mainnet, sepolia |

## 4. How to use

This is a WebSocket-based API that you can subscribe to with a WebSocket client tool such as wscat. For the complete procedure of connecting to the channel, subscribing, receiving responses, and unsubscribing, see the How to use section of the [eth_subscribe](/chains/ethereum/rpc-api/eth_subscribe) documentation.

```sh wscat
# Set network and your api key in the URL to connect (e.g., wss://ethereum-mainnet.nodit.io/FwG...)
wscat -c wss://ethereum-{network}.nodit.io/{your_api_key}
```

Once connected, send the request example above to start the subscription. To cancel it, pass the subscription ID to `eth_unsubscribe`.
