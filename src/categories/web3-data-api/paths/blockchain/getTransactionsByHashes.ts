import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Domains from "../../library/domains";
import Examples from "../../library/examples";
import {
	decodeInfoMessage,
	kaiaUsingTipsForCommon,
	kaiaUsingTipsForTransaction,
	throughputLimitInfoMessage,
} from "../../../../callouts";
import { getChainInfo } from "../../../../constants";

const summary = "Get Transactions By Hashes";
const endpoint = "getTransactionsByHashes";
const isPublic = true;
const tags = ["Blockchain API"];

// 프로토콜별 description을 반환하는 헬퍼 함수
function getDescription(protocol: string): string {
	switch (protocol) {
		default:
			return `여러 트랜잭션의 정보를 조회합니다. 최대 1000개의 트랜잭션을 조회할 수 있습니다.

${decodeInfoMessage}
${throughputLimitInfoMessage}`;
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

					// xrpl
					"xrpl",
				]),
				Requests.network("mainnet", ["mainnet", "testnet", "sepolia", "hoodi", "amoy"]),
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
										transactionHashes: {
											type: "array",
											items: {
												...Requests.Ethereum.transactionHash,
											},
											minItems: 1,
											maxItems: 1000,
											description: "조회할 트랜잭션 해시를 배열로 입력합니다.",
											default: ["0x1632ac1627903e586c8ea0b1c134908c34ee95e84face9a303abd63686eb2022"],
										},
									},
									required: ["transactionHashes"],
								},
								{
									type: "object",
									properties: {
										withLogs: Requests.Ethereum.withLogs,
										withDecode: Requests.Ethereum.withDecode,
									},
								},
							],
						},
						{
							title: "Tron",
							allOf: [
								{
									type: "object",
									properties: {
										transactionHashes: {
											type: "array",
											items: {
												...Requests.Tron.transactionHash,
											},
											minItems: 1,
											maxItems: 1000,
											description: "조회할 트랜잭션 해시를 배열로 입력합니다.",
											default: [
												"03b0a72460abbc3e9ec26dafdb2a4e23faaebb70b8beb30348a6aaffa4d49f8a",
												"84fcce08f052a20f62408c47fbb8e867d2c7a55ecbfe59ed132ae33a2c8690b0",
											],
										},
									},
									required: ["transactionHashes"],
								},
								{
									type: "object",
									properties: {
										withLogs: Requests.Ethereum.withLogs, // Ethereum Parameter를 그대로 사용, 차이가 생길 경우 변경할 것
										withDecode: Requests.Ethereum.withDecode, // Ethereum Parameter를 그대로 사용, 차이가 생길 경우 변경할 것
									},
								},
							],
						},
						{
							title: "XRPL",
							allOf: [
								{
									type: "object",
									properties: {
										transactionHashes: {
											type: "array",
											items: {
												...Requests.XRPL.transactionHash,
											},
											minItems: 1,
											maxItems: 1000,
											description: "조회할 트랜잭션 해시를 배열로 입력합니다.",
											default: [
												"01A8F85930980FFAA100D0A528A6991FB68397558276C550C307140387E488F0",
												"03179DE10D1487CD12467D99D74268D1E0AEC9F1F9ED23CD7EFB126CC4D2F917",
											],
										},
									},
									required: ["transactionHashes"],
								},
								{
									type: "object",
									properties: {
										withBalanceChanges: Requests.XRPL.withBalanceChanges,
										withTokenTransfers: Requests.XRPL.withTokenTransfers,
									},
								},
							],
						},
					],
				},
				successResponse: {
					schema: {
						oneOf: [
							{
								title: "EVM (Ethereum, Optimism, ...)",
								type: "array",
								items: {
									allOf: [
										Domains.Ethereum.TransactionWithReceipt,
										{
											type: "object",
											properties: {
												logs: {
													type: "array",
													items: Domains.Ethereum.LogWithDecodedLog,
												},
											},
										},
									],
								},
								example: Examples.Ethereum[endpoint],
							},
							{
								title: "Tron",
								type: "array",
								items: {
									allOf: [
										Domains.Tron.Transaction,
										{
											type: "object",
											properties: {
												logs: Domains.Tron.Log, // Tron Log에는 DecodedLog가 포함되어 있음
											},
										},
									],
								},
								example: Examples.Tron[endpoint],
							},
							{
								title: "XRPL",
								type: "array",
								items: {
									allOf: [Domains.XRPL.Transaction],
								},
								example: Examples.XRPL[endpoint],
							},
						],
					},
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
								transactionHashes: {
									type: "array",
									items: {
										...Requests.Tron.transactionHash,
									},
									minItems: 1,
									maxItems: 1000,
									description: "조회할 트랜잭션 해시를 배열로 입력합니다.",
									default: [
										"03b0a72460abbc3e9ec26dafdb2a4e23faaebb70b8beb30348a6aaffa4d49f8a",
										"84fcce08f052a20f62408c47fbb8e867d2c7a55ecbfe59ed132ae33a2c8690b0",
									],
								},
							},
							required: ["transactionHashes"],
						},
						{
							type: "object",
							properties: {
								withLogs: Requests.Ethereum.withLogs, // Ethereum Parameter를 그대로 사용, 차이가 생길 경우 변경할 것
								withDecode: Requests.Ethereum.withDecode, // Ethereum Parameter를 그대로 사용, 차이가 생길 경우 변경할 것
							},
						},
					],
				},
				successResponse: {
					schema: {
						type: "array",
						items: {
							allOf: [
								Domains.Tron.Transaction,
								{
									type: "object",
									properties: {
										logs: Domains.Tron.Log, // Tron Log에는 DecodedLog가 포함되어 있음
									},
								},
							],
						},
					},
					example: Examples.Tron[endpoint],
				},
			};
		case "xrpl":
			return {
				requestBody: {
					additionalProperties: false,
					allOf: [
						{
							type: "object",
							properties: {
								transactionHashes: {
									type: "array",
									items: {
										...Requests.XRPL.transactionHash,
									},
									minItems: 1,
									maxItems: 1000,
									description: "조회할 트랜잭션 해시를 배열로 입력합니다.",
									default: [
										"01A8F85930980FFAA100D0A528A6991FB68397558276C550C307140387E488F0",
										"03179DE10D1487CD12467D99D74268D1E0AEC9F1F9ED23CD7EFB126CC4D2F917",
									],
								},
							},
							required: ["transactionHashes"],
						},
						{
							type: "object",
							properties: {
								withBalanceChanges: Requests.XRPL.withBalanceChanges,
								withTokenTransfers: Requests.XRPL.withTokenTransfers,
							},
						},
					],
				},
				successResponse: {
					schema: {
						type: "array",
						items: {
							allOf: [Domains.XRPL.Transaction],
						},
						example: Examples.XRPL[endpoint],
					},
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
								transactionHashes: {
									type: "array",
									items: {
										...Requests.Ethereum.transactionHash,
									},
									minItems: 1,
									maxItems: 1000,
									description: "조회할 트랜잭션 해시를 배열로 입력합니다.",
									default: ["0x1632ac1627903e586c8ea0b1c134908c34ee95e84face9a303abd63686eb2022"],
								},
							},
							required: ["transactionHashes"],
						},
						{
							type: "object",
							properties: {
								withLogs: Requests.Ethereum.withLogs,
								withDecode: Requests.Ethereum.withDecode,
							},
						},
					],
				},
				successResponse: {
					schema: {
						type: "array",
						items: {
							allOf: [
								Domains.Ethereum.TransactionWithReceipt,
								{
									type: "object",
									properties: {
										logs: {
											type: "array",
											items: Domains.Ethereum.LogWithDecodedLog,
										},
									},
								},
							],
						},
					},
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
			return `${kaiaUsingTipsForCommon(kaiaUsingTipsForTransaction)}`;
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
