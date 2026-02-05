import { Patterns } from "../../../../patterns";
import { OpenAPIV3 } from "openapi-types";

export const block: OpenAPIV3.SchemaObject = {
  type: "string",
  description: `조회하고자 하는 블록을 지정하는 파라미터입니다. 이 파라미터의 기본 값은 latest이며, 블록 번호(10진수 문자열), 블록 해시(0x로 시작하는 64자리 16진수 문자열) 또는 블록 태그(earliest, latest)를 입력할 수 있습니다. "earliest"는 첫 번째 블록을, "latest"는 최근 블록을 의미합니다.`,
  pattern: `${Patterns.string.decimal().source}|${
    Patterns.string.prefixedHexaDecimal64.source
  }|latest|earliest`,
  default: "latest",
};

export const relation: OpenAPIV3.SchemaObject = {
  type: "string",
  description: `조회 대상 계정 주소가 from또는 to에 속한 트랜잭션들만 필터링하기 위한 파라미터 입니다.

from과 to, both 세 가지 옵션이 사용 가능하며, 이 파라미터의 기본 값은 both입니다.
- from: 조회한 주소가 balanceOutAccounts에 포함된 결과를 반환합니다.
- to: 조회한 주소가 balanceInAccounts에 포함된 결과를 반환합니다.
- both: 조회한 주소가 모든 자산 변화에 포함된 결과를 반환합니다.`,
  enum: ["from", "to", "both"],
  pattern: `from|to|both`,
  default: "both",
};

export const fromBlock: OpenAPIV3.SchemaObject = {
  type: "string",
  description: `조회 시작 블록을 지정하는 파라미터입니다. 다음 형식 중 하나를 입력할 수 있습니다:  
- block number: 10진수 문자열로 블록 번호를 입력.  
- block hash: 64자리 16진수("0x" 포함).  
- block tag: "earliest" 또는 "latest"를 사용하여 첫 번째 블록 또는 최신 블록을 지정.

유의사항: 
- toBlock 없이 제공하면, 해당 블록부터 최신 블록까지 결과를 조회합니다.  
- fromBlock 값은 toBlock 값보다 클 수 없습니다.  
- fromBlock과 toBlock에 동일한 값을 입력하면, 해당 블록만 조회됩니다.  
- fromBlock에 "latest"는 toBlock이 "latest"일 때만 허용됩니다.
`,
  pattern: `${Patterns.string.decimal().source}|${
    Patterns.string.prefixedHexaDecimal64.source
  }|latest|earliest`,
};

export const toBlock: OpenAPIV3.SchemaObject = {
  type: "string",
  description: `조회 종료 블록을 지정하는 파라미터입니다. 다음 형식 중 하나를 입력할 수 있습니다:  
- block number: 10진수 문자열로 블록 번호를 입력.  
- block hash: 64자리 16진수("0x" 포함).  
- block tag: "earliest" 또는 "latest"를 사용하여 첫 번째 블록 또는 최신 블록을 지정.

유의사항:  
- fromBlock 없이 제공하면, genesis block부터 해당 블록까지 결과를 조회합니다.  
- toBlock 값은 fromBlock 값보다 작을 수 없습니다.  
- fromBlock과 toBlock에 동일한 값을 입력하면, 해당 블록만 조회됩니다.  
- toBlock에 "earliest"는 fromBlock이 "earliest"일 때만 허용됩니다.`,
  pattern: `${Patterns.string.decimal().source}|${
    Patterns.string.prefixedHexaDecimal64.source
  }|latest|earliest`,
};

export const fromDate: OpenAPIV3.SchemaObject = {
  type: "string",
  description: `조회 시작 날짜를 지정하는 파라미터입니다. 날짜는 ISO 8601 형식(YYYY-MM-DDThh:mm:ss{time zone})을 따라야 하며, 초 단위까지 입력해야 합니다.  

유의사항:  
- toDate 없이 제공하면, 해당 날짜부터 최신 블록까지 결과를 조회합니다.  
- fromDate 값은 toDate 값과 같거나 더 과거의 값을 가져야 합니다.
- fromDate와 toDate에 동일한 값을 입력하면, 해당 날짜에서 발생한 블록만 조회됩니다.
- 이 필드는 fromBlock, toBlock과 함께 사용할 수 없습니다.  `,
  pattern: Patterns.iso8601.source,
  default: "2025-01-01T00:00:00+00:00",
};

export const toDate: OpenAPIV3.SchemaObject = {
  type: "string",
  description: `조회 종료 날짜를 지정하는 파라미터입니다. 날짜는 ISO 8601 형식(YYYY-MM-DDThh:mm:ss{time zone})을 따라야 하며, 초 단위까지 입력해야 합니다.  

유의사항:  
- fromDate 없이 제공하면, genesis block부터 해당 날짜까지 결과를 조회합니다.  
- toDate 값은 fromDate 값과 같거나 더 미래의 값을 가져야 합니다.
- fromDate와 toDate에 동일한 값을 입력하면, 해당 날짜에서 발생한 블록만 조회됩니다.
- 이 필드는 fromBlock, toBlock과 함께 사용할 수 없습니다.  `,
  pattern: Patterns.iso8601.source,
  default: "2025-01-31T00:00:00+00:00",
};

export const accountAddress: OpenAPIV3.SchemaObject = {
  type: "string",
  description: `조회하고자 하는 계정 주소를 지정하는 파라미터입니다. 계정 주소는 64자리 16진수("0x" 포함)로 입력해야 합니다.`,
  pattern: Patterns.string.prefixedHexaDecimal64.source,
};

export const withBalanceChanges: OpenAPIV3.SchemaObject = {
  type: "boolean",
  description: `응답에 balanceChanges 필드의 포함 여부를 지정하는 파라미터입니다.

- balanceChanges 는 Native token(APT)와 Token의 잔고 변화를 포함하는 필드입니다.
- 이 파라미터에 true를 입력한 경우, 응답속도가 느려질 수 있습니다.`,
  default: false,
};

export const transactionHash: OpenAPIV3.SchemaObject = {
  type: "string",
  description: `조회하고자 하는 트랜잭션 해시를 지정하는 파라미터입니다. 트랜잭션 해시는 64자리 16진수("0x" 포함)로 입력해야 합니다.`,
  pattern: Patterns.string.prefixedHexaDecimal64.source,
};

export const transactionVersion: OpenAPIV3.SchemaObject = {
  type: "integer",
  description: `조회하고자 하는 트랜잭션 버전을 지정하는 파라미터입니다. 트랜잭션 버전은 양의 정수로 입력해야 합니다.`,
  pattern: Patterns.integer().source,
};

export const assetType: OpenAPIV3.SchemaObject = {
  type: "string",
  description: `조회하고자 하는 자산의 타입을 지정하는 파라미터입니다.
자산 타입은 64자리 16진수("0x" 포함)로 입력해야 하며, 다음과 같은 형식을 사용합니다:

- Coin: "0x1::aptos_coin::AptosCoin"과 같은 Struct 형식의 자산 ID
- Fungible Asset: Token Metadata를 소유한 Object 주소`,
  pattern: `${Patterns.aptos.coinType.source}|${Patterns.string.prefixedHexaDecimal64.source}`,
};

export const linkedAssetType: OpenAPIV3.SchemaObject = {
  type: "string",
  description: `Coin과 FA(Fungible Asset)를 하나의 자산 단위로 조회하기 위한 공통 식별자입니다.

linkedAssetType에는 마이그레이션된 FA의 Object 주소를 입력해야 하며, 64자리 16진수("0x" 포함) 형식으로 입력해야 합니다.`,
  pattern: Patterns.string.prefixedHexaDecimal64.source,
};

export const eventType: OpenAPIV3.SchemaObject = {
  type: "string",
  description: `조회하고자 하는 이벤트 타입을 지정하는 파라미터입니다. 이벤트 타입은 모듈에서 정의한 event struct의 이름을 의미합니다. 이 필드는 \`module_address::module_name::event_name\` 형식으로 입력해야 합니다.`,
  example: "0x1::coin::CoinDeposit",
  pattern: `${Patterns.aptos.address.source}::${Patterns.aptos.resourceType.source}::${Patterns.string.text.source}`,
};
