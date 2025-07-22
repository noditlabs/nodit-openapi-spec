import { OpenAPIV3 } from "openapi-types";

export const Block: OpenAPIV3.SchemaObject = {
  type: "object",
  required: [
    "hash",
    "height",
    "timestamp",
    "firstVersion",
    "lastVersion",
    "transactionsCount",
    "transactions",
  ],
  properties: {
    hash: {
      type: "string",
      description: `블록의 고유 식별 해시값을 나타내는 필드입니다.

해당 블록의 모든 데이터를 포함하여 계산된 암호학적 해시값으로, 0x로 시작하는 64자리 16진수 문자열 형태로 제공됩니다.
블록의 무결성을 검증하고 블록을 고유하게 식별하는 데 사용됩니다.`,
      example:
        "0xfaed12ecb5ac7b0bc87508d4a0bb562523b599e5ffd4719e159087985b184042",
    },
    height: {
      type: "integer",
      description: `블록의 높이를 나타내는 필드입니다.

제네시스 블록(0)부터 시작하여 순차적으로 증가하는 정수값으로, 블록체인의 길이와 특정 블록의 위치를 나타내는 지표로 사용됩니다.
블록 높이는 체인 내에서 블록의 상대적 위치를 식별하고 블록 순서를 결정하는 데 사용됩니다.`,
      example: 160155267,
    },
    timestamp: {
      type: "integer",
      description: `블록이 생성된 시간을 나타내는 필드입니다.

마이크로초(microseconds) 단위의 UNIX 타임스탬프로 제공되며, 블록의 생성 순서와 시간 추적에 사용됩니다.
블록 타임스탬프는 트랜잭션의 시간 순서를 보장하고 블록 생성 간격을 측정하는 데 활용됩니다.`,
      example: 1749003732416395,
    },
    firstVersion: {
      type: "integer",
      description: `블록에 포함된 트랜잭션들 중 가장 먼저 처리된 트랜잭션의 version 번호를 나타내는 필드입니다.

Aptos에서 각 트랜잭션은 고유한 version 번호를 가지며, 이는 트랜잭션의 전체 실행 순서를 나타냅니다.
firstVersion과 lastVersion을 통해 블록 내 트랜잭션들의 version 범위를 확인할 수 있습니다.`,
      example: 2820166554,
    },
    lastVersion: {
      type: "integer",
      description: `블록에 포함된 트랜잭션들 중 마지막으로 처리된 트랜잭션의 version 번호를 나타내는 필드입니다.

firstVersion과 함께 블록 내 트랜잭션들의 version 범위를 정의하며, 이를 통해 블록 내 모든 트랜잭션을 순차적으로 조회할 수 있습니다.`,
      example: 987654325, // firstVersion + 4 (5개의 트랜잭션을 포함하는 예시)
    },
    transactionsCount: {
      type: "integer",
      description: `블록에 포함된 총 트랜잭션의 개수를 나타내는 필드입니다.

블록의 크기와 처리량을 이해하는 데 중요한 지표가 되며, 블록 내 모든 유형의 트랜잭션(사용자 트랜잭션, 시스템 트랜잭션 등)을 포함합니다.
이 값은 lastVersion - firstVersion + 1과 동일합니다.`,
      example: 5, // lastVersion(987654325) - firstVersion(987654321) + 1
    },
    transactions: {
      type: "array",
      description: `블록에 포함된 모든 트랜잭션의 version 번호 목록을 나타내는 필드입니다.

각 version 번호는 해당 트랜잭션의 고유 식별자로 사용되며, firstVersion부터 lastVersion까지 순차적으로 정렬되어 있습니다.
이 목록을 통해 블록 내 개별 트랜잭션의 상세 정보를 조회할 수 있습니다.`,
      items: {
        type: "integer",
      },
      example: [
        2854257037, 2854257038, 2854257039, 2854257040, 2854257041, 2854257042,
      ], // firstVersion부터 lastVersion까지의 연속된 번호
    },
  },
};

export const BalanceChange: OpenAPIV3.SchemaObject = {
  type: "object",
  required: [
    "eventIndex",
    "eventType",
    "subEventIndex",
    "accountAddress",
    "assetType",
    "linkedAssetType",
    "changeValue",
    "tokenStandard",
    "transferType",
  ],
  properties: {
    blockHeight: {
      type: "integer",
      description: `해당 잔액 변화가 포함된 블록의 높이를 나타내는 필드입니다.

제네시스 블록(0)부터 시작하여 순차적으로 증가하는 정수값으로 제공됩니다.`,
      example: 160155267,
    },
    blockTimestamp: {
      type: "integer",
      description: `블록 생성 시각을 나타내는 필드입니다.

마이크로초(microseconds) 단위의 UNIX 타임스탬프로 제공됩니다.`,
      example: 1749003732416395,
    },
    transactionHash: {
      type: "string",
      description: `잔액 변화를 발생시킨 트랜잭션의 해시를 나타내는 필드입니다.

트랜잭션의 모든 데이터를 포함하여 계산된 암호학적 해시값으로, 0x로 시작하는 64자리 16진수 문자열 형태로 제공됩니다.
이 해시를 통해 잔액 변화와 관련된 트랜잭션의 전체 정보를 조회할 수 있습니다.`,
      example:
        "0x2a41cd44491bb92d4eb17d8487f82d9b43ab6289074c1986ee055be8105707c9",
    },
    transactionVersion: {
      type: "integer",
      description: `잔액 변화가 발생한 트랜잭션의 버전을 나타내는 필드입니다.

체인 상에서 트랜잭션의 순서를 나타내는 고유한 시퀀스 ID로, 0부터 시작하여 순차적으로 증가합니다.`,
      example: 34872482,
    },
    eventIndex: {
      type: "integer",
      description: `트랜잭션 내 이벤트의 순서 인덱스를 나타내는 필드입니다.

하나의 트랜잭션에서 발생한 여러 이벤트들 중 현재 이벤트의 순서를 나타냅니다.
0부터 시작하여 이벤트 발생 순서대로 증가하며, 동일 트랜잭션 내 이벤트의 순서를 식별하는 데 사용됩니다.`,
      example: 0,
    },
    eventType: {
      type: "string",
      description: `이벤트의 유형을 나타내는 필드입니다.

Move 모듈에서 정의된 이벤트 구조체의 전체 경로(주소::모듈::구조체)로 제공됩니다.
잔액 변화의 원인이 된 작업의 종류를 식별하는 데 사용됩니다.`,
      example: "0x1::coin::WithdrawEvent",
    },
    subEventIndex: {
      type: "integer",
      description: `하나의 이벤트 내 여러 개의 자산 변화가 발생할 경우의 순서를 나타내는 필드입니다.

동일한 eventIndex를 가진 이벤트 내에서 발생한 여러 자산 변화들의 순서를 식별합니다.
0부터 시작하여 순차적으로 증가하며, 복합 자산 거래(예: 스왑)에서 중요한 역할을 합니다.`,
      example: 0,
    },
    accountAddress: {
      type: "string",
      description: `잔액 변화가 발생한 계정의 주소를 나타내는 필드입니다.

0x로 시작하는 64자리 16진수 문자열 형태로 제공되며, 자산 잔액이 변동된 계정을 식별합니다.
이 주소는 자산의 소유자이거나 자산이 이동된 대상 계정입니다.`,
      example:
        "0x948592877d14d0fde0a42e2fc15a56959f30ea35d0b87c7ee8e98e0cce756f1a",
    },
    assetType: {
      type: "string",
      description: `잔액 변화가 발생한 자산의 타입을 나타내는 필드입니다.

다음 두 가지 형식 중 하나로 제공됩니다:
- Coin: Move 구조체 형식의 자산 ID (예: 0x1::aptos_coin::AptosCoin)
- Fungible Asset: 해당 자산의 메타데이터를 소유한 Object 주소

이 값은 자산의 종류를 고유하게 식별하는 데 사용됩니다.`,
      example: "0x1::aptos_coin::AptosCoin",
    },
    linkedAssetType: {
      type: "string",
      description: `Coin과 Fungible Asset이 마이그레이션된 경우, 두 자산을 이어주는 공통 식별자입니다.

- Fungible Asset인 경우: assetType과 동일한 Fungible Asset Object 주소가 들어갑니다.
- Coin인 경우: 연결된 Fungible Asset의 Object 주소가 들어갑니다.

이 필드는 Coin/Fungible Asset를 하나의 자산 단위로 묶어 식별 및 조회할 수 있도록 해주는 통합 키 역할을 합니다.`,
      example:
        "0xbae207659db88bea0cbead6da0ed00aac12edcdda169e591cd41c94180b46f3b",
    },
    changeValue: {
      type: "string",
      description: `잔액 변화량을 나타내는 필드입니다.

정수 형태의 문자열로 제공되며:
- 양수: 해당 계정의 잔액이 증가했음을 의미
- 음수: 해당 계정의 잔액이 감소했음을 의미

실제 값은 decimals를 고려하여 해석해야 합니다.`,
      example: "1000000",
    },
    tokenStandard: {
      type: "string",
      description: `자산의 표준 유형을 나타내는 필드입니다.

자산이 따르는 표준 규격을 나타내며, 다음과 같은 값들이 가능합니다:
- v1: Coin 표준을 따르는 자산, 
- v2: Fungible Asset 표준을 따르는 자산`,
      example: "coin",
    },
    transferType: {
      type: "string",
      description: `전송 방향 또는 동작 유형을 나타내는 필드입니다.

잔액 변화의 구체적인 유형을 나타내며, 다음과 같은 값들이 가능합니다:
- deposit: 자산 입금
- withdraw: 자산 출금
- swap_in: 스왑으로 인한 입금
- swap_out: 스왑으로 인한 출금
- gas: 가스비 지불
- refund_gas: 가스비 환불`,
      example: "deposit",
    },
  },
};

export const Event: OpenAPIV3.SchemaObject = {
  type: "object",
  required: [
    "eventIndex",
    "eventType",
    "accountAddress",
    "data",
    "creationNumber",
    "sequenceNumber",
    "objectAddress",
    "objectOwnerAddress",
  ],
  properties: {
    eventIndex: {
      type: "integer",
      description: `트랜잭션 내 이벤트의 순서 인덱스를 나타내는 필드입니다.

하나의 트랜잭션에서 발생한 여러 이벤트들 중 현재 이벤트의 순서를 나타냅니다.
0부터 시작하여 이벤트 발생 순서대로 증가하며, 동일 트랜잭션 내 이벤트의 순서를 식별하는 데 사용됩니다.`,
      example: 0,
    },
    eventType: {
      type: "string",
      description: `이벤트의 타입을 나타내는 필드입니다.

Move 모듈에서 정의된 이벤트 구조체의 전체 경로로, '계정주소::모듈이름::이벤트구조체명' 형식으로 제공됩니다.
이벤트의 종류를 식별하고 이벤트 데이터의 구조를 결정하는 데 사용됩니다.`,
      example: "0x1::coin::DepositEvent",
    },
    accountAddress: {
      type: "string",
      description: `이벤트를 발행한 리소스 소유자의 주소를 나타내는 필드입니다.

0x로 시작하는 64자리 16진수 문자열 형태로 제공되며, 이벤트가 발생한 리소스의 소유자를 식별합니다.
이벤트 핸들을 소유한 계정으로, 이벤트 조회 시 필터링 조건으로 사용될 수 있습니다.`,
      example:
        "0x948592877d14d0fde0a42e2fc15a56959f30ea35d0b87c7ee8e98e0cce756f1a",
    },
    data: {
      type: "object",
      description: `이벤트의 구체적인 데이터를 나타내는 필드입니다.

eventType에 정의된 이벤트 구조체의 필드들이 JSON 객체 형태로 제공됩니다.
이벤트의 세부 정보를 담고 있으며, 이벤트 타입에 따라 다른 구조를 가질 수 있습니다.`,
      example: {
        amount: "1000000",
        from: "0x948592877d14d0fde0a42e2fc15a56959f30ea35d0b87c7ee8e98e0cce756f1a",
        to: "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
      },
    },
    creationNumber: {
      type: "integer",
      description: `이벤트 핸들의 생성 번호를 나타내는 필드입니다.

계정이 생성한 이벤트 핸들들을 구분하기 위한 고유 식별자로, 0부터 시작하여 순차적으로 증가합니다.
동일 계정에서 발생한 서로 다른 종류의 이벤트들을 구분하는 데 사용됩니다.`,
      example: 2,
    },
    sequenceNumber: {
      type: "integer",
      description: `해당 이벤트 핸들에서 발생한 이벤트의 순번을 나타내는 필드입니다.

동일한 이벤트 핸들에서 발생한 이벤트들의 순서를 나타냅니다.
0부터 시작하여 순차적으로 증가하며, 특정 이벤트 핸들에서 발생한 이벤트들의 시간 순서를 보장합니다.`,
      example: 12345,
    },
    objectAddress: {
      type: "string",
      description: `Object 리소스에 대한 이벤트일 경우 해당 object의 주소를 나타내는 필드입니다.

0x로 시작하는 64자리 16진수 문자열 형태로 제공되며, Object 기반 리소스의 고유 식별자입니다.
Object 리소스와 관련된 이벤트를 추적하고 조회하는 데 사용됩니다.`,
      example:
        "0xbae207659db88bea0cbead6da0ed00aac12edcdda169e591cd41c94180b46f3b",
    },
    objectOwnerAddress: {
      type: "string",
      description: `objectAddress로 식별되는 Object의 소유자 주소를 나타내는 필드입니다.

0x로 시작하는 64자리 16진수 문자열 형태로 제공되며, Object의 현재 소유자를 식별합니다.
Object의 소유권 추적과 권한 확인에 사용됩니다.`,
      example:
        "0x948592877d14d0fde0a42e2fc15a56959f30ea35d0b87c7ee8e98e0cce756f1a",
    },
  },
};

export const Transaction: OpenAPIV3.SchemaObject = {
  type: "object",
  required: [
    "transactionHash",
    "transactionVersion",
    "blockHeight",
    "blockTimestamp",
    "expirationTimestampSecs",
    "gasUnitPrice",
    "gasUsed",
    "maxGasAmount",
    "secondarySigners",
    "sender",
    "sequenceNumber",
    "success",
    "vmStatus",
    "events",
    "balanceInAccounts",
    "balanceOutAccounts",
    "balanceChangedTokens",
  ],
  properties: {
    transactionHash: {
      type: "string",
      description: `트랜잭션의 고유 식별자를 나타내는 필드입니다.

트랜잭션의 모든 데이터(서명된 페이로드)를 포함하여 계산된 암호학적 해시값으로, 0x로 시작하는 64자리 16진수 문자열 형태로 제공됩니다.
트랜잭션의 무결성을 검증하고 트랜잭션을 고유하게 식별하는 데 사용됩니다.`,
      example:
        "0x2a41cd44491bb92d4eb17d8487f82d9b43ab6289074c1986ee055be8105707c9",
    },
    transactionVersion: {
      type: "integer",
      description: `트랜잭션의 버전을 나타내는 필드입니다.

체인 상에서 트랜잭션의 순서를 나타내는 고유한 시퀀스 ID로, 0부터 시작하여 순차적으로 증가합니다.
트랜잭션의 실행 순서를 보장하고 특정 트랜잭션의 상태를 조회하는 데 사용됩니다.`,
      example: 2854257037,
    },
    blockHeight: {
      type: "string",
      description: `트랜잭션이 포함된 블록의 높이를 나타내는 필드입니다.

제네시스 블록(0)부터 시작하여 순차적으로 증가하는 정수값으로 제공됩니다.
이 값은 트랜잭션이 어느 블록에 포함되었는지를 식별하고, 해당 트랜잭션이 확정되었는지를 확인하는 데 사용됩니다.`,
      example: "160155267",
    },
    blockTimestamp: {
      type: "string",
      description: `트랜잭션이 포함된 블록의 생성 시각을 나타내는 필드입니다.

마이크로초(microseconds) 단위의 UNIX 타임스탬프로 제공되며, 이 값은 블록이 생성된 시점이자 해당 블록에 포함된 트랜잭션들이 처리된 시점을 의미합니다.`,
      example: "1749003732416395",
    },
    expirationTimestampSecs: {
      type: "integer",
      description: `트랜잭션의 만료 시각을 나타내는 필드입니다.

초 단위의 UNIX 타임스탬프로 제공되며, 이 시각이 지나면 트랜잭션이 체인에 포함될 수 없습니다.
트랜잭션의 유효 기간을 설정하여 오래된 트랜잭션이 처리되는 것을 방지합니다.`,
      example: 1749003762,
    },
    gasUnitPrice: {
      type: "string",
      description: `트랜잭션의 가스 단가를 나타내는 필드입니다.

Octas(1 APT = 10^8 Octas) 단위로 제공되며, 각 가스 단위당 지불할 금액을 의미합니다.
트랜잭션 처리의 우선순위를 결정하고 트랜잭션 수수료를 계산하는 데 사용됩니다.`,
      example: "100",
    },
    gasUsed: {
      type: "string",
      description: `트랜잭션 실행에 실제로 사용된 가스의 양을 나타내는 필드입니다.

트랜잭션 처리에 소비된 컴퓨팅 자원의 양을 측정하는 단위입니다.
실제 트랜잭션 수수료는 gasUsed * gasUnitPrice로 계산됩니다.`,
      example: "678",
    },
    maxGasAmount: {
      type: "string",
      description: `트랜잭션에 사용할 수 있는 최대 가스량을 나타내는 필드입니다.

트랜잭션 실행 중 이 값을 초과하면 트랜잭션이 실패하며, 가스 비용 상한선 역할을 합니다.
사용자가 예상치 못한 높은 수수료를 지불하는 것을 방지합니다.`,
      example: "2000",
    },
    secondarySigners: {
      type: "array",
      description: `다중 서명 트랜잭션에서 추가 서명자들의 주소 목록을 나타내는 필드입니다.

기본 서명자(sender) 외에 트랜잭션에 서명한 계정들의 주소가 포함됩니다.
복잡한 권한 관리나 다중 승인이 필요한 트랜잭션에서 사용됩니다.`,
      items: {
        type: "string",
      },
      example: [
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      ],
    },
    sender: {
      type: "string",
      description: `트랜잭션을 발생시킨 계정의 주소를 나타내는 필드입니다.

0x로 시작하는 64자리 16진수 문자열 형태로 제공되며, 트랜잭션의 주체를 식별합니다.
트랜잭션 수수료 지불과 시퀀스 번호 관리의 기준이 되는 계정입니다.`,
      example:
        "0x948592877d14d0fde0a42e2fc15a56959f30ea35d0b87c7ee8e98e0cce756f1a",
    },
    sequenceNumber: {
      type: "integer",
      description: `발신자 계정의 현재 시퀀스 번호를 나타내는 필드입니다.

계정별로 0부터 시작하여 트랜잭션마다 1씩 증가하며, 재사용 공격을 방지하고 트랜잭션의 순서를 보장합니다.
동일한 시퀀스 번호를 가진 트랜잭션은 중복 실행될 수 없습니다.`,
      example: 42,
    },
    success: {
      type: "boolean",
      description: `트랜잭션의 실행 성공 여부를 나타내는 필드입니다.

true인 경우 트랜잭션이 성공적으로 실행되었음을, false인 경우 실행 중 오류가 발생했음을 의미합니다.`,
      example: true,
    },
    vmStatus: {
      type: "string",
      description: `트랜잭션의 실행 결과 상태를 나타내는 필드입니다.

성공 시 'Executed successfully'를 반환하며, 실패 시 구체적인 오류 메시지를 포함합니다.
트랜잭션 실패의 원인을 분석하고 문제를 해결하는 데 도움을 줍니다.`,
      example: "Executed successfully",
    },
    events: {
      type: "array",
      description: `트랜잭션 실행 중 발생한 이벤트들의 목록을 나타내는 필드입니다.

각 이벤트는 트랜잭션으로 인한 상태 변화나 중요 작업의 실행을 기록합니다.
트랜잭션의 영향을 추적하고 외부 시스템과의 연동을 위한 정보를 제공합니다.`,
      items: Event,
      example: [
        {
          type: "0x1::coin::DepositEvent",
          data: { amount: "1000000" },
        },
      ],
    },
    balanceInAccounts: {
      type: "array",
      description: `트랜잭션에서 자산을 수신한 계정들의 주소 목록을 나타내는 필드입니다.

balanceChanges 중 양수 값(입금)을 가진 계정들의 주소가 포함됩니다.
자산 이동의 수신자를 추적하고 입금 내역을 분석하는 데 사용됩니다.`,
      items: {
        type: "string",
      },
      example: [
        "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
      ],
    },
    balanceOutAccounts: {
      type: "array",
      description: `트랜잭션에서 자산을 송신한 계정들의 주소 목록을 나타내는 필드입니다.

balanceChanges 중 음수 값(출금)을 가진 계정들의 주소가 포함됩니다.
자산 이동의 송신자를 추적하고 출금 내역을 분석하는 데 사용됩니다.`,
      items: {
        type: "string",
      },
      example: [
        "0xb2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3",
      ],
    },
    balanceChangedTokens: {
      type: "array",
      description: `트랜잭션으로 인해 잔액이 변동된 토큰들의 타입 목록을 나타내는 필드입니다.

각 토큰은 '모듈주소::모듈이름::구조체이름' 형식으로 제공됩니다.
트랜잭션이 영향을 미친 자산의 종류를 식별하고 자산별 변동 내역을 추적하는 데 사용됩니다.`,
      items: {
        type: "string",
      },
      example: ["0x1::aptos_coin::AptosCoin", "0x1::usdc::USDC"],
    },
    balanceChanges: BalanceChange,
  },
};

export const Payload: OpenAPIV3.SchemaObject = {
  type: "object",
  required: ["function", "type", "typeArguments", "arguments"],
  properties: {
    function: {
      type: "string",
      description: `호출되는 온체인 함수의 전체 식별자를 나타내는 필드입니다.

'주소::모듈이름::함수이름' 형식으로 제공되며, 실행하고자 하는 Module 함수를 고유하게 식별합니다.`,
      example: "0x1::coin::transfer",
    },
    type: {
      type: "string",
      description: `페이로드의 유형을 나타내는 필드입니다.

다음과 같은 값들이 가능합니다:
- entry_function_payload: Move 모듈의 entry 함수를 직접 호출
- script_payload: Move 스크립트를 실행
- multisig_payload: 다중 서명이 필요한 트랜잭션

이 값에 따라 트랜잭션의 실행 방식과 필요한 인자가 결정됩니다.`,
      example: "entry_function_payload",
    },
    typeArguments: {
      type: "array",
      description: `제네릭 함수 호출 시 사용되는 타입 인자들을 나타내는 필드입니다.`,
      items: {
        type: "string",
      },
      default: [],
      example: ["0x1::aptos_coin::AptosCoin"],
    },
    arguments: {
      type: "array",
      description: `호출되는 함수에 전달되는 인자들을 나타내는 필드입니다.

함수의 파라미터에 맞는 값들을 순서대로 제공해야 하며, 함수마다 파라미터의 타입, 개수가 다릅니다.`,
      items: {
        type: "string",
      },
      default: [],
      example: [
        "0x948592877d14d0fde0a42e2fc15a56959f30ea35d0b87c7ee8e98e0cce756f1a",
        "1000000",
      ],
    },
  },
};

export const TokenAccount: OpenAPIV3.SchemaObject = {
  type: "object",
  required: [
    "ownerAddress",
    "objectAddress",
    "value",
    "isFrozen",
    "isPrimary",
    "assetType",
    "tokenStandard",
    "linkedAssetType",
  ],
  properties: {
    ownerAddress: {
      type: "string",
      description: `자산을 보유한 계정의 주소를 나타내는 필드입니다.

0x로 시작하는 64자리 16진수 문자열 형태로 제공되며, 자산의 실질적인 소유자를 식별합니다.
Coin의 경우 보유 계정 주소, Fungible Asset의 경우 Object 소유자의 주소가 제공됩니다.`,
      example:
        "0x948592877d14d0fde0a42e2fc15a56959f30ea35d0b87c7ee8e98e0cce756f1a",
    },
    objectAddress: {
      type: "string",
      description: `자산이 저장된 Object의 주소를 나타내는 필드입니다.

자산의 저장 위치에 따라 다음과 같이 제공됩니다:
- Coin: 계정에 직접 저장되므로 빈 문자열("")
- Fungible Asset: 토큰이 저장된 Object의 주소 (0x로 시작하는 64자리 16진수 문자열)`,
      example:
        "0xbae207659db88bea0cbead6da0ed00aac12edcdda169e591cd41c94180b46f3b",
    },
    value: {
      type: "string",
      description: `보유한 자산의 수량을 나타내는 필드입니다.

정수 형태의 문자열로 제공되며, 소수점은 포함되지 않습니다.
실제 값을 계산할 때는 자산의 decimals를 고려해야 합니다.`,
      example: "1000000",
    },
    isFrozen: {
      type: "boolean",
      description: `자산의 전송 가능 여부를 나타내는 필드입니다.

true인 경우 자산이 동결되어 전송이 불가능함을 의미합니다.
자산의 전송 제한 상태를 확인하는 데 사용됩니다.`,
      example: false,
    },
    isPrimary: {
      type: "boolean",
      description: `해당 Object가 Owner 주소의 대표 Object인지 여부를 나타내는 필드입니다.

true인 경우 해당 Object가 Owner 주소의 대표 Object임을 의미합니다.`,
      example: true,
    },
    assetType: {
      type: "string",
      description: `자산의 고유 식별자를 나타내는 필드입니다.

다음 두 가지 형식 중 하나로 제공됩니다:
- Coin: Move 구조체 형식의 자산 ID (예: 0x1::aptos_coin::AptosCoin)
- Fungible Asset: 해당 자산의 메타데이터를 소유한 Object 주소`,
      example: "0x1::aptos_coin::AptosCoin",
    },
    tokenStandard: {
      type: "string",
      description: `자산이 따르는 표준을 나타내는 필드입니다.

다음과 같은 값들이 가능합니다:
- v1: Coin 표준을 따르는 자산
- v2: Fungible Asset 표준을 따르는 자산`,
      example: "v1",
    },
    linkedAssetType: {
      type: "string",
      description: `Coin과 Fungible Asset가 마이그레이션된 경우, 두 자산을 이어주는 공통 식별자입니다.

다음과 같이 제공됩니다:
- Coin인 경우: 연결된 Fungible Asset의 Object 주소
- Fungible Asset인 경우: assetType과 동일한 Fungible Asset Object 주소

이 필드는 Coin/Fungible Asset를 하나의 자산 단위로 묶어 식별 및 조회할 수 있도록 해주는 통합 키 역할을 합니다.`,
      example:
        "0xbae207659db88bea0cbead6da0ed00aac12edcdda169e591cd41c94180b46f3b",
    },
  },
};

export const TokenMeta: OpenAPIV3.SchemaObject = {
  type: "object",
  required: [
    "name",
    "symbol",
    "decimals",
    "totalSupply",
    "maximumSupply",
    "creatorAddress",
    "projectURI",
    "iconURI",
  ],
  properties: {
    assetType: {
      type: "string",
      description: `자산의 고유 식별자를 나타내는 필드입니다.

다음 두 가지 형식 중 하나로 제공됩니다:
- Coin: Move 구조체 형식의 자산 ID (예: 0x1::aptos_coin::AptosCoin)
- Fungible Asset: 해당 자산의 메타데이터를 소유한 Object 주소`,
      example: "0x1::aptos_coin::AptosCoin",
    },
    tokenStandard: {
      type: "string",
      description: `자산이 따르는 표준을 나타내는 필드입니다.

다음과 같은 값들이 가능합니다:
- v1: Coin 표준을 따르는 자산
- v2: Fungible Asset 표준을 따르는 자산`,
      example: "v1",
    },
    name: {
      type: "string",
      description: `자산의 이름을 나타내는 필드입니다.

사용자 인터페이스에 표시되는 자산의 공식 이름으로, 자산을 식별하고 구분하는 데 사용됩니다.`,
      example: "Aptos Coin",
    },
    symbol: {
      type: "string",
      description: `자산의 심볼(기호)을 나타내는 필드입니다.

거래소나 지갑에서 사용되는 자산의 축약된 식별자입니다.`,
      example: "APT",
    },
    decimals: {
      type: "integer",
      description: `자산의 소수점 자릿수를 나타내는 필드입니다.

실제 자산 수량을 표시할 때 적용되는 소수점 자릿수를 정의합니다.
예를 들어, decimals가 8인 경우 100000000(10^8)은 1.0으로 표시됩니다.`,
      example: 8,
    },
    totalSupply: {
      type: "string",
      description: `현재 유통 중인 총 발행량을 나타내는 필드입니다.

decimals가 적용되기 전의 정수 값으로 제공됩니다.
실제 유통량을 계산할 때는 decimals를 고려해야 합니다.`,
      example: "123456789000000",
    },
    maximumSupply: {
      type: "string",
      description: `발행 가능한 최대 공급량을 나타내는 필드입니다.

decimals가 적용되기 전의 정수 값으로 제공됩니다.
빈 문자열("")인 경우 최대 공급량 제한이 없음을 의미합니다.`,
      example: "123123",
    },
    creatorAddress: {
      type: "string",
      description: `자산을 생성한 계정의 주소를 나타내는 필드입니다.

0x로 시작하는 64자리 16진수 문자열 형태로 제공되며, 자산의 생성자를 식별합니다.
자산의 관리 권한과 소유권을 추적하는 데 사용됩니다.`,
      example: "0x1",
    },
    projectURI: {
      type: "string",
      description: `프로젝트 관련 정보를 제공하는 URI를 나타내는 필드입니다.

웹사이트, 백서, 문서 등 프로젝트의 상세 정보를 확인할 수 있는 URL이 제공됩니다.
자산과 관련된 추가 정보를 얻는 데 사용됩니다.`,
      example: "https://aptos.dev",
    },
    iconURI: {
      type: "string",
      description: `자산의 아이콘 이미지 URL을 나타내는 필드입니다. 자산을 시각적으로 식별할 수 있는 이미지의 URL이 제공됩니다.`,
      example: "https://aptos.dev/icon.png",
    },
  },
};

export const Token: OpenAPIV3.SchemaObject = {
  type: "object",
  required: [
    "ownerAddress",
    "objectAddress",
    "value",
    "isFrozen",
    "isPrimary",
    "assetType",
    "tokenStandard",
    "linkedAssetType",
    "metadata",
  ],
  properties: {
    ...TokenAccount.properties,
    metadata: TokenMeta,
  },
  description: `특정 토큰의 총 보유 수량을 얻기 위해서는 해당 토큰의 assetType 또는 linkedAssetType으로 조회된 모든 결과값을 합산해야 합니다.`,
};

export const TokenPair: OpenAPIV3.SchemaObject = {
  type: "object",
  required: ["coinAssetType", "fungibleAssetType", "linkedAssetType"],
  properties: {
    coinAssetType: {
      type: "string",
      description: `Coin 표준에 속한 자산의 유형을 나타내는 필드입니다.

Coin 표준은 '모듈주소::모듈이름::구조체이름' 형식으로 제공됩니다.`,
      example: "0x1::aptos_coin::AptosCoin",
    },
    fungibleAssetType: {
      type: "string",
      description: `Fungible Asset 표준에 속한 자산의 유형을 나타내는 필드입니다.

Fungible Asset 표준은 0x로 시작하는 64자리 16진수 문자열 형태로 제공되며, 해당 자산의 메타데이터를 소유한 Object 주소가 제공됩니다.`,
      example:
        "0xbae207659db88bea0cbead6da0ed00aac12edcdda169e591cd41c94180b46f3b",
    },
    linkedAssetType: {
      type: "string",
      description: `Coin과 Fungible Asset이 마이그레이션된 경우, 두 자산을 이어주는 공통 식별자입니다.

마이그레이션 된 토큰의 Object 주소를 가리키며, 다음과 같이 제공됩니다:
- Coin인 경우: 마이그레이션된 Fungible Asset의 Object 주소
- Fungible Asset인 경우: assetType과 동일한 Fungible Asset Object 주소

이 필드는 Coin/Fungible Asset을 하나의 자산 단위로 묶어 식별 및 조회할 수 있도록 해주는 통합 키 역할을 합니다.`,
      example:
        "0xbae207659db88bea0cbead6da0ed00aac12edcdda169e591cd41c94180b46f3b",
    },
  },
};

export const AccountStats: OpenAPIV3.SchemaObject = {
  type: "object",
  required: ["transactionCounts", "balanceChangeCounts", "assets"],
  properties: {
    transactionCounts: {
      type: "integer",
      description: `계정이 생성한 트랜잭션 수를 나타내는 필드입니다. 해당 계정이 sender에 포함된 트랜잭션을 의미합니다.`,
      example: 48,
    },
    transferCounts: {
      type: "integer",
      description: `계정이 참여한 전송 트랜잭션 수를 나타내는 필드입니다.`,
      example: 100,
    },
    // balanceChangeCounts: {
    //   type: "object",
    //   properties: {
    //     tokens: {
    //       type: "integer",
    //       description: `Token의 잔액 변동 횟수를 나타내는 필드입니다.`,
    //       example: 100,
    //     },
    //   },
    // },
    assets: {
      type: "object",
      properties: {
        tokens: {
          type: "integer",
          description: `계정이 보유한 Token(Coin, Fungible Asset) 수를 나타내는 필드입니다.`,
          example: 100,
        },
      },
    },
  },
};
