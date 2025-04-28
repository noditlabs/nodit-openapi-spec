import { OpenAPIV3 } from "openapi-types";
import { Patterns } from "../../../../patterns";

/* Common */
export const address: OpenAPIV3.SchemaObject = {
	type: "string",
	description:
		"조회하고자 하는 주소를 지정하는 파라미터입니다. 0x로 시작하는 40자리의 16진수 문자열 형태로 입력할 수 있습니다.",
	pattern: Patterns.ethereum.address.source,
};

export const accountAddress: OpenAPIV3.SchemaObject = {
	type: "string",
	description:
		"조회하고자 하는 계정의 주소를 지정하는 파라미터입니다. 0x로 시작하는 40자리의 16진수 문자열 형태로 입력할 수 있습니다.",
	pattern: Patterns.ethereum.address.source,
};

export const contractAddress: OpenAPIV3.SchemaObject = {
	type: "string",
	description:
		"조회하고자 하는 컨트랙트 주소를 지정하는 파라미터입니다. 0x로 시작하는 40자리의 16진수 문자열 형태로 입력할 수 있습니다.",
	pattern: Patterns.ethereum.address.source,
};

export const contractAddresses: OpenAPIV3.SchemaObject = {
	type: "array",
	description:
		"조회하고자 하는 컨트랙트 주소의 배열을 지정하는 파라미터입니다. 컨트랙트 주소는 0x로 시작하는 40자리의 16진수 문자열 형태로 입력할 수 있습니다.",
	items: {
		...contractAddress,
	},
};

export const tokenId: OpenAPIV3.SchemaObject = {
	type: "string",
	description: "조회하고자 하는 NFT 토큰의 ID를 지정하는 파라미터입니다. 10진수 문자열 형태로 입력할 수 있습니다.",
	pattern: Patterns.string.decimal().source,
};

export const keyword: OpenAPIV3.SchemaObject = {
	type: "string",
	description: "조회하고자 하는 토큰의 name 혹은 symbol을 지정하는 파라미터입니다.",
};

export const transactionHash: OpenAPIV3.SchemaObject = {
	type: "string",
	description:
		"조회하고자 하는 트랜잭션의 해시를 지정하는 파라미터입니다. 0x로 시작하는 64자리 16진수 문자열 형태로 입력할 수 있습니다.",
	pattern: Patterns.ethereum.transactionHash.source,
};

export const eventNames: OpenAPIV3.SchemaObject = {
	type: "array",
	items: {
		type: "string",
		description: "조회하고자 하는 이벤트의 이름을 지정하는 파라미터입니다.",
	},
};

export const abi: OpenAPIV3.SchemaObject = {
	type: "string",
	format: "json",
	description: "조회하고자 하는 컨트랙트의 ABI를 지정하는 파라미터입니다. JSON 형태의 ABI 문자열을 입력할 수 있습니다.",
};

/* Range */
export const block: OpenAPIV3.SchemaObject = {
	type: "string",
	description: `조회하고자 하는 블록을 지정하는 파라미터입니다. 이 파라미터의 기본 값은 latest이며, 블록 번호(10진수 문자열), 블록 해시(0x로 시작하는 64자리 16진수 문자열) 또는 블록 태그(earliest, latest)를 입력할 수 있습니다. "earliest"는 첫 번째 블록을, "latest"는 최근 블록을 의미합니다.

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
`,
	pattern: `${Patterns.string.decimal().source}|${Patterns.string.prefixedHexaDecimal64.source}|latest|earliest`,
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
	pattern: `${Patterns.string.decimal().source}|${Patterns.string.prefixedHexaDecimal64.source}|latest|earliest`,
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

/* Options */
export const withMetadata: OpenAPIV3.SchemaObject = {
	type: "boolean",
	description:
		// "응답에 NFT 토큰 메타데이터 관련 필드(rawMetadata, media, metadataSyncedAt)의 포함 여부를 지정하는 파라미터입니다. 이 파라미터에 true를 입력한 경우, 응답속도가 느려질 수 있습니다.",
		"응답에 NFT 토큰 메타데이터 관련 필드(rawMetadata, metadataSyncedAt)의 포함 여부를 지정하는 파라미터입니다. 이 파라미터에 true를 입력한 경우, 응답속도가 느려질 수 있습니다.", // remove media filed
	default: false,
};

export const withLogs: OpenAPIV3.SchemaObject = {
	type: "boolean",
	description:
		"응답에 logs 필드의 포함 여부를 지정하는 파라미터입니다. 이 파라미터에 true를 입력한 경우, 응답속도가 느려질 수 있습니다.",
	default: false,
};

export const withDecode: OpenAPIV3.SchemaObject = {
	type: "boolean",
	description: `응답에 decodedInput, decodedLog 필드의 포함 여부를 지정하는 파라미터입니다. 이 파라미터에 true를 입력한 경우, 응답속도가 느려질 수 있습니다.

decodedLog는 logs에 포함되어 있기 때문에 withDecode가 true라도 withLogs가 false인 경우 decodedLog는 응답에 포함되지 않습니다.`,
	default: false,
};

export const withExternalTransaction: OpenAPIV3.SchemaObject = {
	type: "boolean",
	description:
		"응답에 external transaction 포함 여부를 결정하는 파라미터입니다. external transaction은 internal transaction과 동일한 형식으로 반환되며, trace index가 0으로 표기됩니다. 이 파라미터를 true로 입력한 경우, external transaction을 포함하며 응답속도가 느려질 수 있습니다.",
	default: false,
};
