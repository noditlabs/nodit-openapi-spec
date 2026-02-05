import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Examples from "../../library/examples";
import Schemas from "../../library/schemas";

const summary = "Submit batch transactions";
const endpoint = "submitBatchTransactions";
const operationId = "aptos_" + endpoint;

const info: OpenAPIV3.PathItemObject = {
  post: {
    security: [
      {
        api_key: [],
      },
    ],
    tags: ["Transactions"],
    description: `여러 개의 트랜잭션을 모아 submit 합니다. 모든 트랜잭션이 성공할 경우, 202 코드가 반환되며 일부 실패한 트랜잭션이 있거나 모든 트랜잭션이 실패했을 경우에는 실패한 트랜잭션과 206 코드가 반환됩니다.`,
    summary,
    operationId,
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            additionalProperties: false,
            allOf: [
              {
                type: "array",
                description: "트랜잭션의 배열",
                items: Requests.BodyParams.transaction,
              },
            ],
          },
        },
      },
    },
    responses: {
      "200": Responses.SuccessAptos200({
        schema: {
          type: "object",
          properties: {
            transaction_failures: Schemas.transactionFailures,
          },
        },
        example: Examples[endpoint],
      }),
      "400": Responses.Error400,
    },
  },
};

export default info;
