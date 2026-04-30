# slotsUpdatesSubscribe

Solana의 slotsUpdatesSubscribe 메서드는 검증자가 각 슬롯에서 발생하는 다양한 업데이트에 대한 실시간 알림을 받을 수 있도록 구독을 생성합니다.

> 📘 사용 시 참고사항
>
> - 반드시 **WebSocket** 엔드포인트를 통해 호출해야 하며, HTTP는 지원되지 않습니다.
> - WebSocket 연결이 끊어지면 구독도 자동으로 해제됩니다. 재연결 시 다시 구독을 요청해야 합니다.
> - CU는 구독한 데이터의 양에 따라 소진되므로, 필요한 데이터만을 구독할 수 있도록 적절한 필터링 옵션 사용을 권장합니다.

> ⚠️ 이 구독은 안정적이지 않을 수 있습니다.
>
> - 이 구독은 각 슬롯에서 발생하는 다양한 업데이트를 받으므로, 매우 빈번한 알림이 발생할 수 있습니다.
> - 구독 형식이 향후 변경될 수 있으며, 항상 지원되지 않을 수 있습니다.

---

## 1. Request

### Parameters

슬롯 업데이트 구독 요청은 아래의 파라미터를 가집니다.

| Parameter | Type              | Required | Description                                                                     |
| --------- | ----------------- | -------- | ------------------------------------------------------------------------------- |
| id        | integer or string | required | 요청 고유 식별자. 클라이언트가 요청과 응답을 매칭하는데 사용됩니다.             |
| jsonrpc   | string            | required | JSON-RPC 프로토콜 버전. 항상 "2.0"을 입력합니다.                                |
| method    | string            | required | 실행할 메서드 이름. 여기서는 "slotsUpdatesSubscribe"를 입력합니다.              |
| params    | array             | required | 슬롯 업데이트 구독에는 추가 파라미터가 필요하지 않습니다. 빈 배열을 사용합니다. |

### Example

```json slotsUpdatesSubscribe example
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "slotsUpdatesSubscribe",
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

이 subscription ID는 slotsUpdatesUnsubscribe 메서드 호출 시 필요합니다.

### Notifications

구독이 활성화되면, 검증자가 슬롯 업데이트를 처리할 때마다 서버에서 알림을 푸시합니다.

**알림 형식:**

| 필드                            | 타입                | 설명                                                                                                                                                                  |
| ------------------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| err                             | string \| undefined | 에러 메시지. 업데이트 타입이 "dead"인 경우에만 존재합니다.                                                                                                            |
| parent                          | u64 \| undefined    | 부모 슬롯. 업데이트 타입이 "createdBank"인 경우에만 존재합니다.                                                                                                       |
| slot                            | u64                 | 새로 업데이트된 슬롯 번호.                                                                                                                                            |
| stats                           | object \| undefined | 통계 정보. 업데이트 타입이 "frozen"인 경우에만 존재합니다.                                                                                                            |
| stats.maxTransactionsPerEntry   | u64 \| undefined    | 엔트리당 최대 트랜잭션 수.                                                                                                                                            |
| stats.numFailedTransactions     | u64 \| undefined    | 실패한 트랜잭션 수.                                                                                                                                                   |
| stats.numSuccessfulTransactions | u64 \| undefined    | 성공한 트랜잭션 수.                                                                                                                                                   |
| stats.numTransactionEntries     | u64 \| undefined    | 트랜잭션 엔트리 수.                                                                                                                                                   |
| timestamp                       | i64                 | 업데이트의 Unix 타임스탬프                                                                                                                                            |
| type                            | string              | 업데이트 타입. <br>다음 중 하나의 값을 반환합니다: `"firstShredReceived"`, `"completed"`, `"createdBank"`, `"frozen"`, `"dead"`, `"optimisticConfirmation"`, `"root"` |

#### Slots Updates Notification Example

```json slotsUpdatesNotification example
{
  "jsonrpc": "2.0",
  "method": "slotsUpdatesNotification",
  "params": {
    "result": {
      "parent": 75,
      "slot": 76,
      "timestamp": 1625081266243,
      "type": "optimisticConfirmation"
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

### Subscribe to Slots Updates

```json subscribe example
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "slotsUpdatesSubscribe",
  "params": []
}
```

### Receive Notifications

- 최초 응답: subscription ID 반환
- 이후: 슬롯 업데이트 발생 시 "slotsUpdatesNotification" 이벤트 수신

### Unsubscribe

구독을 해제하는 방법은 두 가지가 있습니다:

1. **연결 종료**: 터미널 창에서 `CTRL+C`를 입력하여 WebSocket 연결을 종료하면 모든 구독이 자동으로 해제됩니다.

2. **특정 구독 해제**: slotsUpdatesUnsubscribe를 사용하여 연결을 유지한 채 특정 구독만 해제할 수 있습니다.

구독 해제 요청:

```json unsubscribe example
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "slotsUpdatesUnsubscribe",
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
