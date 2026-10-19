# accountUnsubscribe

The accountUnsubscribe method cancels a subscription created by `accountSubscribe`, stopping further account change notifications.

> 📘 Usage Notes
>
> - This method must be called via a **WebSocket** endpoint. HTTP is not supported.
> - Once unsubscribed, the subscription ID cannot be reused. Call `accountSubscribe` again to create a new subscription.
> - If the WebSocket connection is dropped, subscriptions are automatically cancelled. Re-subscribe after reconnecting.

---

## 1. Request

### Parameters

The unsubscribe request accepts the following parameters.

| Parameter | Type              | Required | Description                                                                               |
| --------- | ----------------- | -------- | ----------------------------------------------------------------------------------------- |
| id        | integer or string | required | A unique identifier for the request, used by the client to match requests with responses. |
| jsonrpc   | string            | required | The JSON-RPC protocol version. Always set to `"2.0"`.                                     |
| method    | string            | required | The name of the method to invoke. Set to `"accountUnsubscribe"`.                          |
| params    | array             | required | An array containing the subscription ID to cancel.                                        |

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

1. **Close the connection**: Press `CTRL+C` in the terminal to close the WebSocket connection. All active subscriptions are automatically cancelled.

2. **Cancel a specific subscription**: Use `accountUnsubscribe` to cancel a specific subscription while keeping the connection open.

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
