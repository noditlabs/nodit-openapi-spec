import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Domains from "../../library/domains";
import Examples from "../../library/examples";
import { BITCOIN_ACCOUNTS, getChainInfo } from "../../../../constants";

const summary = "Get Native Token Transfers By Account";
const endpoint = "getNativeTokenTransfersByAccount";
const isPublic = true;
const tags = ["Native Token API"];

// 프로토콜별 description을 반환하는 헬퍼 함수
function getDescription(protocol: string): string {
	switch (protocol) {
		default:
			return `특정 주소와 관련된 네이티브 토큰 전송 내역을 조회합니다. 선택한 프로토콜에 따라 토큰의 종류가 다를 수 있습니다. (e.g., Bitcoin의 경우, BTC 잔고를 조회할 수 있습니다.)`;
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
				Requests.protocol("bitcoin", [
					// evm
					// "arbitrum",
					// "base",
					// "ethereum",
					// "kaia",
					// "optimism",
					// "polygon",
					// "luniverse",

					// utxo
					"bitcoin",
					"dogecoin",
				]),
				Requests.network("mainnet", [
					"mainnet",
					// "sepolia",
					// "holesky",
					// "amoy",
					"testnet",
				]),
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
		default:
			return {
				requestBody: {
					additionalProperties: false,
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
					],
				},
				successResponse: {
					schema: Domains.Bitcoin.Balance,
					example: Examples.Bitcoin[endpoint],
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
