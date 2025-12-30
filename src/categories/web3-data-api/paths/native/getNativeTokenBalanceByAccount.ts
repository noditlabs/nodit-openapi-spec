import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Domains from "../../library/domains";
import Examples from "../../library/examples";
import {
  BITCOIN_ACCOUNTS,
  getChainInfo,
  XRPL_ACCOUNTS,
} from "../../../../constants";

const summary = "Get Native Token Balance by Account";
const endpoint = "getNativeTokenBalanceByAccount";
const isPublic = true;
const tags = ["Native Token API"];

// 체인별 description을 반환하는 헬퍼 함수
function getDescription(chain: string): string {
  switch (chain) {
    default:
      return `특정 Account가 보유한 네이티브 토큰의 잔고를 조회합니다. 선택한 체인에 따라 토큰의 종류가 다를 수 있습니다. (e.g., Bitcoin의 경우, BTC 잔고를 조회할 수 있습니다.)`;
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
        Requests.chain("bitcoin", [
          // UTXO
          "bitcoin",
          "dogecoin",
          "bitcoincash",

          // XRPL
          "xrpl",
        ]),
        Requests.network("mainnet", [
          "mainnet",
          // "sepolia",
          // "hoodi",
          // "amoy",
          // "testnet",
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
    case "bitcoin":
    case "dogecoin":
    case "bitcoincash":
      return {
        requestBody: {
          additionalProperties: false,
          allOf: [
            {
              type: "object",
              properties: {
                accountAddress: {
                  ...Requests.Bitcoin.accountAddress,
                  default: BITCOIN_ACCOUNTS.SATOSHI,
                },
              },
              required: ["accountAddress"],
            },
          ],
        },
        successResponse: {
          schema: Domains.Bitcoin.Balance,
          example: Examples.Bitcoin[endpoint],
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
              },
              required: ["accountAddress"],
            },
          ],
        },
        successResponse: {
          schema: Domains.XRPL.Balance,
          example: Examples.XRPL[endpoint],
        },
      };
    case "web3":
    default:
      return {
        requestBody: {
          additionalProperties: false,
          oneOf: [
            {
              title: "Bitcoin, Dogecoin, Bitcoincash",
              type: "object",
              properties: {
                accountAddress: {
                  ...Requests.Bitcoin.accountAddress,
                  default: BITCOIN_ACCOUNTS.SATOSHI,
                },
              },
              required: ["accountAddress"],
            },
            {
              title: "XRP Ledger (XRPL)",
              type: "object",
              properties: {
                accountAddress: {
                  ...Requests.XRPL.accountAddress,
                  default: XRPL_ACCOUNTS.ACCOUNT_1,
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
                title: "Bitcoin, Dogecoin, Bitcoincash",
                ...Domains.Bitcoin.Balance,
                example: Examples.Bitcoin[endpoint],
              },
              {
                title: "XRPL",
                ...Domains.XRPL.Balance,
                example: Examples.XRPL[endpoint],
              },
            ],
          },
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
