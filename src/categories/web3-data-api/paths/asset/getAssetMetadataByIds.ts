import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Domains from "../../library/domains";
import Examples from "../../library/examples";
import { getChainInfo, INPUT_LIMITS } from "../../../../constants";
import { whatIsTrc10 } from "../../../../callouts";

const summary = "Get Asset(TRC10) Metadata by IDs";
const endpoint = "getAssetMetadataByIds";
const isPublic = true;
const tags = ["Asset(TRC10) API"];

// 프로토콜별 description을 반환하는 헬퍼 함수
function getDescription(protocol: string): string {
  switch (protocol) {
    case "none":
    case "tron":
    default:
      return `지정된 Asset ID를 사용하여 TRC10의 메타데이터를 조회합니다. 조회 대상 자산이 없을 경우, 빈 배열을 반환합니다.  한 번의 호출로 최대 ${INPUT_LIMITS.ITEM_MAX}건의 결과를 조회할 수 있습니다.`;
  }
}

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
        Requests.protocol("tron", [
          // evm
          "tron",
        ]),
        Requests.network("mainnet", ["mainnet"]),
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
    case "tron":
    default:
      return {
        requestBody: {
          additionalProperties: false,
          type: "object",
          required: ["assetIds"],
          properties: {
            assetIds: {
              ...Requests.Tron.assetIds,
              default: [1000001, 1002357],
            },
          },
        },
        successResponse: {
          schema: {
            type: "array",
            items: Domains.Tron.TRC10Meta,
          },
          example: Examples.Tron[endpoint],
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
    case "tron":
    default:
      return whatIsTrc10;
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

export default {
  summary,
  endpoint,
  isPublic,
  info,
};
