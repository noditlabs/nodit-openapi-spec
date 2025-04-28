import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Domains from "../../library/domains";
import Examples from "../../library/examples";
import { ERC20, getChainInfo } from "../../../../constants";
import { onlyEthereumMainnetLuniverseMainnetInfoMessage } from "../../../../callouts";

const summary = "Get Hourly Active Accounts Stats By Contract";
const endpoint = "getHourlyActiveAccountsStatsByContract";
const isPublic = true;
const tags = ["Statistics API"];

// 프로토콜별 description을 반환하는 헬퍼 함수
function getDescription(protocol: string): string {
	switch (protocol) {
		default:
			return `지정한 범위 내에서 발생한 특정 컨트랙트의 시간별 활성 계정의 수를 조회할 수 있습니다

> 📘 데이터는 언제 반영되나요?
> 
> 현재 시간별 통계 API에서 시간은 UTC 기준으로, 응답의 각 항목에는 date로부터 +1시간 내의 통계치가 제공됩니다. 시간별 통계의 경우 최근 1시간의 통계치 반영이 최대 40분까지 지연될 수 있으므로 최신 데이터 조회 시 고려가 필요합니다.

${onlyEthereumMainnetLuniverseMainnetInfoMessage}`;
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
			parameters: [Requests.protocol("ethereum", ["ethereum", "luniverse"]), Requests.network("mainnet", ["mainnet"])],
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
		default:
			return {
				requestBody: {
					additionalProperties: false,
					type: "object",
					properties: {
						contractAddress: {
							...Requests.Ethereum.contractAddress,
							default: ERC20.USDT.CONTRACT_ADDRESS,
						},
						startDateTime: {
							...Requests.startDateTime,
							default: "2024-01-01-00",
						},
						endDateTime: {
							...Requests.endDateTime,
							default: "2024-02-01-00",
						},
					},
					required: ["contractAddress", "startDateTime", "endDateTime"],
				},
				successResponse: {
					schema: Domains.PaginationStats(Domains.HourlyStats),
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
