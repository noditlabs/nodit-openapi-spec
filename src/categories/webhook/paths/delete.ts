import { OpenAPIV3 } from "openapi-types";
import Requests from "../library/requests";
import Responses from "../library/responses";
import Examples from "../library/examples";
import { getChainInfo } from "../../../constants";

const summary = "Delete Webhook";
const endpoint = "deleteWebhook";
const isPublic = true;
const tags = ["Webhook API"];

// 프로토콜별 description을 반환하는 헬퍼 함수
function getDescription(protocol: string): string {
	switch (protocol) {
		default:
			return `Webhook을 삭제하기 위한 API입니다. Webhook을 삭제하면 해당 Webhook의 구독이 취소되며, 더 이상 이벤트를 받지 않습니다.`;
	}
}

const info = (protocol: string): OpenAPIV3.PathItemObject => {
	// A. operationId와 parameters 설정
	const { operationId, parameters } = getOpIdAndParams(protocol);
	// B. successResponse 설정
	const { successResponse } = getRequestAndResponse(protocol);
	// C. callouts 설정
	const callouts = getCallouts(protocol);
	// D. protocol에 따른 description 설정
	const protocolDescription = getDescription(protocol);

	return {
		delete: {
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
					// non-evm
					"aptos",
				]),
				Requests.network("mainnet", ["mainnet", "testnet", "sepolia", "holesky", "amoy"]),
				Requests.subscriptionId,
			],
		};
	} else {
		const chainInfo = getChainInfo(protocol);
		return {
			operationId: `${protocol}-${endpoint}`,
			parameters: [
				Requests.protocol(protocol, [protocol]),
				Requests.network(chainInfo.mainnet, [chainInfo.mainnet, ...chainInfo.testnet]),
				Requests.subscriptionId,
			],
		};
	}
}

// ─────────────────────────────────────
// B. successResponse 설정
// ─────────────────────────────────────
function getRequestAndResponse(protocol: string): {
	requestBody?: OpenAPIV3.SchemaObject;
	successResponse: OpenAPIV3.MediaTypeObject;
} {
	switch (protocol) {
		default:
			return {
				successResponse: {
					schema: {
						type: "object",
						properties: {
							result: Responses.result,
						},
					},
					example: Examples[endpoint],
				},
			};
	}
}

// ─────────────────────────────────────
// C. callouts 설정
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
