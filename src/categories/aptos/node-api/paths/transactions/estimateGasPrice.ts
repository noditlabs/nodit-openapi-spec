import { OpenAPIV3 } from "openapi-types";
import Responses from "../../library/responses";
import Examples from "../../library/examples";
import Schemas from "../../library/schemas";

const summary = "Estimate gas price";
const endpoint = "estimateGasPrice";
const operationId = "aptos_" + endpoint;

const info: OpenAPIV3.PathItemObject = {
  get: {
    security: [
      {
        api_key: [],
      },
    ],
    tags: ["Transactions"],
    description: `트랜잭션을 수행하는데 필요한 Gas의 가격 단가를 추정하여 반환합니다.`,
    summary,
    operationId,
    responses: {
      "200": Responses.SuccessAptos200({
        schema: Schemas.gasEstimateObject,
        example: Examples[endpoint],
      }),
      "400": Responses.Error400,
    },
  },
};

export default info;
