# logsSubscribe

The logsSubscribe method creates a subscription that streams transaction logs matching specified filter conditions in real time.

> 📘 Usage Notes
>
> - This method must be called via a **WebSocket** endpoint. HTTP is not supported.
> - If the WebSocket connection is dropped, the subscription is automatically cancelled. Re-subscribe after reconnecting.
> - CU is consumed based on the volume of subscribed data. Use appropriate filtering options to subscribe only to the data you need.

---

## 1. Request

### Parameters

The log subscription request accepts the following parameters.

| Parameter            | Type              | Required | Description                                                                                                                                                                                                                                                                                                                                                                      |
| -------------------- | ----------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                   | integer or string | required | A unique identifier for the request, used by the client to match requests with responses.                                                                                                                                                                                                                                                                                        |
| jsonrpc              | string            | required | The JSON-RPC protocol version. Always set to `"2.0"`.                                                                                                                                                                                                                                                                                                                            |
| method               | string            | required | The name of the method to invoke. Set to `"logsSubscribe"`.                                                                                                                                                                                                                                                                                                                      |
| params               | array             | required | Log filter and options to subscribe to. The first element is the filter condition; the second is a configuration object.                                                                                                                                                                                                                                                          |
| params[0]            | string or object  | required | Log filter condition. <br />- `"all"`: Subscribe to all transactions except simple vote transactions. <br />- `"allWithVotes"`: Subscribe to all transactions including simple vote transactions. <br />- `{ "mentions": [ <string> ] }`: Subscribe only to transactions that mention a specific address. Currently supports only one address; providing multiple addresses returns an error. |
| params[1].commitment | string            | optional | Specifies the level of block finalization. <br />- `finalized`: Queries the most recent block confirmed as finalized by a supermajority of the cluster at maximum lockout. <br />- `confirmed`: Queries the most recent block voted on by a supermajority of the cluster. <br />- `processed`: Queries the node's most recent block, which may still be skipped by the cluster. |

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

On success, the server returns a subscription ID.

```json Response example
{
  "jsonrpc": "2.0",
  "result": 24040,
  "id": 1
}
```

This subscription ID is required when calling the `logsUnsubscribe` method.

### Notifications

Once the subscription is active, the server pushes a notification each time a matching transaction occurs.

**Response data format:**

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

- Initial response: a subscription ID is returned.
- Subsequent: a `"logsNotification"` event is received each time a matching transaction occurs.

### Unsubscribe

There are two ways to cancel a subscription:

1. **Close the connection**: Press `CTRL+C` in the terminal to close the WebSocket connection. All active subscriptions are automatically cancelled.

2. **Cancel a specific subscription**: Use `logsUnsubscribe` to cancel a specific subscription while keeping the connection open.

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
