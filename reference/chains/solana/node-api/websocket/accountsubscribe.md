# accountSubscribe

The accountSubscribe method creates a subscription that delivers real-time notifications whenever the **lamports** balance or **data** of a specific account changes.

> 📘 Usage Notes
>
> - This method must be called via a **WebSocket** endpoint. HTTP is not supported.
> - If the WebSocket connection is dropped, the subscription is automatically cancelled. Re-subscribe after reconnecting.
> - CU is consumed based on the volume of subscribed data. Use appropriate filtering options to subscribe only to the data you need.

---

## 1. Request

### Parameters

The subscription request accepts the following parameters.

| Parameter            | Type              | Required | Description                                                                                                                                                                                                                                                                                                                                                                      |
| -------------------- | ----------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                   | integer or string | required | A unique identifier for the request, used by the client to match requests with responses.                                                                                                                                                                                                                                                                                        |
| jsonrpc              | string            | required | The JSON-RPC protocol version. Always set to `"2.0"`.                                                                                                                                                                                                                                                                                                                            |
| method               | string            | required | The name of the method to invoke. Set to `"accountSubscribe"`.                                                                                                                                                                                                                                                                                                                   |
| params               | array             | required | Account information and options to subscribe to. The first element is the account public key; the second is a configuration object.                                                                                                                                                                                                                                               |
| params[1].commitment | string            | optional | Specifies the level of block finalization. <br />- `finalized`: Queries the most recent block confirmed as finalized by a supermajority of the cluster at maximum lockout. <br />- `confirmed`: Queries the most recent block voted on by a supermajority of the cluster. <br />- `processed`: Queries the node's most recent block, which may still be skipped by the cluster. |
| params[1].encoding   | string            | optional | Encoding format for account data. <br />- `base58` (slow) <br />- `base64` <br />- `base64+zstd` <br />- `jsonParsed` (applies a program-specific parser if available; otherwise returns a binary string)                                                                                                                                                                        |

### Example

```json accountSubscribe example
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "accountSubscribe",
  "params": [
    "CM78CPUeXjn8o3yroDHxUtKsZZgoy4GPkPPXfouKNH12",
    {
      "encoding": "jsonParsed",
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
  "result": 23784,
  "id": 1
}
```

This subscription ID is required when calling the `accountUnsubscribe` method.

### Notifications

Once the subscription is active, the server pushes a notification each time the account state changes. The notification format matches the response of the `getAccountInfo` RPC method.

**Response data format:**

- Data is returned in one of the following formats depending on the `encoding` option: `base58`, `base64`, `base64+zstd`, or `jsonParsed`.
- `jsonParsed` converts the data into a human-readable format using a program-specific parser. If no parser is available, a binary string is returned instead.

#### Base58 Encoding Example

```json accountNotification - base58
{
  "jsonrpc": "2.0",
  "method": "accountNotification",
  "params": {
    "result": {
      "context": { "slot": 5199307 },
      "value": {
        "data": [
          "11116bv5nS2h3y12kD1yUKeMZvGcKLSjQgX6BeV7u1FrjeJcKfsHPXHRDEHrBesJhZyqnnq9qJeUuF7WHxiuLuL5twc38w2TXNLxnDbjmuR",
          "base58"
        ],
        "executable": false,
        "lamports": 33594,
        "owner": "11111111111111111111111111111111",
        "rentEpoch": 635,
        "space": 80
      }
    },
    "subscription": 23784
  }
}
```

#### JSON Parsed Encoding Example

```json accountNotification - jsonParsed
{
  "jsonrpc": "2.0",
  "method": "accountNotification",
  "params": {
    "result": {
      "context": { "slot": 5199307 },
      "value": {
        "data": {
          "program": "nonce",
          "parsed": {
            "type": "initialized",
            "info": {
              "authority": "Bbqg1M4YVVfbhEzwA9SpC9FhsaG83YMTYoR4a8oTDLX",
              "blockhash": "LUaQTmM7WbMRiATdMMHaRGakPtCkc2GHtH57STKXs6k",
              "feeCalculator": { "lamportsPerSignature": 5000 }
            }
          }
        },
        "executable": false,
        "lamports": 33594,
        "owner": "11111111111111111111111111111111",
        "rentEpoch": 635,
        "space": 80
      }
    },
    "subscription": 23784
  }
}
```

---

## 3. How to Use

### Connect to WebSocket Channel

```sh wscat
wscat -c wss://api.mainnet-beta.solana.com
```

### Subscribe an Account

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

### Receive Notifications

- Initial response: a subscription ID is returned.
- Subsequent: an `"accountNotification"` event is received each time the account changes.

### Unsubscribe

There are two ways to cancel a subscription:

1. **Close the connection**: Press `CTRL+C` in the terminal to close the WebSocket connection. All active subscriptions are automatically cancelled.

2. **Cancel a specific subscription**: Use `accountUnsubscribe` to cancel a specific subscription while keeping the connection open.

Unsubscribe request:

```json unsubscribe example
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "accountUnsubscribe",
  "params": [23784]
}
```

Response after unsubscribing:

```json unsubscribe success
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": true
}
```
