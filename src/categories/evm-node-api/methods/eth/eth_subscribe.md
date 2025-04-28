이 API를 사용하여 특정 이벤트(newHeads, logs, newPendingTransactions)에 대한 구독을 생성할 수 있습니다.

> 📘 사용 시 참고사항
>
> - 연결할 때 반드시 wss endpoint를 사용해야 하며, https는 지원되지 않습니다.
> - WebSocket 연결이 끊기면 자동으로 구독이 해지될 수 있습니다. 연결이 끊긴 경우, 다시 구독을 요청하여 연결해야 합니다.
> - CU는 구독한 데이터의 양에 따라 소진되므로, 필요한 데이터만을 구독할 수 있도록 적절한 필터링 옵션 사용을 권장합니다.

## 1.Request Parameters

모든 구독 요청은 아래의 공통 파라미터를 가집니다.

| Parameter | Type              | Required | Description                                                                                                                                                                                         |
| --------- | ----------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id        | integer or string | required | 각 요청에 대한 고유 식별자입니다. 클라이언트가 요청과 서버의 응답이 일치하도록 매칭하는 데 사용됩니다. 일반적으로 숫자나 문자열로 표현됩니다.                                                       |
| jsonrpc   | string            | required | JSON-RPC 프로토콜의 버전을 나타냅니다. 해당 네트워크에서 사용되는 버전은 "2.0"이므로 항상 이 값을 사용합니다.                                                                                       |
| method    | string            | required | 실행하고자 하는 특정 JSON-RPC 메서드 이름을 지정합니다. 여기서는 "eth_subscribe"를 입력합니다.                                                                                                      |
| params    | array             | required | 실행에 필요한 인자를 배열 형태로 전달합니다. "eth_subscribe"에서는 newHeads, logs, 그리고 newPendingTransactions 중 하나의 구독 타입을 입력하고, 각 구독 타입에 따라 필요한 정보를 함께 입력합니다. |

params에 전달되는 구독 타입에 따라 전달되는 인자가 다릅니다. 아래는 구독 타입에 따라 전달되는 인자들에 대한 설명입니다.

### Subscription Type

#### `newHeads`

이 이벤트를 구독하면 새로운 블록이 생성될 때마다 해당 블록의 헤더 정보가 실시간으로 전송됩니다.
아래표는 params 배열 안에 입력해야하는 인자에 대한 상세 정보를 나타냅니다.

| Argument          | Type   | Required | Description                                                        |
| ----------------- | ------ | -------- | ------------------------------------------------------------------ |
| subscription_type | string | required | 구독할 이벤트 타입을 지정합니다. 여기서는 "newHeads"를 입력합니다. |

```json newHeads example
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "eth_subscribe",
  "params": ["newHeads"]
}
```

#### `logs`

이 이벤트를 구독하면 특정 로그가 발생할 때마다 정보가 실시간으로 전송됩니다. 사용자는 address와 topics 필드를 이용해 특정 스마트 계약 주소와 관련된 이벤트를 필터링할 수 있습니다. 예를 들어, ERC-20 또는 ERC-721 토큰 전송과 같은 이벤트에 대한 로그를 구독할 수 있습니다. 빈 필터링 옵션을 입력할 경우 모든 로그가 반환되므로, 반드시 필요한 필터링 옵션을 지정하는 것이 권장됩니다.
아래표는 params 배열 안에 입력해야하는 인자에 대한 상세 정보를 나타냅니다.

| Argument                 | Type   | Required | Description                                                                                                                                                                     |
| ------------------------ | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| subscription_type        | string | required | 구독할 이벤트 타입을 지정합니다. 여기서는 "logs"를 입력합니다.                                                                                                                  |
| filtering_option         | object | required | 로그를 필터링할 옵션(address, topics)을 지정합니다. 만약 빈 객체를 입력한다면, 발생하는 모든 로그를 반환합니다. 사용 목적에 따라 원하는 필터링 옵션을 지정하는 것을 권장합니다. |
| filtering_option.address | string | optional | 특정 주소를 필터링합니다.                                                                                                                                                       |
| filtering_option.topics  | array  | optional | 필터링할 토픽을 배열의 형태로 입력합니다.                                                                                                                                       |

```json logs example
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "eth_subscribe",
  "params": [
    "logs",
    {
      "address": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      "topics": [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
      ]
    }
  ]
}
```

#### `newPendingTransactions`

이 이벤트를 구독하면 새로운 트랜잭션이 네트워크에 제출 되었을 때, 해당 트랜잭션의 정보를 실시간으로 전송됩니다.
아래표는 params 배열 안에 입력해야하는 인자에 대한 상세 정보를 나타냅니다.

| Argument          | Type    | Required | Description                                                                                                                                                                            |
| ----------------- | ------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| subscription_type | string  | required | 구독할 이벤트 타입을 지정합니다. 여기서는 "newPendingTransactions"를 입력합니다.                                                                                                       |
| flag              | boolean | optional | 트랜잭션 데이터의 포함 여부를 지정합니다. true면 전체 트랜잭션 데이터를 반환하며, false면 트랜잭션 해시만 반환합니다. 지정하지 않는 경우, false로 설정되어 트랜잭션 해시만 반환합니다. |

```json newPendingTransactions
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "eth_subscribe",
  "params": ["newPendingTransactions", true]
}
```

## 2. Response

위의 파라미터들을 이용하여 구독을 생성하면, 이벤트가 발생할 때마다 아래와 같은 응답을 얻을 수 있습니다.

```json newHeads
{
  "jsonrpc": "2.0",
  "method": "eth_subscription",
  "params": {
    "subscription": "0x71bf7fd5f1d909400aefbd04c96474e8",
    "result": {
      "parentHash": "0xef887cc02d9dcc195319201e78a5bf136ed68df16e30c6fe08e21a7d123b3612",
      "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
      "miner": "0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5",
      "stateRoot": "0x401c9af726edb8cc0c96ccfe6fc8cd016fc2e1e4e1ebf90f52a9560d416e78b9",
      "transactionsRoot": "0x11747f43d21022eec362e8ca7b055b4e4417abb6ed12fbd2baae7817b407e614",
      "receiptsRoot": "0xa467e9c0ac6530a0f33c60bd0e799295811da732708cc338a00dcee9ab8794f0",
      "logsBloom": "0x11ad946a2ac00d44ed08ac72e8327009994f3884e471e1410269a2225ca342808053042d80484a9037426401842e07a44220a54a8a0263627091a48073363858040da08c00d80ca909a14189c24c90a481118db114e6188c983407c086e49204140b561783700160690dd010b148aff3a2290ca9a2026443b055609d30081238441a50080c10d1e8c0c56a5e92200300520909355558076c8f22246d6836516023c51862216430102e8075c0aac1133a005bc486f42230443d71406695aa4478a99281e2901e0a003160c2a5147bc8a04830ab0a421808740781538e50d6607a217aa015a10204b98a4c279842201124c1add048182c80c64002ac56d8a2540f",
      "difficulty": "0x0",
      "number": "0x13c5e89",
      "gasLimit": "0x1c9c380",
      "gasUsed": "0x8b58db",
      "timestamp": "0x66e2b143",
      "extraData": "0x6265617665726275696c642e6f7267",
      "mixHash": "0xd03523217638366b0bd1111d29108f0fc3789ab21e6a9e7afe4ab568f3b98a64",
      "nonce": "0x0000000000000000",
      "baseFeePerGas": "0x828e8440",
      "withdrawalsRoot": "0x5584306249ecc33fa9c0b1804b461ec16abcb305d646fcba128bca75e1700f4a",
      "blobGasUsed": "0x0",
      "excessBlobGas": "0xe0000",
      "parentBeaconBlockRoot": "0x9814d97d13152344553575788f0c6853c7d23f8c521201793257bb7c0c14fe59",
      "hash": "0x9f30ee57944013169c179c9c954aaf60a8bf785b166cc49f58dcc5ce28ecae96"
    }
  }
}
```

```json logs
{
  "jsonrpc": "2.0",
  "method": "eth_subscription",
  "params": {
    "subscription": "0x3b7f71db357fe4e9edd8f2e6ec6b24a6",
    "result": {
      "address": "0xdac17f958d2ee523a2206206994597c13d831ec7",
      "topics": [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x0000000000000000000000003ef97e73d4b8e06535e24aab125077d16462318b",
        "0x0000000000000000000000004af688bb824d12cff5c339abf3010ce7806afcd0"
      ],
      "data": "0x00000000000000000000000000000000000000000000000000000002540be400",
      "blockNumber": "0x13c5e92",
      "transactionHash": "0x283b803e4ed34b03674d04ed71b48d6879034ebfa564acccb8b7b48715d25e0d",
      "transactionIndex": "0x1",
      "blockHash": "0x492384316ea319b4f929306492746155d011f08a3b173e6e4eee9e82faeef207",
      "logIndex": "0x0",
      "removed": false
    }
  }
}
```

```json newPendingTransactions
{
  "jsonrpc": "2.0",
  "method": "eth_subscription",
  "params": {
    "subscription": "0x7f708f4295996c21dbf16e6fcdd8c9e3",
    "result": {
      "blockHash": null,
      "blockNumber": null,
      "from": "0x194981ee45d9ead1f67e7b2299153f0cf06ed542",
      "gas": "0x1061f",
      "gasPrice": "0xb2d05e00",
      "hash": "0x410d09342c540808a1a10eabebc6189b6786fad04c3ac88b7098243b0112d6e1",
      "input": "0xa9059cbb00000000000000000000000046e0e692e8cf2aecb75cdece4be2e110a82069b000000000000000000000000000000000000000000000000009f593793582b31c",
      "nonce": "0x8",
      "to": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      "transactionIndex": null,
      "value": "0x0",
      "type": "0x0",
      "chainId": "0x1",
      "v": "0x25",
      "r": "0xa0fbb1a0613b7e07b49b1e6585f75a0d92df71ee8482551a5d9dfbd82011a1eb",
      "s": "0x1271bfa29a4306b02d8d4c09dc467c540d5837110d8f43b3fd52bfed09351b59"
    }
  }
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
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "eth_subscribe",
  "params": [
    "logs",
    {
      "address": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      "topics": [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
      ]
    }
  ]
}
```

```json newPendingTransactions
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "eth_subscribe",
  "params": ["newPendingTransactions", true]
}
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
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "eth_unsubscribe",
  "params": ["0x540e1706d67fd05fc8f3318dc7e86fc7"]
}
```

만약 정상적으로 구독 해제되었다면 아래의 응답을 받을 수 있습니다.

```json unsubscribe successful response example
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": true
}
```
