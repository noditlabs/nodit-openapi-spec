import { OpenAPIV3 } from "openapi-types";
import Responses from "../../library/responses";
import Examples from "../../library/examples";
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
          description: `이 메서드는 롤업 구성 매개변수를 조회하는 데 사용됩니다. 호출 결과로는 롤업의 다양한 구성 옵션을 포함한 정보가 반환됩니다. 이 정보에는 제네시스 블록 정보, 배치 크기, 시퀀서 윈도우 크기, 채널 타임아웃 등 롤업 운영에 필요한 다양한 설정 값이 포함될 수 있습니다. 이를 통해 개발자는 롤업의 현재 구성 상태를 이해하고, 필요에 따라 최적화할 수 있습니다.`,
          summary: method,
          operationId: slug,
          parameters: [],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["id", "jsonrpc", "method"],
                  properties: {
                    ...Requests.baseObject(method).properties, // id, jsonrpc, method
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
