import { OpenAPIV3 } from "openapi-types";
import Responses from "../../library/responses";
import Examples from "../../library/examples";
import Schemas from "../../library/schemas";

const summary = "Get ledger info";
const endpoint = "getLedgerInfo";
const operationId = "aptos_" + endpoint;

const info: OpenAPIV3.PathItemObject = {
  get: {
    security: [
      {
        api_key: [],
      },
    ],
    tags: ["General"],
    description: `최신 렛저 정보를 가져옵니다. 체인 ID, 역할 유형, 렛저 버전, 에포크 등의 데이터를 포함합니다.`,
    summary,
    operationId,
    parameters: [],
    responses: {
      "200": Responses.SuccessAptos200({
        schema: Schemas.ledgerInfo,
        example: Examples[endpoint],
      }),
      "400": Responses.Error400,
    },
  },
};

export default info;
