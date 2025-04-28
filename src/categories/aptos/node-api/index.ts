import { OpenAPIV3 } from "openapi-types";
import accountPaths from "./paths/accounts";
import blockPaths from "./paths/blocks";
import eventsPaths from "./paths/events";
import generalPaths from "./paths/general";
import tablesPaths from "./paths/tables";
import transactionsPaths from "./paths/transactions";
import viewPaths from "./paths/view";
import { OasParams, ReadmeExtension } from "../../../types";
import { API_KEY, API_VERSION, BASE_URL } from "../../../constants";

const title = "Aptos";

function oasDocs({ version }: OasParams): OpenAPIV3.Document {
	return {
		openapi: "3.1.0",
		info: {
			title,
			version,
		},
		servers: [
			{
				url: `${BASE_URL.NODE_API("aptos")}${API_VERSION.APTOS}`,
				variables: {
					"aptos-network": {
						enum: ["aptos-mainnet", "aptos-testnet"],
						default: "aptos-mainnet",
					},
				},
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
			...accountPaths,
			...blockPaths,
			...eventsPaths,
			...generalPaths,
			...tablesPaths,
			...transactionsPaths,
			...viewPaths,
		},
	};
}

export default oasDocs;
