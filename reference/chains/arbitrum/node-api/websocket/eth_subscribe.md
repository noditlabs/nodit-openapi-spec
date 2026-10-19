Use this API to create a subscription for specific events: `newHeads`, `logs`, or `newPendingTransactions`.

Nodit also provides additional subscription types, documented on the following separate pages.

- [nodit_minedTransactions](/chains/arbitrum/rpc-api/nodit_minedtransactions)

> info Usage Notes
> - You must use a `wss` endpoint when connecting. HTTPS is not supported.
> - If the WebSocket connection drops, subscriptions may be cancelled automatically. Re-subscribe after reconnecting.
> - Compute Unit (CU) consumption scales with the volume of subscribed data. Use appropriate filtering options to subscribe only to the data you need.
>

## 1. Request Parameters

All subscription requests share the following common parameters.

| Parameter | Type              | Required | Description                                                                                                                                                                              |
| --------- | ----------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id        | integer or string | required | A unique identifier for each request. Used by the client to match requests with server responses. Typically expressed as a number or string.                                             |
| jsonrpc   | string            | required | Specifies the JSON-RPC protocol version. The version used on this network is `"2.0"` — always use this value.                                                                            |
| method    | string            | required | The name of the JSON-RPC method to invoke. Enter `"eth_subscribe"` here.                                                                                                                 |
| params    | array             | required | Arguments required for execution, passed as an array. For `eth_subscribe`, provide one of the subscription types — `newHeads`, `logs`, or `newPendingTransactions` — along with any additional arguments required for that type. |

The arguments passed in `params` vary depending on the subscription type. The following sections describe the arguments for each type.

### Subscription Type

#### `newHeads`

Subscribing to this event streams the block header of each new block in real time as it is produced.
The table below describes the arguments by their position in the `params` array. `params` is a positional array, so enter only the values in order, without key names.

| Position | Type | Required | Description |
| --- | --- | --- | --- |
| `params[0]` | string | required | The event type to subscribe to. Enter `"newHeads"` here. |

```json newHeads example
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "eth_subscribe",
  "params": ["newHeads"]
}
```

#### `logs`

Subscribing to this event streams matching log data in real time whenever a relevant log is emitted. Use the `address` and `topics` fields to filter events associated with specific smart contract addresses — for example, ERC-20 or ERC-721 token transfer events. If you provide an empty filter object, all logs are returned. Specifying the necessary filter options is strongly recommended.
The table below describes the arguments by their position in the `params` array. `params` is a positional array, so enter only the values in order, without key names.

| Position | Type | Required | Description |
| --- | --- | --- | --- |
| `params[0]` | string | required | The event type to subscribe to. Enter `"logs"` here. |
| `params[1]` | object | required | Filtering options (`address`, `topics`) for log events. If an empty object is provided, all logs are returned. Specify the filtering options appropriate for your use case. See the table below for the available fields. |

The fields of the `params[1]` filter option object are as follows.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `address` | string | optional | Filters logs by a specific contract address. |
| `topics` | array | optional | Filters logs by topic. Provide topics as an array. |

```json logs example
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "eth_subscribe",
  "params": [
    "logs",
    {
      "address": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      "topics": [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
      ]
    }
  ]
}
```

#### `newPendingTransactions`

Subscribing to this event streams transaction data in real time whenever a new transaction is submitted to the network.
The table below describes the arguments by their position in the `params` array. `params` is a positional array, so enter only the values in order, without key names.

| Position | Type | Required | Description |
| --- | --- | --- | --- |
| `params[0]` | string | required | The event type to subscribe to. Enter `"newPendingTransactions"` here. |
| `params[1]` | boolean | optional | Specifies whether to include full transaction data. `true` returns the full transaction object; `false` returns only the transaction hash. Defaults to `false` if not specified. |

```json newPendingTransactions
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "eth_subscribe",
  "params": ["newPendingTransactions", true]
}
```

## 2. Response

Once a subscription is created with the parameters above, the following response is delivered each time an event occurs.

```json newHeads
{
  "jsonrpc": "2.0",
  "method": "eth_subscription",
  "params": {
    "subscription": "0x71bf7fd5f1d909400aefbd04c96474e8",
    "result": {
      "parentHash": "0xef887cc02d9dcc195319201e78a5bf136ed68df16e30c6fe08e21a7d123b3612",
      "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
      "miner": "0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5",
      "stateRoot": "0x401c9af726edb8cc0c96ccfe6fc8cd016fc2e1e4e1ebf90f52a9560d416e78b9",
      "transactionsRoot": "0x11747f43d21022eec362e8ca7b055b4e4417abb6ed12fbd2baae7817b407e614",
      "receiptsRoot": "0xa467e9c0ac6530a0f33c60bd0e799295811da732708cc338a00dcee9ab8794f0",
      "logsBloom": "0x11ad946a2ac00d44ed08ac72e8327009994f3884e471e1410269a2225ca342808053042d80484a9037426401842e07a44220a54a8a0263627091a48073363858040da08c00d80ca909a14189c24c90a481118db114e6188c983407c086e49204140b561783700160690dd010b148aff3a2290ca9a2026443b055609d30081238441a50080c10d1e8c0c56a5e92200300520909355558076c8f22246d6836516023c51862216430102e8075c0aac1133a005bc486f42230443d71406695aa4478a99281e2901e0a003160c2a5147bc8a04830ab0a421808740781538e50d6607a217aa015a10204b98a4c279842201124c1add048182c80c64002ac56d8a2540f",
      "difficulty": "0x0",
      "number": "0x13c5e89",
      "gasLimit": "0x1c9c380",
      "gasUsed": "0x8b58db",
      "timestamp": "0x66e2b143",
      "extraData": "0x6265617665726275696c642e6f7267",
      "mixHash": "0xd03523217638366b0bd1111d29108f0fc3789ab21e6a9e7afe4ab568f3b98a64",
      "nonce": "0x0000000000000000",
      "baseFeePerGas": "0x828e8440",
      "withdrawalsRoot": "0x5584306249ecc33fa9c0b1804b461ec16abcb305d646fcba128bca75e1700f4a",
      "blobGasUsed": "0x0",
      "excessBlobGas": "0xe0000",
      "parentBeaconBlockRoot": "0x9814d97d13152344553575788f0c6853c7d23f8c521201793257bb7c0c14fe59",
      "hash": "0x9f30ee57944013169c179c9c954aaf60a8bf785b166cc49f58dcc5ce28ecae96"
    }
  }
}
```

```json logs
{
  "jsonrpc": "2.0",
  "method": "eth_subscription",
  "params": {
    "subscription": "0x3b7f71db357fe4e9edd8f2e6ec6b24a6",
    "result": {
      "address": "0xdac17f958d2ee523a2206206994597c13d831ec7",
      "topics": [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x0000000000000000000000003ef97e73d4b8e06535e24aab125077d16462318b",
        "0x0000000000000000000000004af688bb824d12cff5c339abf3010ce7806afcd0"
      ],
      "data": "0x00000000000000000000000000000000000000000000000000000002540be400",
      "blockNumber": "0x13c5e92",
      "transactionHash": "0x283b803e4ed34b03674d04ed71b48d6879034ebfa564acccb8b7b48715d25e0d",
      "transactionIndex": "0x1",
      "blockHash": "0x492384316ea319b4f929306492746155d011f08a3b173e6e4eee9e82faeef207",
      "logIndex": "0x0",
      "removed": false
    }
  }
}
```

```json newPendingTransactions
{
  "jsonrpc": "2.0",
  "method": "eth_subscription",
  "params": {
    "subscription": "0x7f708f4295996c21dbf16e6fcdd8c9e3",
    "result": {
      "blockHash": null,
      "blockNumber": null,
      "from": "0x194981ee45d9ead1f67e7b2299153f0cf06ed542",
      "gas": "0x1061f",
      "gasPrice": "0xb2d05e00",
      "hash": "0x410d09342c540808a1a10eabebc6189b6786fad04c3ac88b7098243b0112d6e1",
      "input": "0xa9059cbb00000000000000000000000046e0e692e8cf2aecb75cdece4be2e110a82069b000000000000000000000000000000000000000000000000009f593793582b31c",
      "nonce": "0x8",
      "to": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      "transactionIndex": null,
      "value": "0x0",
      "type": "0x0",
      "chainId": "0x1",
      "v": "0x25",
      "r": "0xa0fbb1a0613b7e07b49b1e6585f75a0d92df71ee8482551a5d9dfbd82011a1eb",
      "s": "0x1271bfa29a4306b02d8d4c09dc467c540d5837110d8f43b3fd52bfed09351b59"
    }
  }
}
```

## 3. How to Use

This is a WebSocket-based API. You can subscribe to events using any tool that supports WebSocket communication. The examples in this guide use `wscat`, a WebSocket client that lets you easily connect to a WebSocket server and send or receive data.

### 3.1. Connect to WebSocket Channel

Open a terminal and run the command below. Specify the protocol and network you want to subscribe to, and provide the API key for the project you created in the console.

```sh wscat
# Set protocol, network and your api key in the URL to connect (e.g., wss://ethereum-mainnet.nodit.io/FwG...)
wscat -c wss://{protocol}-{network}.nodit.io/{your_api_key}
```

### 3.2. Subscribe to a Specific Event

Once the WebSocket connection is established, subscribe to the event you want using one of the examples below.

```json newHeads
{ "jsonrpc": "2.0", "id": 1, "method": "eth_subscribe", "params": ["newHeads"] }
```

```json logs
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "eth_subscribe",
  "params": [
    "logs",
    {
      "address": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      "topics": [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
      ]
    }
  ]
}
```

```json newPendingTransactions
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "eth_subscribe",
  "params": ["newPendingTransactions", true]
}
```

### 3.3. Listen to Subscription Events

The first response returns the subscription ID.

```json first response example
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0xb273410795d4411d707f272834cdd60e"
}
```

Subsequent responses are delivered each time an event occurs, returning results matching the subscription type.

```json event response example
{
  "jsonrpc": "2.0",
  "method": "eth_subscription",
  "params": {
    "subscription": "0xb273410795d4411d707f272834cdd60e",
    "result": {
        # ...
    }
  }
}
```

### 3.4. Unsubscribe

Press `CTRL+C` in the terminal to close the connection and cancel all subscriptions.
Alternatively, use `eth_unsubscribe` to cancel a subscription while keeping the connection open. Pass the subscription ID associated with the channel in `params` as shown in the example below.

```json unsubscribe example
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "eth_unsubscribe",
  "params": ["0x540e1706d67fd05fc8f3318dc7e86fc7"]
}
```

If the subscription is successfully cancelled, you receive the following response.

```json unsubscribe successful response example
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": true
}
```
