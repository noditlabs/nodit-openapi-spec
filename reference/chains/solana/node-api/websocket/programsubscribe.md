---
slug: /node-api/programsubscribe
---

# programSubscribe

Solana의 programSubscribe 메서드는 특정 프로그램이 소유한 계정의 **lamports** 또는 **데이터 변경**이 발생할 때마다 실시간 알림을 받을 수 있도록 구독을 생성합니다.

> 📘 사용 시 참고사항
>
> - 반드시 **WebSocket** 엔드포인트를 통해 호출해야 하며, HTTP는 지원되지 않습니다.
> - WebSocket 연결이 끊어지면 구독도 자동으로 해제됩니다. 재연결 시 다시 구독을 요청해야 합니다.
> - CU는 구독한 데이터의 양에 따라 소진되므로, 필요한 데이터만을 구독할 수 있도록 적절한 필터링 옵션 사용을 권장합니다.

---

## 1. Request

### Parameters

프로그램 구독 요청은 아래의 파라미터를 가집니다.

| Parameter            | Type              | Required | Description                                                                                                                                                                                                                                                                                                                                                           |
| -------------------- | ----------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                   | integer or string | required | 요청 고유 식별자. 클라이언트가 요청과 응답을 매칭하는데 사용됩니다.                                                                                                                                                                                                                                                                                                   |
| jsonrpc              | string            | required | JSON-RPC 프로토콜 버전. 항상 "2.0"을 입력합니다.                                                                                                                                                                                                                                                                                                                      |
| method               | string            | required | 실행할 메서드 이름. 여기서는 "programSubscribe"를 입력합니다.                                                                                                                                                                                                                                                                                                         |
| params               | array             | required | 구독할 프로그램 정보 및 옵션. 첫 번째 요소는 프로그램 ID, 두 번째는 configuration object 입니다.                                                                                                                                                                                                                                                                      |
| params[0]            | string            | required | 구독할 프로그램의 Pubkey (base-58 인코딩된 문자열)입니다.                                                                                                                                                                                                                                                                                                             |
| params[1].commitment | string            | optional | 블록 확정 정도를 지정합니다. <br />- `finalized`: 클러스터의 과반수가 최대 lockout에 도달하여 확정된 가장 최근 블록을 조회합니다. 클러스터가 이 블록을 최종 확정으로 인식합니다. <br />- `confirmed`: 클러스터의 과반수가 투표한 가장 최근 블록을 조회합니다. <br />- `processed`: 노드의 가장 최근 블록을 조회합니다. 이 블록은 여전히 클러스터에 의해 건너뛸 수 있습니다. |
| params[1].filters    | array             | optional | 결과를 필터링하기 위한 다양한 필터 객체 배열입니다. 반모든 필터 조건을 만족하는 계정만 결과에 포함됩니다.                                                                                                                                                                                                                                                             |
| params[1].encoding   | string            | optional | 계정 데이터 인코딩 방식. <br />- `base58` (느림) <br />- `base64` <br />- `base64+zstd` <br />- `jsonParsed` (가능한 경우 parser 적용, 그렇지 않으면 바이너리 문자열 반환)                                                                                                                                                                                                    |

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

성공적으로 구독이 생성되면 subscription ID가 반환됩니다.

```json Response example
{
  "jsonrpc": "2.0",
  "result": 24040,
  "id": 1
}
```

이 subscription ID는 programUnsubscribe 메서드 호출 시 필요합니다.

### Notifications

구독이 활성화되면, 프로그램이 소유한 계정의 상태가 변경될 때마다 서버에서 알림을 푸시합니다.
알림 형식은 getProgramAccounts RPC HTTP 메서드와 동일합니다.

**응답 데이터 형식:**

- 응답 데이터는 encoding 옵션에 따라 base58, base64, base64+zstd, jsonParsed 중 하나로 전달됩니다.
- jsonParsed는 프로그램별 parser를 통해 사람이 읽기 쉬운 형태로 변환하지만, parser가 없는 경우 바이너리 문자열로 반환됩니다.

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

- 최초 응답: subscription ID 반환
- 이후: 프로그램이 소유한 계정 변경 발생 시 "programNotification" 이벤트 수신

### Unsubscribe

구독을 해제하는 방법은 두 가지가 있습니다:

1. **연결 종료**: 터미널 창에서 `CTRL+C`를 입력하여 WebSocket 연결을 종료하면 모든 구독이 자동으로 해제됩니다.

2. **특정 구독 해제**: programUnsubscribe를 사용하여 연결을 유지한 채 특정 구독만 해제할 수 있습니다.

구독 해제 요청:

```json unsubscribe example
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "programUnsubscribe",
  "params": [24040]
}
```

구독 해제 후 응답:

```json unsubscribe success
{
  "jsonrpc": "2.0",
  "result": true,
  "id": 2
}
```
