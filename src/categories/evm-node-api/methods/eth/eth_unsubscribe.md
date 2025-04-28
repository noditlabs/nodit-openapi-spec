이 API를 사용하여 특정 구독을 해지할 수 있습니다.

## 1.Request Parameters

| Parameter | Type              | Required | Description                                                                                                                                   |
| --------- | ----------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| id        | integer or string | required | 각 요청에 대한 고유 식별자입니다. 클라이언트가 요청과 서버의 응답이 일치하도록 매칭하는 데 사용됩니다. 일반적으로 숫자나 문자열로 표현됩니다. |
| jsonrpc   | string            | required | JSON-RPC 프로토콜의 버전을 나타냅니다. 해당 네트워크에서 사용되는 버전은 "2.0"이므로 항상 이 값을 사용합니다.                                 |
| method    | string            | required | 실행하고자 하는 특정 JSON-RPC 메서드 이름을 지정합니다. 여기서는 "eth_subscribe"를 입력합니다.                                                |
| params    | array             | required | 실행에 필요한 인자를 배열 형태로 전달합니다. "eth_unsubscribe"에서는 subscription_id를 인자로 입력합니다.                                     |

params에 전달되는 구독 타입에 따라 전달되는 인자가 다릅니다. 아래는 구독 타입에 따라 전달되는 인자들에 대한 설명입니다.

| Argument        | Type   | Required | Description                               |
| --------------- | ------ | -------- | ----------------------------------------- |
| subscription_id | string | required | 구독 해제할 subscription ID를 지정합니다. |

```json unsubscribe request parameter example
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "eth_unsubscribe",
  "params": ["0x52f404d003f4a461c8aa72f27062b4bc"]
}
```

## 2. Response

위의 파라미터를 통해 정상적인 응답을 받은 경우, 아래와 같은 형태의 응답을 반환합니다.

```json unsubscribe successful response example
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": true
}
```

## 3. How to use

이 API는 WebSocket기반 API로, WebSocket 통신을 위한 도구를 사용하여 구독할 수 있습니다.
이 예제에서 사용된 WebSocket 클라이언트 도구로 wscat을 사용했으며, WebSocket 서버에 쉽게 연결하여 데이터를 송수신할 수 있게 해줍니다.

### 3.1. Connect to Websocket channel

터미널 창을 열어 아래의 커맨드를 입력합니다.
이 때, 구독하고자 하는 프로토콜과 네트워크를 지정하고, 콘솔에서 생성한 프로젝트의 API를 입력해야 합니다.

```sh wscat
# Set protocol, network and your api key in the URL to connect (e.g., wss://ethereum-mainnet.nodit.io/FwG...)
wscat -c wss://{protocol}-{network}.nodit.io/{your_api_key}
```

### 3.2. Subscribe a specific event

Websocket 연결이 완료되었다면, 아래의 예시 중 원하는 이벤트를 구독합니다.

```json newHeads
{ "jsonrpc": "2.0", "id": 1, "method": "eth_subscribe", "params": ["newHeads"] }
```
```json logs
{"jsonrpc":"2.0", "id": 1, "method": "eth_subscribe", "params": ["logs", {"address": "0xdAC17F958D2ee523a2206206994597C13D831ec7", "topics":["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"]}]}
```
```json newPendingTransactions
{"jsonrpc":"2.0", "id": 1, "method": "eth_subscribe", "params": ["newPendingTransactions", true]}
```

### 3.3. Listen subscription

가장 첫 응답에는 subscription ID를 반환합니다.

```json first response example
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0xb273410795d4411d707f272834cdd60e"
}
```

그 이후부터는 이벤트가 발생할 때마다 구독타입에 맞는 결과를 반환합니다.

```json event response example
{
  "jsonrpc": "2.0",
  "method": "eth_subscription",
  "params": {
    "subscription": "0xb273410795d4411d707f272834cdd60e",
    "result": {
        # ...
    }
  }
}
```

### 3.4. Unsubscribe

터미널 창에서 <CTRL+C> 를 입력하여 연결을 종료하면, 구독이 해제됩니다.
혹은 eth_subscribe 를 사용하여, 연결을 유지한채 구독을 해제할 수 있습니다. 아래의 예시와 같이 채널에 연결된 subscription ID를 params에 입력하여 전송하면 해당 구독이 해제됩니다.

```json unsubscribe example
{"jsonrpc":"2.0", "id": 1, "method": "eth_unsubscribe", "params": ["0x540e1706d67fd05fc8f3318dc7e86fc7"]}
```

만약 정상적으로 구독 해제되었다면 아래의 응답을 받을 수 있습니다.

```json unsubscribe successful response example
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": true
}
```
