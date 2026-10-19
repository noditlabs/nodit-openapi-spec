# programSubscribe

The programSubscribe method creates a subscription that delivers real-time notifications whenever the **lamports** balance or **data** of any account owned by a specific program changes.

> 📘 Usage Notes
>
> - This method must be called via a **WebSocket** endpoint. HTTP is not supported.
> - If the WebSocket connection is dropped, the subscription is automatically cancelled. Re-subscribe after reconnecting.
> - CU is consumed based on the volume of subscribed data. Use appropriate filtering options to subscribe only to the data you need.

---

## 1. Request

### Parameters

The program subscription request accepts the following parameters.

| Parameter            | Type              | Required | Description                                                                                                                                                                                                                                                                                                                                                                      |
| -------------------- | ----------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                   | integer or string | required | A unique identifier for the request, used by the client to match requests with responses.                                                                                                                                                                                                                                                                                        |
| jsonrpc              | string            | required | The JSON-RPC protocol version. Always set to `"2.0"`.                                                                                                                                                                                                                                                                                                                            |
| method               | string            | required | The name of the method to invoke. Set to `"programSubscribe"`.                                                                                                                                                                                                                                                                                                                   |
| params               | array             | required | Program information and options to subscribe to. The first element is the program ID; the second is a configuration object.                                                                                                                                                                                                                                                       |
| params[0]            | string            | required | The Pubkey of the program to subscribe to (base-58 encoded string).                                                                                                                                                                                                                                                                                                              |
| params[1].commitment | string            | optional | Specifies the level of block finalization. <br />- `finalized`: Queries the most recent block confirmed as finalized by a supermajority of the cluster at maximum lockout. <br />- `confirmed`: Queries the most recent block voted on by a supermajority of the cluster. <br />- `processed`: Queries the node's most recent block, which may still be skipped by the cluster. |
| params[1].filters    | array             | optional | An array of filter objects used to narrow the results. Only accounts satisfying all filter conditions are included in the response.                                                                                                                                                                                                                                               |
| params[1].encoding   | string            | optional | Encoding format for account data. <br />- `base58` (slow) <br />- `base64` <br />- `base64+zstd` <br />- `jsonParsed` (applies a program-specific parser if available; otherwise returns a binary string)                                                                                                                                                                        |

### Example

```json programSubscribe example
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "programSubscribe",
  "params": [
    "11111111111111111111111111111111",
    {
      "encoding": "base64",
      "filters": [{ "dataSize": 80 }]
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

This subscription ID is required when calling the `programUnsubscribe` method.

### Notifications

Once the subscription is active, the server pushes a notification each time an account owned by the program changes. The notification format matches the response of the `getProgramAccounts` RPC HTTP method.

**Response data format:**

- Data is returned in one of the following formats depending on the `encoding` option: `base58`, `base64`, `base64+zstd`, or `jsonParsed`.
- `jsonParsed` converts the data into a human-readable format using a program-specific parser. If no parser is available, a binary string is returned instead.

#### Base58 Encoding Example

```json programNotification - base58
{
  "jsonrpc": "2.0",
  "method": "programNotification",
  "params": {
    "result": {
      "context": {
        "slot": 5208469
      },
      "value": {
        "pubkey": "H4vnBqifaSACnKa7acsxstsY1iV1bvJNxsCY7enrd1hq",
        "account": {
          "data": [
            "11116bv5nS2h3y12kD1yUKeMZvGcKLSjQgX6BeV7u1FrjeJcKfsHPXHRDEHrBesJhZyqnnq9qJeUuF7WHxiuLuL5twc38w2TXNLxnDbjmuR",
            "base58"
          ],
          "executable": false,
          "lamports": 33594,
          "owner": "11111111111111111111111111111111",
          "rentEpoch": 636,
          "space": 80
        }
      }
    },
    "subscription": 24040
  }
}
```

#### JSON Parsed Encoding Example

```json programNotification - jsonParsed
{
  "jsonrpc": "2.0",
  "method": "programNotification",
  "params": {
    "result": {
      "context": {
        "slot": 5208469
      },
      "value": {
        "pubkey": "H4vnBqifaSACnKa7acsxstsY1iV1bvJNxsCY7enrd1hq",
        "account": {
          "data": {
            "program": "nonce",
            "parsed": {
              "type": "initialized",
              "info": {
                "authority": "Bbqg1M4YVVfbhEzwA9SpC9FhsaG83YMTYoR4a8oTDLX",
                "blockhash": "LUaQTmM7WbMRiATdMMHaRGakPtCkc2GHtH57STKXs6k",
                "feeCalculator": {
                  "lamportsPerSignature": 5000
                }
              }
            }
          },
          "executable": false,
          "lamports": 33594,
          "owner": "11111111111111111111111111111111",
          "rentEpoch": 636,
          "space": 80
        }
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

### Subscribe to Program

```json subscribe example
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "programSubscribe",
  "params": [
    "11111111111111111111111111111111",
    {
      "encoding": "base64",
      "filters": [{ "dataSize": 80 }]
    }
  ]
}
```

### Receive Notifications

- Initial response: a subscription ID is returned.
- Subsequent: a `"programNotification"` event is received each time an account owned by the program changes.

### Unsubscribe

There are two ways to cancel a subscription:

1. **Close the connection**: Press `CTRL+C` in the terminal to close the WebSocket connection. All active subscriptions are automatically cancelled.

2. **Cancel a specific subscription**: Use `programUnsubscribe` to cancel a specific subscription while keeping the connection open.

Unsubscribe request:

```json unsubscribe example
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "programUnsubscribe",
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
