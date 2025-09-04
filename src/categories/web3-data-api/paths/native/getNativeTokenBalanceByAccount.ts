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

// 프로토콜별 description을 반환하는 헬퍼 함수
function getDescription(protocol: string): string {
  switch (protocol) {
    default:
      return `특정 Account가 보유한 네이티브 토큰의 잔고를 조회합니다. 선택한 프로토콜에 따라 토큰의 종류가 다를 수 있습니다. (e.g., Bitcoin의 경우, BTC 잔고를 조회할 수 있습니다.)`;
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
  if (protocol === "none") {
    return {
      operationId: endpoint,
      parameters: [
        Requests.protocol("bitcoin", [
          // UTXO
          "bitcoin",
          "dogecoin",

          // XRPL
          "xrpl",
        ]),
        Requests.network("mainnet", [
          "mainnet",
          // "sepolia",
          // "hoodi",
          // "amoy",
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
    case "bitcoin":
    case "dogecoin":
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
    case "none":
    default:
      return {
        requestBody: {
          additionalProperties: false,
          oneOf: [
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
          schema: {
            oneOf: [
              {
                title: "Bitcoin, Dogecoin",
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
function getCallouts(protocol: string): string {
  switch (protocol) {
    case "none":
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
