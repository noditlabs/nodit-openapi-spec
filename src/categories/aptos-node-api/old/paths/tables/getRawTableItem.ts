import { OpenAPIV3 } from "openapi-types";
import Responses from "../../library/responses";
import Examples from "../../library/examples";
import Requests from "../../library/requests";

const summary = "Get raw table item";
const endpoint = "getRawTableItem";
const operationId = "aptos_" + endpoint;

const tableHandlePathParam = {
  ...Requests.PathParams.tableHandle, // 기존 객체의 속성을 모두 복사
  schema: {
    ...Requests.PathParams.tableHandle.schema, // 기존 schema 객체의 속성을 모두 복사
    default:
      "0x1b854694ae746cdbd8d44186ca4929b2b337df21d1c74633be19b2710552fdca", // 새로운 default 값 추가
  },
};

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
      Requests.Headers.acceptBSC,
      tableHandlePathParam,
      Requests.QueryParams.ledgerVersion,
    ],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            additionalProperties: false,
            allOf: [
              {
                type: "object",
                required: ["key"],
                properties: {
                  key: {
                    ...Requests.BodyParams.key,
                    default:
                      "0x0619dc29a0aac8fa146714058e8dd6d2d0f3bdf5f6331907bf91f3acd81e6935",
                  },
                },
              },
            ],
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
