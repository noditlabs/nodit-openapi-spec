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
          description: `서명된 트랜잭션 데이터를 네트워크에 전송합니다. 트랜잭션이 정상적으로 처리되는 경우, 트랜잭션의 해시 값이 반환됩니다. 트랜잭션 서명은 개인키에 의해 client에서 이루어져야 합니다. 노드에서는 해당 트랜잭션의 유효성만 검증합니다.`,
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
                        oneOf: [Schemas.signedTransactionHash],
                      },
                      minItems: 1,
                      maxItems: 1,
                      default: [
                        "0x02f8688080808080943f39cfbaff46cb736a603269d14a7e9adf5158b488016345785d8a000080c001a005599173ee4483fa38044e8d7bf592b58a9ab598f7d4a510702d193c60af15a0a00f2d39e8202dc9d7d66a51fc67fcf1d893b20e080c6acf2b25610f5e926cfa21",
                      ],
                      description: `다음 파라미터들을 타입에 맞게 배열로 입력합니다.
1. \`signed transaction hash\`: `,
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
