import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Examples from "../../library/examples";
import Schemas from "../../library/schemas";

const summary = "Get account resource";
const endpoint = "getAccountResource";
const operationId = "aptos_" + endpoint;

const info: OpenAPIV3.PathItemObject = {
  get: {
    security: [
      {
        api_key: [],
      },
    ],
    tags: ["Accounts"],
    description: `특정 원장 버전에서 주어진 계정의 개별 리소스를 검색합니다. 원장 버전이 지정되지 않은 경우 최신 원장 버전이 사용됩니다.`,
    summary,
    operationId,
    parameters: [
      Requests.PathParams.address,
      Requests.PathParams.resource_type,
      Requests.QueryParams.ledgerVersion,
    ],
    responses: {
      "200": Responses.SuccessAptos200({
        schema: Schemas.resource,
        example: Examples[endpoint as keyof typeof Examples],
      }),
      "400": Responses.Error400,
    },
  },
};

export default info;
