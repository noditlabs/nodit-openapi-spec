import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Domains from "../../library/domains";
import Examples from "../../library/examples";
import {
  APTOS_ACCOUNTS,
  ETHEREUM_ACCOUNTS,
  getChainInfo,
  TRON_ACCOUNTS,
} from "../../../../constants";
import {
  kaiaUsingTipsForCommon,
  kaiaUsingTipsForTokenOwned,
} from "../../../../callouts";

const summary = "Get Tokens Owned By Account";
const endpoint = "getTokensOwnedByAccount";
const isPublic = true;
const tags = ["Token API"];

// 프로토콜별 description을 반환하는 헬퍼 함수
function getDescription(protocol: string): string {
  switch (protocol) {
    case "web3":
      return `특정 Account가 보유한 토큰의 목록을 조회합니다. 조회 결과에는 각 토큰의 보유 수량과 토큰 컨트랙트의 메타데이터가 포함됩니다.`;
    case "tron":
      return `특정 Account가 보유한 TRC20 토큰의 목록을 조회합니다. 조회 결과에는 각 토큰의 보유 수량과 토큰 컨트랙트의 메타데이터가 포함됩니다.`;
    case "aptos":
      return `특정 Account가 보유한 토큰의 목록을 조회합니다. 조회 결과는 Object 주소를 기준으로 제공되며, 특정 토큰의 총 보유 수량을 얻기 위해서는 해당 토큰의 assetTypes 또는 linkedAssetTypes을 이용하여 조회된 모든 결과값을 합산해야 합니다.`;
    default:
      return `특정 Account가 보유한 ERC20 토큰의 목록을 조회합니다. 조회 결과에는 각 토큰의 보유 수량과 토큰 컨트랙트의 메타데이터가 포함됩니다.`;
  }
}

const info = (protocol: string): OpenAPIV3.PathItemObject => {
  // A. operationId, parameters 설정
  const { operationId, parameters } = getOpIdAndParams(protocol);
  // B. requestBody, successResponse 설정
  const { requestBody, successResponse } = getRequestAndResponse(protocol);
  // C. callouts 설정
  const callouts = getCallouts(protocol);
  // D. protocol에 따른 description 설정
  const protocolDescription = getDescription(protocol);

  return {
    post: {
      security: [
        {
          api_key: [],
        },
      ],
      tags,
      description: `${protocolDescription}\n\n${callouts}`,
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
function getOpIdAndParams(protocol: string): {
  operationId: string;
  parameters: OpenAPIV3.ParameterObject[];
} {
  if (protocol === "web3") {
    return {
      operationId: endpoint,
      parameters: [
        Requests.protocol("ethereum", [
          // evm
          "arbitrum",
          "base",
          // "bnb",
          "chiliz",
          "ethereum",
          "giwa",
          "kaia",
          "optimism",
          "polygon",
          "luniverse",
          "tron",

          // aptos
          "aptos",
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
    const chainInfo = getChainInfo(protocol);
    return {
      operationId: `${protocol}-${endpoint}`,
      parameters: [
        Requests.protocol(protocol, [protocol]),
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
//   - 프로토콜별로 모두 다름
// ─────────────────────────────────────
function getRequestAndResponse(protocol: string): {
  requestBody: OpenAPIV3.SchemaObject;
  successResponse: OpenAPIV3.MediaTypeObject;
} {
  switch (protocol) {
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
                    contractAddresses: Requests.Ethereum.contractAddresses,
                  },
                  required: ["accountAddress"],
                },
                Requests.PaginationSet,
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
                    contractAddresses: Requests.Tron.contractAddresses,
                  },
                  required: ["accountAddress"],
                },
                Requests.PaginationSet,
              ],
            },
            {
              title: "Aptos",
              allOf: [
                {
                  type: "object",
                  properties: {
                    accountAddress: {
                      ...Requests.Aptos.accountAddress,
                      default: APTOS_ACCOUNTS.ACCOUNT_1,
                    },
                    assetTypes: {
                      type: "array",
                      items: Requests.Aptos.assetType,
                      description: `${Requests.Aptos.assetType.description}

<strong style='color: red;'>*</strong> assetTypes과 linkedAssetTypes는 동시에 사용할 수 없습니다.`,
                    },
                    linkedAssetTypes: {
                      type: "array",
                      items: Requests.Aptos.linkedAssetType,
                      description: `${Requests.Aptos.linkedAssetType.description}

<strong style='color: red;'>*</strong> assetTypes과 linkedAssetTypes는 동시에 사용할 수 없습니다.`,
                    },
                  },
                  required: ["accountAddress"],
                },
                Requests.PaginationSet,
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
                  Domains.Ethereum.BalanceWithLastTransferredAt,
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
                  Domains.Tron.Balance,
                  {
                    type: "object",
                    properties: {
                      contract: {
                        allOf: [
                          Domains.Tron.ContractMeta,
                          Domains.Tron.TokenMeta,
                        ],
                      },
                    },
                  },
                ],
                example: Examples.Tron[endpoint],
              },
              {
                title: "Aptos",
                ...Domains.Aptos.Token,
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
                accountAddress: {
                  ...Requests.Tron.accountAddress,
                  default: TRON_ACCOUNTS.JUSTIN_SUN,
                },
                contractAddresses: Requests.Tron.contractAddresses,
              },
              required: ["accountAddress"],
            },
            Requests.PaginationSet,
          ],
        },
        successResponse: {
          schema: Domains.Pagination({
            allOf: [
              Domains.Tron.Balance,
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
                assetTypes: {
                  type: "array",
                  items: Requests.Aptos.assetType,
                  description: `${Requests.Aptos.assetType.description}

<strong style='color: red;'>*</strong> assetTypes과 linkedAssetTypes는 동시에 사용할 수 없습니다.`,
                },
                linkedAssetTypes: {
                  type: "array",
                  items: Requests.Aptos.linkedAssetType,
                  description: `${Requests.Aptos.linkedAssetType.description}

<strong style='color: red;'>*</strong> assetTypes과 linkedAssetTypes는 동시에 사용할 수 없습니다.`,
                },
              },
              required: ["accountAddress"],
            },
            Requests.PaginationSet,
          ],
        },
        successResponse: {
          schema: Domains.Pagination(Domains.Aptos.Token),
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
                accountAddress: {
                  ...Requests.Ethereum.accountAddress,
                  default: ETHEREUM_ACCOUNTS.VITALIK_BUTERIN,
                },
                contractAddresses: Requests.Ethereum.contractAddresses,
              },
              required: ["accountAddress"],
            },
            Requests.PaginationSet,
          ],
        },
        successResponse: {
          schema: Domains.Pagination({
            allOf: [
              Domains.Ethereum.BalanceWithLastTransferredAt,
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
//   - 프로토콜별로 모두 다름
// ─────────────────────────────────────
function getCallouts(protocol: string): string {
  switch (protocol) {
    case "web3":
    case "kaia":
      return `${kaiaUsingTipsForCommon(kaiaUsingTipsForTokenOwned)}`;
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
