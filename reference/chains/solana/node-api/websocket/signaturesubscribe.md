# signatureSubscribe

The signatureSubscribe method creates a subscription that sends a notification when a specific transaction signature reaches the specified commitment level.

> 📘 Usage Notes
>
> - This method must be called via a **WebSocket** endpoint. HTTP is not supported.
> - This is a **one-time notification subscription**. The subscription is automatically cancelled after the server sends a `signatureNotification`.
> - CU is consumed based on the volume of subscribed data. Use appropriate filtering options to subscribe only to the data you need.

---

## 1. Request

### Parameters

The signature subscription request accepts the following parameters.

| Parameter                            | Type              | Required | Description                                                                                                                                                                                                                                                                                                                                                                      |
| ------------------------------------ | ----------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                                   | integer or string | required | A unique identifier for the request, used by the client to match requests with responses.                                                                                                                                                                                                                                                                                        |
| jsonrpc                              | string            | required | The JSON-RPC protocol version. Always set to `"2.0"`.                                                                                                                                                                                                                                                                                                                            |
| method                               | string            | required | The name of the method to invoke. Set to `"signatureSubscribe"`.                                                                                                                                                                                                                                                                                                                 |
| params                               | array             | required | Signature information and options to subscribe to. The first element is the transaction signature; the second is a configuration object.                                                                                                                                                                                                                                          |
| params[0]                            | string            | required | The transaction signature to subscribe to (base-58 encoded string). Must be the first signature of the transaction.                                                                                                                                                                                                                                                              |
| params[1].commitment                 | string            | optional | Specifies the level of block finalization. <br />- `finalized`: Queries the most recent block confirmed as finalized by a supermajority of the cluster at maximum lockout. <br />- `confirmed`: Queries the most recent block voted on by a supermajority of the cluster. <br />- `processed`: Queries the node's most recent block, which may still be skipped by the cluster. |
| params[1].enableReceivedNotification | boolean           | optional | Specifies whether to also receive a notification when the signature is received by the RPC node. When `true`, notifications are sent both on receipt and on processing completion.                                                                                                                                                                                                |

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

On success, the server returns a subscription ID.

```json Response example
{
  "jsonrpc": "2.0",
  "result": 0,
  "id": 1
}
```

This subscription ID is required when calling the `signatureUnsubscribe` method.

### Notifications

Once the subscription is active, the server pushes a notification when the transaction reaches the specified commitment level.

**Notification format:**

| Field | Type             | Description                         |
| ----- | ---------------- | ----------------------------------- |
| slot  | u64              | The slot number                     |
| value | object \| string | RpcSignatureResult notification value |

**`value` field details:**

- **Signature received notification** (when `enableReceivedNotification` is `true` and the signature is received):

  - Type: `string`
  - Value: `"receivedSignature"`
  - Description: Indicates that the signature has been received by the RPC node.

- **Transaction processing completion notification** (when the signature has been processed):
  - Type: `object`
  - Value: `{ "err": null }` (success) or `{ "err": TransactionError }` (failure)
  - Description: Indicates that the transaction has been processed at the specified commitment level.

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

- Initial response: a subscription ID is returned.
- Subsequent: when the transaction reaches the specified commitment level, the server automatically sends a notification. The subscription is automatically cancelled after the notification is received (one-time notification subscription).

### Unsubscribe

There are two ways to cancel a subscription:

1. **Close the connection**: Press `CTRL+C` in the terminal to close the WebSocket connection. All active subscriptions are automatically cancelled.

2. **Cancel a specific subscription**: Use `signatureUnsubscribe` to cancel a specific subscription while keeping the connection open.

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
