import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Domains from "../../library/domains";
import Examples from "../../library/examples";
import { getChainInfo } from "../../../../constants";
import { optimismBedrockDataInfoMessage } from "../../../../callouts";

const summary = "Get Internal Transactions By Transaction Hash";
const endpoint = "getInternalTransactionsByTransactionHash";
const isPublic = true;
const tags = ["Blockchain API"];

// 체인별 description을 반환하는 헬퍼 함수
function getDescription(chain: string): string {
  switch (chain) {
    default:
      return `특정 트랜잭션에서 발생한 internal transaction 리스트를 조회합니다.`;
  }
}

const info = (chain: string): OpenAPIV3.PathItemObject => {
  // A. operationId, parameters 설정
  const { operationId, parameters } = getOpIdAndParams(chain);
  // B. requestBody, successResponse 설정
  const { requestBody, successResponse } = getRequestAndResponse(chain);
  // C. callouts 설정
  const callouts = getCallouts(chain);
  // D. chain에 따른 description 설정
  const chainDescription = getDescription(chain);

  return {
    post: {
      security: [
        {
          api_key: [],
        },
      ],
      tags,
      description: `${chainDescription}\n\n${callouts}`,
      summary,
      operationId,
      parameters,
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: requestBody,
          },
        },
      },
      responses: {
        "200": {
          ...Responses.Success200(successResponse),
        },
        "400": Responses.Error400,
        "401": Responses.Error401,
        "403": Responses.Error403,
        "404": Responses.Error404,
        "429": Responses.Error429,
      },
    },
  };
};

// ─────────────────────────────────────
// A. operationId, parameters 설정
//   - none vs. 그 외
// ─────────────────────────────────────
function getOpIdAndParams(chain: string): {
  operationId: string;
  parameters: OpenAPIV3.ParameterObject[];
} {
  if (chain === "web3") {
    return {
      operationId: endpoint,
      parameters: [
        Requests.chain("ethereum", [
          "arbitrum",
          "base",
          // "bnb",
          "chiliz",
          "ethereum",
          "ethereumclassic",
          "giwa",
          "kaia",
          "luniverse",
          "tron",
        ]),
        Requests.network("mainnet", ["mainnet"]),
      ],
    };
  } else {
    const chainInfo = getChainInfo(chain);
    return {
      operationId: `${chain}-${endpoint}`,
      parameters: [
        Requests.chain(chain, [chain]),
        Requests.network(
          chainInfo?.mainnet || chainInfo?.testnet?.[0] || null,
          chainInfo?.mainnet
            ? [chainInfo.mainnet, ...(chainInfo?.testnet || [])]
            : [...(chainInfo?.testnet || [])]
        ),
      ],
    };
  }
}

// ─────────────────────────────────────
// B. requestBody, successResponse 설정
//   - 체인별로 모두 다름
// ─────────────────────────────────────
function getRequestAndResponse(chain: string): {
  requestBody: OpenAPIV3.SchemaObject;
  successResponse: OpenAPIV3.MediaTypeObject;
} {
  switch (chain) {
    case "web3":
      return {
        requestBody: {
          additionalProperties: false,
          oneOf: [
            {
              title: "EVM (Ethereum, Optimism, ...)",
              allOf: [
                {
                  type: "object",
                  properties: {
                    transactionHash: {
                      ...Requests.Ethereum.transactionHash,
                      default:
                        "0x1632ac1627903e586c8ea0b1c134908c34ee95e84face9a303abd63686eb2022",
                    },
                  },
                  required: ["transactionHash"],
                },
                Requests.PaginationSet,
                {
                  type: "object",
                  properties: {
                    withZeroValue: Requests.withZeroValue,
                    withExternalTransaction:
                      Requests.Ethereum.withExternalTransaction,
                  },
                },
              ],
            },
            {
              title: "Tron",
              allOf: [
                {
                  type: "object",
                  properties: {
                    transactionHash: {
                      ...Requests.Tron.transactionHash,
                      default:
                        "03b0a72460abbc3e9ec26dafdb2a4e23faaebb70b8beb30348a6aaffa4d49f8a",
                    },
                  },
                  required: ["transactionHash"],
                },
                Requests.PaginationSet,
              ],
            },
          ],
        },
        successResponse: {
          schema: {
            oneOf: [
              {
                title: "EVM (Ethereum, Optimism, ...)",
                ...Domains.Pagination(Domains.Ethereum.Trace),
                example: Examples.Ethereum[endpoint],
              },
              {
                title: "Tron",
                ...Domains.Pagination(Domains.Tron.InternalTransaction),
                example: Examples.Tron[endpoint],
              },
            ],
          },
        },
      };
    case "tron":
      return {
        requestBody: {
          additionalProperties: false,
          allOf: [
            {
              type: "object",
              properties: {
                transactionHash: {
                  ...Requests.Tron.transactionHash,
                  default:
                    "03b0a72460abbc3e9ec26dafdb2a4e23faaebb70b8beb30348a6aaffa4d49f8a",
                },
              },
              required: ["transactionHash"],
            },
            Requests.PaginationSet,
          ],
        },
        successResponse: {
          schema: Domains.Pagination(Domains.Tron.InternalTransaction),
          example: Examples.Tron[endpoint],
        },
      };
    default:
      return {
        requestBody: {
          additionalProperties: false,
          allOf: [
            {
              type: "object",
              properties: {
                transactionHash: {
                  ...Requests.Ethereum.transactionHash,
                  default:
                    "0x1632ac1627903e586c8ea0b1c134908c34ee95e84face9a303abd63686eb2022",
                },
              },
              required: ["transactionHash"],
            },
            Requests.PaginationSet,
            {
              type: "object",
              properties: {
                withZeroValue: Requests.withZeroValue,
                withExternalTransaction:
                  Requests.Ethereum.withExternalTransaction,
              },
            },
          ],
        },
        successResponse: {
          schema: Domains.Pagination(Domains.Ethereum.Trace),
          example: Examples.Ethereum[endpoint],
        },
      };
  }
}

// ─────────────────────────────────────
// C. callouts 설정
//   - 체인별로 모두 다름
// ─────────────────────────────────────
function getCallouts(chain: string): string {
  switch (chain) {
    case "web3":
    case "optimism":
      return optimismBedrockDataInfoMessage;
    default:
      return "";
  }
}

export default {
  summary,
  endpoint,
  isPublic,
  info,
};
