import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Examples from "../../library/examples";
import Schemas from "../../library/schemas";

const summary = "Get account transactions";
const endpoint = "getAccountTransactions";
const operationId = "aptos_" + endpoint;

const info: OpenAPIV3.PathItemObject = {
  get: {
    security: [
      {
        api_key: [],
      },
    ],
    tags: ["Transactions"],
    description: `온체인에 committed 된 트랜잭션 중 특정 Account로 부터 생성된 트랜잭션을 반환합니다.`,
    summary,
    operationId,
    parameters: [
      Requests.PathParams.address,
      Requests.QueryParams.limit,
      Requests.QueryParams.start,
    ],
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
