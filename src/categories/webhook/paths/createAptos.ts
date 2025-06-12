import { OpenAPIV3 } from "openapi-types";
import Requests from "../library/requests";
import Responses from "../library/responses";
import Examples from "../library/examples";
import { getChainInfo } from "../../../constants";
import { XReadmeObject } from "../../../types";

const summary = "Create Webhook (Aptos)";
const endpoint = "aptos-createWebhook";
const isPublic = true;
const tags = ["Webhook API"];

// 프로토콜별 description을 반환하는 헬퍼 함수
function getDescription(protocol: string): string {
	switch (protocol) {
		default:
			return `Webhook을 생성하기 위한 API입니다. 구독 정보와 Webhook URL을 입력하여 Webhook을 생성합니다. Webhook을 생성하면 해당 Webhook URL로 이벤트가 전송됩니다. Webhook이 생성되면 Webhook의 Subscription ID를 반환하며, 이를 통해 Webhook 정보를 조회, 수정 및 삭제를 할 수 있습니다.`;
	}
}

const info = (protocol: string): OpenAPIV3.PathItemObject<{ "x-readme": XReadmeObject }> => {
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
			"x-readme": {
				"explorer-enabled": false,
			},
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
				"201": {
					...Responses.Success201(successResponse),
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
			parameters: [Requests.network("mainnet", ["mainnet", "testnet"])],
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
						eventType: Requests.eventTypeForAptos,
						description: Requests.description,
						notification: Requests.notification,
						isInstant: Requests.isInstant,
						condition: Requests.conditionForAptos,
					},
					required: ["eventType", "notification", "condition"],
					default: {
						eventType: "EVENT",
						notification: {
							webhookUrl: "https://example.com/webhook",
						},
						description: "Webhook Test",
						condition: {
							eventType: "0x1::account::CoinRegisterEvent",
						},
					},
				},
				successResponse: {
					schema: {
						type: "object",
						properties: {
							subscriptionId: Responses.subscriptionId,
							description: Responses.description,
							protocol: Responses.protocol,
							network: Responses.network,
							eventType: Responses.eventType,
							notification: Responses.notification,
							signingKey: Responses.signingKey,
							isInstant: Responses.isInstant,
							condition: Responses.condition,
							createdAt: Responses.createdAt,
						},
					},
					example: Examples[endpoint],
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
