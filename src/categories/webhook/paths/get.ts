import { OpenAPIV3 } from "openapi-types";
import Requests from "../library/requests";
import Responses from "../library/responses";
import Examples from "../library/examples";
import { getChainInfo } from "../../../constants";

const summary = "Get Webhook";
const endpoint = "getWebhook";
const isPublic = true;
const tags = ["Webhook API"];

// 체인별 description을 반환하는 헬퍼 함수
function getDescription(chain: string): string {
  switch (chain) {
    default:
      return `Webhook의 Subscription ID로 Webhook 정보를 조회하기 위한 API입니다.`;
  }
}

const info = (chain: string): OpenAPIV3.PathItemObject => {
  // A. operationId, parameters 설정
  const { operationId, parameters } = getOpIdAndParams(chain);
  // B. successResponse 설정
  const { successResponse } = getRequestAndResponse(chain);
  // C. callouts 설정
  const callouts = getCallouts(chain);
  // D. protocol에 따른 description 설정
  const chainDescription = getDescription(chain);

  return {
    get: {
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
// A. operationId, parameters 설정 (none vs. 그 외)
// ─────────────────────────────────────
function getOpIdAndParams(chain: string): {
  operationId: string;
  parameters: OpenAPIV3.ParameterObject[];
} {
  if (chain === "web3") {
    return {
      operationId: endpoint,
      parameters: [
        Requests.chain("ethereum", [
          // evm
          "arbitrum",
          "base",
          "ethereum",
          "kaia",
          "optimism",
          "polygon",
          // non-evm
          "aptos",
        ]),
        Requests.network("mainnet", [
          "mainnet",
          "testnet",
          "sepolia",
          "hoodi",
          "amoy",
        ]),
        Requests.subscriptionIdQuery,
      ],
    };
  } else {
    const chainInfo = getChainInfo(chain);
    return {
      operationId: `${chain}-${endpoint}`,
      parameters: [
        Requests.chain(chain, [chain]),
        Requests.network(chainInfo?.mainnet || chainInfo?.testnet?.[0] || "", [
          ...(chainInfo?.mainnet || []),
          ...(chainInfo?.testnet || []),
        ]),
      ],
    };
  }
}

// ─────────────────────────────────────
// B. successResponse 설정 (체인별로 다름)
// ─────────────────────────────────────
function getRequestAndResponse(chain: string): {
  requestBody?: OpenAPIV3.SchemaObject;
  successResponse: OpenAPIV3.MediaTypeObject;
} {
  switch (chain) {
    default:
      return {
        successResponse: {
          schema: {
            type: "object",
            required: ["total", "page", "rpp", "items"],
            properties: {
              total: Responses.total,
              page: Responses.page,
              rpp: Responses.rpp,
              items: Responses.items({
                type: "object",
                required: [
                  "subscriptionId",
                  "description",
                  "protocol",
                  "network",
                  "subscriptionType",
                  "eventType",
                  "notification",
                  "isActive",
                  "updatedAt",
                  "createdAt",
                  "condition",
                ],
                properties: {
                  subscriptionId: Responses.subscriptionId,
                  description: Responses.description,
                  // TODO: environment id 정체 확인할 것
                  protocol: Responses.protocol,
                  network: Responses.network,
                  subscriptionType: Responses.subscriptionType,
                  eventType: Responses.eventType,
                  notification: Responses.notification,
                  // signingKey: Responses.signingKey,
                  isInstant: Responses.isInstant,
                  isActive: Responses.isActive,
                  updatedAt: Responses.updatedAt,
                  createdAt: Responses.createdAt,
                  condition: Responses.condition,
                },
              }),
            },
          },
          example: Examples[endpoint],
        },
      };
  }
}

// ─────────────────────────────────────
// C. callouts 설정 (체인별로 다름)
// ─────────────────────────────────────
function getCallouts(chain: string): string {
  switch (chain) {
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
