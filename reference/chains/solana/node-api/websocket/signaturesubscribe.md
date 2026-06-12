---
slug: /node-api/signaturesubscribe
---

# signatureSubscribe

The signatureSubscribe method in Solana creates a subscription to receive a notification when a specific transaction signature reaches the specified commitment level.

> 📘 Notes on Usage
>
> - Must be called via a **WebSocket** endpoint; HTTP is not supported.
> - This is a **single-notification subscription**. The subscription is automatically cancelled after the server sends the signatureNotification.
> - CU is consumed based on the amount of data subscribed. It is recommended to use appropriate filtering options to subscribe only to the data you need.

---

## 1. Request

### Parameters

The subscription request has the following parameters.

| Parameter                            | Type              | Required | Description                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------------------ | ----------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                                   | integer or string | required | A unique request identifier. Used by the client to match requests with responses.                                                                                                                                                                                                                                                                                     |
| jsonrpc                              | string            | required | JSON-RPC protocol version. Always enter "2.0".                                                                                                                                                                                                                                                                                                                        |
| method                               | string            | required | The method name to execute. Enter "signatureSubscribe" here.                                                                                                                                                                                                                                                                                                          |
| params                               | array             | required | Signature information and options to subscribe to. The first element is the transaction signature, and the second is a configuration object.                                                                                                                                                                                                                          |
| params[0]                            | string            | required | The transaction signature to subscribe to (base-58 encoded string). Must be the first signature of the transaction.                                                                                                                                                                                                                                                   |
| params[1].commitment                 | string            | optional | Specifies the level of block commitment. <br />- `finalized`: Queries the most recent block confirmed by a supermajority of the cluster reaching maximum lockout. The cluster recognizes this block as finalized. <br />- `confirmed`: Queries the most recent block voted on by a supermajority of the cluster. <br />- `processed`: Queries the most recent block of the node. This block may still be skipped by the cluster. |
| params[1].enableReceivedNotification | boolean           | optional | Specifies whether to also receive a notification when the signature is received by the RPC. When `true`, notifications are received both upon receipt and upon processing completion.                                                                                                                                                                                  |

### Example

```json signatureSubscribe example
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "signatureSubscribe",
  "params": [
    "2EBVM6cB8vAAD93Ktr6Vd8p67XPbQzCJX47MpReuiCXJAtcjaxpvWpcg9Ege1Nr5Tk3a2GFrByT7WPBjdsTycY9b",
    {
      "commitment": "finalized",
      "enableReceivedNotification": false
    }
  ]
}
```

---

## 2. Response

### Subscription Response

Upon successful subscription, a subscription ID is returned.

```json Response example
{
  "jsonrpc": "2.0",
  "result": 0,
  "id": 1
}
```

This subscription ID is required when calling the signatureUnsubscribe method.

### Notifications

When the subscription is active, the server pushes a notification when the transaction reaches the specified commitment level.

**Notification Format:**

| Field | Type             | Description                       |
| ----- | ---------------- | --------------------------------- |
| slot  | u64              | The slot number                   |
| value | object \| string | RpcSignatureResult notification value |

**value field details:**

- **Signature received notification** (when enableReceivedNotification is true and the signature is received):

  - Type: `string`
  - Value: `"receivedSignature"`
  - Description: Indicates that the signature has been received by the RPC

- **Transaction processing complete notification** (when the signature is processed):
  - Type: `object`
  - Value: `{ "err": null }` (success) or `{ "err": TransactionError }` (failure)
  - Description: The transaction has been processed at the specified commitment level

#### Examples

```json Successful Transaction Example
{
  "jsonrpc": "2.0",
  "method": "signatureNotification",
  "params": {
    "result": {
      "context": {
        "slot": 5207624
      },
      "value": {
        "err": null
      }
    },
    "subscription": 24006
  }
}
```

```json Received Signature Example
{
  "jsonrpc": "2.0",
  "method": "signatureNotification",
  "params": {
    "result": {
      "context": {
        "slot": 5207624
      },
      "value": "receivedSignature"
    },
    "subscription": 24006
  }
}
```

---

## 3. How to Use

### Connect to WebSocket Channel

```sh wscat
wscat -c wss://api.mainnet-beta.solana.com
```

### Subscribe to Signature

```json subscribe example
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "signatureSubscribe",
  "params": [
    "2EBVM6cB8vAAD93Ktr6Vd8p67XPbQzCJX47MpReuiCXJAtcjaxpvWpcg9Ege1Nr5Tk3a2GFrByT7WPBjdsTycY9b",
    {
      "commitment": "finalized",
      "enableReceivedNotification": false
    }
  ]
}
```

### Receive Notification

- Initial response: subscription ID returned
- Subsequently: when a matching transaction reaches the specified commitment level, the server automatically sends a notification, and the subscription is automatically cancelled after the notification is received (single-notification subscription)

### Unsubscribe

There are two ways to cancel a subscription:

1. **Close connection**: Press `CTRL+C` in the terminal window to close the WebSocket connection and all subscriptions will be automatically cancelled.

2. **Cancel specific subscription**: Use signatureUnsubscribe to cancel only a specific subscription while keeping the connection open.

Unsubscribe request:

```json unsubscribe example
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "signatureUnsubscribe",
  "params": [10]
}
```

Response after unsubscribing:

```json unsubscribe success
{
  "jsonrpc": "2.0",
  "result": true,
  "id": 2
}
```
