import { OpenAPIV3 } from "openapi-types";
import Responses from "../../library/responses";
import Examples from "../../library/examples";
import Schemas from "../../library/schemas";
import Requests from "../../library/requests";
import {
  API_KEY,
  BASE_URL,
  ERC20,
  ETHEREUM_ACCOUNTS,
  getChainInfo,
} from "../../../../constants";
import { OasParams, ReadmeExtension } from "../../../../types";
import { protocolNetwork } from "../../library/serverVariables";
import { ethCallInfoMessage } from "../../../../callouts";

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
          description: `실제로 트랜잭션을 생성하여 발행하지 않고 컨트랙트의 읽기 method를 실행한 결과를 조회할 수 있습니다. 주로 특정 스마트 컨트랙트의 현재 상태를 읽기 위해 사용됩니다. call로 인한 상태 변경은 일어나지 않습니다.
					
${ethCallInfoMessage}`,
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
                      minItems: 2,
                      maxItems: 3,
                      items: {
                        oneOf: [
                          Schemas.callObject,
                          Schemas.blockNumberOrHashOrTagKaia,
                          Schemas.stateOverrideSet,
                        ],
                      },
                      default: [
                        {
                          to: ERC20.USDC.CONTRACT_ADDRESS,
                          data: `0x70a08231000000000000000000000000${ETHEREUM_ACCOUNTS.VITALIK_BUTERIN.slice(
                            2
                          )}`, // balanceOf(address)
                        },
                        "latest",
                      ],
                      description: `다음 파라미터들을 타입에 맞게 배열로 입력합니다.
1. \`call object\` - 호출할 컨트랙트의 주소와 호출할 함수의 데이터를 입력합니다.
2. \`block identifier\` - 조회 대상 블록 식별자로 블록 넘버, 블록 해시, 블록 태그 중 하나를 입력할 수 있습니다. 
3. \`state override set\` - 상태 변경을 위한 트랜잭션의 state override set을 입력합니다.`,
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
