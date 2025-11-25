import { OpenAPIV3 } from "openapi-types";
import { Patterns } from "../../../../patterns";

export const address: OpenAPIV3.SchemaObject = {
  type: "string",
  description:
    "조회하고자 하는 주소를 지정하는 파라미터입니다. 0x로 시작하는 40자리의 16진수 문자열 형태로 입력할 수 있습니다.",
  pattern: Patterns.bitcoin.address.source,
  example: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
};

export const accountAddress: OpenAPIV3.SchemaObject = {
  type: "string",
  description:
    "조회하고자 하는 계정의 주소를 지정하는 파라미터입니다. 0x로 시작하는 40자리의 16진수 문자열 형태로 입력할 수 있습니다.",
  pattern: Patterns.bitcoin.address.source,
  example: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
};

export const block: OpenAPIV3.SchemaObject = {
  type: "string",
  description: `잔고 조회 시점을 지정하는 파라미터입니다. 다음 형식 중 하나를 입력할 수 있습니다:
- block hash: 64자리 16진수 문자열 (256비트). 해당 블록 해시를 기준으로 조회됩니다.
- block number: 10진수 문자열. 해당 블록 높이를 기준으로 조회됩니다.
- block tag: "earliest" 또는 "latest"를 입력하여 첫 번째 블록 또는 최신 블록을 조회합니다.`,
  pattern: `${Patterns.string.decimal().source}|${
    Patterns.string.hexaDecimal64.source
  }|latest|earliest`,
  default: "latest",
};

export const fromBlock: OpenAPIV3.SchemaObject = {
  type: "string",
  description: `조회 시작 블록을 지정하는 파라미터입니다. 다음 형식 중 하나를 입력할 수 있습니다:  
- block number: 10진수 문자열로 블록 번호를 입력.  
- block hash: 64자리 16진수("0x"를 제외).  
- block tag: "earliest" 또는 "latest"를 사용하여 첫 번째 블록 또는 최신 블록을 지정.

유의사항: 
- toBlock 없이 제공하면, 해당 블록부터 최신 블록까지 결과를 조회합니다.  
- fromBlock 값은 toBlock 값보다 클 수 없습니다.  
- fromBlock과 toBlock에 동일한 값을 입력하면, 해당 블록만 조회됩니다.  
- fromBlock에 "latest"는 toBlock이 "latest"일 때만 허용됩니다.
`,
  pattern: `${Patterns.string.decimal().source}|${
    Patterns.string.hexaDecimal64.source
  }|latest|earliest`,
};

export const toBlock: OpenAPIV3.SchemaObject = {
  type: "string",
  description: `조회 종료 블록을 지정하는 파라미터입니다. 다음 형식 중 하나를 입력할 수 있습니다:  
- block number: 10진수 문자열로 블록 번호를 입력.  
- block hash: 64자리 16진수("0x"를 제외).  
- block tag: "earliest" 또는 "latest"를 사용하여 첫 번째 블록 또는 최신 블록을 지정.

유의사항:  
- fromBlock 없이 제공하면, genesis block부터 해당 블록까지 결과를 조회합니다.  
- toBlock 값은 fromBlock 값보다 작을 수 없습니다.  
- fromBlock과 toBlock에 동일한 값을 입력하면, 해당 블록만 조회됩니다.  
- toBlock에 "earliest"는 fromBlock이 "earliest"일 때만 허용됩니다.
`,
  pattern: `${Patterns.string.decimal().source}|${
    Patterns.string.hexaDecimal64.source
  }|latest|earliest`,
};

export const fromDate: OpenAPIV3.SchemaObject = {
  type: "string",
  description: `조회 시작 날짜를 지정하는 파라미터입니다. 날짜는 ISO 8601 형식(YYYY-MM-DDThh:mm:ss{time zone})을 따라야 하며, 초 단위까지 입력해야 합니다.  

유의사항:  
- toDate 없이 제공하면, 해당 날짜부터 최신 블록까지 결과를 조회합니다.  
- fromDate 값은 toDate 값과 같거나 더 과거의 값을 가져야 합니다.
- fromDate와 toDate에 동일한 값을 입력하면, 해당 날짜에서 발생한 블록만 조회됩니다.
- 이 필드는 fromBlock, toBlock과 함께 사용할 수 없습니다.`,
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
- 이 필드는 fromBlock, toBlock과 함께 사용할 수 없습니다.`,
  pattern: Patterns.iso8601.source,
  default: "2025-01-31T00:00:00+00:00",
};

export const transactionId: OpenAPIV3.SchemaObject = {
  type: "string",
  description:
    "조회하고자 하는 트랜잭션의 ID를 지정하는 파라미터입니다. 0x를 제외한 64자리 16진수 문자열 형태로 입력할 수 있습니다.",
  pattern: Patterns.bitcoin.transactionId.source,
};
