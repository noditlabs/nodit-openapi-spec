import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Domains from "../../library/domains";
import Examples from "../../library/examples";
import { ERC20, getChainInfo, TRC20 } from "../../../../constants";
import {
  kaiaUsingTipsForCommon,
  kaiaUsingTipsForTokenTransfer,
} from "../../../../callouts";

const summary = "Get Token Transfers by Contract";
const endpoint = "getTokenTransfersByContract";
const isPublic = true;
const tags = ["Token API"];

// 체인별 description을 반환하는 헬퍼 함수
function getDescription(chain: string): string {
  switch (chain) {
    case "web3":
      return `특정 컨트랙트에서 발생된 토큰 전송 목록을 조회합니다. 조회 결과에는 토큰 컨트랙트의 메타데이터와 전송된 토큰의 수량이 포함됩니다.`;
    case "tron":
      return `특정 컨트랙트에서 발생된 TRC20 토큰 전송 목록을 조회합니다. 조회 결과에는 토큰 컨트랙트의 메타데이터와 전송된 토큰의 수량이 포함됩니다.`;
    default:
      return `특정 컨트랙트에서 발생된 ERC20 토큰 전송 목록을 조회합니다. 조회 결과에는 토큰 컨트랙트의 메타데이터와 전송된 토큰의 수량이 포함됩니다.`;
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
        ]),
        Requests.network("mainnet", [
          "mainnet",
          "sepolia",
          "hoodi",
          "amoy",
          "testnet",
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
                    contractAddress: {
                      ...Requests.Ethereum.contractAddress,
                      default: ERC20.USDT.CONTRACT_ADDRESS,
                    },
                    fromBlock: Requests.Kaia.fromBlock, // 카이아 하드포크로 인한 안내 문구 포함
                    toBlock: Requests.Ethereum.toBlock,
                    fromDate: Requests.Ethereum.fromDate,
                    toDate: Requests.Ethereum.toDate,
                  },
                  required: ["contractAddress"],
                },
                Requests.PaginationSet,
                {
                  type: "object",
                  properties: {
                    withZeroValue: Requests.withZeroValue,
                    withFunction: Requests.Ethereum.withFunction,
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
                    contractAddress: {
                      ...Requests.Tron.contractAddress,
                      default: TRC20.USDT.CONTRACT_ADDRESS,
                    },
                    fromBlock: Requests.Tron.fromBlock,
                    toBlock: Requests.Tron.toBlock,
                    fromDate: Requests.Tron.fromDate,
                    toDate: Requests.Tron.toDate,
                  },
                  required: ["contractAddress"],
                },
                Requests.PaginationSet,
                {
                  type: "object",
                  properties: {
                    withZeroValue: Requests.withZeroValue,
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
                  Domains.Ethereum.Transfer,
                  {
                    type: "object",
                    properties: {
                      contract: {
                        allOf: [
                          Domains.Ethereum.ContractMeta,
                          Domains.Ethereum.AssetMeta,
                        ],
                      },
                    },
                  },
                ],
                example: Examples.Ethereum[endpoint],
              },
              {
                title: "Tron",
                allOf: [
                  {
                    type: "object",
                    properties: {
                      contractAddress: {
                        ...Requests.Tron.contractAddress,
                        default: TRC20.USDT.CONTRACT_ADDRESS,
                      },
                      fromBlock: Requests.Tron.fromBlock,
                      toBlock: Requests.Tron.toBlock,
                      fromDate: Requests.Tron.fromDate,
                      toDate: Requests.Tron.toDate,
                    },
                    required: ["contractAddress"],
                  },
                  Requests.PaginationSet,
                  {
                    type: "object",
                    properties: {
                      withZeroValue: Requests.withZeroValue,
                    },
                  },
                ],
                example: Examples.Tron[endpoint],
              },
            ],
          }),
        },
      };
    case "kaia":
      return {
        requestBody: {
          additionalProperties: false,
          allOf: [
            {
              type: "object",
              properties: {
                contractAddress: {
                  ...Requests.Ethereum.contractAddress,
                  default: ERC20.USDT.CONTRACT_ADDRESS,
                },
                fromBlock: Requests.Kaia.fromBlock, // 카이아 하드포크로 인한 안내 문구 포함
                toBlock: Requests.Ethereum.toBlock,
                fromDate: Requests.Ethereum.fromDate,
                toDate: Requests.Ethereum.toDate,
              },
              required: ["contractAddress"],
            },
            Requests.PaginationSet,
            {
              type: "object",
              properties: {
                withZeroValue: Requests.withZeroValue,
                withFunction: Requests.Ethereum.withFunction,
              },
            },
          ],
        },
        successResponse: {
          schema: Domains.Pagination({
            allOf: [
              Domains.Ethereum.Transfer,
              {
                type: "object",
                properties: {
                  contract: {
                    allOf: [
                      Domains.Ethereum.ContractMeta,
                      Domains.Ethereum.AssetMeta,
                    ],
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
          allOf: [
            {
              type: "object",
              properties: {
                contractAddress: {
                  ...Requests.Tron.contractAddress,
                  default: TRC20.USDT.CONTRACT_ADDRESS,
                },
                fromBlock: Requests.Tron.fromBlock,
                toBlock: Requests.Tron.toBlock,
                fromDate: Requests.Tron.fromDate,
                toDate: Requests.Tron.toDate,
              },
              required: ["contractAddress"],
            },
            Requests.PaginationSet,
            {
              type: "object",
              properties: {
                withZeroValue: Requests.withZeroValue,
              },
            },
          ],
        },
        successResponse: {
          schema: Domains.Pagination({
            allOf: [
              Domains.Tron.Transfer,
              {
                type: "object",
                properties: {
                  contract: {
                    allOf: [Domains.Tron.ContractMeta, Domains.Tron.TokenMeta],
                  },
                },
              },
            ],
          }),
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
                contractAddress: {
                  ...Requests.Ethereum.contractAddress,
                  default: ERC20.USDT.CONTRACT_ADDRESS,
                },
                fromBlock: Requests.Ethereum.fromBlock,
                toBlock: Requests.Ethereum.toBlock,
                fromDate: Requests.Ethereum.fromDate,
                toDate: Requests.Ethereum.toDate,
              },
              required: ["contractAddress"],
            },
            Requests.PaginationSet,
            {
              type: "object",
              properties: {
                withZeroValue: Requests.withZeroValue,
                withFunction: Requests.Ethereum.withFunction,
              },
            },
          ],
        },
        successResponse: {
          schema: Domains.Pagination({
            allOf: [
              Domains.Ethereum.Transfer,
              {
                type: "object",
                properties: {
                  contract: {
                    allOf: [
                      Domains.Ethereum.ContractMeta,
                      Domains.Ethereum.AssetMeta,
                    ],
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
//   - 체인별로 모두 다름
// ─────────────────────────────────────
function getCallouts(chain: string): string {
  switch (chain) {
    case "web3":
    case "kaia":
      return `${kaiaUsingTipsForCommon(kaiaUsingTipsForTokenTransfer)}`;
    default:
      return ""; // 해당 체인에서는 callouts가 없음
  }
}

export default {
  summary,
  endpoint,
  isPublic,
  info,
};
