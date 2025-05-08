import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Domains from "../../library/domains";
import Examples from "../../library/examples";
import {
	kaiaUsingTipsForCommon,
	kaiaUsingTipsForTokenContractMetadata,
	throughputLimitInfoMessage,
} from "../../../../callouts";
import { getChainInfo } from "../../../../constants";

const summary = "Search Token Contract Metadata by Keyword";
const endpoint = "searchTokenContractMetadataByKeyword";
const isPublic = true;
const tags = ["Token API"];

// 프로토콜별 description을 반환하는 헬퍼 함수
function getDescription(protocol: string): string {
	switch (protocol) {
		case "none":
			return `토큰 컨트랙트의 name 혹은 symbol과 일치하는 컨트랙트 목록을 조회합니다. 
${throughputLimitInfoMessage}
`;
		case "tron":
			return `TRC20 토큰 컨트랙트의 name 혹은 symbol과 일치하는 컨트랙트 목록을 조회합니다. 
${throughputLimitInfoMessage}
`;
		default:
			return `ERC20 토큰 컨트랙트의 name 혹은 symbol과 일치하는 컨트랙트 목록을 조회합니다. 
${throughputLimitInfoMessage}
`;
	}
}

const info = (protocol: string): OpenAPIV3.PathItemObject => {
	// A. operationId, parameters 설정
	const { operationId, parameters } = getOpIdAndParams(protocol);
	// B. requestBody, successResponse 설정
	const { requestBody, successResponse } = getRequestAndResponse(protocol);
	// C. callouts 설정
	const callouts = getCallouts(protocol);

	return {
		post: {
			security: [
				{
					api_key: [],
				},
			],
			tags,
			description: `${getDescription(protocol)}\n\n${callouts}`,
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
				Requests.network("mainnet", ["mainnet", "sepolia", "holesky", "amoy", "testnet"]),
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
					oneOf: [
						{
							title: "EVM (Ethereum, Optimism, ...)",
							allOf: [
								{
									type: "object",
									properties: {
										keyword: { ...Requests.Ethereum.keyword, default: "USDT" },
									},
									required: ["keyword"],
								},
								Requests.PaginationSet,
							],
						},
						{
							title: "Tron",
							allOf: [
								{
									type: "object",
									properties: {
										keyword: { ...Requests.Tron.keyword, default: "USDT" },
									},
									required: ["keyword"],
								},
								Requests.PaginationSet,
							],
						},
					],
				},
				successResponse: {
					schema: Domains.Pagination({
						oneOf: [
							{
								title: "EVM (Ethereum, Optimism, ...)",
								allOf: [Domains.Ethereum.ContractMeta, Domains.Ethereum.AssetMeta],
								example: Examples.Ethereum[endpoint],
							},
							{
								title: "Tron",
								allOf: [Domains.Tron.ContractMeta, Domains.Tron.TokenMeta],
								example: Examples.Tron[endpoint],
							},
						],
					}),
				},
			};
		case "tron":
			return {
				requestBody: {
					additionalProperties: false,
					allOf: [
						{
							type: "object",
							properties: {
								keyword: { ...Requests.Tron.keyword, default: "USDT" },
							},
							required: ["keyword"],
						},
						Requests.PaginationSet,
					],
				},
				successResponse: {
					schema: Domains.Pagination({
						allOf: [Domains.Tron.ContractMeta, Domains.Tron.TokenMeta],
					}),
					example: Examples.Tron[endpoint],
				},
			};
		default:
			return {
				requestBody: {
					additionalProperties: false,
					allOf: [
						{
							type: "object",
							properties: {
								keyword: { ...Requests.Ethereum.keyword, default: "USDT" },
							},
							required: ["keyword"],
						},
						Requests.PaginationSet,
					],
				},
				successResponse: {
					schema: Domains.Pagination({
						allOf: [Domains.Ethereum.ContractMeta, Domains.Ethereum.AssetMeta],
					}),
					example: Examples.Ethereum[endpoint],
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
		case "none":
		case "kaia":
			return `${kaiaUsingTipsForCommon(kaiaUsingTipsForTokenContractMetadata)}`;
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
