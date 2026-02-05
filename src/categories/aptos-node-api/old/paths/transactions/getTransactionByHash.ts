import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Examples from "../../library/examples";
import Schemas from "../../library/schemas";

const summary = "Get transaction by hash";
const endpoint = "getTransactionByHash";
const operationId = "aptos_" + endpoint;

const info: OpenAPIV3.PathItemObject = {
  get: {
    security: [
      {
        api_key: [],
      },
    ],
    tags: ["Transactions"],
    description: `트랜잭션 해시를 이용해 특정 트랜잭션 데이터를 반환합니다. Hash가 주어지면 서버에서는 Storage(on-chain, committed)에서 트랜잭션을 우선 조회하며 on-chain에서 발견되지 않으면 mempool에서 조회합니다.`,
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
