import { OpenAPIV3 } from "openapi-types";
import Responses from "../../library/responses";
import Examples from "../../library/examples";
import Schemas from "../../library/schemas";
import Requests from "../../library/requests";
import { API_KEY, BASE_URL, getChainInfo } from "../../../../constants";
import { OasParams, ReadmeExtension } from "../../../../types";
import { protocolNetwork } from "../../library/serverVariables";

function oasDocs({ version, protocol }: OasParams): OpenAPIV3.Document {
  const fileName = __filename.split("/").slice(-1)[0]?.split(".")[0];
  const method = fileName;
  const title = `evm-${protocol}-${method}`;
  const slug = protocol === "ethereum" ? method : `${protocol}-${method}`;
  if (!method) {
    throw new Error("Check if the file name is correct");
  }
  return {
    openapi: "3.1.0",
    info: {
      title,
      version,
    },
    servers: [
      {
        url: BASE_URL.NODE_API(protocol),
        variables: protocolNetwork(
          protocol,
          `${protocol}-${
            getChainInfo(protocol).mainnet ||
            getChainInfo(protocol).testnet?.[0]
          }`,
          [
            ...(getChainInfo(protocol).mainnet
              ? [`${protocol}-${getChainInfo(protocol).mainnet}`]
              : []),
            ...(getChainInfo(protocol).testnet?.map(
              (testnet) => `${protocol}-${testnet}`
            ) || []),
          ]
        ),
      },
    ],
    components: {
      securitySchemes: {
        api_key: {
          type: "apiKey",
          name: "X-API-KEY",
          in: "header",
          "x-default": API_KEY.NODIT_DOCS_DEMO,
          description:
            "The default value, `nodit-demo`, is only for use in the developer documentation. For real applications or services, use the API key obtained from the Nodit console.",
        } as ReadmeExtension.securitySchemes,
      },
    },
    paths: {
      ["/"]: {
        post: {
          security: [
            {
              api_key: [],
            },
          ],
          tags: [title],
          description: `지정된 블록에 포함된 모든 트랜잭션의 실행을 추적합니다. 이 메소드는 해당 블록에서 실행된 모든 트랜잭션에 대한 상세한 추적 정보를 제공하며, 블록 수준에서의 트랜잭션 처리 과정을 분석하는 데 사용됩니다.`,
          summary: method,
          operationId: slug,
          parameters: [],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["id", "jsonrpc", "method", "params"],
                  properties: {
                    ...Requests.baseObject(method).properties, // id, jsonrpc, method
                    params: {
                      type: "array",
                      items: {
                        oneOf: [Schemas.blockNumberOrTag, Schemas.traceType],
                      },
                      minItems: 2,
                      maxItems: 2,
                      default: ["latest", ["trace"]],
                      description: `다음 파라미터들을 타입에 맞게 배열로 입력합니다.

1. \`block number or block tag\`: 조회하고자 하는 블록 넘버를 16진수 문자열 형식으로 입력합니다. "earliest", "latest", "pending" 등의 블록 태그를 입력할 수도 있습니다.`,
                    },
                  },
                },
              },
            },
          },
          responses: {
            "200": Responses.Success200({
              example: Examples[method as keyof typeof Examples],
            }),
            "400": Responses.Error400,
          },
        },
      },
    },
  };
}

export default oasDocs;
