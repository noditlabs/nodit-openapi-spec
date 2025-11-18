import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Domains from "../../library/domains";
import Examples from "../../library/examples";
import {
  decodeInfoMessage,
  kaiaUsingTipsForCommon,
  kaiaUsingTipsForTransaction,
} from "../../../../callouts";
import { getChainInfo } from "../../../../constants";

const summary = "Get Transactions In Block";
const endpoint = "getTransactionsInBlock";
const isPublic = true;
const tags = ["Blockchain API"];

// 체인별 description을 반환하는 헬퍼 함수
function getDescription(chain: string): string {
  switch (chain) {
    default:
      return `특정 블록 내의 트랜잭션 리스트를 조회합니다.

${decodeInfoMessage}
`;
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
          "tron",

          // Move 기반 체인
          "aptos",
        ]),
        Requests.network("mainnet", [
          "mainnet",
          "testnet",
          "sepolia",
          "hoodi",
          "amoy",
          "shasta",
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
              allOf: [
                {
                  type: "object",
                  properties: {
                    block: { ...Requests.Ethereum.block, default: "latest" },
                  },
                  required: ["block"],
                },
                Requests.PaginationSet,
                {
                  type: "object",
                  properties: {
                    withLogs: Requests.Ethereum.withLogs,
                    withDecode: Requests.Ethereum.withDecode,
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
                    block: { ...Requests.Tron.block, default: "latest" },
                  },
                  required: ["block"],
                },
                Requests.PaginationSet,
                {
                  type: "object",
                  properties: {
                    withLogs: Requests.Ethereum.withLogs, // Ethereum Parameter를 그대로 사용, 차이가 생길 경우 변경할 것
                    withDecode: Requests.Ethereum.withDecode, // Ethereum Parameter를 그대로 사용, 차이가 생길 경우 변경할 것
                  },
                },
              ],
            },
            {
              title: "Aptos",
              allOf: [
                {
                  type: "object",
                  properties: {
                    block: { ...Requests.Aptos.block, default: "latest" },
                  },
                  required: ["block"],
                },
                Requests.PaginationSet,
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
          schema: Domains.Pagination({
            oneOf: [
              {
                title: "EVM (Ethereum, Optimism, ...)",
                allOf: [
                  Domains.Ethereum.TransactionWithReceipt,
                  {
                    type: "object",
                    properties: {
                      logs: {
                        type: "array",
                        items: Domains.Ethereum.LogWithDecodedLog,
                      },
                    },
                  },
                ],
                example: Examples.Ethereum[endpoint],
              },
              {
                title: "Tron",
                allOf: [
                  Domains.Tron.Transaction,
                  {
                    type: "object",
                    properties: {
                      logs: {
                        type: "array",
                        items: Domains.Tron.Log,
                      },
                    },
                  },
                ],
                example: Examples.Tron[endpoint],
              },
              {
                title: "Aptos",
                allOf: [Domains.Aptos.Transaction],
                example: Examples.Aptos[endpoint],
              },
            ],
          }),
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
                block: { ...Requests.Tron.block, default: "latest" },
              },
              required: ["block"],
            },
            Requests.PaginationSet,
            {
              type: "object",
              properties: {
                withLogs: Requests.Ethereum.withLogs, // Ethereum Parameter를 그대로 사용, 차이가 생길 경우 변경할 것
                withDecode: Requests.Ethereum.withDecode, // Ethereum Parameter를 그대로 사용, 차이가 생길 경우 변경할 것
              },
            },
          ],
        },
        successResponse: {
          schema: Domains.Pagination({
            allOf: [
              Domains.Tron.Transaction,
              {
                type: "object",
                properties: {
                  logs: {
                    type: "array",
                    items: Domains.Tron.Log,
                  },
                },
              },
            ],
          }),
          example: Examples.Tron[endpoint],
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
                block: { ...Requests.Aptos.block, default: "latest" },
              },
              required: ["block"],
            },
            Requests.PaginationSet,
            {
              type: "object",
              properties: {
                withBalanceChanges: Requests.Aptos.withBalanceChanges,
              },
            },
          ],
        },
        successResponse: {
          schema: Domains.Pagination({
            allOf: [Domains.Aptos.Transaction],
          }),
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
                block: { ...Requests.Ethereum.block, default: "latest" },
              },
              required: ["block"],
            },
            Requests.PaginationSet,
            {
              type: "object",
              properties: {
                withLogs: Requests.Ethereum.withLogs,
                withDecode: Requests.Ethereum.withDecode,
              },
            },
          ],
        },
        successResponse: {
          schema: Domains.Pagination({
            allOf: [
              Domains.Ethereum.TransactionWithReceipt,
              {
                type: "object",
                properties: {
                  logs: {
                    type: "array",
                    items: Domains.Ethereum.LogWithDecodedLog,
                  },
                },
              },
            ],
          }),
          example: Examples.Ethereum[endpoint],
        },
      };
  }
}

// ─────────────────────────────────────
// C. callouts 설정
//   - none일 경우 모든 케이스의 callouts 처리
// ─────────────────────────────────────
function getCallouts(chain: string): string {
  switch (chain) {
    case "web3":
    case "kaia":
      return `${kaiaUsingTipsForCommon(kaiaUsingTipsForTransaction)}`;
    default:
      return ``;
  }
}

export default {
  summary,
  endpoint,
  isPublic,
  info,
};
