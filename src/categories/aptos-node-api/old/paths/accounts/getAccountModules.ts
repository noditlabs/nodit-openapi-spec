import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Examples from "../../library/examples";
import Schemas from "../../library/schemas";
import { legacyIndexerDeprecationWarning } from "../../../../../callouts/aptos.callouts";

const summary = "Get account modules";
const endpoint = "getAccountModules";
const operationId = "aptos_" + endpoint;

const info: OpenAPIV3.PathItemObject = {
  get: {
    security: [
      {
        api_key: [],
      },
    ],
    tags: ["Accounts"],
    description: `특정 원장 버전에서 주어진 계정의 모든 모듈을 반환합니다. 원장 버전이 지정되지 않은 경우 최신 원장 버전이 사용됩니다.

${legacyIndexerDeprecationWarning}
`,
    summary,
    operationId,
    parameters: [
      Requests.PathParams.address,
      Requests.QueryParams.ledgerVersion,
      Requests.QueryParams.limit,
      Requests.QueryParams.start,
    ],
    responses: {
      "200": Responses.SuccessAptos200({
        schema: {
          type: "array",
          items: Schemas.module,
        },
        example: Examples[endpoint as keyof typeof Examples],
      }),
      "400": Responses.Error400,
    },
  },
};

export default info;
