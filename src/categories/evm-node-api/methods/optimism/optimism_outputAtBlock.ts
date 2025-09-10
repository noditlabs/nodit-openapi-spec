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
          description: `이 메소드는 특정 블록에서의 출력 루트를 얻기 위해 사용됩니다. 사용자는 해당 블록 번호를 16진수 형태로 제공하여 호출할 수 있으며, 성공적인 호출 결과로는 해당 블록의 출력 루트가 반환됩니다. 출력 루트는 Optimism의 상태를 나타내는 중요한 요소로, 특정 블록의 상태를 검증하는 데 사용될 수 있습니다.`,
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
                          { ...Schemas.blockNumber, default: "0x7C664D5" },
                        ],
                      },
                      minItems: 1,
                      maxItems: 1,
                      description: `다음 파라미터들을 타입에 맞게 배열로 입력합니다.
1. \`block number\`: 조회하고자 하는 블록 넘버를 16진수 문자열 형식으로 입력합니다. 이 메서드는 최신 128블록까지 조회 가능합니다.`,
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
