import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Examples from "../../library/examples";
import Schemas from "../../library/schemas";

const summary = "Get events by event handle";
const endpoint = "getEventsByEventHandle";
const operationId = "aptos_" + endpoint;

const info: OpenAPIV3.PathItemObject = {
  get: {
    security: [
      {
        api_key: [],
      },
    ],
    tags: ["Events"],
    description: `address와 creation_number를 이용해 특정 이벤트를 반환합니다.`,
    summary,
    operationId,
    parameters: [
      Requests.PathParams.address,
      Requests.PathParams.eventHandle,
      Requests.PathParams.fieldName,
      Requests.QueryParams.limit,
      Requests.QueryParams.start,
    ],
    responses: {
      "200": Responses.SuccessAptos200({
        schema: {
          type: "array",
          items: Schemas.event,
        },
        example: Examples[endpoint],
      }),
      "400": Responses.Error400,
    },
  },
};

export default info;
