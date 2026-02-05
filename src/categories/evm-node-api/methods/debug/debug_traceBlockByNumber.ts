import { OpenAPIV3 } from "openapi-types";
import Responses from "../../library/responses";
import Examples from "../../library/examples";
import Schemas from "../../library/schemas";
import Requests from "../../library/requests";
import { API_KEY, BASE_URL, getChainInfo } from "../../../../constants";
import { OasParamsWithProtocol, ReadmeExtension } from "../../../../types";
import { throughputLimitInfoMessage } from "../../../../callouts";
import { protocolNetwork } from "../../library/serverVariables";

function oasDocs({ version, protocol }: OasParamsWithProtocol): OpenAPIV3.Document {
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
          description: `특정 블록에 대해 tracer를 설정하여 해당 tracer가 제공하는 정보들을 통해 트랜잭션으로 인한 체인의 상태 변화 및 실제 call의 발생 이력들을 Debug할 수 있는 도구입니다.

${throughputLimitInfoMessage}`,
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
                        oneOf: [Schemas.blockNumberOrTag, Schemas.traceOption],
                      },
                      minItems: 1,
                      maxItems: 1,
                      default: [
                        "latest",
                        {
                          tracer: "callTracer",
                          tracerConfig: { onlyTopCall: true },
                        },
                      ],
                      description: `다음 파라미터들을 타입에 맞게 배열로 입력합니다.

1. \`block number or block tag\`: 조회하고자 하는 블록 넘버를 16진수 문자열 형식으로 입력합니다. "earliest", "latest", "pending" 등의 블록 태그를 입력할 수도 있습니다.	
2. \`traceOption\`: trace 옵션 설정을 위한 object입니다.`,
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
