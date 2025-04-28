import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Examples from "../../library/examples";
import Schemas from "../../library/schemas";

const summary = "Get transaction by version";
const endpoint = "getTransactionByVersion";
const operationId = "aptos_" + endpoint;

const info: OpenAPIV3.PathItemObject = {
  get: {
    security: [
      {
        api_key: [],
      },
    ],
    tags: ["Transactions"],
    description: `트랜잭션의 버전을 이용하여 특정 트랜잭션을 식별해 반환합니다. 만약 버전이 pruned된 경우, 410에러가 반환됩니다.`,
    summary,
    operationId,
    parameters: [Requests.PathParams.transactionVersion],
    responses: {
      "200": Responses.SuccessAptos200({
        schema: Schemas.TransactionTypes.pendingTransaction,
        example: Examples[endpoint],
      }),
      "400": Responses.Error400,
    },
  },
};

export default info;
