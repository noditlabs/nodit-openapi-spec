# logsSubscribe

Solana의 `logsSubscribe` 메서드는 특정 조건에 맞는 트랜잭션 로그를 실시간으로 구독하여 수신할 수 있도록 합니다.

> 📘 사용 시 참고사항
>
> - 반드시 **WebSocket** 엔드포인트를 통해 호출해야 하며, HTTP는 지원되지 않습니다.
> - WebSocket 연결이 끊어지면 구독도 자동으로 해제됩니다. 재연결 시 다시 구독을 요청해야 합니다.
> - CU는 구독한 데이터의 양에 따라 소진되므로, 필요한 데이터만을 구독할 수 있도록 적절한 필터링 옵션 사용을 권장합니다.

---

## 1. Request

### Parameters

로그 구독 요청은 아래의 파라미터를 가집니다.

| Parameter            | Type              | Required | Description                                                                                                                                                                                                                                                                                                                                                           |
| -------------------- | ----------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                   | integer or string | required | 요청 고유 식별자. 클라이언트가 요청과 응답을 매칭하는데 사용됩니다.                                                                                                                                                                                                                                                                                                   |
| jsonrpc              | string            | required | JSON-RPC 프로토콜 버전. 항상 "2.0"을 입력합니다.                                                                                                                                                                                                                                                                                                                      |
| method               | string            | required | 실행할 메서드 이름. 여기서는 "logsSubscribe"를 입력합니다.                                                                                                                                                                                                                                                                                                            |
| params               | array             | required | 구독할 로그 필터 및 옵션. 첫 번째 요소는 필터 조건, 두 번째는 configuration object 입니다.                                                                                                                                                                                                                                                                            |
| params[0]            | string or object  | required | 로그 필터 조건. <br>- `"all"`: 단순 투표 트랜잭션을 제외한 모든 트랜잭션 구독 <br>- `"allWithVotes"`: 단순 투표 트랜잭션을 포함한 모든 트랜잭션 구독 <br>- `{ "mentions": ["주소"] }`: 특정 주소가 언급된 트랜잭션만 구독 (현재 하나의 주소만 지원하며, 여러 주소를 입력하면 에러가 발생합니다.)                                                                      |
| params[1].commitment | string            | optional | 블록 확정 정도를 지정합니다. <br>- `finalized`: 클러스터의 과반수가 최대 lockout에 도달하여 확정된 가장 최근 블록을 조회합니다. 클러스터가 이 블록을 최종 확정으로 인식합니다. <br>- `confirmed`: 클러스터의 과반수가 투표한 가장 최근 블록을 조회합니다. <br>- `processed`: 노드의 가장 최근 블록을 조회합니다. 이 블록은 여전히 클러스터에 의해 건너뛸 수 있습니다. |

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

성공적으로 구독이 생성되면 subscription ID가 반환됩니다.

```json Response example
{
  "jsonrpc": "2.0",
  "result": 24040,
  "id": 1
}
```

이 subscription ID는 `logsUnsubscribe` 메서드 호출 시 필요합니다.

### Notifications

구독이 활성화되면, 조건에 맞는 트랜잭션이 발생할 때마다 서버에서 알림을 푸시합니다.

**응답 데이터 형식:**

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

- 최초 응답: subscription ID 반환
- 이후: 조건에 맞는 트랜잭션 발생 시 "logsNotification" 이벤트 수신

### Unsubscribe

구독을 해제하는 방법은 두 가지가 있습니다:

1. **연결 종료**: 터미널 창에서 `<CTRL+C>`를 입력하여 WebSocket 연결을 종료하면 모든 구독이 자동으로 해제됩니다.

2. **특정 구독 해제**: `logsUnsubscribe`를 사용하여 연결을 유지한 채 특정 구독만 해제할 수 있습니다.

구독 해제 요청:

```json unsubscribe example
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "logsUnsubscribe",
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
