import { OpenAPIV3 } from "openapi-types";
import { Patterns } from "../../../patterns";
import { ERC20, ETHEREUM_ACCOUNTS } from "../../../constants";

namespace Requests {
  /** Path Parameters **/
  export function chain(
    example: string,
    list: string[]
  ): OpenAPIV3.ParameterObject {
    return {
      name: "chain",
      in: "path",
      required: true,
      schema: {
        type: "string",
        enum: list,
        default: example,
      },
      description: `조회 대상 체인을 지정하기 위한 파라미터입니다. 
<strong style="color: red;">*</strong> 응답 결과에는 지정한 체인명이 protocol 필드에 반환됩니다.`,
    };
  }

  export function network(
    example: string,
    list: string[]
  ): OpenAPIV3.ParameterObject {
    return {
      name: "network",
      in: "path",
      required: true,
      schema: {
        type: "string",
        default: example,
        enum: list,
      },
      description: `조회 대상 체인의 네트워크를 지정하기 위한 파라미터입니다. 체인에 따라 지원되는 네트워크가 다를 수 있습니다.

- aptos: "mainnet", "testnet"
- arbitrum: "mainnet", "sepolia"
- base: "mainnet", "sepolia",
- ethereum: "mainnet", "sepolia", "hoodi"
- giwa: "sepolia"
- kaia: "mainnet", "kairos"
- optimism: "mainnet", "sepolia"
- polygon: "mainnet", "amoy"
- luniverse(the balance): "mainnet"
`,
    };
  }

  export function networkForEvm(
    example: string,
    list: string[]
  ): OpenAPIV3.ParameterObject {
    return {
      name: "network",
      in: "path",
      required: true,
      schema: {
        type: "string",
        default: example,
        enum: list,
      },
      description: `조회 대상 체인의 네트워크를 지정하기 위한 파라미터입니다. 체인에 따라 지원되는 네트워크가 다를 수 있습니다.

- arbitrum: "mainnet", "sepolia"
- base: "mainnet", "sepolia",
- ethereum: "mainnet", "sepolia", "hoodi"
- giwa: "sepolia"
- kaia: "mainnet", "kairos"
- optimism: "mainnet", "sepolia"
- polygon: "mainnet", "amoy"
- luniverse(the balance): "mainnet"
`,
    };
  }

  export function networkForAptos(
    example: string,
    list: string[]
  ): OpenAPIV3.ParameterObject {
    return {
      name: "network",
      in: "path",
      required: true,
      schema: {
        type: "string",
        default: example,
        enum: list,
      },
      description: `조회 대상 체인의 네트워크를 지정하기 위한 파라미터입니다.`,
    };
  }

  export const subscriptionId: OpenAPIV3.ParameterObject = {
    name: "subscriptionId",
    in: "path",
    required: true,
    schema: {
      type: "string",
    },
    description:
      "조회하고자 하는 Webhook에 할당된 subscriptionId를 지정하기 위한 파라미터입니다. Webhook 생성 시 반환되는 subscriptionId를 사용하여 Webhook 정보를 조회, 수정 및 삭제할 수 있습니다.",
  };

  /** Query Parameters **/
  export const pageQuery: OpenAPIV3.ParameterObject = {
    name: "page",
    in: "query",
    required: false,
    schema: {
      type: "string",
    },
    description: "조회할 페이지를 지정합니다. 기본값은 1입니다.",
  };

  export const rppQuery: OpenAPIV3.ParameterObject = {
    name: "rpp",
    in: "query",
    required: false,
    schema: {
      type: "string",
    },
    description:
      "한 페이지에 조회할 이벤트 수를 지정합니다. 값의 범위는 1에서 100입니다. 기본값은 10입니다.",
  };

  export const subscriptionIdQuery: OpenAPIV3.ParameterObject = {
    name: "subscriptionId",
    in: "query",
    required: false,
    schema: {
      type: "string",
    },
    description:
      "조회하고자 하는 Webhook에 할당된 subscriptionId를 지정하기 위한 파라미터입니다. Webhook 생성 시 반환되는 subscriptionId를 사용하여 Webhook 정보를 조회, 수정 및 삭제할 수 있습니다. 빈 값을 입력하면 모든 Webhook 정보를 조회합니다.",
  };

  export const withEventMessageQuery: OpenAPIV3.ParameterObject = {
    name: "withEventMessage",
    in: "query",
    required: false,
    schema: {
      type: "boolean",
    },
    description:
      "이벤트 메시지를 함께 조회할지 여부를 지정합니다. 기본값은 false입니다.",
  };

  export const statusQuery: OpenAPIV3.ParameterObject = {
    name: "status",
    in: "query",
    required: false,
    schema: {
      type: "string",
      enum: ["SUCCESS", "FAIL"],
    },
    description:
      "웹훅 호출의 성공(SUCCESS) 또는 실패(FAIL) 여부를 기준으로 이벤트를 필터링합니다.",
  };

  export const startAtQuery: OpenAPIV3.ParameterObject = {
    name: "startAt",
    in: "query",
    required: false,
    schema: {
      type: "string",
      format: "date-time",
    },
    description:
      "조회할 이벤트 발생의 시작 시각을 ISO 8601 형식으로 지정합니다.",
  };

  export const endAtQuery: OpenAPIV3.ParameterObject = {
    name: "endAt",
    in: "query",
    required: false,
    schema: {
      type: "string",
      format: "date-time",
    },
    description:
      "조회할 이벤트 발생의 종료 시각을 ISO 8601 형식으로 지정합니다.",
  };

  export const startSequenceNumberQuery: OpenAPIV3.ParameterObject = {
    name: "startSequenceNumber",
    in: "query",
    required: false,
    schema: {
      type: "string",
    },
    description: "조회를 시작할 sequenceNumber를 지정합니다.",
  };

  /** Common **/
  export const eventTypeForEvm: OpenAPIV3.SchemaObject = {
    type: "string",
    description:
      "Webhook으로 구독하고자 하는 이벤트 타입 구분자를 지정하는 파라미터입니다. 지원되는 이벤트 타입에 대한 정보는 Event Types 페이지를 참고하세요.",
    enum: [
      "ADDRESS_ACTIVITY",
      "MINED_TRANSACTION",
      "SUCCESSFUL_TRANSACTION",
      "FAILED_TRANSACTION",
      "TOKEN_TRANSFER",
      "BELOW_THRESHOLD_BALANCE",
      "BLOCK_PERIOD",
      "BLOCK_LIST_CALLER",
      "ALLOW_LIST_CALLER",
      "LOG",
    ],
  };

  export const eventTypeForAptos: OpenAPIV3.SchemaObject = {
    type: "string",
    description:
      "Webhook으로 구독하고자 하는 이벤트 타입 구분자를 지정하는 파라미터입니다. 지원되는 이벤트 타입에 대한 정보는 Event Types 페이지를 참고하세요.",
    enum: ["EVENT", "TRANSACTION"],
  };

  export const description: OpenAPIV3.SchemaObject = {
    type: "string",
    description: "이벤트의 설명을 지정하는 파라미터입니다.",
  };

  export const notification: OpenAPIV3.SchemaObject = {
    type: "object",
    description:
      "이벤트 발생 시 알림을 받기 위해 필요한 정보를 지정하는 파라미터입니다.",
    properties: {
      webhookUrl: {
        type: "string",
        description:
          "구독한 이벤트 발생 시 알림을 받을 웹훅 URL을 지정하는 파라미터입니다. Public Access가 가능한 URL을 지정해야 합니다.",
      },
    },
  };

  export const conditionForEvm: OpenAPIV3.SchemaObject = {
    type: "object",
    description:
      "구독하고자 하는 이벤트 조건의 상제 정의를 위한 필드입니다. 이벤트 타입에 따라 입력 가능한 조건이 다르기 때문에, Webhook Types 페이지를 참고하여 사용하세요.",
    oneOf: [
      {
        title: "ADDRESS_ACTIVITY",
        description:
          "사용자가 지정한 주소 배열에 포함된 계정들의 활동을 모니터링합니다. 이 이벤트는 해당 계정들이 트랜잭션의 발신자(from) 또는 수신자(to)로 포함되어 있는 경우, 즉 트랜잭션, 토큰 전송(ERC20), 또는 NFT 전송(ERC721, ERC1155)이 발생할 때마다 알림을 제공합니다. 이 서비스는 사용자가 다수의 주소에 대한 활동을 실시간으로 파악할 수 있게 해 주어, 자산의 이동과 거래를 효과적으로 추적할 수 있도록 돕습니다.",
        type: "object",
        required: ["addresses"],
        properties: {
          addresses: {
            type: "array",
            description: "이벤트를 모니터링 하고자 하는 주소들의 목록입니다.	",
            items: {
              type: "string",
              format: Patterns.ethereum.address.source,
              default: "0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97",
              example: [ERC20.USDT, ETHEREUM_ACCOUNTS.VITALIK_BUTERIN],
            },
          },
        },
      },
      {
        title: "MINED_TRANSACTION",
        description:
          "특정 주소가 발송한 트랜잭션이 블록체인 네트워크에 의해 성공적으로 채굴되고 최종적으로 확인되었을 때, 그 트랜잭션의 영수증(receipt) 정보를 알림으로 제공합니다. 이 이벤트는 트랜잭션이 성공적으로 처리된 경우, 그리고 실패한 경우 모두 알림을 받을 수 있습니다. 사용자는 이를 통해 자신이 발송한 트랜잭션의 최종 상태를 실시간으로 파악할 수 있으며, 트랜잭션의 성공 또는 실패 여부를 확인할 수 있습니다.",
        type: "object",
        required: ["addresses"],
        properties: {
          addresses: {
            type: "array",
            description:
              "모니터링 하고자 하는 트랜잭션의 sender 주소 목록. 배열에 포함된 주소 중 하나라도 from에 포함된 트랜잭션이 발생하는 경우 알림을 수신할 수 있습니다.",
            items: {
              type: "string",
              format: Patterns.ethereum.address.source,
              default: "0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97",
              example: [ERC20.USDT, ETHEREUM_ACCOUNTS.VITALIK_BUTERIN],
            },
          },
        },
      },
      {
        title: "SUCCESSFUL_TRANSACTION",
        description:
          "특정 주소가 발송한 트랜잭션이 성공적으로 처리되었을 때 알림을 제공합니다. 이 이벤트는 트랜잭션이 블록체인 네트워크에 의해 완전히 확인되고 유효한 것으로 판정될 때 발생합니다. 사용자는 이를 통해 자신의 트랜잭션이 예상대로 실행되어 결과적으로 원하는 작업이 성공적으로 완료되었음을 확인할 수 있습니다.",
        type: "object",
        required: ["addresses"],
        properties: {
          addresses: {
            type: "array",
            description:
              "모니터링 하고자 하는 트랜잭션의 sender 주소 목록. 배열에 포함된 주소 중 하나라도 from에 포함된 트랜잭션이 발생하는 경우 알림을 수신할 수 있습니다.",
            items: {
              type: "string",
              format: Patterns.ethereum.address.source,
              default: "0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97",
              example: [ERC20.USDT, ETHEREUM_ACCOUNTS.VITALIK_BUTERIN],
            },
          },
        },
      },
      {
        title: "FAILED_TRANSACTION",
        description:
          "특정 주소가 발송한 트랜잭션이 실패했을 때 알림을 제공합니다. 이 이벤트는 트랜잭션이 블록체인 네트워크에 의해 거부되거나, 실행 중 오류가 발생하여 완료되지 못했을 경우 발생합니다. 이를 통해 사용자는 트랜잭션 실패의 원인을 신속하게 파악하고, 필요한 조치를 취할 수 있습니다. 실패 이윤이 가스 부족, 계약 조건 불충족 등 다양한 기술적 문제로 인해 발생할 수 있으며, 이 이벤트는 블록체인 상의 트랜잭션 관리와 오류 추적을 보다 효과적으로 수행할 수 있게 도와줍니다.",
        type: "object",
        required: ["addresses"],
        properties: {
          addresses: {
            type: "array",
            description:
              "모니터링 하고자 하는 트랜잭션의 sender 주소 목록. 배열에 포함된 주소 중 하나라도 from에 포함된 트랜잭션이 발생하는 경우 알림을 수신할 수 있습니다.",
            items: {
              type: "string",
              format: Patterns.ethereum.address.source,
              default: "0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97",
              example: [ERC20.USDT, ETHEREUM_ACCOUNTS.VITALIK_BUTERIN],
            },
          },
        },
      },
      {
        title: "TOKEN_TRANSFER",
        description:
          "토큰(ERC20) 전송 또는 NFT(ERC721, ERC1155) 전송이 발생할 경우 알림을 제공합니다. 사용자는 특정 컨트랙트 주소를 지정하여 해당 컨트랙트에서 발생하는 토큰 이동을 모니터링할 수 있습니다. 또한, ERC721과 ERC1155 표준에 따른 NFT의 경우, 특정 토큰 ID를 조건으로 설정하여 해당 ID의 토큰 전송만을 추적하는 것이 가능합니다.",
        type: "object",
        required: ["tokens"],
        properties: {
          tokens: {
            type: "array",
            description: "전송 이벤트를 모니터링 하고자 하는 토큰 정보 객체",
            items: {
              type: "object",
              required: ["contractAddress"],
              properties: {
                contractAddress: {
                  type: "string",
                  description:
                    "모니터링 하고자 하는 ERC20 또는 ERC721, ERC1155 토큰의 컨트랙트 주소",
                  format: Patterns.ethereum.address.source,
                  default: "0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97",
                  example: [ERC20.USDT, ETHEREUM_ACCOUNTS.VITALIK_BUTERIN],
                },
                tokenId: {
                  type: "string",
                  description:
                    "해당 ERC721 또는 ERC1155 컨트랙트의 특정 토큰에 대한 전송 이벤트만 모니터링 하고자 하는 경우, 토큰 ID",
                  format: Patterns.string.decimal().source,
                  example: ["1", "9386"],
                },
              },
            },
          },
        },
      },
      {
        title: "BELOW_THRESHOLD_BALANCE",
        description:
          "지정된 계정의 잔고가 사용자가 설정한 특정 수치 이하로 떨어질 경우 알림을 제공합니다. 이 이벤트는 특히 재정 관리와 자산 보호에 중요한 역할을 합니다. 사용자는 이 기능을 통해 자신의 계정이 최소 잔고 아래로 떨어지지 않도록 예방 조치를 취할 수 있으며, 필요한 경우 적시에 추가 자금을 이체하거나 다른 금융 조치를 취할 수 있습니다.",
        type: "object",
        required: ["address", "belowThresholdBalance"],
        properties: {
          address: {
            type: "string",
            description: "잔고 알림을 받고자 하는 대상 주소	",
            default: "0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97",
            example: [ERC20.USDT, ETHEREUM_ACCOUNTS.VITALIK_BUTERIN],
          },
          belowThresholdBalance: {
            type: "string",
            description: `모니터링 하고자 하는 잔고의 임계값. 잔고가 설정한 임계값 밑으로 떨어지는 경우, 알림을 받을 수 있습니다.
> 📘 알림의 주기는 어떻게 되나요?
> 
> 1분 마다 해당 주소의 잔고를 조회하며 입력한 THRESHOLD 보다 잔고가 낮을 경우, 알림을 전송합니다. 만약 조회 시점마다 실제 잔고가 belowThresholdBalance에 입력한 값보다 낮은 경우, 알림을 계속해서 받을 수 있습니다.
`,
            default: "1000000000000000000",
            example: ["1000000000", "100000000000", "1000000000000000000"],
          },
        },
      },
      {
        title: "BLOCK_PERIOD",
        description:
          "네트워크에서 생성되는 블록의 주기에 따라 알림을 제공합니다. 사용자는 원하는 블록 주기(예: 매 블록, N개의 블록마다)를 설정하여 해당 주기에 맞춰 블록 정보를 받을 수 있습니다. 이 이벤트는 특정 수의 블록이 확인된 후에 정보를 제공함으로써, 더욱 안정적이고 확정된 데이터를 제공합니다.",
        type: "object",
        required: ["period"],
        properties: {
          period: {
            type: "integer",
            description:
              "이벤트 알림을 받을 블록 주기 설정의 값. 1로 설정하는 경우 매 블록이 생성될 때마다 알림을 받을 수 있습니다.",
            default: 1,
            example: [1, 2, 10],
          },
        },
      },
      {
        title: "BLOCK_LIST_CALLER",
        description:
          "특정 주소 목록(block list)에 포함된 주소들이 대상 주소(target address)로 토큰을 전송할 때 알림을 제공합니다. 이 이벤트 타입은 주로 사전에 정의된 블록 리스트에 있는 주소들의 활동을 모니터링하고 싶을 때 활용됩니다. 예를 들어, 블랙리스트에 올라간 주소들이 특정 계정으로 자금을 이체하려고 시도할 때 즉시 경고를 받을 수 있습니다. 이를 통해 불법적이거나 의심스러운 자금 이동을 사전에 감지할 수 있는 유용한 도구입니다.",
        type: "object",
        required: ["address", "blockListCallers"],
        properties: {
          address: {
            type: "string",
            description: "토큰 전송 이벤트를 모니터링 하고자 하는 대상 주소",
            default: "0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97",
            example: [
              ETHEREUM_ACCOUNTS.VITALIK_BUTERIN,
              ETHEREUM_ACCOUNTS.BINANCE,
            ],
          },
          blockListCallers: {
            type: "array",
            description:
              "대상 주소로 토큰 전송이 발생하는 경우 알림을 받고자 하는 주소의 목록",
            items: {
              type: "string",
              default: "0x6ccf8Ecfc7805145ce5e3f1448c2f54572970f74",
              example: [
                ETHEREUM_ACCOUNTS.VITALIK_BUTERIN,
                ETHEREUM_ACCOUNTS.BINANCE,
              ],
            },
          },
        },
      },
      {
        title: "ALLOW_LIST_CALLER",
        description:
          "허용 리스트(allow list)에 포함된 주소들이 대상 주소로 토큰을 전송할 때 알림을 제공합니다. 이 리스트에는 신뢰할 수 있는 주소들이 포함되어 있으며, 해당 주소들로부터의 자금 이동은 안전하거나 예상된 활동으로 간주됩니다. 이 이벤트 타입은 허용된 주소들의 활동을 추적하고, 허용 리스트에 포함된 주소로부터의 자금 이체를 확증하고자 할 때 사용됩니다.",
        type: "object",
        required: ["address", "allowListCallers"],
        properties: {
          address: {
            type: "string",
            description: "토큰 전송 이벤트를 모니터링 하고자 하는 대상 주소",
            default: "0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97",
            example: [
              ETHEREUM_ACCOUNTS.VITALIK_BUTERIN,
              ETHEREUM_ACCOUNTS.BINANCE,
            ],
          },
          allowListCallers: {
            type: "array",
            description:
              "대상 주소로 토큰 전송이 발생하는 경우 알림을 받고자 하는 주소의 목록",
            items: {
              type: "string",
              default: "0x6ccf8Ecfc7805145ce5e3f1448c2f54572970f74",
              example: [
                ETHEREUM_ACCOUNTS.VITALIK_BUTERIN,
                ETHEREUM_ACCOUNTS.BINANCE,
              ],
            },
          },
        },
      },
      {
        title: "LOG",
        description:
          "지정한 스마트 컨트랙트 이벤트 로그가 포함된 트랜잭션이 생성될 때 알림을 제공합니다. 사용자는 모니터링하려는 계정 주소(address)와 이벤트의 식별자 정보(topics)를 필터 조건으로 지정할 수 있습니다. 예를 들어, ERC20 표준의 토큰 전송 이벤트인 Transfer(address,address,uint256)를 모니터링하도록 설정하면, 해당 Event signature(0xddf252ad...)와 일치하는 모든 트랜잭션 로그가 캡처됩니다. LOG EventType을 활용하여 표준 토큰 전송 또는 특정 스마트 계약 이벤트와 같은 중요한 활동을 효율적으로 추적할 수 있습니다.",
        type: "object",
        required: ["address", "topics"],
        properties: {
          address: {
            type: "string",
            description: "토큰 전송 이벤트를 모니터링 하고자 하는 대상 주소",
            default: ETHEREUM_ACCOUNTS.VITALIK_BUTERIN,
            example: [
              ETHEREUM_ACCOUNTS.VITALIK_BUTERIN,
              ETHEREUM_ACCOUNTS.BINANCE,
            ],
          },
          topics: {
            type: "array",
            description: `모니터링 하고자 하는 Event Log의 Topic 배열 객체. 최대 4개의 문자열을 포함할 수 있습니다.

> 📘 모니터링하려는 이벤트의 Topic 필드는 스마트 컨트랙트 이벤트와 연결된 데이터를 필터링하는 데 사용됩니다. 각 Topic에는 이벤트의 Event signature 및 인덱싱된 파라미터 정보가 포함됩니다.
> **topics[0]: Event Signature**
> - topics[0]은 항상 이벤트의 Event signature를 Keccak256 해시로 변환한 값입니다.
> 예를 들어, Transfer(address indexed from, address indexed to, uint256 value) 이벤트의 경우 Event signature는 다음과 같은 코드를 실행하여 확인할 수 있습니다.
> \`Keccak256("Transfer(address,address,uint256)") = 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef \`
>
> **topics[1], topics[2], topics[3]: Indexed Parameters**
> - topics[1]부터는 해당 이벤트의 indexed 파라미터 값에 해당합니다. 스마트 컨트랙트에서 indexed 키워드로 선언된 이벤트 파라미터만 Topic에 포함됩니다. 위 예제의 Transfer 이벤트의 경우, from address가 topics[1], to address가 topics[2]에 해당합니다. 즉, from address에 특정 주소가 포함된 이벤트만 필터링 하고 싶다면, topics[1]에 해당 주소값을 입력할 수 있습니다. indexed 파라미터를 제외한 나머지 파라미터들에 대한 입력값은 조회한 로그의 data 필드에서 확인할 수 있습니다.
>
> **Topic 값을 확인하는 방법**
> - 스마트 컨트랙트 코드에서 확인하는 방법: Solidity 코드에서 이벤트 정의를 확인하고, indexed 파라미터와 Event signature를 식별한 뒤, Keccak256 해싱을 통해 Topic에 들어갈 값을 확인할 수 있습니다.
> - 블록 Explorer를 활용한 방법: 추적하고자 하는 트랜잭션 예제를 선택하여 트랜잭션 상세로 이동한 뒤, "Logs" 섹션 등 관련 섹션을 통해 Topic값을 확인할 수 있습니다. 아래는 이더스캔(https://etherscan.io) 에서 USDC(ERC20) Transfer 이벤트에 대한 로그를 확인하는 예시 화면입니다.
`,
            minItems: 1,
            maxItems: 4,
            items: {
              type: "string",
              default:
                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
              example: [
                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                "0x000000000000000000000000b7aa2d3c833a6827c4f39bef9622d7cddf66b7e7",
                "0x0000000000000000000000003264039cfaa37a70a0e8ccfbf4b7e60bedce5c9f",
              ],
            },
          },
        },
      },
    ],
  };

  export const conditionForAptos: OpenAPIV3.SchemaObject = {
    type: "object",
    description:
      "구독하고자 하는 이벤트 조건의 상제 정의를 위한 필드입니다. 이벤트 타입에 따라 입력 가능한 조건이 다르기 때문에, Webhook Types 페이지를 참고하여 사용하세요.",
    oneOf: [
      {
        title: "EVENT",
        description:
          "지정한 이벤트가 발생할 때마다 알림을 제공합니다. 사용자는 이를 통해 네트워크 상에서 발생하는 중요한 활동을 빠르게 파악할 수 있습니다.",
        type: "object",
        required: ["eventType", "eventAccountAddress"],
        properties: {
          eventType: {
            type: "string",
            description: `모니터링 하고자하는 이벤트 타입. 이벤트 타입은 모듈에서 정의한 event struct의 이름을 의미합니다. 이 필드는 \`module_address::module_name::event_name\` 형식으로 입력합니다.
> 📘 \`0x1::transaction_fee::FeeStatement\` 는 eventType에 사용할 수 없나요?
> 네, 이 이벤트는 가스비를 소모하는 모든 user transaction에 포함됩니다.
> 따라서 별도의 이벤트로 구독할 필요가 없으므로, Transaction 이벤트를 구독하는 방식을 권장드립니다.
`,
            default: "0x1::account::CoinRegisterEvent",
            example: [
              "0x6d138096fb880d1c16b48f10686b98a96000c0ac18501425378f784c6b81c34d::eragon_lucky_wheel::EragonLuckyWheelEvent",
              "0x1::coin::CoinDeposit",
            ],
          },
          eventAccountAddress: {
            type: "string",
            description: `모니터링 하고자하는 이벤트를 발생시키는 주소. 
> 📘 Module Events일 때는 eventAccountAddress를 꼭 0x0으로 입력해야 하나요?
> 맞습니다. eventType이 “Module Events”인 경우에는 eventAccountAddress를 반드시 “0x0”으로 입력해 주세요. 만약, “Event-Handler Events”로 정의된 경우에는 이벤트를 발생한 계정 주소를 입력하시면 됩니다. 이벤트 종류에 대한 자세한 내용은 [Aptos 공식 문서](https://aptos.dev/en/network/blockchain/events)에서 확인하실 수 있습니다.
`,
            default: "0x0",
            example: [
              "0x1",
              "0x6d138096fb880d1c16b48f10686b98a96000c0ac18501425378f784c6b81c34d",
            ],
          },
          eventData: {
            type: "string",
            format: "json",
            description: `이벤트 데이터 필터링 조건을 지정하는 객체. 이 필드를 활용하면 특정 키와 값을 지정하여 원하는 이벤트만 필터링할 수 있습니다. JSON 객체 형식으로 최대 3단계 중첩된 값까지 입력 가능합니다. 입력한 키와 값이 이벤트 데이터와 정확히 일치하는 경우에만 필터링됩니다.`,
            example: [`{ transfer: { sender: "0xcafe", receiver: "0xface" } }`],
          },
        },
      },
      {
        title: "TRANSACTION",
        description:
          "이 기능은 사용자가 특정 이벤트 유형(eventType)과 해당 이벤트를 발생시킨 계정(eventAccountAddress)을 입력하여 API를 설정하면, 지정된 이벤트 유형이 발생했을 때 해당 이벤트 유형이 포함된 트랜잭션의 모든 세부 내역을 반환하는 API입니다. 이벤트가 발생하면 해당 트랜잭션의 전체 내역, 발신자, 수신자, 금액, 호출된 함수, 관련 데이터 등 모든 세부 정보를 확인할 수 있어 시스템 모니터링에 유용하게 활용될 수 있습니다.",
        type: "object",
        oneOf: [
          {
            title: "function condition set",
            required: ["payloadFunction"],
            properties: {
              payloadFunction: {
                type: "string",
                description: `모니터링 하고자하는 함수. 이 필드는 \`module_address::module_name::function_name\` 형식으로 입력합니다.`,
                default:
                  "0x6d138096fb880d1c16b48f10686b98a96000c0ac18501425378f784c6b81c34d::eragon_lucky_wheel::roll_premium",
                example: [
                  "0x1::aptos_account::transfer",
                  "0x1::aptos_account::transfer_coins",
                  "0x1::primary_fungible_store::transfer",
                ],
              },
            },
          },
          {
            title: "event condition set",
            required: ["eventType", "eventAccountAddress"],
            properties: {
              eventType: {
                type: "string",
                description: `모니터링 하고자하는 이벤트 타입. 이벤트 타입은 모듈에서 정의한 event struct의 이름을 의미합니다. 이 필드는 \`module_address::module_name::event_name\` 형식으로 입력합니다.
> 📘 \`0x1::transaction_fee::FeeStatement\` 는 eventType에 사용할 수 없나요?
> 네, 이 이벤트는 가스비를 소모하는 모든 user transaction에 포함됩니다.
> 따라서 별도의 이벤트로 구독할 필요가 없으므로, Transaction 이벤트를 구독하는 방식을 권장드립니다.
`,
                default: "0x1::account::CoinRegisterEvent",
                example: [
                  "0x6d138096fb880d1c16b48f10686b98a96000c0ac18501425378f784c6b81c34d::eragon_lucky_wheel::EragonLuckyWheelEvent",
                  "0x1::coin::CoinDeposit",
                ],
              },
              eventAccountAddress: {
                type: "string",
                description: `모니터링 하고자하는 이벤트를 발생시키는 주소. 
> 📘 Module Events일 때는 eventAccountAddress를 꼭 0x0으로 입력해야 하나요?
> 맞습니다. eventType이 “Module Events”인 경우에는 eventAccountAddress를 반드시 “0x0”으로 입력해 주세요. 만약, “Event-Handler Events”로 정의된 경우에는 이벤트를 발생한 계정 주소를 입력하시면 됩니다. 이벤트 종류에 대한 자세한 내용은 [Aptos 공식 문서](https://aptos.dev/en/network/blockchain/events)에서 확인하실 수 있습니다.
`,
                default: "0x0",
                example: [
                  "0x1",
                  "0x6d138096fb880d1c16b48f10686b98a96000c0ac18501425378f784c6b81c34d",
                ],
              },
              eventData: {
                type: "string",
                format: "json",
                description: `이벤트 데이터 필터링 조건을 지정하는 객체. 이 필드를 활용하면 특정 키와 값을 지정하여 원하는 이벤트만 필터링할 수 있습니다. JSON 객체 형식으로 최대 3단계 중첩된 값까지 입력 가능합니다. 입력한 키와 값이 이벤트 데이터와 정확히 일치하는 경우에만 필터링됩니다.`,
                example: [
                  `{ transfer: { sender: "0xcafe", receiver: "0xface" } }`,
                ],
              },
            },
          },
          {
            title: "function and event condition set",
            required: ["payloadFunction", "eventType", "eventAccountAddress"],
            properties: {
              payloadFunction: {
                type: "string",
                description: `모니터링 하고자하는 함수. 이 필드는 \`module_address::module_name::function_name\` 형식으로 입력합니다.`,
                default:
                  "0x6d138096fb880d1c16b48f10686b98a96000c0ac18501425378f784c6b81c34d::eragon_lucky_wheel::roll_premium",
                example: [
                  "0x1::aptos_account::transfer",
                  "0x1::aptos_account::transfer_coins",
                  "0x1::primary_fungible_store::transfer",
                ],
              },
              eventType: {
                type: "string",
                description: `모니터링 하고자하는 이벤트 타입. 이벤트 타입은 모듈에서 정의한 event struct의 이름을 의미합니다. 이 필드는 \`module_address::module_name::event_name\` 형식으로 입력합니다.
> 📘 \`0x1::transaction_fee::FeeStatement\` 는 eventType에 사용할 수 없나요?
> 네, 이 이벤트는 가스비를 소모하는 모든 user transaction에 포함됩니다.
> 따라서 별도의 이벤트로 구독할 필요가 없으므로, Transaction 이벤트를 구독하는 방식을 권장드립니다.
`,
                default: "0x1::account::CoinRegisterEvent",
                example: [
                  "0x6d138096fb880d1c16b48f10686b98a96000c0ac18501425378f784c6b81c34d::eragon_lucky_wheel::EragonLuckyWheelEvent",
                  "0x1::coin::CoinDeposit",
                ],
              },
              eventAccountAddress: {
                type: "string",
                description: `모니터링 하고자하는 이벤트를 발생시키는 주소. 
> 📘 Module Events일 때는 eventAccountAddress를 꼭 0x0으로 입력해야 하나요?
> 맞습니다. eventType이 “Module Events”인 경우에는 eventAccountAddress를 반드시 “0x0”으로 입력해 주세요. 만약, “Event-Handler Events”로 정의된 경우에는 이벤트를 발생한 계정 주소를 입력하시면 됩니다. 이벤트 종류에 대한 자세한 내용은 [Aptos 공식 문서](https://aptos.dev/en/network/blockchain/events)에서 확인하실 수 있습니다.
`,
                default: "0x0",
                example: [
                  "0x1",
                  "0x6d138096fb880d1c16b48f10686b98a96000c0ac18501425378f784c6b81c34d",
                ],
              },
              eventData: {
                type: "string",
                format: "json",
                description: `이벤트 데이터 필터링 조건을 지정하는 객체. 이 필드를 활용하면 특정 키와 값을 지정하여 원하는 이벤트만 필터링할 수 있습니다. JSON 객체 형식으로 최대 3단계 중첩된 값까지 입력 가능합니다. 입력한 키와 값이 이벤트 데이터와 정확히 일치하는 경우에만 필터링됩니다.`,
                example: [
                  `{ transfer: { sender: "0xcafe", receiver: "0xface" } }`,
                ],
              },
            },
          },
        ],
      },
    ],
  };

  export const isActive: OpenAPIV3.SchemaObject = {
    type: "boolean",
    description:
      "Webhook의 활성화 여부를 지정하는 파라미터입니다. 이 값이 true로 지정하면 활성화되며, false로 지정하면 비활성화됩니다. 비활성화된 Webhook은 알림을 받을 수 없지만 삭제되지 않습니다.",
  };

  export const isInstant: OpenAPIV3.SchemaObject = {
    type: "boolean",
    description: `Instant Webhook 옵션 활성화 여부를 지정하는 파라미터로, 지정하지 않을시 false로 설정됩니다. 
- true: Instant Webhook 옵션을 활성화하며, 블록의 확정 여부와 상관 없이 해당 이벤트가 감지되는 즉시 Webhook 메시지를 수신할 수 있습니다. 
- false: Instant Webhook 옵션을 비활성화하며, 이벤트 트랜잭션이 포함된 블록이 확정된 이후에만 메시지가 발송됩니다.`,
  };
}

export default Requests;
