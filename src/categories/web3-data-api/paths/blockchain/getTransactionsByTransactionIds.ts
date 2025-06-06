import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Domains from "../../library/domains";
import { getChainInfo } from "../../../../constants";

const summary = "Get Transactions By Transaction IDs";
const endpoint = "getTransactionsByTransactionIds";
const isPublic = true;
const tags = ["Blockchain API"];

// 프로토콜별 description을 반환하는 헬퍼 함수
function getDescription(protocol: string): string {
	switch (protocol) {
		default:
			return `여러 트랜잭션의 정보를 조회합니다. 최대 1000개의 트랜잭션을 조회할 수 있습니다.`;
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
					// utxo
					"bitcoin",
					"dogecoin",
				]),
				Requests.network("mainnet", ["mainnet", "testnet"]),
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
								transactionIds: {
									type: "array",
									items: {
										...Requests.Bitcoin.transactionId,
									},
									minItems: 1,
									maxItems: 1000,
									description: "조회할 트랜잭션 ID를 배열로 입력합니다.",
									default: ["b3554fe6689fddb99446c78a3bb1d08f59cfa479505e87e9b948e14b42ea9aef"],
								},
							},
							required: ["transactionIds"],
						},
					],
				},
				successResponse: {
					schema: {
						type: "array",
						items: {
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
						},
					},
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
