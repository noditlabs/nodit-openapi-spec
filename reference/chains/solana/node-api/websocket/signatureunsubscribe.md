# signatureUnsubscribe

The signatureUnsubscribe method cancels a signature subscription created by `signatureSubscribe`, stopping further transaction signature notifications.

> 📘 Usage Notes
>
> - This method must be called via a **WebSocket** endpoint. HTTP is not supported.
> - Once unsubscribed, the subscription ID cannot be reused. Call `signatureSubscribe` again to create a new subscription.
> - If the WebSocket connection is dropped, subscriptions are automatically cancelled. Re-subscribe after reconnecting.
> - Because `signatureSubscribe` is a one-time notification subscription, the subscription is automatically cancelled after the notification is received.

---

## 1. Request

### Parameters

The signature unsubscribe request accepts the following parameters.

| Parameter | Type              | Required | Description                                                                               |
| --------- | ----------------- | -------- | ----------------------------------------------------------------------------------------- |
| id        | integer or string | required | A unique identifier for the request, used by the client to match requests with responses. |
| jsonrpc   | string            | required | The JSON-RPC protocol version. Always set to `"2.0"`.                                     |
| method    | string            | required | The name of the method to invoke. Set to `"signatureUnsubscribe"`.                        |
| params    | array             | required | An array containing the subscription ID to cancel.                                        |

### Example

```json signatureUnsubscribe example
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "signatureUnsubscribe",
  "params": [24006]
}
```

---

## 2. Response

### Success Response

Returns `true` when the subscription is successfully cancelled.

```json Response example
{
  "jsonrpc": "2.0",
  "result": true,
  "id": 1
}
```

### Error Response

Returns an error if the unsubscribe request fails.

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

### Subscribe to Signature (First)

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

### Receive Subscription ID

```json subscription response
{
  "jsonrpc": "2.0",
  "result": 24006,
  "id": 1
}
```

### Unsubscribe

There are two ways to cancel a subscription:

1. **Close the connection**: Press `CTRL+C` in the terminal to close the WebSocket connection. All active subscriptions are automatically cancelled.

2. **Cancel a specific subscription**: Use `signatureUnsubscribe` to cancel a specific subscription while keeping the connection open.

```json unsubscribe example
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "signatureUnsubscribe",
  "params": [24006]
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
