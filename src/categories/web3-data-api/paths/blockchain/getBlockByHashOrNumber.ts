import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Domains from "../../library/domains";
import Examples from "../../library/examples";
import {
  kaiaUsingTipsForBlock,
  kaiaUsingTipsForCommon,
} from "../../../../callouts";
import { getChainInfo } from "../../../../constants";

const summary = "Get Block by Hash or Number";
const endpoint = "getBlockByHashOrNumber";
const isPublic = true;
const tags = ["Blockchain API"];

// 프로토콜별 description을 반환하는 헬퍼 함수
function getDescription(protocol: string): string {
  switch (protocol) {
    default:
      return "블록 해시 혹은 블록넘버로 조회한 블록의 특정 정보를 반환합니다.";
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
          // EVM
          "arbitrum",
          "base",
          "ethereum",
          "giwa",
          "kaia",
          "optimism",
          "polygon",
          "luniverse",
          "chiliz",

          // UTXO
          "bitcoin",
          "dogecoin",

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
              title: "EVM (Ethereum, Optimism, ...)",
              type: "object",
              properties: {
                // 카이아 하드포크로 인한 안내 문구 포함
                block: { ...Requests.Kaia.block, default: "latest" },
              },
              required: ["block"],
            },
            {
              title: "Bitcoin, Dogecoin",
              type: "object",
              properties: {
                block: {
                  ...Requests.Bitcoin.block,
                  default:
                    "00000000000000000002a30c53b8f371d4ebba1434cffa32716e6e84eb33b2af",
                },
              },
              required: ["block"],
            },
          ],
        },
        successResponse: {
          schema: {
            oneOf: [
              {
                title: "EVM (Ethereum, Optimism, ...)",
                ...Domains.Ethereum.Block,
                example: Examples.Ethereum[endpoint],
              },
              {
                title: "Bitcoin, Dogecoin",
                ...Domains.Bitcoin.Block,
                example: Examples.Bitcoin[endpoint],
              },
              {
                title: "Aptos",
                ...Domains.Aptos.Block,
                example: Examples.Aptos[endpoint],
              },
            ],
          },
        },
      };

    case "bitcoin":
    case "dogecoin":
      return {
        requestBody: {
          additionalProperties: false,
          // 비트코인/도지코인용 스키마
          type: "object",
          properties: {
            block: {
              ...Requests.Bitcoin.block,
              default:
                "00000000000000000002a30c53b8f371d4ebba1434cffa32716e6e84eb33b2af",
            },
          },
          required: ["block"],
        },
        successResponse: {
          schema: {
            // Bitcoin, Dogecoin 공통 응답
            ...Domains.Bitcoin.Block,
            example: Examples.Bitcoin[endpoint],
          },
        },
      };

    case "kaia":
      return {
        requestBody: {
          additionalProperties: false,
          type: "object",
          properties: {
            // 하드포크로 인한 안내 문구 포함
            block: { ...Requests.Kaia.block, default: "latest" },
          },
          required: ["block"],
        },
        successResponse: {
          schema: {
            // EVM 계열 공통 응답
            ...Domains.Ethereum.Block,
            example: Examples.Ethereum[endpoint],
          },
        },
      };

    case "aptos":
      return {
        requestBody: {
          additionalProperties: false,
          type: "object",
          properties: {
            block: { ...Requests.Aptos.block, default: "latest" },
          },
          required: ["block"],
        },
        successResponse: {
          schema: {
            ...Domains.Aptos.Block,
            example: Examples.Aptos[endpoint],
          },
        },
      };

    default:
      // 그 외 (Ethereum, Polygon, Arbitrum, etc.)
      return {
        requestBody: {
          additionalProperties: false,
          // EVM 기본 스키마
          type: "object",
          properties: {
            block: { ...Requests.Ethereum.block, default: "latest" },
          },
          required: ["block"],
        },
        successResponse: {
          schema: {
            // EVM 계열 공통 응답
            ...Domains.Ethereum.Block,
            example: Examples.Ethereum[endpoint],
          },
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
    case "none":
    case "kaia":
      return `${kaiaUsingTipsForCommon(kaiaUsingTipsForBlock)}`;
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
