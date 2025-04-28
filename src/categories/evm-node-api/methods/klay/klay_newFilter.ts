import { OpenAPIV3 } from "openapi-types";
import Responses from "../../library/responses";
import Examples from "../../library/examples";
import Schemas from "../../library/schemas";
import Requests from "../../library/requests";
import { API_KEY, BASE_URL, ETHEREUM_ACCOUNTS, getChainInfo } from "../../../../constants";
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
					description: `입력한 필터 조건에 부합하는 Log들을 조회하기 위한 필터를 생성하고 필터 ID를 반환합니다. 필터 ID는 klay_getFilterLogs, klay_uninstallFilter 메서드에서 사용됩니다.`,
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
											minItems: 1,
											maxItems: 1,
											items: Schemas.logObject,
											default: [
												{
													fromBlock: "latest",
												},
											],
											example: [
												{
													address: ETHEREUM_ACCOUNTS.VITALIK_BUTERIN,
													blockHash: "0x39008d07edf93c03bb9d1cfc80598fcf63f441ec86e9de3733fa6a484980ca48",
													fromBlock: "0x12C1A00",
													toBlock: "latest",
													topics: [
														"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
														`0x000000000000000000000000${ETHEREUM_ACCOUNTS.VITALIK_BUTERIN.slice(2)}`,
													],
												},
											],
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
