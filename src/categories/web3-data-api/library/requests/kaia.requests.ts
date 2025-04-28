import { OpenAPIV3 } from "openapi-types";
import { Patterns } from "../../../../patterns";

const kaiaEarliest = `Kaia의 경우, "earliest"를 입력시 Kaia 하드포크 시점의 블록이 조회가 됩니다.
- Mainnet: 162,900,480 (Aug 29, 2024 11:08:01 UTC+9)
- Kairos(Testnet): 156,660,000 (June 13, 2024 10:15:19 UTC+9)
`;
export const block: OpenAPIV3.SchemaObject = {
	type: "string",
	description: `조회하고자 하는 블록을 지정하는 파라미터입니다. 이 파라미터의 기본 값은 latest이며, 블록 번호(10진수 문자열), 블록 해시(0x로 시작하는 64자리 16진수 문자열) 또는 블록 태그(earliest, latest)를 입력할 수 있습니다. "earliest"는 첫 번째 블록을, "latest"는 최근 블록을 의미합니다.

${kaiaEarliest}
`,
	pattern: `${Patterns.string.decimal().source}|${Patterns.string.prefixedHexaDecimal64.source}|latest|earliest`,
	default: "latest",
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

${kaiaEarliest}
`,
	pattern: `${Patterns.string.decimal().source}|${Patterns.string.prefixedHexaDecimal64.source}|latest|earliest`,
};
