# slotSubscribe

Solana의 slotSubscribe 메서드는 검증자가 슬롯을 처리할 때마다 실시간 알림을 받을 수 있도록 구독을 생성합니다.

> 📘 사용 시 참고사항
>
> - 반드시 **WebSocket** 엔드포인트를 통해 호출해야 하며, HTTP는 지원되지 않습니다.
> - WebSocket 연결이 끊어지면 구독도 자동으로 해제됩니다. 재연결 시 다시 구독을 요청해야 합니다.
> - 이 구독은 검증자가 슬롯을 처리할 때마다 알림을 받으므로, 매우 빈번한 알림이 발생할 수 있습니다.
> - CU는 구독한 데이터의 양에 따라 소진되므로, 필요한 데이터만을 구독할 수 있도록 적절한 필터링 옵션 사용을 권장합니다.

---

## 1. Request

### Parameters

슬롯 구독 요청은 아래의 파라미터를 가집니다.

| Parameter | Type              | Required | Description                                                            |
| --------- | ----------------- | -------- | ---------------------------------------------------------------------- |
| id        | integer or string | required | 요청 고유 식별자. 클라이언트가 요청과 응답을 매칭하는데 사용됩니다.    |
| jsonrpc   | string            | required | JSON-RPC 프로토콜 버전. 항상 "2.0"을 입력합니다.                       |
| method    | string            | required | 실행할 메서드 이름. 여기서는 "slotSubscribe"를 입력합니다.             |
| params    | array             | required | 슬롯 구독에는 추가 파라미터가 필요하지 않습니다. 빈 배열을 사용합니다. |

### Example

```json slotSubscribe example
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "slotSubscribe",
  "params": []
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

이 subscription ID는 `slotUnsubscribe` 메서드 호출 시 필요합니다.

### Notifications

구독이 활성화되면, 검증자가 슬롯을 처리할 때마다 서버에서 알림을 푸시합니다.

**알림 형식:**

| 필드   | 타입 | 설명                |
| ------ | ---- | ------------------- |
| parent | u64  | 부모 슬롯 번호      |
| root   | u64  | 현재 루트 슬롯 번호 |
| slot   | u64  | 새로 설정된 슬롯 값 |

#### Slot Notification Example

```json slotNotification example
{
  "jsonrpc": "2.0",
  "method": "slotNotification",
  "params": {
    "result": {
      "parent": 75,
      "root": 44,
      "slot": 76
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

### Subscribe to Slots

```json subscribe example
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "slotSubscribe",
  "params": []
}
```

### Receive Notifications

- 최초 응답: subscription ID 반환
- 이후: 검증자가 슬롯을 처리할 때마다 "slotNotification" 이벤트 수신

### Unsubscribe

구독을 해제하는 방법은 두 가지가 있습니다:

1. **연결 종료**: 터미널 창에서 <CTRL+C>를 입력하여 WebSocket 연결을 종료하면 모든 구독이 자동으로 해제됩니다.

2. **특정 구독 해제**: slotUnsubscribe를 사용하여 연결을 유지한 채 특정 구독만 해제할 수 있습니다.

구독 해제 요청:

```json unsubscribe example
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "slotUnsubscribe",
  "params": [0]
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
