import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Domains from "../../library/domains";
import Examples from "../../library/examples";
import { getChainInfo } from "../../../../constants";
import { whatIsTrc10 } from "../../../../callouts";

const summary = "Get Asset(TRC10) Transfers by ID";
const endpoint = "getAssetTransfersById";
const isPublic = true;
const tags = ["Asset(TRC10) API"];

// 체인별 description을 반환하는 헬퍼 함수
function getDescription(chain: string): string {
  switch (chain) {
    case "web3":
    case "tron":
    default:
      return `지정된 Asset ID에 해당하는 TRC10 토큰의 전송 내역을 조회합니다.`;
  }
}

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
        Requests.chain("tron", [
          // evm
          "tron",
        ]),
        Requests.network("mainnet", ["mainnet"]),
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
    case "tron":
    default:
      return {
        requestBody: {
          additionalProperties: false,
          allOf: [
            {
              type: "object",
              required: ["assetId"],
              properties: {
                assetId: { ...Requests.Tron.assetId, default: 1002357 },
                fromBlock: Requests.Tron.fromBlock,
                toBlock: Requests.Tron.toBlock,
                fromDate: Requests.Tron.fromDate,
                toDate: Requests.Tron.toDate,
              },
            },
            Requests.PaginationSet,
            {
              type: "object",
              properties: {
                withZeroValue: Requests.withZeroValue,
              },
            },
          ],
        },
        successResponse: {
          schema: Domains.Pagination({
            allOf: [
              Domains.Tron.Transfer,
              {
                type: "object",
                properties: {
                  asset: Domains.Tron.TRC10Meta,
                },
              },
            ],
          }),
          example: Examples.Tron[endpoint],
        },
      };
  }
}

// ─────────────────────────────────────
// C. callouts 설정
//   - 체인별로 모두 다름
// ─────────────────────────────────────
function getCallouts(chain: string): string {
  switch (chain) {
    case "web3":
    case "tron":
    default:
      return whatIsTrc10;
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

export default {
  summary,
  endpoint,
  isPublic,
  info,
};
