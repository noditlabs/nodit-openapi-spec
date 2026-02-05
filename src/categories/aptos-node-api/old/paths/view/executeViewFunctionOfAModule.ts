import { OpenAPIV3 } from "openapi-types";
import Responses from "../../library/responses";
import Examples from "../../library/examples";
import { Patterns } from "../../../../../patterns";

const summary = "Execute view function of a module";
const endpoint = "executeViewFunctionOfAModule";
const operationId = "aptos_" + endpoint;

const info: OpenAPIV3.PathItemObject = {
  post: {
    security: [
      {
        api_key: [],
      },
    ],
    tags: ["View"],
    description: `view로 정의된 함수를 호출할 수 있습니다.`,
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
                type: "object",
                required: ["function", "type_arguments", "arguments"],
                properties: {
                  function: {
                    type: "string",
                    description: `배포된 module에서 정의한 view 함수를 입력하는 필드입니다. 아래의 형식에 맞게 입력하세요.
- 형식: {address}::{module_name}::{function_name}`,
                  },
                  type_arguments: {
                    type: "array",
                    description:
                      "함수의 type arguments를 입력하는 필드입니다. gerneric type을 인자로 받지 않는 함수의 경우, 빈 배열을 입력합니다.",
                    items: {
                      type: "string",
                      pattern: Patterns.aptos.primitiveType.source,
                    },
                  },
                  arguments: {
                    type: "array",
                    description:
                      "함수의 arguments를 입력하는 필드입니다. 인자를 갖지 않는 함수의 경우, 이 필드는 빈 배열로 입력합니다.",
                    items: {
                      type: "string",
                    },
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
        example: Examples[endpoint],
      }),
      "400": Responses.Error400,
    },
  },
};

export default info;
