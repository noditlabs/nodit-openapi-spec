Use this API to cancel a specific subscription.

## 1. Request Parameters

| Parameter | Type              | Required | Description                                                                                                                                              |
| --------- | ----------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id        | integer or string | required | A unique identifier for each request. Used by the client to match requests with server responses. Typically expressed as a number or string.             |
| jsonrpc   | string            | required | Specifies the JSON-RPC protocol version. The version used on this network is `"2.0"` — always use this value.                                            |
| method    | string            | required | The name of the JSON-RPC method to invoke. Enter `"eth_unsubscribe"` here.                                                                               |
| params    | array             | required | Arguments required for execution, passed as an array. For `eth_unsubscribe`, provide the `subscription_id` as the argument.                              |

The arguments passed in `params` vary depending on the subscription type. The table below describes the arguments for each type.

| Argument        | Type   | Required | Description                                              |
| --------------- | ------ | -------- | -------------------------------------------------------- |
| subscription_id | string | required | The subscription ID of the subscription to cancel.       |

```json unsubscribe request parameter example
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "eth_unsubscribe",
  "params": ["0x52f404d003f4a461c8aa72f27062b4bc"]
}
```

## 2. Response

A successful response to the parameters above returns the following.

```json unsubscribe successful response example
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": true
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
