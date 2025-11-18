import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Domains from "../../library/domains";
import Examples from "../../library/examples";
import {
  CURRENCY,
  ERC20,
  INPUT_LIMITS,
  getChainInfo,
} from "../../../../constants";
import {
  throughputLimitInfoMessage,
  warningTokenPriceData,
} from "../../../../callouts";

const summary = "Get Token Prices by Contracts";
const endpoint = "getTokenPricesByContracts";
const isPublic = true;
const tags = ["Token API"];

// 체인별 description을 반환하는 헬퍼 함수
function getDescription(chain: string): string {
  switch (chain) {
    case "web3":
      return `입력한 토큰 컨트랙트에서 발행한 Token의 온체인 마켓 가격을 조회합니다. 다수의 컨트랙트를 조회할 수 있으며, 최대 ${INPUT_LIMITS.ITEM_MAX}개의 컨트랙트를 조회할 수 있습니다.`;
    default:
      return `입력한 ERC20 토큰 컨트랙트에서 발행한 Token의 온체인 마켓 가격을 조회합니다. 다수의 컨트랙트를 조회할 수 있으며, 최대 ${INPUT_LIMITS.ITEM_MAX}개의 컨트랙트를 조회할 수 있습니다.`;
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
    default:
      return {
        requestBody: {
          additionalProperties: false,
          allOf: [
            {
              type: "object",
              properties: {
                contractAddresses: {
                  ...Requests.Ethereum.contractAddresses,
                  default: [
                    ERC20.USDT.CONTRACT_ADDRESS,
                    ERC20.USDC.CONTRACT_ADDRESS,
                  ],
                },
              },
              required: ["contractAddresses"],
              maximum: INPUT_LIMITS.ITEM_MAX,
            },
            {
              type: "object",
              properties: {
                currency: {
                  ...Requests.currency,
                  default: CURRENCY.USD,
                },
              },
            },
          ],
        },
        successResponse: {
          schema: {
            type: "array",
            items: {
              allOf: [
                Domains.Ethereum.TokenMarketData,
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
            },
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
    default:
      return `${throughputLimitInfoMessage}
${warningTokenPriceData}`;
  }
}

export default {
  summary,
  endpoint,
  isPublic,
  info,
};
