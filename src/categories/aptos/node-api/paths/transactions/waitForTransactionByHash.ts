import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Examples from "../../library/examples";
import Schemas from "../../library/schemas";

const summary = "Wait for transaction by hash";
const endpoint = "waitForTransactionByHash";
const operationId = "aptos_" + endpoint;

const info: OpenAPIV3.PathItemObject = {
  get: {
    security: [
      {
        api_key: [],
      },
    ],
    tags: ["Transactions"],
    description: `특정 트랜잭션이 블록체인에 포함될 때까지 기다리는 기능을 제공하며, 응답으로 블록에 포함된 트랜잭션의 세부 정보를 반환합니다. 예를 들어, 상태를 변경하는 트랜잭션을 전송하고 변경된 값을 확인하기 위해 이 API를 사용할 수 있습니다.`,
    summary,
    operationId,
    parameters: [Requests.PathParams.transactionHash],
    responses: {
      "200": Responses.SuccessAptos200({
        schema: Schemas.transaction,
        example: Examples[endpoint],
      }),
      "400": Responses.Error400,
    },
  },
};

export default info;
