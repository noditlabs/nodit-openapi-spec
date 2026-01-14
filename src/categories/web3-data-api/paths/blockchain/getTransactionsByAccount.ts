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
import {
  BITCOIN_ACCOUNTS,
  ETHEREUM_ACCOUNTS,
  getChainInfo,
  TRON_ACCOUNTS,
  XRPL_ACCOUNTS,
  APTOS_ACCOUNTS,
} from "../../../../constants";

const summary = "Get Transactions By Account";
const endpoint = "getTransactionsByAccount";
const isPublic = true;
const tags = ["Blockchain API"];

// 체인별 description을 반환하는 헬퍼 함수
function getDescription(chain: string): string {
  switch (chain) {
    default:
      return `특정 계정이 전송 혹은 수신한 트랜잭션 목록을 조회합니다.`;
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
          "bnb",
          "chiliz",
          "ethereum",
          "ethereumclassic",
          "giwa",
          "kaia",
          "optimism",
          "polygon",
          "luniverse",
          "tron",

          // utxo
          "bitcoin",
          "dogecoin",
          "bitcoincash",

          // xrpl
          "xrpl",

          // Move 기반 체인
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
      // "web3"인 경우 EVM과 UTXO 체인을 하나의 `oneOf`로 처리
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
                    fromBlock: Requests.Kaia.fromBlock, // 카이아 하드포크로 인한 안내 문구 포함
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
                    withLogs: Requests.Ethereum.withLogs,
                    withDecode: Requests.Ethereum.withDecode,
                  },
                },
              ],
            },
            {
              title: "Bitcoin, Dogecoin, Bitcoincash",
              allOf: [
                {
                  type: "object",
                  properties: {
                    accountAddress: {
                      ...Requests.Bitcoin.accountAddress,
                      default: BITCOIN_ACCOUNTS.SATOSHI,
                    },
                    relation: Requests.relation,
                    fromBlock: Requests.Bitcoin.fromBlock,
                    toBlock: Requests.Bitcoin.toBlock,
                    fromDate: Requests.Bitcoin.fromDate,
                    toDate: Requests.Bitcoin.toDate,
                  },
                  required: ["accountAddress"],
                },
                Requests.PaginationSet,
              ],
            },
            {
              title: "Tron",
              type: "object",
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
                {
                  type: "object",
                  properties: {
                    withLogs: Requests.Ethereum.withLogs, // Ethereum Parameter를 그대로 사용, 차이가 생길 경우 변경할 것
                    withDecode: Requests.Ethereum.withDecode, // Ethereum Parameter를 그대로 사용, 차이가 생길 경우 변경할 것
                  },
                },
              ],
              required: ["accountAddress"],
            },
            {
              title: "XRPL",
              type: "object",
              allOf: [
                {
                  type: "object",
                  properties: {
                    accountAddress: {
                      ...Requests.XRPL.accountAddress,
                      default: XRPL_ACCOUNTS.ACCOUNT_1,
                    },
                    relation: Requests.XRPL.relation,
                    fromLedger: Requests.XRPL.fromLedger,
                    toLedger: Requests.XRPL.toLedger,
                    fromDate: Requests.XRPL.fromDate,
                    toDate: Requests.XRPL.toDate,
                  },
                  required: ["accountAddress"],
                },
                Requests.PaginationSet,
                {
                  type: "object",
                  properties: {
                    withBalanceChanges: Requests.XRPL.withBalanceChanges,
                    withTokenTransfers: Requests.XRPL.withTokenTransfers,
                  },
                },
              ],
            },
            {
              title: "Aptos",
              type: "object",
              allOf: [
                {
                  type: "object",
                  properties: {
                    accountAddress: {
                      ...Requests.Aptos.accountAddress,
                      default: APTOS_ACCOUNTS.ACCOUNT_1,
                    },
                    relation: Requests.Aptos.relation,
                    fromBlock: Requests.Aptos.fromBlock,
                    toBlock: Requests.Aptos.toBlock,
                    fromDate: Requests.Aptos.fromDate,
                    toDate: Requests.Aptos.toDate,
                  },
                  required: ["accountAddress"],
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
                        ...Domains.Ethereum.Log,
                        ...Domains.Ethereum.DecodedLog,
                      },
                    },
                  },
                ],
                example: Examples.Ethereum[endpoint],
              },
              {
                title: "Bitcoin, Dogecoin",
                allOf: [
                  Domains.Bitcoin.Transaction,
                  {
                    type: "object",
                    properties: {
                      vin: Domains.Bitcoin.Vin,
                      vout: Domains.Bitcoin.Vout,
                    },
                  },
                ],
                example: Examples.Bitcoin[endpoint],
              },
              {
                title: "Bitcoincash",
                allOf: [
                  Domains.Bitcoin.Transaction,
                  {
                    type: "object",
                    properties: {
                      vin: {
                        allOf: [Domains.Bitcoin.Vin, Domains.BitcoinCash.Token],
                      },
                      vout: {
                        allOf: [
                          Domains.Bitcoin.Vout,
                          Domains.BitcoinCash.Token,
                        ],
                      },
                    },
                  },
                ],
                example: Examples.BitcoinCash[endpoint],
              },
              {
                title: "Tron",
                allOf: [
                  Domains.Tron.Transaction,
                  {
                    type: "object",
                    properties: {
                      logs: {
                        ...Domains.Tron.Log, // Tron Log에는 DecodedLog가 포함되어 있음
                      },
                    },
                  },
                ],
                example: Examples.Tron[endpoint],
              },
              {
                title: "XRPL",
                allOf: [Domains.XRPL.Transaction],
                example: Examples.XRPL[endpoint],
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
    case "bitcoin":
    case "dogecoin":
      // Bitcoin과 Dogecoin 관련 설정 (UTXO)
      return {
        requestBody: {
          additionalProperties: false,
          type: "object",
          allOf: [
            {
              type: "object",
              properties: {
                accountAddress: {
                  ...Requests.Bitcoin.accountAddress,
                  default: BITCOIN_ACCOUNTS.SATOSHI,
                },
                relation: Requests.relation,
                fromBlock: Requests.Bitcoin.fromBlock,
                toBlock: Requests.Bitcoin.toBlock,
                fromDate: Requests.Bitcoin.fromDate,
                toDate: Requests.Bitcoin.toDate,
              },
              required: ["accountAddress"],
            },
            Requests.PaginationSet,
          ],
        },
        successResponse: {
          schema: Domains.Pagination({
            allOf: [
              Domains.Bitcoin.Transaction,
              {
                type: "object",
                properties: {
                  vin: Domains.Bitcoin.Vin,
                  vout: Domains.Bitcoin.Vout,
                },
              },
            ],
          }),
          example: Examples.Bitcoin[endpoint],
        },
      };
    case "bitcoincash":
      return {
        requestBody: {
          additionalProperties: false,
          type: "object",
          allOf: [
            {
              type: "object",
              properties: {
                accountAddress: {
                  ...Requests.Bitcoin.accountAddress,
                  default: BITCOIN_ACCOUNTS.SATOSHI,
                },
                relation: Requests.relation,
                fromBlock: Requests.Bitcoin.fromBlock,
                toBlock: Requests.Bitcoin.toBlock,
                fromDate: Requests.Bitcoin.fromDate,
                toDate: Requests.Bitcoin.toDate,
              },
              required: ["accountAddress"],
            },
            Requests.PaginationSet,
          ],
        },
        successResponse: {
          schema: Domains.Pagination({
            allOf: [
              Domains.Bitcoin.Transaction,
              {
                type: "object",
                properties: {
                  vin: {
                    allOf: [Domains.Bitcoin.Vin, Domains.BitcoinCash.Token],
                  },
                  vout: {
                    allOf: [Domains.Bitcoin.Vout, Domains.BitcoinCash.Token],
                  },
                },
              },
            ],
          }),
          example: Examples.Bitcoin[endpoint],
        },
      };

    case "kaia":
      return {
        requestBody: {
          additionalProperties: false,
          type: "object",
          allOf: [
            {
              type: "object",
              properties: {
                accountAddress: {
                  ...Requests.Ethereum.accountAddress,
                  default: ETHEREUM_ACCOUNTS.VITALIK_BUTERIN,
                },
                relation: Requests.relation,
                fromBlock: Requests.Kaia.fromBlock, // 카이아 하드포크로 인한 안내 문구 포함
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
                withLogs: Requests.Ethereum.withLogs,
                withDecode: Requests.Ethereum.withDecode,
              },
            },
          ],
          required: ["accountAddress"],
        },
        successResponse: {
          schema: Domains.Pagination({
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
          }),
          example: Examples.Ethereum[endpoint],
        },
      };
    case "tron":
      return {
        requestBody: {
          additionalProperties: false,
          type: "object",
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
            {
              type: "object",
              properties: {
                withLogs: Requests.Ethereum.withLogs, // Ethereum Parameter를 그대로 사용, 차이가 생길 경우 변경할 것
                withDecode: Requests.Ethereum.withDecode, // Ethereum Parameter를 그대로 사용, 차이가 생길 경우 변경할 것
              },
            },
          ],
          required: ["accountAddress"],
        },
        successResponse: {
          schema: Domains.Pagination({
            allOf: [
              Domains.Tron.Transaction,
              {
                type: "object",
                properties: {
                  logs: {
                    ...Domains.Tron.Log, // Tron Log에는 DecodedLog가 포함되어 있음
                  },
                },
              },
            ],
          }),
          example: Examples.Tron[endpoint],
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
                accountAddress: {
                  ...Requests.XRPL.accountAddress,
                  default: XRPL_ACCOUNTS.ACCOUNT_1,
                },
                relation: Requests.XRPL.relation,
                fromLedger: Requests.XRPL.fromLedger,
                toLedger: Requests.XRPL.toLedger,
                fromDate: Requests.XRPL.fromDate,
                toDate: Requests.XRPL.toDate,
              },
              required: ["accountAddress"],
            },
            Requests.PaginationSet,
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
          schema: Domains.Pagination(Domains.XRPL.Transaction),
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
                accountAddress: {
                  ...Requests.Aptos.accountAddress,
                  default: APTOS_ACCOUNTS.ACCOUNT_1,
                },
                relation: Requests.Aptos.relation,
                fromBlock: Requests.Aptos.fromBlock,
                toBlock: Requests.Aptos.toBlock,
                fromDate: Requests.Aptos.fromDate,
                toDate: Requests.Aptos.toDate,
              },
            },
            Requests.PaginationSet,
            {
              type: "object",
              properties: {
                withBalanceChanges: Requests.Aptos.withBalanceChanges,
              },
            },
          ],
          required: ["accountAddress"],
        },
        successResponse: {
          schema: Domains.Pagination(Domains.Aptos.Transaction),
          example: Examples.Aptos[endpoint],
        },
      };

    // for EVM chains
    default:
      return {
        requestBody: {
          additionalProperties: false,
          type: "object",
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
                withLogs: Requests.Ethereum.withLogs,
                withDecode: Requests.Ethereum.withDecode,
              },
            },
          ],
          required: ["accountAddress"],
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
//   - "web3"일 때 모든 케이스의 callouts 포함
// ─────────────────────────────────────
function getCallouts(chain: string): string {
  switch (chain) {
    case "web3":
    case "kaia":
      return `${kaiaUsingTipsForCommon(kaiaUsingTipsForTransaction)}

${decodeInfoMessage}`;
    case "arbitrum":
    case "base":
    case "chiliz":
    case "ethereum":
    case "ethereumclassic":
    case "giwa":
    case "optimism":
    case "polygon":
    case "luniverse":
    case "tron":
      return `${decodeInfoMessage}`; // 해당 체인에서는 callouts가 없음

    case "xrpl":
    case "aptos":
    case "bitcoin":
    case "dogecoin":
    case "bitcoincash":
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
