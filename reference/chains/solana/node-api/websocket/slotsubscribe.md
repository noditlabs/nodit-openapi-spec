# slotSubscribe

The slotSubscribe method creates a subscription that delivers real-time notifications each time a validator processes a slot.

> 📘 Usage Notes
>
> - This method must be called via a **WebSocket** endpoint. HTTP is not supported.
> - If the WebSocket connection is dropped, the subscription is automatically cancelled. Re-subscribe after reconnecting.
> - This subscription fires a notification every time a validator processes a slot, which can result in a very high frequency of notifications.
> - CU is consumed based on the volume of subscribed data. Use appropriate filtering options to subscribe only to the data you need.

---

## 1. Request

### Parameters

The slot subscription request accepts the following parameters.

| Parameter | Type              | Required | Description                                                                               |
| --------- | ----------------- | -------- | ----------------------------------------------------------------------------------------- |
| id        | integer or string | required | A unique identifier for the request, used by the client to match requests with responses. |
| jsonrpc   | string            | required | The JSON-RPC protocol version. Always set to `"2.0"`.                                     |
| method    | string            | required | The name of the method to invoke. Set to `"slotSubscribe"`.                               |
| params    | array             | required | No additional parameters are required for slot subscription. Use an empty array.          |

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

On success, the server returns a subscription ID.

```json Response example
{
  "jsonrpc": "2.0",
  "result": 0,
  "id": 1
}
```

This subscription ID is required when calling the `slotUnsubscribe` method.

### Notifications

Once the subscription is active, the server pushes a notification each time a validator processes a slot.

**Notification format:**

| Field  | Type | Description                        |
| ------ | ---- | ---------------------------------- |
| parent | u64  | The parent slot number             |
| root   | u64  | The current root slot number       |
| slot   | u64  | The newly processed slot number    |

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

- Initial response: a subscription ID is returned.
- Subsequent: a `"slotNotification"` event is received each time a validator processes a slot.

### Unsubscribe

There are two ways to cancel a subscription:

1. **Close the connection**: Press `CTRL+C` in the terminal to close the WebSocket connection. All active subscriptions are automatically cancelled.

2. **Cancel a specific subscription**: Use `slotUnsubscribe` to cancel a specific subscription while keeping the connection open.

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
