import { OpenAPIV3 } from "openapi-types";
import Responses from "../../library/responses";
import Examples from "../../library/examples";
import Requests from "../../library/requests";
import { API_KEY, BASE_URL, getChainInfo } from "../../../../constants";
import { OasParams, ReadmeExtension } from "../../../../types";
import { protocolNetwork } from "../../library/serverVariables";
import { Patterns } from "../../../../patterns";

function oasDocs({ version, protocol }: OasParams): OpenAPIV3.Document {
	const fileName = __filename.split("/").slice(-1)[0]?.split(".")[0];
	const method = fileName;
	const title = `evm-${protocol}-${method}`;
	const slug = protocol === "ethereum" ? method : `${protocol}-${method}`;
	if (!method) {
		throw new Error("Check if the file name is correct");
	}
	return {
		openapi: "3.1.0",
		info: {
			title,
			version,
		},
		servers: [
			{
				url: BASE_URL.NODE_API(protocol),
				variables: protocolNetwork(protocol, `${protocol}-${getChainInfo(protocol).mainnet}`, [
					`${protocol}-${getChainInfo(protocol).mainnet}`,
					...getChainInfo(protocol).testnet.map((testnet) => `${protocol}-${testnet}`),
				]),
			},
		],
		components: {
			securitySchemes: {
				api_key: {
					type: "apiKey",
					name: "X-API-KEY",
					in: "header",
					"x-default": API_KEY.NODIT_DOCS_DEMO,
					description:
						"The default value, `nodit-demo`, is only for use in the developer documentation. For real applications or services, use the API key obtained from the Nodit console.",
				} as ReadmeExtension.securitySchemes,
			},
		},
		paths: {
			["/"]: {
				post: {
					security: [
						{
							api_key: [],
						},
					],
					tags: [title],
					description: `입력된 데이터에 대해 SHA3 (Keccak-256) 해시 함수를 적용하고, 그 결과를 반환합니다. 이 메소드는 주로 데이터의 무결성을 검증하거나, 특정 데이터에 대한 고유한 식별자를 생성하는 데 사용됩니다. 예를 들어, 입력 데이터를 해싱하여 블록체인에서 관리하거나, 고유한 해시 값을 계산하는 데 활용할 수 있습니다.`,
					summary: method,
					operationId: slug,
					parameters: [],
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: {
									type: "object",
									required: ["id", "jsonrpc", "method"],
									properties: {
										...Requests.baseObject(method).properties, // id, jsonrpc, method
										params: {
											type: "array",
											items: {
												oneOf: [
													{
														title: "입력 데이터",
														type: "string",
														pattern: Patterns.string.prefixedHexaDecimal.source,
														default: "0x68656c6c6f204e4f444954",
														description: `SHA3 해시를 적용할 데이터입니다. 이 값은 16진수로 인코딩된 문자열이어야 하며, '0x' 접두사를 포함해야 합니다. 예를 들어, "0x68656c6c6f204e4f444954"는 "hello NODIT"를 나타냅니다.`,
													},
												],
											},
											minItems: 1,
											maxItems: 1,
											default: ["0x68656c6c6f204e4f444954"],
											description: `다음 파라미터들을 타입에 맞게 배열로 입력합니다.

1. data in hex: SHA3 해시를 적용할 데이터입니다. 이 값은 16진수로 인코딩된 문자열이어야 하며, '0x' 접두사를 포함해야 합니다.`,
										},
									},
								},
							},
						},
					},
					responses: {
						"200": Responses.Success200({
							example: Examples[method as keyof typeof Examples],
						}),
						"400": Responses.Error400,
					},
				},
			},
		},
	};
}

export default oasDocs;
