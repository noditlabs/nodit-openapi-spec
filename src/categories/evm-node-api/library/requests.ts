import { OpenAPIV3 } from "openapi-types";

namespace Requests {
  export const baseObject = (
    defaultMethod: string,
  ): OpenAPIV3.SchemaObject => ({
    type: "object",
    required: ["id", "jsonrpc", "method"],
    properties: {
      id: {
        type: "integer",
        default: 1,
      },
      jsonrpc: {
        type: "string",
        default: "2.0",
      },
      method: {
        type: "string",
        default: defaultMethod,
      },
    },
  });

  /** Path Parameters **/
  export namespace PathParams {
    export const protocol: OpenAPIV3.ParameterObject = {
      name: "protocol",
      in: "path",
      required: true,
      schema: {
        type: "string",
        default: "aptos",
      },
      description: "조회 대상 체인의 프로토콜을 지정하기 위한 파라미터입니다.",
    };

    export const network: OpenAPIV3.ParameterObject = {
      name: "network",
      in: "path",
      required: true,
      schema: {
        type: "string",
        default: "mainnet",
      },
      description:
        "조회 대상 체인의 네트워크를 지정하기 위한 파라미터입니다. 프로토콜에 따라 지원되는 네트워크가 다를 수 있습니다.",
    };
  }

  /** Body Parameters **/
  export namespace BodyParams {}
}

export default Requests;
