import { OpenAPIV3 } from "openapi-types";
import { Patterns } from "../../../../patterns";
import { TRON_ACCOUNTS } from "../../../../constants";

/* Common */
export const accountAddress: OpenAPIV3.SchemaObject = {
	type: "string",
	description: `조회할 계정의 주소를 지정하는 파라미터입니다. 이 필드는 "T"로 시작하는 34자리 base58 문자열 형식을 가집니다.`,
	pattern: Patterns.tron.address.source,
	default: TRON_ACCOUNTS.JUSTIN_SUN,
};

export const transactionHash: OpenAPIV3.SchemaObject = {
	type: "string",
	description:
		"트랜잭션의 해시를 입력하는 파라미터입니다. 이 파라미터에는 64자리의 16진수 문자열을 입력할 수 있습니다.",
	pattern: Patterns.tron.transactionHash.source,
};

export const contractAddress: OpenAPIV3.SchemaObject = {
	type: "string",
	description: `조회할 컨트랙트 주소를 지정하는 파라미터입니다. 이 필드는 "T"로 시작하는 34자리 base58 문자열 형식을 가집니다.`,
	pattern: Patterns.tron.address.source,
};

export const contractAddresses: OpenAPIV3.SchemaObject = {
	type: "array",
	description: `조회하고자 하는 컨트랙트 주소의 배열을 지정하는 파라미터입니다. 컨트랙트 주소는 "T"로 시작하는 34자리 base58 문자열 형식을 가집니다.`,
	items: {
		...contractAddress,
	},
};

export const assetId: OpenAPIV3.SchemaObject = {
	type: "integer",
	description: `조회할 Asset ID를 입력합니다. Asset ID는 0보다 큰 정수여야 합니다.`,
	default: 1002357,
};

export const assetIds: OpenAPIV3.SchemaObject = {
	type: "array",
	description: `조회할 Asset ID 목록을 입력합니다. Asset ID는 0보다 큰 정수여야 합니다.`,
	items: {
		type: "integer",
	},
};

export const keyword: OpenAPIV3.SchemaObject = {
	type: "string",
	description: "조회하고자 하는 토큰의 name 혹은 symbol을 지정하는 파라미터입니다.",
	default: "USDT",
};

/* Range */
export const block: OpenAPIV3.SchemaObject = {
	type: "string",
	description: `잔고 조회 시점을 지정하는 파라미터로, block hash, block number, 또는 block tag를 입력할 수 있습니다.
- block number: 10진수 문자열을 입력합니다.
- block hash: 64자리 16진수 문자열로 입력하며, 0x 접두사는 제외해야 합니다.
- block tag: "earliest" 또는 "latest"를 입력할 수 있으며, "latest"는 가장 최신 블록의 잔고를 조회합니다.`,
	pattern: `${Patterns.string.decimal().source}|${Patterns.string.hexaDecimal64.source}|latest|earliest`,
	default: "latest",
};

export const fromBlock: OpenAPIV3.SchemaObject = {
	type: "string",
	description: `조회 시작 시점을 지정하는 파라미터입니다. block number, block hash 또는 block tag를 입력할 수 있으며, 기본 값은 0입니다.
- block number: 10진수 문자열로 입력합니다.
- block hash: 64자리 16진수 문자열로 입력하며, 0x 접두사는 제외해야 합니다.
- block tag: fromBlock으로 "earliest"를 입력할 수 있습니다.

유의사항:
- toBlock 없이 fromBlock만 제공되면, fromBlock에서 가장 최근 블록까지의 결과가 조회됩니다.
- fromBlock의 block number는 toBlock의 block number보다 작거나 같아야 합니다.
- toBlock과 fromBlock에 동일한 값을 입력하면, 해당 블록 하나의 결과만 조회됩니다.
- fromBlock에는 "latest"를 입력할 수 없습니다.
`,
	pattern: `${Patterns.string.decimal().source}|${Patterns.string.hexaDecimal64.source}|latest|earliest`,
};

export const toBlock: OpenAPIV3.SchemaObject = {
	type: "string",
	description: `조회 종료 시점을 지정하는 파라미터입니다. block number, block hash 또는 block tag를 입력할 수 있으며, 기본 값은 "latest" 입니다.
- block number: 10진수 문자열로 입력합니다.
- block hash: 64자리 16진수 문자열로 입력하며, 0x 접두사는 제외해야 합니다.
- block tag: "latest"를 입력할 수 있습니다.

유의사항:
- 입력한 toBlock에 해당하는 blockNumber는 입력한 fromBlock에 해당하는 blockNumber보다 크거나 같은 값을 입력해야 합니다.
- toBlock와 fromBlock에 동일한 값이 입력된 경우, 입력된 블록 한 개의 결과만 조회됩니다.
- fromBlock 없이 toBlock만 제공되는 경우, genesis block부터 toBlock에 입력한 시점까지의 결과가 조회됩니다.
- toBlock에는 "earliest"를 입력할 수 없습니다.`,
	pattern: `${Patterns.string.decimal().source}|${Patterns.string.hexaDecimal64.source}|latest|earliest`,
};

export const fromDate: OpenAPIV3.SchemaObject = {
	type: "string",
	description: `조회 시작 시점을 지정하는 파라미터입니다. 날짜는 ISO 8601 형식(YYYY-MM-DDThh:mm:ss{time zone})을 따라야 하며, 시간은 항상 초단위까지 입력해야 합니다.

유의사항:
- toDate 없이 fromDate만 제공되면, fromDate부터 최신 블록까지의 결과가 조회됩니다.
- fromDate는 toDate보다 과거의 날짜여야 합니다.
- 해당 필드는 fromBlock 및 toBlock과 함께 사용할 수 없습니다.
- fromDate와 toDate에 동일한 값을 입력하면, 해당 날짜에 생성된 블록의 결과가 조회됩니다.
- toDate 없이 fromDate만 제공되면, 첫 번째 블록부터 fromDate까지의 결과가 조회됩니다.`,
	pattern: Patterns.iso8601.source,
};

export const toDate: OpenAPIV3.SchemaObject = {
	type: "string",
	description: `조회 종료 시점을 지정하는 파라미터입니다. 날짜는 ISO 8601 형식(YYYY-MM-DDThh:mm:ss{time zone})을 따라야 하며, 시간은 항상 초단위까지 입력해야합니다.

유의사항:
- toDate는 fromDate보다 미래의 날짜여야 합니다.
- 이 필드는 fromBlock 및 toBlock과 함께 사용할 수 없습니다.
- fromDate와 toDate가 동일한 경우, 해당 날짜에 생성된 블록의 결과만 조회됩니다.
- fromDate 없이 toDate만 제공되면, 첫 번째 블록부터 toDate까지의 결과가 조회됩니다.`,
	pattern: Patterns.iso8601.source,
};
