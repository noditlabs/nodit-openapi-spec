import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Domains from "../../library/domains";
import Examples from "../../library/examples";
import { kaiaUsingTipsForCommon, kaiaUsingTipsForTokenTransfer } from "../../../../callouts";
import { getChainInfo } from "../../../../constants";

const summary = "Get Token Transfers Within Range";
const endpoint = "getTokenTransfersWithinRange";
const isPublic = true;
const tags = ["Token API"];

// 프로토콜별 description을 반환하는 헬퍼 함수
function getDescription(protocol: string): string {
	switch (protocol) {
		case "none":
			return `특정 기간동안 발생한 토큰 전송 목록을 조회합니다. 요청한 체인에 따라 토큰의 타입 및 응답이 다를 수 있습니다.`;
		case "tron":
			return `특정 기간동안 발생한 TRC20 토큰 전송 목록을 조회합니다. 조회 결과에는 토큰 컨트랙트의 메타데이터와 전송된 토큰의 수량이 포함됩니다.`;
		case "xrpl":
			return `특정 기간동안 발생한 IOU 토큰 전송 내역을 조회합니다.`;
		default:
			return `특정 기간동안 발생한 ERC20 토큰 전송 목록을 조회합니다. 조회 결과에는 토큰 컨트랙트의 메타데이터와 전송된 토큰의 수량이 포함됩니다.`;
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
					"tron",

					// XRPL
					"xrpl",
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
										fromBlock: Requests.Kaia.fromBlock, // 카이아 하드포크로 인한 안내 문구 포함
										toBlock: Requests.Ethereum.toBlock,
										fromDate: Requests.Ethereum.fromDate,
										toDate: Requests.Ethereum.toDate,
									},
								},
								Requests.PaginationSet,
								{
									type: "object",
									properties: {
										withZeroValue: Requests.withZeroValue,
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
										fromBlock: Requests.Tron.fromBlock,
										toBlock: Requests.Tron.toBlock,
										fromDate: Requests.Tron.fromDate,
										toDate: Requests.Tron.toDate,
									},
								},
								Requests.PaginationSet,
								{
									type: "object",
									properties: {
										withZeroValue: Requests.withZeroValue,
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
										fromLedger: Requests.XRPL.fromLedger,
										toLedger: Requests.XRPL.toLedger,
										fromDate: Requests.XRPL.fromDate,
										toDate: Requests.XRPL.toDate,
									},
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
								allOf: [
									Domains.Ethereum.Transfer,
									{
										type: "object",
										properties: {
											contract: {
												allOf: [Domains.Ethereum.ContractMeta, Domains.Ethereum.AssetMeta],
											},
										},
									},
								],
								example: Examples.Ethereum[endpoint],
							},
							{
								title: "Tron",
								allOf: [
									Domains.Tron.Transfer,
									{
										type: "object",
										properties: {
											contract: {
												allOf: [Domains.Tron.ContractMeta, Domains.Tron.TokenMeta],
											},
										},
									},
								],
								example: Examples.Tron[endpoint],
							},
							{
								title: "XRPL",
								allOf: [Domains.XRPL.Transfer],
								example: Examples.XRPL[endpoint],
							},
						],
					}),
				},
			};
		case "kaia":
			return {
				requestBody: {
					additionalProperties: false,
					allOf: [
						{
							type: "object",
							properties: {
								fromBlock: Requests.Kaia.fromBlock, // 카이아 하드포크로 인한 안내 문구 포함
								toBlock: Requests.Ethereum.toBlock,
								fromDate: Requests.Ethereum.fromDate,
								toDate: Requests.Ethereum.toDate,
							},
						},
						Requests.PaginationSet,
						{
							type: "object",
							properties: {
								withZeroValue: Requests.withZeroValue,
							},
						},
					],
				},
				successResponse: {
					schema: Domains.Pagination({
						allOf: [
							Domains.Ethereum.Transfer,
							{
								type: "object",
								properties: {
									contract: {
										allOf: [Domains.Ethereum.ContractMeta, Domains.Ethereum.AssetMeta],
									},
								},
							},
						],
					}),
					example: Examples.Ethereum[endpoint],
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
								fromBlock: Requests.Tron.fromBlock,
								toBlock: Requests.Tron.toBlock,
								fromDate: Requests.Tron.fromDate,
								toDate: Requests.Tron.toDate,
							},
						},
						Requests.PaginationSet,
						{
							type: "object",
							properties: {
								withZeroValue: Requests.withZeroValue,
							},
						},
					],
				},
				successResponse: {
					schema: Domains.Pagination({
						allOf: [
							Domains.Tron.Transfer,
							{
								type: "object",
								properties: {
									contract: {
										allOf: [Domains.Tron.ContractMeta, Domains.Tron.TokenMeta],
									},
								},
							},
						],
					}),
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
								fromLedger: Requests.XRPL.fromLedger,
								toLedger: Requests.XRPL.toLedger,
								fromDate: Requests.XRPL.fromDate,
								toDate: Requests.XRPL.toDate,
							},
						},
						Requests.PaginationSet,
					],
				},
				successResponse: {
					schema: Domains.Pagination({
						allOf: [Domains.XRPL.Transfer],
					}),
					example: Examples.XRPL[endpoint],
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
								fromBlock: Requests.Ethereum.fromBlock,
								toBlock: Requests.Ethereum.toBlock,
								fromDate: Requests.Ethereum.fromDate,
								toDate: Requests.Ethereum.toDate,
							},
						},
						Requests.PaginationSet,
						{
							type: "object",
							properties: {
								withZeroValue: Requests.withZeroValue,
							},
						},
					],
				},
				successResponse: {
					schema: Domains.Pagination({
						allOf: [
							Domains.Ethereum.Transfer,
							{
								type: "object",
								properties: {
									contract: {
										allOf: [Domains.Ethereum.ContractMeta, Domains.Ethereum.AssetMeta],
									},
								},
							},
						],
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
			return `${kaiaUsingTipsForCommon(kaiaUsingTipsForTokenTransfer)}
> 📘 기간 설정 팁 
> 설정한 기간이 길 경우 응답시간이 길어질 수 있습니다. 빠른 응답을 원한다면 필요한 기간만큼만 설정하는 것을 권장합니다.`;
		default:
			return `
> 📘 기간 설정 팁 
> 설정한 기간이 길 경우 응답시간이 길어질 수 있습니다. 빠른 응답을 원한다면 필요한 기간만큼만 설정하는 것을 권장합니다.
`; // 해당 체인에서는 callouts가 없음
	}
}

export default {
	summary,
	endpoint,
	isPublic,
	info,
};
