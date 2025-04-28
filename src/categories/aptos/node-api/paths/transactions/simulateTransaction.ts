import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Examples from "../../library/examples";
import Schemas from "../../library/schemas";

const summary = "Simulate transaction";
const endpoint = "simulateTransaction";
const operationId = "aptos_" + endpoint;

const info: OpenAPIV3.PathItemObject = {
  post: {
    security: [
      {
        api_key: [],
      },
    ],
    tags: ["Transactions"],
    description: `트랜잭션을 실제로 실행하기 전, 시뮬레이션할 수 있습니다. 이를 이용하여 실행될 트랜잭션의 최대 가스 사용량을 추정할 수 있습니다.`,
    summary,
    operationId,
    parameters: [
      Requests.QueryParams.estimate_gas_price,
      Requests.QueryParams.estimate_max_gas,
      Requests.QueryParams.estimate_prioritized_gas_uint_price,
    ],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            additionalProperties: false,
            allOf: [Requests.BodyParams.transaction],
          },
        },
      },
    },
    responses: {
      "200": Responses.SuccessAptos200({
        schema: {
          type: "array",
          items: Schemas.TransactionTypes.userTransaction,
        },
        example: Examples[endpoint],
      }),
      "400": Responses.Error400,
    },
  },
};

export default info;
