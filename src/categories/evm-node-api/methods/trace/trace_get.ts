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
          `${protocol}-${getChainInfo(protocol).mainnet}`,
          [
            `${protocol}-${getChainInfo(protocol).mainnet}`,
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
          description: `특정 트랜잭션의 실행 과정을 추적합니다. 이 메소드는 해당 트랜잭션이 실행되면서 발생한 모든 중요한 이벤트(예: 함수 호출, 가스 소비량, 생성된 로그 등)에 대한 정보를 제공합니다.`,
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
                        oneOf: [
                          Schemas.transactionHash,
                          {
                            title: "Trace Index",
                            type: "array",
                            items: Schemas.transactionIndex,
                            minItems: 1,
                          },
                        ],
                      },
                      minItems: 2,
                      maxItems: 2,
                      default: [
                        "0x17104ac9d3312d8c136b7f44d4b8b47852618065ebfa534bd2d3b5ef218ca1f3",
                        ["0x0"],
                      ],
                      description: `다음 파라미터들을 타입에 맞게 배열로 입력합니다.

1. \`transaction hash\` : 조회하고자 하는 트랜잭션 해시를 문자열 형식으로 입력합니다.
2. \`index\`: 조회하고자 하는 trace의 index를 배열의 형태로 입력합니다.`,
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
