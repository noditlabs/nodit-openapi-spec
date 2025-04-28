import { OpenAPIV3 } from "openapi-types";
import { Patterns } from "../../../../patterns";
import { XRPL_ACCOUNTS } from "../../../../constants";

/* Common */
export const accountAddress: OpenAPIV3.SchemaObject = {
	type: "string",
	description: `잔고를 조회할 계정의 주소를 지정하는 파라미터로, 25~35자리 길이의 Base58 인코딩 문자열이며 항상 "r"로 시작합니다.`,
	pattern: Patterns.xrpl.address.source,
	default: XRPL_ACCOUNTS.ACCOUNT_1,
};

export const currency: OpenAPIV3.SchemaObject = {
	type: "string",
	description: `조회하고자 하는 화폐의 심볼을 지정하는 파라미터로, 예를 들어 "USD"나 "EUR"처럼 ISO-4217 형식의 문자열을 입력할 수 있습니다.`,
	default: "USD",
};

export const issuer: OpenAPIV3.SchemaObject = {
	type: "string",
	description: `조회하고자 하는 화폐의 발행자를 지정하는 파라미터로, 25~35자리 길이의 Base58 인코딩 문자열("r"로 시작)을 사용해 발행자 계정 주소를 입력합니다.`,
	default: "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
};

/* Range */
export const ledger: OpenAPIV3.SchemaObject = {
	type: "string",
	description: `조회할 원장을 지정하는 파라미터로, 다음 형식 중 하나를 입력할 수 있습니다.
- ledger index: 10진수 문자열로 원장 번호
- ledger hash: 64자리 16진수 문자열 (0x 접두사 제외)
- ledger tag: "earliest" 또는 "latest" (가장 오래된 원장 또는 최신 원장)
`,
	pattern: `${Patterns.string.decimal().source}|${Patterns.string.hexaDecimal64.source}|latest|earliest`,
	default: "latest",
};

export const fromLedger: OpenAPIV3.SchemaObject = {
	type: "string",
	description: `조회 시작 원장을 지정하는 파라미터입니다. 다음 형식 중 하나를 입력할 수 있습니다:  
- **ledger index**: 10진수 문자열로 원장 번호 입력  
- **ledger hash**: 64자리 16진수 문자열 (0x 접두사 제외)  
- **ledger tag**: "earliest" 또는 "latest" 입력 (가장 오래된 원장 또는 최신 원장)

유의사항:  
- toLedger 없이 제공하면, 해당 원장부터 최신 원장까지 결과를 조회합니다.  
- fromLedger 값은 toLedger 값보다 클 수 없습니다.  
- fromLedger과 toLedger에 동일한 값을 입력하면, 해당 원장만 조회합니다.  
- fromLedger에 "latest"는 toLedger가 "latest"일 때만 허용됩니다.`,
	pattern: `${Patterns.string.decimal().source}|${Patterns.string.prefixedHexaDecimal64.source}|latest|earliest`,
};

export const toLedger: OpenAPIV3.SchemaObject = {
	type: "string",
	description: `조회 종료 원장을 지정하는 파라미터입니다. 다음 형식 중 하나를 입력할 수 있습니다:  
- **ledger index**: 10진수 문자열로 원장 번호 입력  
- **ledger hash**: 64자리 16진수 문자열 (0x 접두사 제외)  
- **ledger tag**: "earliest" 또는 "latest" 입력 (가장 오래된 원장 또는 최신 원장)

유의사항:  
- fromLedger 없이 제공하면, genesis 원장부터 해당 원장까지 결과를 조회합니다.  
- toLedger 값은 fromLedger 값보다 작을 수 없습니다.  
- fromLedger과 toLedger에 동일한 값을 입력하면, 해당 원장만 조회합니다.  
- toLedger에 "earliest"는 fromLedger가 "earliest"일 때만 허용됩니다.`,
	pattern: `${Patterns.string.decimal().source}|${Patterns.string.prefixedHexaDecimal64.source}|latest|earliest`,
};

export const fromDate: OpenAPIV3.SchemaObject = {
	type: "string",
	description: `조회 시작 날짜를 지정하는 파라미터입니다. 날짜는 ISO 8601 형식(YYYY-MM-DDThh:mm:ss{time zone})을 따라야 하며, 초 단위까지 입력해야 합니다.

유의사항:  
- toDate 없이 제공하면, 해당 날짜부터 최신 원장까지 결과를 조회합니다.  
- fromDate 값은 toDate 값과 같거나 더 과거여야 합니다.  
- fromDate와 toDate가 동일하면, 해당 날짜에 발생한 원장만 조회합니다.  
- 이 필드는 fromLedger, toLedger와 함께 사용할 수 없습니다.`,
	pattern: Patterns.iso8601.source,
	default: "2025-01-01T00:00:00+00:00",
};

export const toDate: OpenAPIV3.SchemaObject = {
	type: "string",
	description: `조회 종료 날짜를 지정하는 파라미터입니다. 날짜는 ISO 8601 형식(YYYY-MM-DDThh:mm:ss{time zone})을 따라야 하며, 초 단위까지 입력해야 합니다.

유의사항:  
- fromDate 없이 제공하면, genesis 원장 생성 시점부터 해당 날짜까지 결과를 조회합니다.  
- toDate 값은 fromDate 값과 같거나 더 미래여야 합니다.  
- fromDate와 toDate가 동일하면, 해당 날짜에 발생한 원장만 조회합니다.  
- 이 필드는 fromLedger, toLedger와 함께 사용할 수 없습니다.`,
	pattern: Patterns.iso8601.source,
	default: "2025-01-31T00:00:00+00:00",
};

export const transactionHash: OpenAPIV3.SchemaObject = {
	type: "string",
	description: "트랜잭션의 고유 해시를 입력하는 파라미터로, 64자리의 16진수 문자열을 사용합니다.",
	pattern: Patterns.xrpl.transactionHash.source,
};

/* Options */
export const withBalanceChanges: OpenAPIV3.SchemaObject = {
	type: "boolean",
	description: `응답에 balanceChanges 필드를 포함할지를 결정하는 선택적 파라미터입니다. balanceChanges에는 네이티브 토큰(XRP)과 IOU 토큰의 잔고 변동 내역이 담기며, 이 옵션을 true로 설정하면 응답 속도가 느려질 수 있습니다.`,
	default: false,
};

export const withTokenTransfers: OpenAPIV3.SchemaObject = {
	type: "boolean",
	description:
		"응답에 tokenTransfers 필드를 포함할지를 결정하는 선택적 파라미터입니다. tokenTransfers에는 IOU 토큰 전송 내역이 포함되며, 이 옵션을 true로 설정하면 응답 속도가 느려질 수 있습니다.",
	default: false,
};
