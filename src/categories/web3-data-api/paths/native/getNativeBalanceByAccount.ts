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

const summary = "Get Native Balance by Account";
const endpoint = "getNativeBalanceByAccount";
const isPublic = true;
const tags = ["Native Token API"];

// 체인별 description을 반환하는 헬퍼 함수
function getDescription(chain: string): string {
  switch (chain) {
    default:
      return `특정 Account가 보유한 네이티브 토큰의 잔고를 조회합니다. 선택한 체인에 따라 토큰의 종류가 다를 수 있습니다.`;
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
          type: "object",
          oneOf: [
            {
              title: "EVM (Ethereum, Optimism, ...)",
              properties: {
                accountAddress: {
                  ...Requests.Ethereum.accountAddress,
                  default: ETHEREUM_ACCOUNTS.VITALIK_BUTERIN,
                },
              },
              required: ["accountAddress"],
            },
            {
              title: "Tron",
              properties: {
                accountAddress: {
                  ...Requests.Tron.accountAddress,
                  default: TRON_ACCOUNTS.JUSTIN_SUN,
                },
              },
              required: ["accountAddress"],
            },
          ],
        },
        successResponse: {
          schema: {
            oneOf: [
              {
                title: "EVM (Ethereum, Optimism, ...)",
                ...Domains.Ethereum.Balance,
                example: Examples.Ethereum[endpoint],
              },
              {
                title: "Tron",
                ...Domains.Tron.Balance,
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
          type: "object",
          properties: {
            accountAddress: {
              ...Requests.Tron.accountAddress,
              default: TRON_ACCOUNTS.JUSTIN_SUN,
            },
          },
          required: ["accountAddress"],
        },
        successResponse: {
          schema: Domains.Tron.Balance,
          example: Examples.Tron[endpoint],
        },
      };
    default:
      return {
        requestBody: {
          additionalProperties: false,
          type: "object",
          properties: {
            accountAddress: {
              ...Requests.Ethereum.accountAddress,
              default: ETHEREUM_ACCOUNTS.VITALIK_BUTERIN,
            },
          },
          required: ["accountAddress"],
        },
        successResponse: {
          schema: Domains.Ethereum.Balance,
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
