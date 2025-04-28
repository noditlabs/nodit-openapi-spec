import { OpenAPIV3 } from "openapi-types";
import Schemas from "./schemas";

type Success200Function = (
  option: OpenAPIV3.MediaTypeObject,
) => OpenAPIV3.ResponseObject;

namespace Responses {
  /* Success Response Objects */
  export const Success200: Success200Function = (option) => ({
    description: "Successful Response",
    content: {
      "application/json": option,
    },
  });

  export const SuccessAptos200: Success200Function = (option) => ({
    description: "Successful Response",
    content: {
      "application/json": option,
    },
    headers: {
      "X-APTOS-BLOCK-HEIGHT": {
        description: "Current block height of the chain",
        schema: {
          type: "integer",
        },
        required: true,
      },
      "X-APTOS-CHAIN-ID": {
        description: "Chain ID of the current chain",
        schema: {
          type: "integer",
        },
        required: true,
      },
      "X-APTOS-EPOCH": {
        description: "Current epoch of the chain",
        schema: {
          type: "integer",
        },
        required: true,
      },
      "X-APTOS-LEDGER-OLDEST-VERSION": {
        description: "Oldest non-pruned ledger version of the chain",
        schema: {
          type: "integer",
        },
        required: true,
      },
      "X-APTOS-LEDGER-TIMESTAMPUSEC": {
        description: "Current timestamp of the chain",
        schema: {
          type: "integer",
        },
        required: true,
      },
      "X-APTOS-LEDGER-VERSION": {
        description: "Current ledger version of the chain",
        schema: {
          type: "integer",
        },
        required: true,
      },
      "X-APTOS-OLDEST-BLOCK-HEIGHT": {
        description: "Oldest non-pruned block height of the chain",
        schema: {
          type: "integer",
        },
        required: true,
      },
      "X-APTOS-CURSOR": {
        description: "Cursor for the next page",
        schema: {
          type: "string",
        },
        required: true,
      },
    },
  });

  /* Error Response Objects */
  export const Error400: OpenAPIV3.ResponseObject = {
    description: "Bad Request",
    content: {
      "application/json": {
        schema: Schemas.error,
      },
    },
  };
}

export default Responses;
