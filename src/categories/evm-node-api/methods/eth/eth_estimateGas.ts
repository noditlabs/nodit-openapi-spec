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
          description: `트랜잭션을 실행할 때 필요한 가스량을 추정합니다. 실제로 트랜잭션을 발행하지 않고 가스량만 추정합니다.`,
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
                      minItems: 1,
                      maxItems: 1,
                      items: {
                        oneOf: [Schemas.callObject],
                      },
                      default: [
                        {
                          from: "0xc90d3Ac75D1D36dF0b0a229E73D8409FB7F3c4ab",
                          to: "0xd3CdA913deB6f67967B99D67aCDFa1712C293601",
                          value: "0x186a0",
                        },
                      ],
                      description: `다음 파라미터들을 타입에 맞게 배열로 입력합니다.
1. \`call object\` - 호출할 컨트랙트의 주소와 호출할 함수의 데이터를 입력합니다.`,
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
