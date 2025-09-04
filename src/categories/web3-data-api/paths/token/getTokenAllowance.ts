import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Examples from "../../library/examples";
import { ERC20, getChainInfo, TRC20 } from "../../../../constants";

const summary = "Get Token Allowance";
const endpoint = "getTokenAllowance";
const isPublic = true;
const tags = ["Token API"];

// 프로토콜별 description을 반환하는 헬퍼 함수
function getDescription(protocol: string): string {
  switch (protocol) {
    case "none":
      return `Spender에게 Owner가 Approve한 토큰의 수량을 조회합니다.`;
    case "tron":
      return `Spender에게 Owner가 Approve한 TRC20 토큰의 수량을 조회합니다.`;
    default:
      return `Spender에게 Owner가 Approve한 ERC20 토큰의 수량을 조회합니다.`;
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
        Requests.protocol("ethereum", [
          // evm
          "arbitrum",
          "base",
          "ethereum",
          "kaia",
          "optimism",
          "polygon",
          "luniverse",
          "chiliz",
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
    case "none":
      return {
        requestBody: {
          additionalProperties: false,
          oneOf: [
            {
              allOf: [
                {
                  title: "EVM (Ethereum, Optimism, ...)",
                  type: "object",
                  properties: {
                    contractAddress: {
                      ...Requests.Ethereum.contractAddress,
                      default: ERC20.USDT.CONTRACT_ADDRESS,
                    },
                    ownerAddress: {
                      type: "string",
                      description: `토큰 소유자의 주소를 지정하는 파라미터입니다. 이 주소는 토큰의 소유권을 가진 계정을 나타냅니다.`,
                      default: "0x14d06788090769f669427b6aea1c0240d2321f34",
                    },
                    spenderAddress: {
                      type: "string",
                      description: `토큰 사용을 허가받은 주소를 지정하는 파라미터입니다. 이 주소는 소유자가 토큰 사용을 허가한 계정 또는 컨트랙트를 나타냅니다.`,
                      default: "0x61e2523f3e7895670be632600bf0d139453642f7",
                    },
                  },
                  required: [
                    "contractAddress",
                    "ownerAddress",
                    "spenderAddress",
                  ],
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
                    ownerAddress: {
                      type: "string",
                      description: `토큰 소유자의 주소를 지정하는 파라미터입니다. 이 주소는 토큰의 소유권을 가진 계정을 나타냅니다. 이 필드는 "T"로 시작하는 34자리 base58 문자열 형식을 가집니다.`,
                      default: "THLU47aojaiVg68atDTJzFv1E2CShJ1GNM",
                    },
                    spenderAddress: {
                      type: "string",
                      description: `토큰 사용을 허가받은 주소를 지정하는 파라미터입니다. 이 주소는 소유자가 토큰 사용을 허가한 계정 또는 컨트랙트를 나타냅니다. 이 필드는 "T"로 시작하는 34자리 base58 문자열 형식을 가집니다.`,
                      default: "TWrEMSKgTZ1GsjJBaTfxGWuzcS6rQi4CjZ",
                    },
                  },
                  required: [
                    "contractAddress",
                    "ownerAddress",
                    "spenderAddress",
                  ],
                },
              ],
            },
          ],
        },
        successResponse: {
          schema: {
            type: "object",
            properties: {
              allowance: {
                type: "string",
                description:
                  "spender가 owner를 대신하여 transferFrom을 통해 사용할 수 있는 남은 토큰 수를 반환합니다. 이 값은 approve나 transferFrom이 호출될 때 변경됩니다",
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
                contractAddress: {
                  ...Requests.Tron.contractAddress,
                  default: TRC20.USDT.CONTRACT_ADDRESS,
                },
                ownerAddress: {
                  type: "string",
                  description: `토큰 소유자의 주소를 지정하는 파라미터입니다. 이 주소는 토큰의 소유권을 가진 계정을 나타냅니다. 이 필드는 "T"로 시작하는 34자리 base58 문자열 형식을 가집니다.`,
                  default: "THLU47aojaiVg68atDTJzFv1E2CShJ1GNM",
                },
                spenderAddress: {
                  type: "string",
                  description: `토큰 사용을 허가받은 주소를 지정하는 파라미터입니다. 이 주소는 소유자가 토큰 사용을 허가한 계정 또는 컨트랙트를 나타냅니다. 이 필드는 "T"로 시작하는 34자리 base58 문자열 형식을 가집니다.`,
                  default: "TWrEMSKgTZ1GsjJBaTfxGWuzcS6rQi4CjZ",
                },
              },
              required: ["contractAddress", "ownerAddress", "spenderAddress"],
            },
          ],
        },
        successResponse: {
          schema: {
            type: "object",
            properties: {
              allowance: {
                type: "string",
                description:
                  "spender가 owner를 대신하여 transferFrom을 통해 사용할 수 있는 남은 토큰 수를 반환합니다. 이 값은 approve나 transferFrom이 호출될 때 변경됩니다",
              },
            },
          },
          example: Examples.Ethereum[endpoint],
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
                ownerAddress: {
                  type: "string",
                  description: `토큰 소유자의 주소를 지정하는 파라미터입니다. 이 주소는 토큰의 소유권을 가진 계정을 나타냅니다.`,
                  default: "0x14d06788090769f669427b6aea1c0240d2321f34",
                },
                spenderAddress: {
                  type: "string",
                  description: `토큰 사용을 허가받은 주소를 지정하는 파라미터입니다. 이 주소는 소유자가 토큰 사용을 허가한 계정 또는 컨트랙트를 나타냅니다.`,
                  default: "0x61e2523f3e7895670be632600bf0d139453642f7",
                },
              },
              required: ["contractAddress", "ownerAddress", "spenderAddress"],
            },
          ],
        },
        successResponse: {
          schema: {
            type: "object",
            properties: {
              allowance: {
                type: "string",
                description:
                  "spender가 owner를 대신하여 transferFrom을 통해 사용할 수 있는 남은 토큰 수를 반환합니다. 이 값은 approve나 transferFrom이 호출될 때 변경됩니다",
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
//   - 프로토콜별로 모두 다름
// ─────────────────────────────────────
function getCallouts(protocol: string): string {
  switch (protocol) {
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
