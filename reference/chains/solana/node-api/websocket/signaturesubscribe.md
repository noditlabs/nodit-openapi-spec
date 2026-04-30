# signatureSubscribe

Solana의 signatureSubscribe 메서드는 특정 트랜잭션 서명이 지정된 commitment 레벨에 도달했을 때 알림을 받을 수 있도록 구독을 생성합니다.

> 📘 사용 시 참고사항
>
> - 반드시 **WebSocket** 엔드포인트를 통해 호출해야 하며, HTTP는 지원되지 않습니다.
> - 이는 **단일 알림 구독**입니다. 서버가 signatureNotification을 전송한 후 자동으로 구독이 취소됩니다.
> - CU는 구독한 데이터의 양에 따라 소진되므로, 필요한 데이터만을 구독할 수 있도록 적절한 필터링 옵션 사용을 권장합니다.

---

## 1. Request

### Parameters

서명 구독 요청은 아래의 파라미터를 가집니다.

| Parameter                            | Type              | Required | Description                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------------------ | ----------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                                   | integer or string | required | 요청 고유 식별자. 클라이언트가 요청과 응답을 매칭하는데 사용됩니다.                                                                                                                                                                                                                                                                                                   |
| jsonrpc                              | string            | required | JSON-RPC 프로토콜 버전. 항상 "2.0"을 입력합니다.                                                                                                                                                                                                                                                                                                                      |
| method                               | string            | required | 실행할 메서드 이름. 여기서는 "signatureSubscribe"를 입력합니다.                                                                                                                                                                                                                                                                                                       |
| params                               | array             | required | 구독할 서명 정보 및 옵션. 첫 번째 요소는 트랜잭션 서명, 두 번째는 configuration object 입니다.                                                                                                                                                                                                                                                                        |
| params[0]                            | string            | required | 구독할 트랜잭션 서명 (base-58 인코딩된 문자열). 트랜잭션의 첫 번째 서명이어야 합니다.                                                                                                                                                                                                                                                                                 |
| params[1].commitment                 | string            | optional | 블록 확정 정도를 지정합니다. <br>- `finalized`: 클러스터의 과반수가 최대 lockout에 도달하여 확정된 가장 최근 블록을 조회합니다. 클러스터가 이 블록을 최종 확정으로 인식합니다. <br>- `confirmed`: 클러스터의 과반수가 투표한 가장 최근 블록을 조회합니다. <br>- `processed`: 노드의 가장 최근 블록을 조회합니다. 이 블록은 여전히 클러스터에 의해 건너뛸 수 있습니다. |
| params[1].enableReceivedNotification | boolean           | optional | 서명이 RPC에 수신되었을 때도 알림을 받을지 여부를 지정합니다. `true`인 경우 수신 시와 처리 완료 시 모두 알림을 받습니다.                                                                                                                                                                                                                                              |

### Example

```json signatureSubscribe example
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "signatureSubscribe",
  "params": [
    "2EBVM6cB8vAAD93Ktr6Vd8p67XPbQzCJX47MpReuiCXJAtcjaxpvWpcg9Ege1Nr5Tk3a2GFrByT7WPBjdsTycY9b",
    {
      "commitment": "finalized",
      "enableReceivedNotification": false
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
  "result": 0,
  "id": 1
}
```

이 subscription ID는 signatureUnsubscribe 메서드 호출 시 필요합니다.

### Notifications

구독이 활성화되면, 트랜잭션이 지정된 commitment 레벨에 도달했을 때 서버에서 알림을 푸시합니다.

**알림 형식:**

| 필드  | 타입             | 설명                       |
| ----- | ---------------- | -------------------------- |
| slot  | u64              | 해당 슬롯 번호             |
| value | object \| string | RpcSignatureResult 알림 값 |

**value 필드 상세:**

- **서명 수신 알림** (enableReceivedNotification이 true이고 서명이 수신된 경우):

  - 타입: `string`
  - 값: `"receivedSignature"`
  - 설명: 서명이 RPC에 수신되었음을 나타냄

- **트랜잭션 처리 완료 알림** (서명이 처리된 경우):
  - 타입: `object`
  - 값: { "err": null } (성공) 또는 { "err": TransactionError } (실패)
  - 설명: 트랜잭션이 지정된 commitment 레벨에서 처리됨

#### Examples

```json Successful Transaction Example
{
  "jsonrpc": "2.0",
  "method": "signatureNotification",
  "params": {
    "result": {
      "context": {
        "slot": 5207624
      },
      "value": {
        "err": null
      }
    },
    "subscription": 24006
  }
}
```

```json Received Signature Example
{
  "jsonrpc": "2.0",
  "method": "signatureNotification",
  "params": {
    "result": {
      "context": {
        "slot": 5207624
      },
      "value": "receivedSignature"
    },
    "subscription": 24006
  }
}
```

---

## 3. How to Use

### Connect to WebSocket Channel

```sh wscat
wscat -c wss://api.mainnet-beta.solana.com
```

### Subscribe to Signature

```json subscribe example
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "signatureSubscribe",
  "params": [
    "2EBVM6cB8vAAD93Ktr6Vd8p67XPbQzCJX47MpReuiCXJAtcjaxpvWpcg9Ege1Nr5Tk3a2GFrByT7WPBjdsTycY9b",
    {
      "commitment": "finalized",
      "enableReceivedNotification": false
    }
  ]
}
```

### Receive Notification

- 최초 응답: subscription ID 반환
- 이후: 조건에 맞는 트랜잭션이 지정된 commitment 레벨에 도달하면 서버에서 자동으로 알림 전송되며 알림 수신 후 구독은 자동으로 해제됨 (단일 알림 구독)

### Unsubscribe

구독을 해제하는 방법은 두 가지가 있습니다:

1. **연결 종료**: 터미널 창에서 `CTRL+C`를 입력하여 WebSocket 연결을 종료하면 모든 구독이 자동으로 해제됩니다.

2. **특정 구독 해제**: signatureUnsubscribe를 사용하여 연결을 유지한 채 특정 구독만 해제할 수 있습니다.

구독 해제 요청:

```json unsubscribe example
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "signatureUnsubscribe",
  "params": [10]
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
