import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Domains from "../../library/domains";
import Examples from "../../library/examples";
import { getChainInfo, TRON_ACCOUNTS } from "../../../../constants";
import { whatIsTrc10 } from "../../../../callouts";

const summary = "Get Asset(TRC10) Transfers by Account";
const endpoint = "getAssetTransfersByAccount";
const isPublic = true;
const tags = ["Asset(TRC10) API"];

// 프로토콜별 description을 반환하는 헬퍼 함수
function getDescription(protocol: string): string {
	switch (protocol) {
		case "none":
		case "tron":
		default:
			return `특정 주소가 전송 혹은 수신한 Asset(TRC10) 전송 Transfer 리스트 조회합니다.`;
	}
}

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
				Requests.protocol("tron", [
					// evm
					"tron",
				]),
				Requests.network("mainnet", ["mainnet"]),
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
		case "tron":
		default:
			return {
				requestBody: {
					additionalProperties: false,
					allOf: [
						{
							type: "object",
							required: ["accountAddress"],
							properties: {
								accountAddress: { ...Requests.Tron.accountAddress, default: TRON_ACCOUNTS.JUSTIN_SUN },
								assetIds: Requests.Tron.assetIds,
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
									asset: Domains.Tron.TRC10Meta,
								},
							},
						],
					}),
					example: Examples.Tron[endpoint],
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
		case "tron":
		default:
			return whatIsTrc10;
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

export default {
	summary,
	endpoint,
	isPublic,
	info,
};
