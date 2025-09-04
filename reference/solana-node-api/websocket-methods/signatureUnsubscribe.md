# signatureUnsubscribe

Solana의 `signatureUnsubscribe` 메서드는 `signatureSubscribe`로 생성된 서명 구독을 해제하여 더 이상 트랜잭션 서명 알림을 받지 않도록 합니다.

> 📘 사용 시 참고사항
>
> - 반드시 **WebSocket** 엔드포인트를 통해 호출해야 하며, HTTP는 지원되지 않습니다.
> - 구독 해제 후에는 해당 subscription ID로 다시 구독할 수 없습니다. 새로운 구독이 필요한 경우 `signatureSubscribe`를 다시 호출해야 합니다.
> - WebSocket 연결이 끊어지면 구독이 자동으로 해제되므로, 재연결 시 구독을 다시 설정해야 합니다.
> - `signatureSubscribe`는 단일 알림 구독이므로, 알림을 받은 후 자동으로 구독이 취소됩니다.

---

## 1. Request

### Parameters

서명 구독 해제 요청은 아래의 파라미터를 가집니다.

| Parameter | Type              | Required | Description                                                         |
| --------- | ----------------- | -------- | ------------------------------------------------------------------- |
| id        | integer or string | required | 요청 고유 식별자. 클라이언트가 요청과 응답을 매칭하는데 사용됩니다. |
| jsonrpc   | string            | required | JSON-RPC 프로토콜 버전. 항상 "2.0"을 입력합니다.                    |
| method    | string            | required | 실행할 메서드 이름. 여기서는 "signatureUnsubscribe"를 입력합니다.   |
| params    | array             | required | 해제할 구독의 subscription ID를 포함하는 배열입니다.                |

### Example

```json signatureUnsubscribe example
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "signatureUnsubscribe",
  "params": [24006]
}
```

---

## 2. Response

### Success Response

성공적으로 구독이 해제되면 `true`가 반환됩니다.

```json Response example
{
  "jsonrpc": "2.0",
  "result": true,
  "id": 1
}
```

### Error Response

구독 해제에 실패한 경우 에러가 반환됩니다.

```json Error example
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32000,
    "message": "Invalid subscription ID"
  },
  "id": 1
}
```

---

## 3. How to Use

### Connect to WebSocket Channel

```sh wscat
wscat -c wss://api.mainnet-beta.solana.com
```

### Subscribe to Signature (First)

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

### Receive Subscription ID

```json subscription response
{
  "jsonrpc": "2.0",
  "result": 24006,
  "id": 1
}
```

### Unsubscribe

구독을 해제하는 방법은 두 가지가 있습니다:

1. **연결 종료**: 터미널 창에서 `<CTRL+C>`를 입력하여 WebSocket 연결을 종료하면 모든 구독이 자동으로 해제됩니다.

2. **특정 구독 해제**: `signatureUnsubscribe`를 사용하여 연결을 유지한 채 특정 구독만 해제할 수 있습니다.

```json unsubscribe example
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "signatureUnsubscribe",
  "params": [24006]
}
```

### Confirm Unsubscribe

```json unsubscribe success
{
  "jsonrpc": "2.0",
  "result": true,
  "id": 2
}
```
