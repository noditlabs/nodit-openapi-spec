import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Domains from "../../library/domains";
import Examples from "../../library/examples";
import {
  kaiaUsingTipsForBlock,
  kaiaUsingTipsForCommon,
} from "../../../../callouts";
import { decodeInfoMessage } from "../../../../callouts";
import { getChainInfo } from "../../../../constants";

const summary = "Get Transaction By Hash";
const endpoint = "getTransactionByHash";
const isPublic = true;
const tags = ["Blockchain API"];

// 체인별 description을 반환하는 헬퍼 함수
function getDescription(chain: string): string {
  switch (chain) {
    default:
      return `특정 트랜잭션의 정보를 조회합니다.`;
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
          // evm
          "arbitrum",
          "base",
          // "bnb",
          "chiliz",
          "ethereum",
          "ethereumclassic",
          "giwa",
          "kaia",
          "optimism",
          "polygon",
          "luniverse",

          // xrpl
          "xrpl",

          // aptos
          "aptos",
        ]),
        Requests.network("mainnet", [
          "mainnet",
          "testnet",
          "sepolia",
          "hoodi",
          "amoy",
        ]),
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
              type: "object",
              properties: {
                transactionHash: {
                  ...Requests.Ethereum.transactionHash,
                  default:
                    "0x1632ac1627903e586c8ea0b1c134908c34ee95e84face9a303abd63686eb2022",
                },
                withLogs: Requests.Ethereum.withLogs,
                withDecode: Requests.Ethereum.withDecode,
              },
              required: ["transactionHash"],
            },
            {
              title: "XRPL",
              type: "object",
              allOf: [
                {
                  type: "object",
                  properties: {
                    transactionHash: {
                      ...Requests.XRPL.transactionHash,
                      default:
                        "CEE2B3341141745B41DD40C775D34A6E24CBD79F5A4E5D025712416D5CE85784",
                    },
                  },
                },
                {
                  type: "object",
                  properties: {
                    withBalanceChanges: Requests.XRPL.withBalanceChanges,
                    withTokenTransfers: Requests.XRPL.withTokenTransfers,
                  },
                },
              ],
              required: ["transactionHash"],
            },
            {
              title: "Aptos",
              type: "object",
              allOf: [
                {
                  type: "object",
                  properties: {
                    transactionHash: {
                      ...Requests.Aptos.transactionHash,
                    },
                  },
                  required: ["transactionHash"],
                },
                {
                  type: "object",
                  properties: {
                    withBalanceChanges: Requests.Aptos.withBalanceChanges,
                  },
                },
              ],
            },
          ],
        },
        successResponse: {
          schema: {
            oneOf: [
              {
                title: "EVM (Ethereum, Optimism, ...)",
                allOf: [
                  Domains.Ethereum.TransactionWithReceipt,
                  {
                    type: "object",
                    properties: {
                      logs: {
                        ...Domains.Ethereum.LogWithDecodedLog,
                      },
                    },
                  },
                ],
                example: Examples.Ethereum[endpoint],
              },
              {
                title: "XRPL",
                ...Domains.XRPL.Transaction,
                example: Examples.XRPL[endpoint],
              },
              {
                title: "Aptos",
                ...Domains.Aptos.Transaction,
                example: Examples.Aptos[endpoint],
              },
            ],
          },
        },
      };

    case "xrpl":
      return {
        requestBody: {
          additionalProperties: false,
          allOf: [
            {
              type: "object",
              properties: {
                transactionHash: {
                  ...Requests.XRPL.transactionHash,
                  default:
                    "CEE2B3341141745B41DD40C775D34A6E24CBD79F5A4E5D025712416D5CE85784",
                },
              },
              required: ["transactionHash"],
            },
            {
              type: "object",
              properties: {
                withBalanceChanges: Requests.XRPL.withBalanceChanges,
                withTokenTransfers: Requests.XRPL.withTokenTransfers,
              },
            },
          ],
        },
        successResponse: {
          schema: {
            allOf: [Domains.XRPL.Transaction],
          },
          example: Examples.XRPL[endpoint],
        },
      };

    case "aptos":
      return {
        requestBody: {
          additionalProperties: false,
          allOf: [
            {
              type: "object",
              properties: {
                transactionHash: {
                  ...Requests.Aptos.transactionHash,
                  default:
                    "0xaf2fba4b6190c4b87d9479f3eb62c093f452f27c388dab4afeae98ae8ec00005",
                },
              },
              required: ["transactionHash"],
            },
            {
              type: "object",
              properties: {
                withBalanceChanges: Requests.Aptos.withBalanceChanges,
              },
            },
          ],
        },
        successResponse: {
          schema: {
            allOf: [Domains.Aptos.Transaction],
          },
          example: Examples.Aptos[endpoint],
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
                withLogs: Requests.Ethereum.withLogs,
                withDecode: Requests.Ethereum.withDecode,
              },
              required: ["transactionHash"],
            },
          ],
        },
        successResponse: {
          schema: {
            allOf: [
              Domains.Ethereum.TransactionWithReceipt,
              {
                type: "object",
                properties: {
                  logs: {
                    ...Domains.Ethereum.LogWithDecodedLog,
                  },
                },
              },
            ],
          },
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
    case "kaia":
      return `${kaiaUsingTipsForCommon(kaiaUsingTipsForBlock)}

${decodeInfoMessage}`;
    case "xrpl":
    case "aptos":
      return ``;
    default:
      return `${decodeInfoMessage}`; // 해당 체인에서는 callouts가 없음
  }
}

export default {
  summary,
  endpoint,
  isPublic,
  info,
};
