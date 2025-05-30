import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Domains from "../../library/domains";
import Examples from "../../library/examples";
import { ETHEREUM_ACCOUNTS, getChainInfo, TRON_ACCOUNTS } from "../../../../constants";

const summary = "Get Native Balance by Account";
const endpoint = "getNativeBalanceByAccount";
const isPublic = true;
const tags = ["Native Token API"];

// 프로토콜별 description을 반환하는 헬퍼 함수
function getDescription(protocol: string): string {
	switch (protocol) {
		default:
			return `특정 Account가 보유한 네이티브 토큰의 잔고를 조회합니다. 선택한 프로토콜에 따라 토큰의 종류가 다를 수 있습니다.`;
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
				Requests.protocol("ethereum", [
					// evm
					"arbitrum",
					"base",
					"ethereum",
					"kaia",
					"optimism",
					"polygon",
					"luniverse",
					"chiliz",
					"tron",
				]),
				Requests.network("mainnet", ["mainnet", "sepolia", "hoodi", "amoy", "testnet"]),
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
					oneOf: [
						{
							title: "EVM (Ethereum, Optimism, ...)",
							properties: {
								accountAddress: {
									...Requests.Ethereum.accountAddress,
									default: ETHEREUM_ACCOUNTS.VITALIK_BUTERIN,
								},
							},
							required: ["accountAddress"],
						},
						{
							title: "Tron",
							properties: {
								accountAddress: {
									...Requests.Tron.accountAddress,
									default: TRON_ACCOUNTS.JUSTIN_SUN,
								},
							},
							required: ["accountAddress"],
						},
					],
				},
				successResponse: {
					schema: {
						oneOf: [
							{
								title: "EVM (Ethereum, Optimism, ...)",
								...Domains.Ethereum.Balance,
								example: Examples.Ethereum[endpoint],
							},
							{
								title: "Tron",
								...Domains.Tron.Balance,
								example: Examples.Tron[endpoint],
							},
						],
					},
				},
			};
		case "tron":
			return {
				requestBody: {
					additionalProperties: false,
					type: "object",
					properties: {
						accountAddress: {
							...Requests.Tron.accountAddress,
							default: TRON_ACCOUNTS.JUSTIN_SUN,
						},
					},
					required: ["accountAddress"],
				},
				successResponse: {
					schema: Domains.Tron.Balance,
					example: Examples.Tron[endpoint],
				},
			};
		default:
			return {
				requestBody: {
					additionalProperties: false,
					type: "object",
					properties: {
						accountAddress: {
							...Requests.Ethereum.accountAddress,
							default: ETHEREUM_ACCOUNTS.VITALIK_BUTERIN,
						},
					},
					required: ["accountAddress"],
				},
				successResponse: {
					schema: Domains.Ethereum.Balance,
					example: Examples.Ethereum[endpoint],
				},
			};
	}
}

// ─────────────────────────────────────
// C. callouts 설정
//   - none일 경우 모든 케이스의 callouts 처리
// ─────────────────────────────────────
function getCallouts(protocol: string): string {
	switch (protocol) {
		case "none":
		default:
			return ``;
	}
}

export default {
	summary,
	endpoint,
	isPublic,
	info,
};
