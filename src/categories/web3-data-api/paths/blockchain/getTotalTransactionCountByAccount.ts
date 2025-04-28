import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Examples from "../../library/examples";
import { BITCOIN_ACCOUNTS, getChainInfo, XRPL_ACCOUNTS } from "../../../../constants";

const summary = "Get Total Transaction Count By Account";
const endpoint = "getTotalTransactionCountByAccount";
const isPublic = true;
const tags = ["Blockchain API"];

// 프로토콜별 description을 반환하는 헬퍼 함수
function getDescription(protocol: string): string {
	switch (protocol) {
		case "xrpl":
			return `이  API는 특정 계정이 생성한 트랜잭션 총 개수를 반환합니다.`;
		default:
			return `이 API는 특정 계정 주소가 송신자나 수신자로 포함된 트랜잭션의 총 개수를 반환합니다.`;
	}
}

const info = (protocol: string): OpenAPIV3.PathItemObject => {
	// A. operationId, parameters 설정
	const { operationId, parameters } = getOpIdAndParams(protocol);
	// B. requestBody, successResponse 설정
	const { requestBody, successResponse } = getRequestAndResponse(protocol);
	// C. callouts 설정
	const callouts = getCallouts(protocol);
	// D. protocol에 따른 description 설정
	const protocolDescription = getDescription(protocol);

	return {
		post: {
			security: [
				{
					api_key: [],
				},
			],
			tags,
			description: `${protocolDescription}\n\n${callouts}`,
			summary,
			operationId,
			parameters,
			requestBody: {
				required: true,
				content: {
					"application/json": {
						schema: requestBody,
					},
				},
			},
			responses: {
				"200": {
					...Responses.Success200(successResponse),
				},
				"400": Responses.Error400,
				"401": Responses.Error401,
				"403": Responses.Error403,
				"404": Responses.Error404,
				"429": Responses.Error429,
			},
		},
	};
};

// ─────────────────────────────────────
// A. operationId, parameters 설정
//   - none vs. 그 외
// ─────────────────────────────────────
function getOpIdAndParams(protocol: string): {
	operationId: string;
	parameters: OpenAPIV3.ParameterObject[];
} {
	if (protocol === "none") {
		return {
			operationId: endpoint,
			parameters: [
				Requests.protocol("bitcoin", ["bitcoin", "dogecoin", "xrpl"]),
				Requests.network("mainnet", ["mainnet", "testnet"]),
			],
		};
	} else {
		const chainInfo = getChainInfo(protocol);
		return {
			operationId: `${protocol}-${endpoint}`,
			parameters: [
				Requests.protocol(protocol, [protocol]),
				Requests.network(chainInfo.mainnet, [chainInfo.mainnet, ...chainInfo.testnet]),
			],
		};
	}
}

// ─────────────────────────────────────
// B. requestBody, successResponse 설정
//   - 프로토콜별로 모두 다름
// ─────────────────────────────────────
function getRequestAndResponse(protocol: string): {
	requestBody: OpenAPIV3.SchemaObject;
	successResponse: OpenAPIV3.MediaTypeObject;
} {
	switch (protocol) {
		case "none":
			return {
				requestBody: {
					additionalProperties: false,
					type: "object",
					properties: {
						accountAddress: {
							oneOf: [
								{
									title: "Bitcoin, Dogecoin",
									description: "Bitcoin, Dogecoin",
									...Requests.Bitcoin.accountAddress,
									default: BITCOIN_ACCOUNTS.SATOSHI,
								},
								{
									title: "XRPL",
									description: "XRP Ledger (XRPL)",
									...Requests.XRPL.accountAddress,
									default: XRPL_ACCOUNTS.ACCOUNT_1,
								},
							],
						},
					},
					required: ["accountAddress"],
				},
				successResponse: {
					schema: {
						oneOf: [
							{
								title: "Bitcoin, Dogecoin",
								type: "object",
								properties: {
									transactionCount: {
										type: "integer",
										description: "특정 계정이 송신 또는 수신에 관여한 트랜잭션의 총 개수를 나타냅니다.",
									},
								},
								example: Examples.Bitcoin[endpoint],
							},
							{
								title: "XRPL",
								type: "object",
								properties: {
									transactionCount: {
										type: "integer",
										description: "특정 계정이 송신 또는 수신에 관여한 트랜잭션의 총 개수를 나타냅니다.",
									},
								},
								example: Examples.XRPL[endpoint],
							},
						],
					},
				},
			};
		case "xrpl":
			return {
				requestBody: {
					additionalProperties: false,
					type: "object",
					properties: {
						accountAddress: Requests.XRPL.accountAddress,
					},
				},
				successResponse: {
					schema: {
						type: "object",
						properties: {
							transactionCount: {
								type: "integer",
								description: "특정 계정이 생성한 트랜잭션의 총 개수를 나타냅니다.",
							},
						},
						example: Examples.XRPL[endpoint],
					},
				},
			};
		case "bitcoin":
		case "dogecoin":
		default:
			return {
				requestBody: {
					additionalProperties: false,
					type: "object",
					properties: {
						accountAddress: {
							...Requests.Bitcoin.accountAddress,
							default: BITCOIN_ACCOUNTS.SATOSHI,
						},
					},
					required: ["accountAddress"],
				},
				successResponse: {
					schema: {
						type: "object",
						properties: {
							transactionCount: {
								type: "integer",
								description: "특정 계정이 송신 또는 수신에 관여한 트랜잭션의 총 개수를 나타냅니다.",
							},
						},
					},
					example: Examples.Bitcoin[endpoint],
				},
			};
	}
}

// ─────────────────────────────────────
// C. callouts 설정
//   - 프로토콜별로 모두 다름
// ─────────────────────────────────────
function getCallouts(protocol: string): string {
	switch (protocol) {
		default:
			return ""; // 해당 체인에서는 callouts가 없음
	}
}

export default {
	summary,
	endpoint,
	isPublic,
	info,
};
