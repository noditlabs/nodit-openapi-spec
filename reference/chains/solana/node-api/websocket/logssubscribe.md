---
slug: /node-api/logssubscribe
---

# logsSubscribe

The logsSubscribe method in Solana allows you to subscribe to and receive transaction logs that match specific conditions in real time.

> 📘 Notes on Usage
>
> - Must be called via a **WebSocket** endpoint; HTTP is not supported.
> - When the WebSocket connection drops, the subscription is automatically cancelled. You must re-subscribe upon reconnection.
> - CU is consumed based on the amount of data subscribed. It is recommended to use appropriate filtering options to subscribe only to the data you need.

---

## 1. Request

### Parameters

The log subscription request has the following parameters.

| Parameter            | Type              | Required | Description                                                                                                                                                                                                                                                                                                                                                                       |
| -------------------- | ----------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                   | integer or string | required | A unique request identifier. Used by the client to match requests with responses.                                                                                                                                                                                                                                                                                                 |
| jsonrpc              | string            | required | JSON-RPC protocol version. Always enter "2.0".                                                                                                                                                                                                                                                                                                                                    |
| method               | string            | required | The method name to execute. Enter "logsSubscribe" here.                                                                                                                                                                                                                                                                                                                           |
| params               | array             | required | Log filter and options to subscribe to. The first element is the filter condition, and the second is a configuration object.                                                                                                                                                                                                                                                       |
| params[0]            | string or object  | required | Log filter condition. <br />- `"all"`: Subscribe to all transactions except simple vote transactions <br />- `"allWithVotes"`: Subscribe to all transactions including simple vote transactions <br />- `{ "mentions": [ <string> ] }`: Subscribe only to transactions mentioning a specific address (currently only one address is supported; providing multiple addresses will cause an error.) |
| params[1].commitment | string            | optional | Specifies the level of block commitment. <br />- `finalized`: Queries the most recent block confirmed by a supermajority of the cluster reaching maximum lockout. The cluster recognizes this block as finalized. <br />- `confirmed`: Queries the most recent block voted on by a supermajority of the cluster. <br />- `processed`: Queries the most recent block of the node. This block may still be skipped by the cluster. |

### Example

```json logsSubscribe example
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "logsSubscribe",
  "params": [
    {
      "mentions": ["11111111111111111111111111111111"]
    },
    {
      "commitment": "finalized"
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
  "result": 24040,
  "id": 1
}
```

This subscription ID is required when calling the logsUnsubscribe method.

### Notifications

When the subscription is active, the server pushes notifications whenever a transaction matching the condition occurs.

**Response Data Format:**

#### Log Notification Example

```json logsNotification example
{
  "jsonrpc": "2.0",
  "method": "logsNotification",
  "params": {
    "result": {
      "context": {
        "slot": 5208469
      },
      "value": {
        "signature": "5h6xBEauJ3PK6SWCZ1PGjBvj8vDdWG3KpwATGy1ARAXFSDwt8GFXM7W5Ncn16wmqokgpiKRLuS83KUxyZyv2sUYv",
        "err": null,
        "logs": [
          "SBF program 83astBRguLMdt2h5U1Tpdq5tjFoJ6noeGwaY3mDLVcri success"
        ]
      }
    },
    "subscription": 24040
  }
}
```

---

## 3. How to Use

### Connect to WebSocket Channel

```sh wscat
wscat -c wss://api.mainnet-beta.solana.com
```

### Subscribe to Logs

```json subscribe example
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "logsSubscribe",
  "params": [
    {
      "mentions": ["11111111111111111111111111111111"]
    },
    {
      "commitment": "finalized"
    }
  ]
}
```

### Receive Notifications

- Initial response: subscription ID returned
- Subsequently: receive "logsNotification" event when a matching transaction occurs

### Unsubscribe

There are two ways to cancel a subscription:

1. **Close connection**: Press `CTRL+C` in the terminal window to close the WebSocket connection and all subscriptions will be automatically cancelled.

2. **Cancel specific subscription**: Use logsUnsubscribe to cancel only a specific subscription while keeping the connection open.

Unsubscribe request:

```json unsubscribe example
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "logsUnsubscribe",
  "params": [24040]
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
