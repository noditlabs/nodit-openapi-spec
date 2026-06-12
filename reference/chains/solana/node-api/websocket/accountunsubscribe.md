---
slug: /node-api/accountunsubscribe
---

# accountUnsubscribe

The accountUnsubscribe method in Solana cancels a subscription created by accountSubscribe so that account change notifications are no longer received.

> 📘 Notes on Usage
>
> - Must be called via a **WebSocket** endpoint; HTTP is not supported.
> - After unsubscribing, you cannot re-subscribe using the same subscription ID. If a new subscription is needed, call accountSubscribe again.
> - When the WebSocket connection drops, the subscription is automatically cancelled, so you must re-subscribe upon reconnection.

---

## 1. Request

### Parameters

The unsubscribe request has the following parameters.

| Parameter | Type              | Required | Description                                                                       |
| --------- | ----------------- | -------- | --------------------------------------------------------------------------------- |
| id        | integer or string | required | A unique request identifier. Used by the client to match requests with responses. |
| jsonrpc   | string            | required | JSON-RPC protocol version. Always enter "2.0".                                    |
| method    | string            | required | The method name to execute. Enter "accountUnsubscribe" here.                      |
| params    | array             | required | An array containing the subscription ID of the subscription to cancel.            |

### Example

```json accountUnsubscribe example
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "accountUnsubscribe",
  "params": [23784]
}
```

---

## 2. Response

### Success Response

Upon successful unsubscription, true is returned.

```json Response example
{
  "jsonrpc": "2.0",
  "result": true,
  "id": 1
}
```

### Error Response

If unsubscription fails, an error is returned.

```json Error example
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32000,
    "message": "Invalid subscription ID"
  },
  "id": 1
}
```

---

## 3. How to Use

### Connect to WebSocket Channel

```sh wscat
wscat -c wss://api.mainnet-beta.solana.com
```

### Subscribe an Account (First)

```json subscribe example
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "accountSubscribe",
  "params": [
    "CM78CPUeXjn8o3yroDHxUtKsZZgoy4GPkPPXfouKNH12",
    { "encoding": "jsonParsed", "commitment": "finalized" }
  ]
}
```

### Receive Subscription ID

```json subscription response
{
  "jsonrpc": "2.0",
  "result": 23784,
  "id": 1
}
```

### Unsubscribe

There are two ways to cancel a subscription:

1. **Close connection**: Press `CTRL+C` in the terminal window to close the WebSocket connection and all subscriptions will be automatically cancelled.

2. **Cancel specific subscription**: Use accountUnsubscribe to cancel only a specific subscription while keeping the connection open.

```json unsubscribe example
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "accountUnsubscribe",
  "params": [23784]
}
```

### Confirm Unsubscribe

```json unsubscribe success
{
  "jsonrpc": "2.0",
  "result": true,
  "id": 2
}
```
