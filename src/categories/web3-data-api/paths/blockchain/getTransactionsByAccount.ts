import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Domains from "../../library/domains";
import Examples from "../../library/examples";
import { decodeInfoMessage, kaiaUsingTipsForCommon, kaiaUsingTipsForTransaction } from "../../../../callouts";
import { BITCOIN_ACCOUNTS, ETHEREUM_ACCOUNTS, getChainInfo, TRON_ACCOUNTS, XRPL_ACCOUNTS } from "../../../../constants";

const summary = "Get Transactions By Account";
const endpoint = "getTransactionsByAccount";
const isPublic = true;
const tags = ["Blockchain API"];

// 프로토콜별 description을 반환하는 헬퍼 함수
function getDescription(protocol: string): string {
	switch (protocol) {
		default:
			return `특정 계정이 전송 혹은 수신한 트랜잭션 목록을 조회합니다.`;
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

					// utxo
					"bitcoin",
					"dogecoin",

					// xrpl
					"xrpl",
				]),
				Requests.network("mainnet", ["mainnet", "testnet", "sepolia", "holesky", "amoy"]),
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
			// "none"인 경우 EVM과 UTXO 프로토콜을 하나의 `oneOf`로 처리
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
										accountAddress: {
											...Requests.Ethereum.accountAddress,
											default: ETHEREUM_ACCOUNTS.VITALIK_BUTERIN,
										},
										relation: Requests.relation,
										fromBlock: Requests.Kaia.fromBlock, // 카이아 하드포크로 인한 안내 문구 포함
										toBlock: Requests.Ethereum.toBlock,
										fromDate: Requests.Ethereum.fromDate,
										toDate: Requests.Ethereum.toDate,
									},
									required: ["accountAddress"],
								},
								Requests.PaginationSet,
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
							title: "Bitcoin, Dogecoin",
							allOf: [
								{
									type: "object",
									properties: {
										accountAddress: {
											...Requests.Bitcoin.accountAddress,
											default: BITCOIN_ACCOUNTS.SATOSHI,
										},
										relation: Requests.relation,
										fromBlock: Requests.Bitcoin.fromBlock,
										toBlock: Requests.Bitcoin.toBlock,
										fromDate: Requests.Bitcoin.fromDate,
										toDate: Requests.Bitcoin.toDate,
									},
									required: ["accountAddress"],
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
							type: "object",
							allOf: [
								{
									type: "object",
									properties: {
										accountAddress: {
											...Requests.Tron.accountAddress,
											default: TRON_ACCOUNTS.JUSTIN_SUN,
										},
										relation: Requests.relation,
										fromBlock: Requests.Tron.fromBlock,
										toBlock: Requests.Tron.toBlock,
										fromDate: Requests.Tron.fromDate,
										toDate: Requests.Tron.toDate,
									},
									required: ["accountAddress"],
								},
								Requests.PaginationSet,
								{
									type: "object",
									properties: {
										withLogs: Requests.Ethereum.withLogs, // Ethereum Parameter를 그대로 사용, 차이가 생길 경우 변경할 것
										withDecode: Requests.Ethereum.withDecode, // Ethereum Parameter를 그대로 사용, 차이가 생길 경우 변경할 것
									},
								},
							],
							required: ["accountAddress"],
						},
						{
							title: "XRPL",
							type: "object",
							allOf: [
								{
									type: "object",
									properties: {
										accountAddress: {
											...Requests.XRPL.accountAddress,
											default: XRPL_ACCOUNTS.ACCOUNT_1,
										},
										fromLedger: Requests.XRPL.fromLedger,
										toLedger: Requests.XRPL.toLedger,
										fromDate: Requests.XRPL.fromDate,
										toDate: Requests.XRPL.toDate,
									},
									required: ["accountAddress"],
								},
								Requests.PaginationSet,
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
					schema: Domains.Pagination({
						oneOf: [
							{
								title: "EVM (Ethereum, Optimism, ...)",
								allOf: [
									Domains.Ethereum.TransactionWithReceipt,
									{
										type: "object",
										properties: {
											logs: {
												...Domains.Ethereum.Log,
												...Domains.Ethereum.DecodedLog,
											},
										},
									},
								],
								example: Examples.Ethereum[endpoint],
							},
							{
								title: "Bitcoin, Dogecoin",
								allOf: [
									Domains.Bitcoin.Transaction,
									{
										type: "object",
										properties: {
											vin: Domains.Bitcoin.Vin,
											vout: Domains.Bitcoin.Vout,
										},
									},
								],
								example: Examples.Bitcoin[endpoint],
							},
							{
								title: "Tron",
								allOf: [
									Domains.Tron.Transaction,
									{
										type: "object",
										properties: {
											logs: {
												...Domains.Tron.Log, // Tron Log에는 DecodedLog가 포함되어 있음
											},
										},
									},
								],
								example: Examples.Tron[endpoint],
							},
							{
								title: "XRPL",
								allOf: [Domains.XRPL.Transaction],
								example: Examples.XRPL[endpoint],
							},
						],
					}),
				},
			};
		case "bitcoin":
		case "dogecoin":
			// Bitcoin과 Dogecoin 관련 설정 (UTXO)
			return {
				requestBody: {
					additionalProperties: false,
					type: "object",
					properties: {
						accountAddress: {
							...Requests.Bitcoin.accountAddress,
							default: BITCOIN_ACCOUNTS.SATOSHI,
						},
						relation: Requests.relation,
						fromBlock: Requests.Bitcoin.fromBlock,
						toBlock: Requests.Bitcoin.toBlock,
						fromDate: Requests.Bitcoin.fromDate,
						toDate: Requests.Bitcoin.toDate,
					},
					required: ["accountAddress"],
				},
				successResponse: {
					schema: Domains.Pagination({
						allOf: [
							Domains.Bitcoin.Transaction,
							{
								type: "object",
								properties: {
									vin: Domains.Bitcoin.Vin,
									vout: Domains.Bitcoin.Vout,
								},
							},
						],
					}),
					example: Examples.Bitcoin[endpoint],
				},
			};
		case "kaia":
			return {
				requestBody: {
					additionalProperties: false,
					type: "object",
					allOf: [
						{
							type: "object",
							properties: {
								accountAddress: {
									...Requests.Ethereum.accountAddress,
									default: ETHEREUM_ACCOUNTS.VITALIK_BUTERIN,
								},
								relation: Requests.relation,
								fromBlock: Requests.Kaia.fromBlock, // 카이아 하드포크로 인한 안내 문구 포함
								toBlock: Requests.Ethereum.toBlock,
								fromDate: Requests.Ethereum.fromDate,
								toDate: Requests.Ethereum.toDate,
							},
							required: ["accountAddress"],
						},
						Requests.PaginationSet,
						{
							type: "object",
							properties: {
								withLogs: Requests.Ethereum.withLogs,
								withDecode: Requests.Ethereum.withDecode,
							},
						},
					],
					required: ["accountAddress"],
				},
				successResponse: {
					schema: Domains.Pagination({
						allOf: [
							Domains.Ethereum.TransactionWithReceipt,
							{
								type: "object",
								properties: {
									logs: {
										...Domains.Ethereum.LogWithDecodedLog,
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
					type: "object",
					allOf: [
						{
							type: "object",
							properties: {
								accountAddress: {
									...Requests.Tron.accountAddress,
									default: TRON_ACCOUNTS.JUSTIN_SUN,
								},
								relation: Requests.relation,
								fromBlock: Requests.Tron.fromBlock,
								toBlock: Requests.Tron.toBlock,
								fromDate: Requests.Tron.fromDate,
								toDate: Requests.Tron.toDate,
							},
							required: ["accountAddress"],
						},
						Requests.PaginationSet,
						{
							type: "object",
							properties: {
								withLogs: Requests.Ethereum.withLogs, // Ethereum Parameter를 그대로 사용, 차이가 생길 경우 변경할 것
								withDecode: Requests.Ethereum.withDecode, // Ethereum Parameter를 그대로 사용, 차이가 생길 경우 변경할 것
							},
						},
					],
					required: ["accountAddress"],
				},
				successResponse: {
					schema: Domains.Pagination({
						allOf: [
							Domains.Tron.Transaction,
							{
								type: "object",
								properties: {
									logs: {
										...Domains.Tron.Log, // Tron Log에는 DecodedLog가 포함되어 있음
									},
								},
							},
						],
					}),
					example: Examples.Tron[endpoint],
				},
			};
		// XRPL
		case "xrpl":
			return {
				requestBody: {
					additionalProperties: false,
					allOf: [
						{
							type: "object",
							properties: {
								accountAddress: {
									...Requests.XRPL.accountAddress,
									default: XRPL_ACCOUNTS.ACCOUNT_1,
								},
								fromLedger: Requests.XRPL.fromLedger,
								toLedger: Requests.XRPL.toLedger,
								fromDate: Requests.XRPL.fromDate,
								toDate: Requests.XRPL.toDate,
							},
							required: ["accountAddress"],
						},
						Requests.PaginationSet,
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
					schema: Domains.Pagination({
						allOf: [Domains.XRPL.Transaction],
					}),
					example: Examples.XRPL[endpoint],
				},
			};
		// for EVM chains
		default:
			return {
				requestBody: {
					additionalProperties: false,
					type: "object",
					allOf: [
						{
							type: "object",
							properties: {
								accountAddress: {
									...Requests.Ethereum.accountAddress,
									default: ETHEREUM_ACCOUNTS.VITALIK_BUTERIN,
								},
								relation: Requests.relation,
								fromBlock: Requests.Ethereum.fromBlock,
								toBlock: Requests.Ethereum.toBlock,
								fromDate: Requests.Ethereum.fromDate,
								toDate: Requests.Ethereum.toDate,
							},
							required: ["accountAddress"],
						},
						Requests.PaginationSet,
						{
							type: "object",
							properties: {
								withLogs: Requests.Ethereum.withLogs,
								withDecode: Requests.Ethereum.withDecode,
							},
						},
					],
					required: ["accountAddress"],
				},
				successResponse: {
					schema: Domains.Pagination({
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
					}),
					example: Examples.Ethereum[endpoint],
				},
			};
	}
}

// ─────────────────────────────────────
// C. callouts 설정
//   - "none"일 때 모든 케이스의 callouts 포함
// ─────────────────────────────────────
function getCallouts(protocol: string): string {
	switch (protocol) {
		case "none":
		case "kaia":
			return `${kaiaUsingTipsForCommon(kaiaUsingTipsForTransaction)}

${decodeInfoMessage}`;
		case "xrpl":
			return ``;
		default:
			return `${decodeInfoMessage}`; // 해당 체인에서는 callouts가 없음
	}
}

export default {
	summary,
	endpoint,
	isPublic,
	info,
};
