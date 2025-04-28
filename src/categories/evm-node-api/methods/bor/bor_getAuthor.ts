import { OpenAPIV3 } from "openapi-types";
import Responses from "../../library/responses";
import Examples from "../../library/examples";
import Schemas from "../../library/schemas";
import Requests from "../../library/requests";
import { API_KEY, BASE_URL, getChainInfo } from "../../../../constants";
import { OasParams, ReadmeExtension } from "../../../../types";
import { protocolNetwork } from "../../library/serverVariables";

function oasDocs({ version, protocol }: OasParams): OpenAPIV3.Document {
	const fileName = __filename.split("/").slice(-1)[0]?.split(".")[0];
	console.log(fileName);
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
					description: `현재 블록을 생성한 검증자(또는 블록 생성자)의 주소를 반환합니다. 이 메소드는 PoA 네트워크에서 블록을 생성한 노드를 식별하는 데 사용됩니다. 블록 생성자는 네트워크의 합의 프로토콜에 따라 선택되며, 이 메소드를 통해 해당 블록의 "author" 또는 "miner"의 주소를 알 수 있습니다.`,
					summary: method,
					operationId: slug,
					parameters: [],
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: {
									type: "object",
									required: ["id", "jsonrpc", "method", "params"],
									properties: {
										...Requests.baseObject(method).properties, // id, jsonrpc, method
										params: {
											type: "array",
											items: {
												oneOf: [Schemas.blockNumberOrTag],
											},
											minItems: 1,
											maxItems: 1,
											default: ["latest"],
											description: `다음 파라미터들을 타입에 맞게 배열로 입력합니다.
1. \`block number or block tag\`: 조회하고자 하는 블록 넘버를 16진수 문자열 형식으로 입력합니다. "earliest", "latest", "pending" 등의 블록 태그를 입력할 수도 있습니다.`,
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
