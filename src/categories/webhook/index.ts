import { OpenAPIV3 } from "openapi-types";
import webhookCreateEvm from "./paths/createEvm";
import webhookCreateAptos from "./paths/createAptos";
import webhookGet from "./paths/get";
import webhookUpdateAptos from "./paths/updateAptos";
import webhookUpdateEvm from "./paths/updateEvm";
import webhookDelete from "./paths/delete";
import webhookHistory from "./paths/history";
import { OasParams, ReadmeExtension } from "../../types";
import { API_KEY, BASE_URL } from "../../constants";

const title = "Webhook";

function oasDocs({ version, protocol }: OasParams): OpenAPIV3.Document {
	return {
		openapi: "3.1.0",
		info: {
			title,
			version,
		},
		servers: [
			{
				url: BASE_URL.WEB3_DATA_API,
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
			"/aptos/{network}/webhooks": {
				post: webhookCreateAptos.info(protocol).post,
			},
			"/{protocol}/{network}/webhooks": {
				post: webhookCreateEvm.info(protocol).post,
				get: webhookGet.info(protocol).get,
			},
			"/aptos/{network}/webhooks/{subscriptionId}": {
				patch: webhookUpdateAptos.info(protocol).patch,
			},
			"/{protocol}/{network}/webhooks/{subscriptionId}": {
				patch: webhookUpdateEvm.info(protocol).patch,
				delete: webhookDelete.info(protocol).delete,
			},
			"/{protocol}/{network}/webhooks/history": {
				get: webhookHistory.info(protocol).get,
			},
		},
	};
}

export default oasDocs;
