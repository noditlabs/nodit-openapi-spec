import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Examples from "../../library/examples";
import {
  ETHEREUM_ACCOUNTS,
  getChainInfo,
  TRON_ACCOUNTS,
} from "../../../../constants";

const summary = "Is Contract";
const endpoint = "isContract";
const isPublic = true;
const tags = ["Blockchain API"];

// 프로토콜별 description을 반환하는 헬퍼 함수
function getDescription(protocol: string): string {
  switch (protocol) {
    default:
      return `입력된 Address가 컨트랙트 주소인지 아닌지 조회합니다.`;
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
                    address: {
                      ...Requests.Ethereum.address,
                      default: ETHEREUM_ACCOUNTS.VITALIK_BUTERIN,
                    },
                  },
                  required: ["address"],
                },
              ],
            },
            {
              title: "Tron",
              allOf: [
                {
                  type: "object",
                  properties: {
                    address: {
                      ...Requests.Tron.accountAddress,
                      default: TRON_ACCOUNTS.JUSTIN_SUN,
                    },
                  },
                  required: ["address"],
                },
              ],
            },
          ],
        },
        successResponse: {
          schema: {
            type: "object",
            properties: {
              result: {
                type: "boolean",
                description:
                  "입력된 Address가 컨트랙트라면 true, 아니라면 false를 반환합니다.",
              },
            },
          },
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
                address: {
                  ...Requests.Tron.accountAddress,
                  default: TRON_ACCOUNTS.JUSTIN_SUN,
                },
              },
              required: ["address"],
            },
          ],
        },
        successResponse: {
          schema: {
            type: "object",
            properties: {
              result: {
                type: "boolean",
                description:
                  "입력된 Address가 컨트랙트라면 true, 아니라면 false를 반환합니다.",
              },
            },
          },
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
                address: {
                  ...Requests.Ethereum.address,
                  default: ETHEREUM_ACCOUNTS.VITALIK_BUTERIN,
                },
              },
              required: ["address"],
            },
          ],
        },
        successResponse: {
          schema: {
            type: "object",
            properties: {
              result: {
                type: "boolean",
                description:
                  "입력된 Address가 컨트랙트라면 true, 아니라면 false를 반환합니다.",
              },
            },
          },
          example: Examples.Ethereum[endpoint],
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
    case "web3":
    default:
      return ``; // 필요시 callouts 추가
  }
}

export default {
  summary,
  endpoint,
  isPublic,
  info,
};
