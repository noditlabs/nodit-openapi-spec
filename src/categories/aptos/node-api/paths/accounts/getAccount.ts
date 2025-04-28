import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Examples from "../../library/examples";
import Schemas from "../../library/schemas";

const summary = "Get account";
const endpoint = "getAccount";
const operationId = "aptos_" + endpoint;

const info: OpenAPIV3.PathItemObject = {
  get: {
    security: [
      {
        api_key: [],
      },
    ],
    tags: ["Accounts"],
    description: `계정 주소에 대한 인증 키와 시퀀스 넘버를 반환합니다. 원장의 버전을 지정할 수 있으며 원장의 버전이 지정되지 않은 경우, 최신 원장의 버전을 가져옵니다.`,
    summary,
    operationId,
    parameters: [
      Requests.PathParams.address,
      Requests.QueryParams.ledgerVersion,
    ],
    responses: {
      "200": Responses.SuccessAptos200({
        schema: {
          type: "object",
          properties: {
            sequence_number: Schemas.sequenceNumber,
            authenticationKey: Schemas.authenticationKey,
          },
        },
        example: Examples[endpoint as keyof typeof Examples],
      }),
      "400": Responses.Error400,
    },
  },
};

export default info;
