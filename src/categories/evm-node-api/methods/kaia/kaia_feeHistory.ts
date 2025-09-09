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
            ...(getChainInfo(protocol).mainnet || []),
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
          description: `요청한 블록 범위 내의 가스 수수료 히스토리를 반환합니다. 이 정보를 사용하여 트랜잭션을 생성할 때 maxFeePerGas 및 maxPriorityFeePerGas의 적절한 값을 설정할 수 있습니다.`,
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
                          {
                            title: "Block Count",
                            type: "integer",
                            minimum: 1,
                            maximum: 1024,
                            default: 2,
                          },
                          Schemas.blockNumberOrTagKaia,
                          {
                            title: "Reward Percentiles",
                            type: "array",
                            items: {
                              type: "integer",
                              minimum: 0,
                              maximum: 100,
                            },
                            default: [0, 100],
                          },
                        ],
                      },
                      description: `다음 파라미터들을 타입에 맞게 배열로 입력합니다.
1. \`block count\`: 조회하고자 하는 블록의 범위를 입력합니다. 블록 범위는 1이상 1024이하의 정수로 입력합니다. 사용 가능한 모든 블록이 제공되지 않으면 요청된 수보다 적은 수가 반환될 수 있습니다.
2. \`newest block\`: 조회의 기준이 되는 블록을 입력합니다. 16진수 문자열 형식의 블록 넘버 또는 "latest"를 입력합니다.
3. \`reward percentiles\`: 우선 순위 수수료에 대한 백분위 값을 샘플링하기 위한 정수 배열을 입력합니다. 각 블록의 사용된 가스량에 따라 가중치를 부여하여 백분위 값을 계산합니다. 백분위 값은 0 이상 100 이하의 정수를 오름차순으로 입력합니다.`,
                      minItems: 3,
                      maxItems: 3,
                      default: [2, "latest", [0, 100]],
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
