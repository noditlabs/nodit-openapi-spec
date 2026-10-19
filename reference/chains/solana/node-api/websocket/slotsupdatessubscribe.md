# slotsUpdatesSubscribe

The slotsUpdatesSubscribe method creates a subscription that delivers real-time notifications for various types of updates occurring in each slot as processed by a validator.

> 📘 Usage Notes
>
> - This method must be called via a **WebSocket** endpoint. HTTP is not supported.
> - If the WebSocket connection is dropped, the subscription is automatically cancelled. Re-subscribe after reconnecting.
> - CU is consumed based on the volume of subscribed data. Use appropriate filtering options to subscribe only to the data you need.

> ⚠️ This subscription may be unstable.
>
> - This subscription receives various updates for each slot, which can result in a very high frequency of notifications.
> - The subscription format is subject to change in the future and may not always be supported.

---

## 1. Request

### Parameters

The slot updates subscription request accepts the following parameters.

| Parameter | Type              | Required | Description                                                                                      |
| --------- | ----------------- | -------- | ------------------------------------------------------------------------------------------------ |
| id        | integer or string | required | A unique identifier for the request, used by the client to match requests with responses.        |
| jsonrpc   | string            | required | The JSON-RPC protocol version. Always set to `"2.0"`.                                            |
| method    | string            | required | The name of the method to invoke. Set to `"slotsUpdatesSubscribe"`.                              |
| params    | array             | required | No additional parameters are required for slot updates subscription. Use an empty array.         |

### Example

```json slotsUpdatesSubscribe example
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "slotsUpdatesSubscribe",
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

This subscription ID is required when calling the `slotsUpdatesUnsubscribe` method.

### Notifications

Once the subscription is active, the server pushes a notification each time a validator processes a slot update.

**Notification format:**

| Field                           | Type                | Description                                                                                                                                                                              |
| ------------------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| err                             | string \| undefined | Error message. Present only when the update type is `"dead"`.                                                                                                                            |
| parent                          | u64 \| undefined    | Parent slot. Present only when the update type is `"createdBank"`.                                                                                                                       |
| slot                            | u64                 | The newly updated slot number.                                                                                                                                                           |
| stats                           | object \| undefined | Statistics information. Present only when the update type is `"frozen"`.                                                                                                                 |
| stats.maxTransactionsPerEntry   | u64 \| undefined    | Maximum number of transactions per entry.                                                                                                                                                |
| stats.numFailedTransactions     | u64 \| undefined    | Number of failed transactions.                                                                                                                                                           |
| stats.numSuccessfulTransactions | u64 \| undefined    | Number of successful transactions.                                                                                                                                                       |
| stats.numTransactionEntries     | u64 \| undefined    | Number of transaction entries.                                                                                                                                                           |
| timestamp                       | i64                 | Unix timestamp of the update.                                                                                                                                                            |
| type                            | string              | The update type. Returns one of: `"firstShredReceived"`, `"completed"`, `"createdBank"`, `"frozen"`, `"dead"`, `"optimisticConfirmation"`, `"root"` |

#### Slots Updates Notification Example

```json slotsUpdatesNotification example
{
  "jsonrpc": "2.0",
  "method": "slotsUpdatesNotification",
  "params": {
    "result": {
      "parent": 75,
      "slot": 76,
      "timestamp": 1625081266243,
      "type": "optimisticConfirmation"
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

### Subscribe to Slots Updates

```json subscribe example
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "slotsUpdatesSubscribe",
  "params": []
}
```

### Receive Notifications

- Initial response: a subscription ID is returned.
- Subsequent: a `"slotsUpdatesNotification"` event is received each time a slot update occurs.

### Unsubscribe

There are two ways to cancel a subscription:

1. **Close the connection**: Press `CTRL+C` in the terminal to close the WebSocket connection. All active subscriptions are automatically cancelled.

2. **Cancel a specific subscription**: Use `slotsUpdatesUnsubscribe` to cancel a specific subscription while keeping the connection open.

Unsubscribe request:

```json unsubscribe example
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "slotsUpdatesUnsubscribe",
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
