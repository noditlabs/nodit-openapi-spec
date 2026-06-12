---
slug: /node-api/accountsubscribe
---

# accountSubscribe

The accountSubscribe method in Solana creates a subscription to receive real-time notifications whenever **lamports** or **data changes** occur in a specific account.

> 📘 Notes on Usage
>
> - Must be called via a **WebSocket** endpoint; HTTP is not supported.
> - When the WebSocket connection drops, the subscription is automatically cancelled. You must re-subscribe upon reconnection.
> - CU is consumed based on the amount of data subscribed. It is recommended to use appropriate filtering options to subscribe only to the data you need.

---

## 1. Request

### Parameters

The subscription request has the following parameters.

| Parameter            | Type              | Required | Description                                                                                                                                                                                                                                                                                                                                                                       |
| -------------------- | ----------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                   | integer or string | required | A unique request identifier. Used by the client to match requests with responses.                                                                                                                                                                                                                                                                                                 |
| jsonrpc              | string            | required | JSON-RPC protocol version. Always enter "2.0".                                                                                                                                                                                                                                                                                                                                    |
| method               | string            | required | The method name to execute. Enter "accountSubscribe" here.                                                                                                                                                                                                                                                                                                                        |
| params               | array             | required | Account information and options to subscribe to. The first element is the account public key, and the second is a configuration object.                                                                                                                                                                                                                                           |
| params[1].commitment | string            | optional | Specifies the level of block commitment. <br />- `finalized`: Queries the most recent block confirmed by a supermajority of the cluster reaching maximum lockout. The cluster recognizes this block as finalized. <br />- `confirmed`: Queries the most recent block voted on by a supermajority of the cluster. <br />- `processed`: Queries the most recent block of the node. This block may still be skipped by the cluster. |
| params[1].encoding   | string            | optional | Account data encoding format. <br />- base58 (slow) <br />- base64 <br />- base64+zstd <br />- jsonParsed (applies parser if available; otherwise returns binary string)                                                                                                                                                                                                          |

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

Upon successful subscription, a subscription ID is returned.

```json Response example
{
  "jsonrpc": "2.0",
  "result": 23784,
  "id": 1
}
```

This subscription ID is required when calling the `accountUnsubscribe` method.

### Notifications

When the subscription is active, the server pushes notifications whenever the account state changes.
The notification format is the same as the response from the `getAccountInfo` RPC.

**Response Data Format:**

- Response data is delivered as one of `base58`, `base64`, `base64+zstd`, `jsonParsed` depending on the `encoding` option.
- `jsonParsed` converts data to a human-readable format through program-specific parsers; if no parser is available, it returns a binary string.

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

- Initial response: subscription ID returned
- Subsequently: receive "accountNotification" event when account changes occur

### Unsubscribe

There are two ways to cancel a subscription:

1. **Close connection**: Press `CTRL+C` in the terminal window to close the WebSocket connection and all subscriptions will be automatically cancelled.

2. **Cancel specific subscription**: Use accountUnsubscribe to cancel only a specific subscription while keeping the connection open.

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
