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
					description: `이미 처리된 Transaction의 처리 과정을 노드 레벨에서 replay하면서 트랜잭션의 실행 과정에서 각각의 단계와 관련된 상세한 정보를 확인할 수 있는 디버깅 메소드입니다. 트랜잭션의 호출 스택, 가스 사용량, 상태 변경, 로그 이벤트 등 다양한 정보를 반환합니다. 이를 통해 컨트랙트의 함수 호출 흐름, 변수 변경, 이벤트 발생 등을 추적하고 디버깅할 수 있습니다.`,
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
												oneOf: [Schemas.transactionHash, Schemas.traceOptionWithTimeout],
											},
											minItems: 2,
											maxItems: 2,
											default: [
												"0xda148d856aef6d77d0b76c90ef1091ffe77afe9ee9b1c6cc23f28f042f198bd8",
												{ tracer: "callTracer" },
											],
											description: `다음 파라미터들을 타입에 맞게 배열로 입력합니다.

1. \`transaction hash\`: 조회하고자 하는 트랜잭션 해시를 문자열 형식으로 입력합니다.
2. \`trace option\`: trace 옵션 설정을 위한 object입니다.`,
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
