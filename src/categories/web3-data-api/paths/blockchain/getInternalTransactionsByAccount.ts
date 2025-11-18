import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Domains from "../../library/domains";
import Examples from "../../library/examples";
import {
  ETHEREUM_ACCOUNTS,
  getChainInfo,
  TRON_ACCOUNTS,
} from "../../../../constants";
import {
  optimismBedrockDataInfoMessage,
  throughputLimitInfoMessage,
} from "../../../../callouts";

const summary = "Get Internal Transactions By Account";
const endpoint = "getInternalTransactionsByAccount";
const isPublic = true;
const tags = ["Blockchain API"];

// 체인별 description을 반환하는 헬퍼 함수
function getDescription(chain: string): string {
  switch (chain) {
    default:
      return `특정 Account와 관련된 internal transaction 리스트를 조회합니다.`;
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
                    accountAddress: {
                      ...Requests.Ethereum.accountAddress,
                      default: ETHEREUM_ACCOUNTS.VITALIK_BUTERIN,
                    },
                    relation: Requests.relation,
                    fromBlock: Requests.Ethereum.fromBlock,
                    toBlock: Requests.Ethereum.toBlock,
                    fromDate: Requests.Ethereum.fromDate,
                    toDate: Requests.Ethereum.toDate,
                  },
                  required: ["accountAddress"],
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
                    accountAddress: {
                      ...Requests.Tron.accountAddress,
                      default: TRON_ACCOUNTS.JUSTIN_SUN,
                    },
                    relation: Requests.relation,
                    fromBlock: Requests.Tron.fromBlock,
                    toBlock: Requests.Tron.toBlock,
                    fromDate: Requests.Tron.fromDate,
                    toDate: Requests.Tron.toDate,
                  },
                  required: ["accountAddress"],
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
                accountAddress: {
                  ...Requests.Tron.accountAddress,
                  default: TRON_ACCOUNTS.JUSTIN_SUN,
                },
                relation: Requests.relation,
                fromBlock: Requests.Tron.fromBlock,
                toBlock: Requests.Tron.toBlock,
                fromDate: Requests.Tron.fromDate,
                toDate: Requests.Tron.toDate,
              },
              required: ["accountAddress"],
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
                accountAddress: {
                  ...Requests.Ethereum.accountAddress,
                  default: ETHEREUM_ACCOUNTS.VITALIK_BUTERIN,
                },
                relation: Requests.relation,
                fromBlock: Requests.Ethereum.fromBlock,
                toBlock: Requests.Ethereum.toBlock,
                fromDate: Requests.Ethereum.fromDate,
                toDate: Requests.Ethereum.toDate,
              },
              required: ["accountAddress"],
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
    case "optimism":
    case "web3":
      return `${throughputLimitInfoMessage}\n${optimismBedrockDataInfoMessage}`;
    default:
      return throughputLimitInfoMessage;
  }
}

export default {
  summary,
  endpoint,
  isPublic,
  info,
};
