import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Domains from "../../library/domains";
import Examples from "../../library/examples";
import { getChainInfo } from "../../../../constants";

const summary = "Get Token Balance Changes By Asset Type";
const endpoint = "getTokenBalanceChangesByAssetType";
const isPublic = true;
const tags = ["Token API"];

// 프로토콜별 description을 반환하는 헬퍼 함수
function getDescription(protocol: string): string {
  switch (protocol) {
    default:
      return `특정 자산 타입의 잔액 변화 내역을 조회합니다.`;
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
        Requests.protocol("aptos", ["aptos"]),
        Requests.network("mainnet", ["mainnet", "testnet"]),
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
    case "aptos":
    default:
      return {
        requestBody: {
          additionalProperties: false,
          allOf: [
            {
              type: "object",
              properties: {
                assetType: {
                  ...Requests.Aptos.assetType,
                  description: `${Requests.Aptos.assetType.description}

<strong style='color: red;'>*</strong> assetType과 linkedAssetType 중 하나는 필수로 입력해야 하며, 두 파라미터를 동시에 사용할 수 없습니다.`,
                  default: "0x1::aptos_coin::AptosCoin",
                },
                linkedAssetType: {
                  ...Requests.Aptos.linkedAssetType,
                  description: `${Requests.Aptos.linkedAssetType.description}

<strong style='color: red;'>*</strong> assetType과 linkedAssetType 중 하나는 필수로 입력해야 하며, 두 파라미터를 동시에 사용할 수 없습니다.`,
                  example:
                    "0x000000000000000000000000000000000000000000000000000000000000000a",
                },
                fromBlock: Requests.Aptos.fromBlock,
                toBlock: Requests.Aptos.toBlock,
                fromDate: Requests.Aptos.fromDate,
                toDate: Requests.Aptos.toDate,
              },
            },
            Requests.PaginationSet,
          ],
        },
        successResponse: {
          schema: Domains.Pagination(Domains.Aptos.BalanceChange),
          example: Examples.Aptos[endpoint],
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
    case "aptos":
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
