import { OpenAPIV3 } from "openapi-types";

interface Success200Interface {
  (option: OpenAPIV3.MediaTypeObject): OpenAPIV3.ResponseObject;
}

namespace Responses {
  /* Success Response Objects */
  export const Success200: Success200Interface = (option) => ({
    description: "Successful Response",
    content: {
      "application/json": option,
    },
  });

  /* Error Response Objects */
  export const Error400: OpenAPIV3.ResponseObject = {
    description: "Bad Request",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            code: {
              type: "string",
            },
            message: {
              type: "string",
            },
          },
          example: {
            code: "INVALID_PARAMETER",
            message:
              "Invalid parameter: { PARAMETER1_NAME = PARAMETER1_VALUE, PARAMETER2_NAME = PARAMETER2_VALUE, ... }",
          },
        },
      },
    },
  };

  export const Error401: OpenAPIV3.ResponseObject = {
    description: "Unauthorized",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            code: {
              type: "string",
            },
            message: {
              type: "string",
            },
          },
          example: {
            code: "AUTHENTICATION_FAILED",
            message: "Authentication failed",
          },
        },
      },
    },
  };

  export const Error403: OpenAPIV3.ResponseObject = {
    description: "Forbidden",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            code: {
              type: "string",
            },
            message: {
              type: "string",
            },
          },
          example: {
            code: "PERMISSION_DENIED",
            message: "Permission denied",
          },
        },
      },
    },
  };

  export const Error404: OpenAPIV3.ResponseObject = {
    description: "Not Found",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            code: {
              type: "string",
            },
            message: {
              type: "string",
            },
          },
          example: {
            code: "RESOURCE_NOT_FOUND",
            message:
              "Resource not found: { RESOURCE1_NAME = RESOURCE1_VALUE, RESOURCE2_NAME = RESOURCE2_VALUE, ... }",
          },
        },
      },
    },
  };

  export const Error429: OpenAPIV3.ResponseObject = {
    description: "Too Many Requests",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            code: {
              type: "string",
            },
            message: {
              type: "string",
            },
          },
          example: {
            code: "TOO_MANY_REQUESTS",
            message: "Too many requests",
          },
        },
      },
    },
  };
}

export default Responses;
