import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Domains from "../../library/domains";
import Examples from "../../library/examples";
import { ERC20, getChainInfo } from "../../../../constants";
import {
  kaiaUsingTipsForCommon,
  kaiaUsingTipsForEvent,
  throughputLimitInfoMessage,
} from "../../../../callouts";

const summary = "Search Events";
const endpoint = "searchEvents";
const isPublic = true;
const tags = ["Blockchain API"];

// 프로토콜별 description을 반환하는 헬퍼 함수
function getDescription(protocol: string): string {
  switch (protocol) {
    default:
      return `지정한 범위 내의 특정 event를 검색합니다.

${throughputLimitInfoMessage}`;
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
                eventNames: {
                  ...Requests.Ethereum.eventNames,
                  default: ["Transfer"],
                },
                abi: { ...Requests.Ethereum.abi, default: ERC20.USDT.ABI },
                fromBlock: Requests.Kaia.fromBlock, // 카이아 하드포크로 인한 안내 문구 포함
                toBlock: Requests.Ethereum.toBlock,
                fromDate: Requests.Ethereum.fromDate,
                toDate: Requests.Ethereum.toDate,
              },
              required: ["contractAddress", "eventNames", "abi"],
            },
            Requests.PaginationSet,
          ],
        },
        successResponse: {
          schema: Domains.Pagination(Domains.Ethereum.Log),
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
                eventNames: {
                  ...Requests.Ethereum.eventNames,
                  default: ["Transfer"],
                },
                abi: { ...Requests.Ethereum.abi, default: ERC20.USDT.ABI },
                fromBlock: Requests.Ethereum.fromBlock,
                toBlock: Requests.Ethereum.toBlock,
                fromDate: Requests.Ethereum.fromDate,
                toDate: Requests.Ethereum.toDate,
              },
              required: ["contractAddress", "eventNames", "abi"],
            },
            Requests.PaginationSet,
          ],
        },
        successResponse: {
          schema: Domains.Pagination(Domains.Ethereum.Log),
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
    case "kaia":
      return `${kaiaUsingTipsForCommon(kaiaUsingTipsForEvent)}`;
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
