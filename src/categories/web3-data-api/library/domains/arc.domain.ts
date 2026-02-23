import { OpenAPIV3 } from "openapi-types";
import { Patterns } from "../../../../patterns";

export const NativeTransfer: OpenAPIV3.SchemaObject = {
  type: "object",
  required: ["from", "to", "value", "timestamp", "blockTimestamp", "blockNumber", "transactionHash", "transactionIndex", "traceIndex"],
  properties: {
    from: {
      type: "string",
      description: "토큰이 전송된 주소를 나타내는 필드입니다. 0x로 시작하는 40자리의 16진수 문자열 형태로 제공됩니다.",
      pattern: Patterns.ethereum.address.source,
    },
    to: {
      type: "string",
      description: "토큰을 전송받은 주소를 나타내는 필드입니다. 0x로 시작하는 40자리의 16진수 문자열 형태로 제공됩니다.",
      pattern: Patterns.ethereum.address.source,
    },
    value: {
      type: "string",
      description: "전송한 토큰의 수량을 나타내는 필드입니다. 10진수 문자열 형태로 제공됩니다.",
      pattern: Patterns.string.decimal().source,
    },
    timestamp: {
      type: "integer",
      description: "토큰 전송이 발생한 시간을 나타내는 필드입니다. 이 필드는 UNIX 타임스탬프로 제공됩니다.",
    },
    blockTimestamp: {
      type: "integer",
      description: "토큰 전송이 발생한 블록이 생성된 시간을 나타내는 필드입니다. 밀리초 단위의 UNIX 타임스탬프 형식으로 기록되며, 이를 통해 트랜잭션 발생 시점을 확인할 수 있습니다.",
    },
    blockNumber: {
      type: "integer",
      description: "토큰 전송이 발생한 블록 번호를 나타내는 필드입니다.",
    },
    transactionHash: {
      type: "string",
      description: "토큰 전송 트랜잭션의 해시를 나타내는 필드입니다. 0x로 시작하는 64자리 16진수 문자열 형태로 제공됩니다.",
      pattern: Patterns.ethereum.transactionHash.source,
    },
    transactionIndex: {
      type: "integer",
      description: "토큰 전송 트랜잭션이 포함된 블록 내에서의 위치를 나타내는 필드입니다. 여러 트랜잭션이 있는 블록에서 해당 트랜잭션의 순서를 식별하는 데 사용됩니다.",
    },
    traceIndex: {
      type: "integer",
      description: "트랜잭션의 트레이스 인덱스를 나타내는 필드입니다. external transaction의 경우 0을 반환합니다.",
    },
  },
};