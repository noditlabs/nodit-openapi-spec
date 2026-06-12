---
id: eth_unsubscribe
title: eth_unsubscribe
sidebar_label: eth_unsubscribe
slug: /node-api/eth_unsubscribe
---

Use this API to cancel a specific subscription.

## 1.Request Parameters

| Parameter | Type              | Required | Description                                                                                                                                   |
| --------- | ----------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| id        | integer or string | required | A unique identifier for each request. Used by the client to match requests with server responses. Typically represented as a number or string. |
| jsonrpc   | string            | required | Indicates the version of the JSON-RPC protocol. The version used in this network is "2.0", so always use this value.                          |
| method    | string            | required | Specifies the name of the specific JSON-RPC method to execute. Enter "eth_unsubscribe" here.                                                  |
| params    | array             | required | Passes the arguments required for execution as an array. In "eth_unsubscribe", enter the subscription_id as the argument.                     |

The arguments passed depend on the subscription type provided in params. The following describes the arguments for each subscription type.

| Argument        | Type   | Required | Description                               |
| --------------- | ------ | -------- | ----------------------------------------- |
| subscription_id | string | required | Specifies the subscription ID to cancel.  |

```json unsubscribe request parameter example
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "eth_unsubscribe",
  "params": ["0x52f404d003f4a461c8aa72f27062b4bc"]
}
```

## 2. Response

When a successful response is received using the above parameters, the response is returned in the following format.

```json unsubscribe successful response example
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": true
}
```

## 3. How to use

This is a WebSocket-based API that can be subscribed to using a WebSocket communication tool.
The WebSocket client tool used in this example is wscat, which allows you to easily connect to a WebSocket server and send/receive data.

### 3.1. Connect to Websocket channel

Open a terminal window and enter the command below.
At this point, you must specify the protocol and network you want to subscribe to, and enter the API key for the project created in the console.

```sh wscat
# Set protocol, network and your api key in the URL to connect (e.g., wss://ethereum-mainnet.nodit.io/FwG...)
wscat -c wss://{protocol}-{network}.nodit.io/{your_api_key}
```

### 3.2. Subscribe a specific event

Once the WebSocket connection is established, subscribe to the desired event from the examples below.

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

### 3.3. Listen subscription

The first response returns the subscription ID.

```json first response example
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0xb273410795d4411d707f272834cdd60e"
}
```

From that point on, it returns results matching the subscription type whenever an event occurs.

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

Press `CTRL+C` in the terminal window to close the connection, which will cancel the subscription.
Alternatively, you can use eth_unsubscribe to cancel a subscription while keeping the connection open. As shown in the example below, enter the subscription ID connected to the channel in params and send it to cancel the subscription.

```json unsubscribe example
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "eth_unsubscribe",
  "params": ["0x540e1706d67fd05fc8f3318dc7e86fc7"]
}
```

If the subscription is successfully cancelled, you will receive the following response.

```json unsubscribe successful response example
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": true
}
```
