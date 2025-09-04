import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Examples from "../../library/examples";
import {
  APTOS_ACCOUNTS,
  ERC721,
  ETHEREUM_ACCOUNTS,
  getChainInfo,
  TRON_ACCOUNTS,
} from "../../../../constants";
import { internalTxSupportedNetworksInfoMessage } from "../../../../callouts";
import Domains from "../../library/domains";

const summary = "Get Account Stats";
const endpoint = "getAccountStats";
const isPublic = true;
const tags = ["Statistics API"];

// 프로토콜별 description을 반환하는 헬퍼 함수
function getDescription(protocol: string): string {
  switch (protocol) {
    default:
      return `특정 주소의 통계 정보를 조회합니다. 계정 주소의 트랜잭션, 전송 이벤트, 자산 등의 정보를 통해서 계정의 활동을 분석할 수 있습니다.`;
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
          "arbitrum",
          "base",
          "ethereum",
          "kaia",
          "optimism",
          "polygon",
          "luniverse",
          "chiliz",
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
    case "none":
      return {
        requestBody: {
          additionalProperties: false,
          type: "object",
          oneOf: [
            {
              title: "EVM (Ethereum, Optimism, ...)",
              properties: {
                address: {
                  ...Requests.Ethereum.address,
                  default: ETHEREUM_ACCOUNTS.VITALIK_BUTERIN,
                },
              },
              required: ["address"],
            },
            {
              title: "Tron",
              properties: {
                address: {
                  ...Requests.Tron.accountAddress,
                  default: TRON_ACCOUNTS.JUSTIN_SUN,
                },
              },
              required: ["address"],
            },
            {
              title: "Aptos",
              properties: {
                address: Requests.Aptos.accountAddress,
              },
            },
          ],
        },
        successResponse: {
          schema: {
            oneOf: [
              {
                title: "EVM (Ethereum, Optimism, ...)",
                ...Domains.Ethereum.AccountStats,
                example: Examples.Ethereum[endpoint],
              },
              {
                title: "Tron",
                ...Domains.Tron.AccountStats,
                example: Examples.Tron[endpoint],
              },
              {
                title: "Aptos",
                ...Domains.Aptos.AccountStats,
                example: Examples.Aptos[endpoint],
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
            address: {
              ...Requests.Tron.accountAddress,
              default: TRON_ACCOUNTS.JUSTIN_SUN,
            },
          },
          required: ["address"],
        },
        successResponse: {
          schema: Domains.Tron.AccountStats,
          example: Examples.Tron[endpoint],
        },
      };
    case "aptos":
      return {
        requestBody: {
          additionalProperties: false,
          type: "object",
          properties: {
            address: Requests.Aptos.accountAddress,
          },
          default: {
            address: APTOS_ACCOUNTS.ACCOUNT_1,
          },
          required: ["address"],
        },
        successResponse: {
          schema: Domains.Aptos.AccountStats,
          example: Examples.Aptos[endpoint],
        },
      };
    default:
      return {
        requestBody: {
          additionalProperties: false,
          type: "object",
          properties: {
            address: {
              ...Requests.Ethereum.address,
              default: ETHEREUM_ACCOUNTS.VITALIK_BUTERIN,
            },
          },
          required: ["address"],
        },
        successResponse: {
          schema: Domains.Ethereum.AccountStats,
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
    case "none":
      return internalTxSupportedNetworksInfoMessage;
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
