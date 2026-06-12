---
slug: /node-api/slotsubscribe
---

# slotSubscribe

The slotSubscribe method in Solana creates a subscription to receive real-time notifications whenever a validator processes a slot.

> 📘 Notes on Usage
>
> - Must be called via a **WebSocket** endpoint; HTTP is not supported.
> - When the WebSocket connection drops, the subscription is automatically cancelled. You must re-subscribe upon reconnection.
> - This subscription fires a notification every time the validator processes a slot, which can result in very frequent notifications.
> - CU is consumed based on the amount of data subscribed. It is recommended to use appropriate filtering options to subscribe only to the data you need.

---

## 1. Request

### Parameters

The subscription request has the following parameters.

| Parameter | Type              | Required | Description                                                                          |
| --------- | ----------------- | -------- | ------------------------------------------------------------------------------------ |
| id        | integer or string | required | A unique request identifier. Used by the client to match requests with responses.    |
| jsonrpc   | string            | required | JSON-RPC protocol version. Always enter "2.0".                                       |
| method    | string            | required | The method name to execute. Enter "slotSubscribe" here.                              |
| params    | array             | required | No additional parameters are required for slot subscription. Use an empty array.     |

### Example

```json slotSubscribe example
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "slotSubscribe",
  "params": []
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

This subscription ID is required when calling the `slotUnsubscribe` method.

### Notifications

When the subscription is active, the server pushes notifications whenever the validator processes a slot.

**Notification Format:**

| Field  | Type | Description               |
| ------ | ---- | ------------------------- |
| parent | u64  | The parent slot number    |
| root   | u64  | The current root slot number |
| slot   | u64  | The newly set slot value  |

#### Slot Notification Example

```json slotNotification example
{
  "jsonrpc": "2.0",
  "method": "slotNotification",
  "params": {
    "result": {
      "parent": 75,
      "root": 44,
      "slot": 76
    },
    "subscription": 0
  }
}
```

---

## 3. How to Use

### Connect to WebSocket Channel

```sh wscat
wscat -c wss://api.mainnet-beta.solana.com
```

### Subscribe to Slots

```json subscribe example
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "slotSubscribe",
  "params": []
}
```

### Receive Notifications

- Initial response: subscription ID returned
- Subsequently: receive "slotNotification" event whenever the validator processes a slot

### Unsubscribe

There are two ways to cancel a subscription:

1. **Close connection**: Press `CTRL+C` in the terminal window to close the WebSocket connection and all subscriptions will be automatically cancelled.

2. **Cancel specific subscription**: Use slotUnsubscribe to cancel only a specific subscription while keeping the connection open.

Unsubscribe request:

```json unsubscribe example
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "slotUnsubscribe",
  "params": [0]
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
