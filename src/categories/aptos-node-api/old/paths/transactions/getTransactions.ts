import { OpenAPIV3 } from "openapi-types";
import Responses from "../../library/responses";
import Examples from "../../library/examples";
import Requests from "../../library/requests";
import Schemas from "../../library/schemas";

const summary = "Get transactions";
const endpoint = "getTransactions";
const operationId = "aptos_" + endpoint;

const info: OpenAPIV3.PathItemObject = {
  get: {
    security: [
      {
        api_key: [],
      },
    ],
    tags: ["Transactions"],
    description: `온체인에 commit된 트랜잭션을 반환합니다. 특정 트랜잭션이 필요한 경우, limit과 start를 이용하여 설정할 수 있으며 version이 pruned된 경우, 410에러가 반환됩니다. 만약 Pending 중인 트랜잭션을 조회하고 싶은 경우, /transaction/by_hash 를 이용하여 조회할 수 있습니다.`,
    summary,
    operationId,
    parameters: [Requests.QueryParams.limit, Requests.QueryParams.start],
    responses: {
      "200": Responses.SuccessAptos200({
        schema: {
          type: "array",
          items: Schemas.transaction,
        },
        example: Examples[endpoint],
      }),
      "400": Responses.Error400,
    },
  },
};

export default info;
