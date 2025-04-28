import { OpenAPIV3 } from "openapi-types";
import Schemas from "./schemas";

type Success200Function = (
  option: OpenAPIV3.MediaTypeObject,
) => OpenAPIV3.ResponseObject;
type SuccessEvm200Function = ({
  result,
  example,
}: {
  result: OpenAPIV3.SchemaObject;
  example: any;
}) => OpenAPIV3.ResponseObject;

namespace Responses {
  /* Success Response Objects */
  export const Success200: Success200Function = (option) => ({
    description: "Successful Response",
    content: {
      "application/json": option,
    },
  });

  export const SuccessEvm200: SuccessEvm200Function = ({
    result,
    example,
  }) => ({
    description: "Successful Response",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            jsonrpc: {
              type: "string",
            },
            id: {
              type: "integer",
            },
            result,
          },
        },
        example,
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
