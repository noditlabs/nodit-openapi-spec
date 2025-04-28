import { OpenAPIV3 } from "openapi-types";
import Responses from "../../library/responses";
import Examples from "../../library/examples";
import Requests from "../../library/requests";

const summary = "Get table item";
const endpoint = "getTableItem";
const operationId = "aptos_" + endpoint;

const info: OpenAPIV3.PathItemObject = {
  post: {
    security: [
      {
        api_key: [],
      },
    ],
    tags: ["Tables"],
    description: `특정 ledger version에서의 table Item을 가져옵니다. table_handle과 key를 이용해 특정 table item을 식별할 수 있습니다.`,
    summary,
    operationId,
    parameters: [
      Requests.PathParams.tableHandle,
      Requests.QueryParams.ledgerVersion,
    ],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            additionalProperties: false,
            allOf: [Requests.BodyParams.tableItem],
          },
        },
      },
    },
    responses: {
      "200": Responses.SuccessAptos200({
        schema: {
          type: "string",
          format: "json",
          description: "value_type에 따라 반환되는 데이터의 형식이 달라집니다.",
        },
        example: Examples[endpoint],
      }),
      "400": Responses.Error400,
    },
  },
};

export default info;
