import { OpenAPIV3 } from "openapi-types";
import { Patterns } from "../../../../patterns";

export const Ablastate: OpenAPIV3.SchemaObject = {
  type: "object",
  description:
    "ABLA(Adaptive Block Limit Algorithm) 상태값입니다. ABLA 활성화 이후 블록에서만 제공될 수 있으며, 제공되는 경우 내부 필드는 모두 존재합니다.",
  required: [
    "epsilon",
    "beta",
    "blockSize",
    "blockSizeLimit",
    "nextBlockSizeLimit",
  ],
  properties: {
    epsilon: {
      type: "integer",
      description:
        "ABLA(Adaptive Block Limit Algorithm) 알고리즘의 엡실론 파라미터입니다. 블록 크기 조정의 민감도를 제어하는 값입니다.",
    },
    beta: {
      type: "integer",
      description:
        "ABLA 알고리즘의 베타 파라미터입니다. 블록 크기 증가율을 제한하는 감쇠 계수입니다.",
    },
    blockSize: {
      type: "integer",
      description:
        "현재 블록의 실제 크기(바이트 단위)입니다. 블록에 포함된 트랜잭션 데이터의 총 크기를 나타냅니다.",
    },
    blockSizeLimit: {
      type: "integer",
      description:
        "현재 블록에 적용되는 최대 크기 제한(바이트 단위)입니다. ABLA 알고리즘에 의해 동적으로 조정됩니다.",
    },
    nextBlockSizeLimit: {
      type: "integer",
      description:
        "다음 블록에 적용될 예상 최대 크기 제한(바이트 단위)입니다. 현재 블록의 사용률을 기반으로 ABLA가 계산한 값입니다.",
    },
  },
};

export const Token: OpenAPIV3.SchemaObject = {
  type: "object",
  description:
    "해당 vin/vout이 CashTokens를 포함하는 경우에만 존재하는 토큰 정보 객체입니다. 토큰이 없으면 이 객체 자체가 생략됩니다.",
  properties: {
    tokenCategory: {
      type: "string",
      description:
        "CashTokens의 카테고리 ID입니다. 토큰 카테고리를 생성한 첫 번째 입력(outpoint)의 txid를 big-endian 16진수 문자열로 표현한 값이며, 동일 카테고리의 FT/NFT를 구분하는 고유 식별자입니다.",
      pattern: Patterns.string.hexaDecimal64.source,
    },
    tokenAmount: {
      type: "string",
      description:
        "Fungible 토큰(FT)의 수량입니다. FT가 포함된 경우에만 존재하며, 10진수 문자열 형태로 표현한 값입니다.",
      pattern: Patterns.string.decimal().source,
    },
    tokenNftCapability: {
      type: "string",
      description:
        "Non-Fungible 토큰(NFT)의 권한입니다. NFT가 포함된 경우에만 존재하며, 'none'(변경/발행 불가), 'mutable'(commitment 변경 가능), 'minting'(추가 NFT 발행 가능) 중 하나입니다.",
      enum: ["none", "mutable", "minting"],
    },
    tokenNftCommitment: {
      type: "string",
      description:
        "NFT에 첨부된 commitment 데이터입니다. NFT가 포함되고 commitment 길이가 1바이트 이상일 때만 존재합니다. 최대 40바이트의 16진수 문자열로, NFT의 메타데이터나 고유 속성을 표현하는 데 사용됩니다.",
      pattern: Patterns.string.hexaDecimal.source,
    },
  },
};
