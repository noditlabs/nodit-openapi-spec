---
slug: /node-api/slotsupdatessubscribe
---

# slotsUpdatesSubscribe

The slotsUpdatesSubscribe method in Solana creates a subscription to receive real-time notifications for various updates that occur at each slot from validators.

> 📘 Notes on Usage
>
> - Must be called via a **WebSocket** endpoint; HTTP is not supported.
> - When the WebSocket connection drops, the subscription is automatically cancelled. You must re-subscribe upon reconnection.
> - CU is consumed based on the amount of data subscribed. It is recommended to use appropriate filtering options to subscribe only to the data you need.

> ⚠️ This subscription may be unstable.
>
> - This subscription receives various updates occurring at each slot, which can result in very frequent notifications.
> - The subscription format may change in the future and may not always be supported.

---

## 1. Request

### Parameters

The subscription request has the following parameters.

| Parameter | Type              | Required | Description                                                                                      |
| --------- | ----------------- | -------- | ------------------------------------------------------------------------------------------------ |
| id        | integer or string | required | A unique request identifier. Used by the client to match requests with responses.                |
| jsonrpc   | string            | required | JSON-RPC protocol version. Always enter "2.0".                                                   |
| method    | string            | required | The method name to execute. Enter "slotsUpdatesSubscribe" here.                                  |
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

Upon successful subscription, a subscription ID is returned.

```json Response example
{
  "jsonrpc": "2.0",
  "result": 0,
  "id": 1
}
```

This subscription ID is required when calling the slotsUpdatesUnsubscribe method.

### Notifications

When the subscription is active, the server pushes notifications whenever the validator processes a slot update.

**Notification Format:**

| Field                           | Type                | Description                                                                                                                                                                   |
| ------------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| err                             | string \| undefined | Error message. Only present when the update type is "dead".                                                                                                                   |
| parent                          | u64 \| undefined    | Parent slot. Only present when the update type is "createdBank".                                                                                                              |
| slot                            | u64                 | The newly updated slot number.                                                                                                                                                |
| stats                           | object \| undefined | Statistics information. Only present when the update type is "frozen".                                                                                                        |
| stats.maxTransactionsPerEntry   | u64 \| undefined    | Maximum number of transactions per entry.                                                                                                                                     |
| stats.numFailedTransactions     | u64 \| undefined    | Number of failed transactions.                                                                                                                                                |
| stats.numSuccessfulTransactions | u64 \| undefined    | Number of successful transactions.                                                                                                                                            |
| stats.numTransactionEntries     | u64 \| undefined    | Number of transaction entries.                                                                                                                                                |
| timestamp                       | i64                 | Unix timestamp of the update.                                                                                                                                                 |
| type                            | string              | Update type. <br />Returns one of the following values: `"firstShredReceived"`, `"completed"`, `"createdBank"`, `"frozen"`, `"dead"`, `"optimisticConfirmation"`, `"root"` |

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

- Initial response: subscription ID returned
- Subsequently: receive "slotsUpdatesNotification" event when a slot update occurs

### Unsubscribe

There are two ways to cancel a subscription:

1. **Close connection**: Press `CTRL+C` in the terminal window to close the WebSocket connection and all subscriptions will be automatically cancelled.

2. **Cancel specific subscription**: Use slotsUpdatesUnsubscribe to cancel only a specific subscription while keeping the connection open.

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
