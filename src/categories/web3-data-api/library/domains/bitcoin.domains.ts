import { OpenAPIV3 } from "openapi-types";
import { Patterns } from "../../../../patterns";

export const ownerAddress: OpenAPIV3.SchemaObject = {
  type: "string",
  description: "소유자 주소를 나타내는 필드입니다.",
  pattern: Patterns.bitcoin.address.source,
};

export const balance: OpenAPIV3.SchemaObject = {
  type: "string",
  description: "잔고 나타내는 필드입니다.",
  pattern: Patterns.string.decimal().source,
};

export const Balance: OpenAPIV3.SchemaObject = {
  type: "object",
  required: ["ownerAddress", "balance"],
  properties: {
    ownerAddress: ownerAddress,
    balance: balance,
  },
};

export const Block: OpenAPIV3.SchemaObject = {
  type: "object",
  required: [
    "hash",
    "height",
    "version",
    "timestamp",
    "nonce",
    "bits",
    "difficulty",
    "merkleRoot",
    "transactionCount",
    "size",
    "weight",
    "previousBlockHash",
    "nextBlockHash",
    "medianTime",
    "strippedSize",
    "transactions",
  ],
  properties: {
    hash: {
      type: "string",
      description:
        "블록을 고유하게 식별하는 SHA-256 해시 값입니다. 블록 헤더의 정보를 조합하여 생성되며, 블록체인 내에서 중복되지 않는 식별자입니다.",
      example:
        "00000000000000000002a30c53b8f371d4ebba1434cffa32716e6e84eb33b2af",
    },
    height: {
      type: "integer",
      description:
        "블록체인에서 블록의 위치를 나타내는 번호입니다. 제네시스 블록은 0번으로 시작하며, 이후 블록들은 1씩 증가합니다.",
      example: 844237,
    },
    version: {
      type: "integer",
      description:
        "블록의 버전 번호로, 네트워크에서 사용되는 블록 검증 규칙을 식별하는 데 사용됩니다. 새로운 기능이 추가되면 버전이 업데이트됩니다.",
      example: 541065216,
    },
    timestamp: {
      type: "integer",
      description: "블록 생성 시간을 나타내며, UNIX 타임스탬프로 표시됩니다.",
      example: 1716177005,
    },
    nonce: {
      type: "integer",
      description:
        "작업증명(Proof-of-Work) 알고리즘에서 사용되는 값으로, 유효한 블록 해시를 찾기 위해 여러 번 변경되는 변수입니다.",
      example: 890911130,
    },
    bits: {
      type: "string",
      description:
        "블록 해시가 만족해야 하는 난이도 목표 값으로, 압축된 32비트 16진수로 표현됩니다. 이 값은 네트워크의 채굴 난이도에 따라 변합니다.",
      example: "386097818",
    },
    difficulty: {
      type: "string",
      description:
        "블록의 난이도를 나타내며, 초기 목표 값과 현재 목표 값의 비율로 계산됩니다. 이 값은 채굴의 상대적인 난이도를 반영합니다.",
      example: "8.314835518923977E13",
    },
    merkleRoot: {
      type: "string",
      description:
        "블록에 포함된 모든 트랜잭션의 해시를 머클 트리로 계산한 루트 해시 값입니다. 데이터 무결성을 확인하기 위해 사용됩니다.",
      example:
        "ea1cc8f8e626dd317a96c13c9b53451c4fd33e88edf33f327fc063be669e174c",
    },
    transactionCount: {
      type: "integer",
      description:
        "블록에 포함된 트랜잭션의 총 개수를 나타냅니다. 채굴된 블록 내 트랜잭션의 양을 확인하는 데 사용됩니다.",
      example: 2948,
    },
    size: {
      type: "integer",
      description:
        "블록의 전체 크기로, 헤더와 트랜잭션 데이터를 포함한 바이트 단위 값입니다. 이 값은 블록 데이터를 저장하는 데 필요한 실제 디스크 공간을 나타냅니다.",
      example: 2106825,
    },
    weight: {
      type: "integer",
      description:
        "SegWit 데이터를 고려하여 BIP-141에 정의된 방식으로 계산된 블록의 가중치입니다.",
      example: 3993132,
    },
    previousBlockHash: {
      type: "string",
      description:
        "이전 블록의 해시 값으로, 블록체인 내에서 블록 간의 연결을 유지합니다. 제네시스 블록의 경우 이 값은 null입니다.",
      example:
        "00000000000000000002732fa80041196753bcb6aea0938d9a682665ccd52385",
    },
    nextBlockHash: {
      type: "string",
      description:
        "다음 블록의 해시 값으로, 가장 최신 블록의 경우 이 값은 null입니다. 이는 체인의 끝을 나타냅니다.",
      example:
        "00000000000000000002732fa80041196753bcb6aea0938d9a682665ccd52385",
    },
    medianTime: {
      type: "integer",
      description:
        "최근 11개의 블록 타임스탬프의 중간값입니다. 시간의 변동성을 줄이고 보다 안정적인 블록 시간을 제공하기 위해 사용됩니다.",
      example: 1716175427,
    },
    strippedSize: {
      type: "integer",
      description:
        "SegWit 데이터를 제외한 블록의 크기입니다. 바이트 단위로 측정되며, 순수한 트랜잭션 데이터와 헤더 크기를 나타냅니다.",
      example: 2106825,
    },
    transactions: {
      type: "array",
      description:
        "블록에 포함된 트랜잭션의 해시 값 배열입니다. 각 트랜잭션은 고유한 해시 값으로 식별됩니다.",
      items: {
        type: "string",
        description: "각 트랜잭션을 고유하게 식별하는 SHA-256 해시 값입니다.",
        example:
          "3954b135801a24fec00b28d23c8ebda69ca963f16bf38e00e0e02405964a40e2",
      },
    },
  },
};

export const Transaction: OpenAPIV3.SchemaObject = {
  type: "object",
  required: [
    "id",
    "index",
    "hash",
    "version",
    "lockTime",
    "size",
    "vsize",
    "weight",
    "fee",
    "vinCount",
    "voutCount",
    "blockHeight",
    "blockHash",
    "blockTimestamp",
  ],
  properties: {
    id: {
      type: "string",
      description:
        "트랜잭션의 고유 식별자로, 각 트랜잭션을 유일하게 식별할 수 있는 값입니다.",
      example:
        "3954b135801a24fec00b28d23c8ebda69ca963f16bf38e00e0e02405964a40e2",
    },
    index: {
      type: "integer",
      description:
        "블록 내 트랜잭션의 인덱스를 나타냅니다. 0부터 시작하며, 블록에 포함된 트랜잭션의 순서를 의미합니다.",
      example: 0,
    },
    hash: {
      type: "string",
      description:
        "트랜잭션의 해시 값으로, 트랜잭션 데이터를 기반으로 계산된 고유한 식별자입니다. SegWit 데이터를 포함하여 계산됩니다.",
      example:
        "3954b135801a24fec00b28d23c8ebda69ca963f16bf38e00e0e02405964a40e2",
    },
    version: {
      type: "integer",
      description:
        "트랜잭션의 버전을 나타내는 값으로, 트랜잭션 형식을 정의합니다.",
      example: 2,
    },
    lockTime: {
      type: "integer",
      description:
        "트랜잭션의 락타임으로, 트랜잭션이 유효해지는 조건(블록 높이 또는 UNIX 타임스탬프)을 나타냅니다. 값이 `0`이면 트랜잭션은 즉시 유효합니다.",
      example: 0,
    },
    size: {
      type: "integer",
      description:
        "트랜잭션의 실제 크기(바이트)로, 트랜잭션의 데이터 길이를 나타냅니다.",
      example: 223,
    },
    vsize: {
      type: "integer",
      description:
        "트랜잭션의 가상 크기(바이트)로, SegWit 데이터를 포함하여 블록에 포함되는 트랜잭션의 유효 크기를 나타냅니다. BIP-141에 따라 가중치(weight)를 4로 나눈 후 올림 처리한 값입니다.",
      example: 300,
    },
    weight: {
      type: "integer",
      description:
        "트랜잭션의 가중치로, BIP-141에 따라 계산된 트랜잭션의 네트워크 비용을 나타냅니다. `(non-witness 크기 * 3) + total 크기`로 계산됩니다.",
      example: 565,
    },
    fee: {
      type: "integer",
      description:
        "트랜잭션의 수수료(BTC 단위)로, 입력 값에서 출력 값을 뺀 나머지 값입니다.",
      example: 1840,
    },
    vinCount: {
      type: "integer",
      description: "입력(Vin) 트랜잭션의 개수를 나타냅니다.",
      example: 1,
    },
    voutCount: {
      type: "integer",
      description: "출력(Vout) 트랜잭션의 개수를 나타냅니다.",
      example: 1,
    },
    blockHeight: {
      type: "integer",
      description: "트랜잭션이 포함된 블록의 높이를 나타냅니다.",
      example: 844237,
    },
    blockHash: {
      type: "string",
      description: "트랜잭션이 포함된 블록의 해시 값입니다.",
      example:
        "00000000000000000002a30c53b8f371d4ebba1434cffa32716e6e84eb33b2af",
    },
    blockTimestamp: {
      type: "integer",
      description:
        "트랜잭션이 포함된 블록의 생성 시간을 나타내며, UNIX 타임스탬프 형식으로 표시됩니다.",
      example: 1716177005,
    },
  },
};

export const Vin: OpenAPIV3.SchemaObject = {
  type: "object",
  required: [
    "index",
    "address",
    "value",
    "coinbase",
    "voutTransactionId",
    "voutIndex",
    "scriptSig",
    "sequence",
    "witness",
  ],
  properties: {
    index: {
      type: "integer",
      description: "포함된 트랜잭션에서 Vin(입력)의 인덱스를 나타냅니다.",
      example: 0,
    },
    address: {
      type: "string",
      description:
        "Vin(입력)이 참조하는 이전 Vout(출력)의 주소로, 비트코인을 전송한 발송자의 주소를 나타냅니다.",
      example: "bc1q0a7h7sa94e8svscf8sxmhyj8fujgy423fzjjfr",
    },
    value: {
      type: "string",
      description:
        "Vin(입력)에서 참조된 이전 Vout(출력)의 출력 값으로, 전송되는 비트코인의 양을 나타냅니다 (BTC 단위).",
      example: "0.00506140",
    },
    coinbase: {
      type: "string",
      description:
        "Coinbase 트랜잭션(채굴 보상 트랜잭션)에서 사용되며, 채굴자가 정의한 임의의 데이터를 포함합니다. 일반 트랜잭션에서는 null로 설정됩니다.",
      example: null,
    },
    voutTransactionId: {
      type: "string",
      description:
        "Vin(입력)이 참조하는 이전 트랜잭션(Vout)의 ID를 나타냅니다. Coinbase 트랜잭션의 경우 이 필드는 null로 표기됩니다.",
      example:
        "c2976d591a92cc39f2bb1f367afbc2d6ae6e3c940b640eb245dfbeef75d340db",
    },
    voutIndex: {
      type: "integer",
      description:
        "Vin(입력)이 참조하는 이전 Vout(출력)의 인덱스를 나타냅니다. Coinbase 트랜잭션의 경우 null로 표기됩니다.",
      example: 0,
    },
    scriptSig: {
      type: "object",
      required: ["hex", "asm", "type"],
      description:
        "Vin(입력)의 서명 스크립트로, 참조된 이전 Vout(출력)의 잠금 스크립트를 해제하는 데 사용됩니다.",
      properties: {
        hex: {
          type: "string",
          description:
            "16진수 형식으로 표현된 Vin(입력)의 서명 스크립트입니다. SegWit 트랜잭션에서는 빈 문자열로 제공됩니다.",
          example: "3045022100b228e33e8b62f825...",
        },
        asm: {
          type: "string",
          description:
            "어셈블리 형식으로 표현된 Vin(입력)의 서명 스크립트입니다. SegWit 트랜잭션에서는 빈 문자열로 제공됩니다.",
          example: "OP_HASH160 OP_PUSHBYTES_20 000000...",
        },
        type: {
          type: "string",
          description:
            "Vin(입력)의 서명 스크립트 유형을 나타냅니다 (예: `p2pkh`, `p2sh` 등).",
          example: "witness_v0_keyhash",
        },
      },
    },
    sequence: {
      type: "integer",
      description:
        "Vin(입력)의 시퀀스 번호로, 트랜잭션의 유효성을 제어하거나 `locktime`과 함께 작동합니다. RBF 기능 제어에도 사용됩니다.",
      example: 4294967295,
    },
    witness: {
      type: "array",
      description:
        "SegWit 트랜잭션의 경우 포함되는 Vin(입력)의 스크립트 서명 데이터 배열입니다.",
      items: {
        type: "string",
        example: "3045022100b228e33e8b62f825...",
      },
    },
  },
};

export const Vout: OpenAPIV3.SchemaObject = {
  type: "object",
  required: ["index", "address", "value", "scriptPubKey"],
  properties: {
    index: {
      type: "integer",
      description: "포함된 트랜잭션에서 Vout(출력)의 인덱스를 나타냅니다.",
      example: 0,
    },
    address: {
      type: "string",
      description:
        "Vout(출력)에서 비트코인을 수신할 수신자의 주소를 나타냅니다.",
      example: "D5Vz9PwaMdPfFCxXPCbBt84s3ZJQ5wd2Gw",
    },
    value: {
      type: "string",
      description:
        "Vout(출력)에서 전송된 비트코인의 양을 나타냅니다 (BTC 단위).",
      example: "0.00016400",
    },
    scriptPubKey: {
      type: "object",
      required: ["hex", "asm", "type"],
      description:
        "Vout(출력) 스크립트로, 비트코인을 사용하기 위한 조건(잠금 스크립트)을 정의합니다.",
      properties: {
        hex: {
          type: "string",
          description: "16진수 형식으로 표현된 Vout(출력)의 스크립트입니다.",
          example:
            "21025ac17459519db3146065c5a1738cd45315c38951e978d792492a6633c9cd6e75ac",
        },
        asm: {
          type: "string",
          description: "어셈블리 형식으로 표현된 Vout(출력)의 스크립트입니다.",
          example:
            "025ac17459519db3146065c5a1738cd45315c38951e978d792492a6633c9cd6e75 OP_CHECKSIG",
        },
        type: {
          type: "string",
          description:
            "Vout(출력) 스크립트의 유형을 나타냅니다 (예: pubkey, p2sh, p2pkh 등).",
          example: "pubkey",
        },
      },
    },
  },
};

export const UTXO: OpenAPIV3.SchemaObject = {
  type: "object",
  required: [
    "transactionId",
    "voutIndex",
    "address",
    "value",
    "blockHeight",
    "blockHash",
    "blockTimestamp",
  ],
  properties: {
    transactionId: {
      type: "string",
      description:
        "UTXO가 생성된 트랜잭션의 고유 식별자입니다. 트랜잭션 데이터를 기반으로 계산된 고유한 해시 값으로, 트랜잭션을 고유하게 식별합니다.",
      example: "6b1e04c59a1e42d30af4cdac20e1a9e4d22e947b",
    },
    voutIndex: {
      type: "integer",
      description:
        "UTXO가 생성된 트랜잭션의 출력(Vout) 인덱스입니다. 트랜잭션 출력 배열에서 몇 번째 출력인지 나타내며, 0부터 시작합니다.",
      example: 1,
    },
    address: {
      type: "string",
      description:
        "트랜잭션의 출력을 수신한 주소입니다. 수신자는 이 주소를 사용하여 UTXO를 소유하며, P2PKH, P2SH, Bech32, 또는 Bech32m 형식을 따릅니다.",
      example: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    },
    value: {
      type: "integer",
      description:
        "UTXO의 값으로, 트랜잭션 출력의 잔액을 나타냅니다. 값은 Satoshi 단위로 표현되며, 1 BTC = 100,000,000 Satoshi입니다.",
      example: 5000000000,
    },
    blockHeight: {
      type: "integer",
      description:
        "UTXO가 포함된 블록의 높이를 나타냅니다. 블록체인에서 이 블록의 순서를 나타내는 정수 값입니다.",
      example: 100000,
    },
    blockHash: {
      type: "string",
      description:
        "UTXO가 포함된 블록의 해시 값입니다. SHA-256 알고리즘으로 생성된 고유한 64자리 16진수 값으로, 블록을 고유하게 식별합니다.",
      example: "0000000000000000000a8ed7f3e6c1c2d21cbb5f",
    },
    blockTimestamp: {
      type: "integer",
      description:
        "UTXO가 포함된 블록의 생성 시간을 나타냅니다. 값은 UNIX 타임스탬프 형식(초 단위)으로, 블록의 생성 시점을 나타냅니다.",
      example: 1400000000,
    },
  },
};

export const Transfer: OpenAPIV3.SchemaObject = {
  type: "object",
  required: [
    "senders",
    "recipients",
    "fee",
    "transactionHash",
    "transactionId",
    "blockHeight",
    "blockHash",
    "blockTimestamp",
  ],
  properties: {
    senders: {
      type: "array",
      description:
        "트랜잭션에 포함된 각 송신자의 세부 정보를 포함한 배열입니다. 각 객체는 송신자의 주소, 송금 금액, 송신자의 인덱스를 포함합니다.",
      items: {
        type: "object",
        required: ["index", "address", "amount"],
        properties: {
          index: {
            type: "integer",
            description:
              "송신자의 인덱스로, 트랜잭션에서 송신자를 고유하게 식별합니다. 0부터 시작하며, 송신자가 여러 명일 경우 순차적으로 부여됩니다.",
            example: 0,
          },
          address: {
            type: "string",
            description:
              "송신자의 주소입니다. 송신자가 트랜잭션에서 비트코인을 보내기 위해 사용하는 주소이며, P2PKH, P2SH, Bech32, 또는 Bech32m 형식을 따릅니다.",
            example: "2N5PcdirZUzKF9bWuGdugNuzcQrCbBudxv1",
          },
          amount: {
            type: "string",
            description:
              "송신자가 트랜잭션에서 보낸 금액으로, BTC 단위로 표시됩니다. 금액은 소수점 8자리까지 허용됩니다.",
            example: "0.0873472",
          },
        },
      },
      example: [
        {
          index: 0,
          address: "2N5PcdirZUzKF9bWuGdugNuzcQrCbBudxv1",
          amount: "0.0873472",
        },
      ],
    },
    recipients: {
      type: "array",
      description:
        "트랜잭션에 포함된 각 수신자의 세부 정보를 포함한 배열입니다. 각 객체는 수신자의 주소, 수령 금액, 수신자의 인덱스를 포함합니다.",
      items: {
        type: "object",
        required: ["index", "address", "amount"],
        properties: {
          index: {
            type: "integer",
            description:
              "수신자의 인덱스로, 트랜잭션에서 수신자를 고유하게 식별합니다. 0부터 시작하며, 수신자가 여러 명일 경우 순차적으로 부여됩니다.",
            example: 0,
          },
          address: {
            type: "string",
            description:
              "수신자의 주소입니다. 수신자가 비트코인을 받기 위해 사용하는 주소이며, P2PKH, P2SH, Bech32, 또는 Bech32m 형식을 따릅니다.",
            example: "2MzakdGTEp8SMWEHKwKM4HYv6uNCBXtHpkV",
          },
          amount: {
            type: "string",
            description:
              "수신자가 트랜잭션에서 받은 금액으로, BTC 단위로 표시됩니다. 금액은 소수점 8자리까지 허용됩니다.",
            example: "0.00144",
          },
        },
      },
      example: [
        {
          index: 0,
          address: "2MzakdGTEp8SMWEHKwKM4HYv6uNCBXtHpkV",
          amount: "0.00144",
        },
        {
          index: 1,
          address: "2N3zifWQLo3SQFRCYWA5QCkssAJtByRxuVh",
          amount: "0.0842140",
        },
      ],
    },
    fee: {
      type: "string",
      description:
        "트랜잭션 수수료로, 송신자가 트랜잭션을 블록체인 네트워크에 포함시키기 위해 지불한 금액입니다. 금액은 BTC 단위로 표시됩니다.",
      example: "0.0016932",
    },
    transactionHash: {
      type: "string",
      description:
        "트랜잭션의 고유 해시 값입니다. 트랜잭션 데이터를 기반으로 생성된 64자리 16진수 문자열로, 트랜잭션을 고유하게 식별합니다.",
      example:
        "1ec73b0f61359927d02376b35993b756b1097cb9a857bec23da4c98c4977d2b2",
    },
    transactionId: {
      type: "string",
      description:
        "트랜잭션의 고유 ID입니다. 각 트랜잭션을 고유하게 식별할 수 있는 값으로, 64자리 16진수 문자열로 나타납니다.",
      example:
        "4b66461bf88b61e1e4326356534c135129defb504c7acb2fd6c92697d79eb250",
    },
    blockHeight: {
      type: "integer",
      description:
        "트랜잭션이 포함된 블록의 높이를 나타냅니다. 블록체인에서 순서를 나타내는 정수 값입니다.",
      example: 100000,
    },
    blockHash: {
      type: "string",
      description:
        "트랜잭션이 포함된 블록의 고유 해시 값입니다. SHA-256 알고리즘을 기반으로 생성된 64자리 16진수 문자열로, 블록을 고유하게 식별합니다.",
      example: "0000000000000000000a8ed7f3e6c1c2d21cbb5f",
    },
    blockTimestamp: {
      type: "integer",
      description:
        "트랜잭션이 포함된 블록의 생성 시간입니다. 값은 UNIX 타임스탬프 형식으로, 블록이 생성된 UTC 시간을 초 단위로 나타냅니다.",
      example: 1400000000,
    },
  },
};
