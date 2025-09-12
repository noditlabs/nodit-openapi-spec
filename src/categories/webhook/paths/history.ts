import { OpenAPIV3 } from "openapi-types";
import Requests from "../library/requests";
import Responses from "../library/responses";
import Examples from "../library/examples";
import { getChainInfo } from "../../../constants";

const summary = "Get Webhook History";
const endpoint = "getWebhookHistory";
const isPublic = true;
const tags = ["Webhook API"];
const description = `Webhook의 호출 이력을 조회할 수 있는 API입니다. 이 API를 사용하면 Webhook의 실행 상태와 호출 결과를 확인할 수 있습니다. 호출 이력에는 Webhook 이벤트의 성공 여부와 각 호출에 대한 상세 정보가 포함됩니다.`;

// 프로토콜별 description을 반환하는 헬퍼 함수
function getDescription(protocol: string): string {
  switch (protocol) {
    default:
      return description;
  }
}

const info = (protocol: string): OpenAPIV3.PathItemObject => {
  // A. operationId 및 parameters 설정
  const { operationId, parameters } = getOpIdAndParams(protocol);
  // B. successResponse 설정 (GET 엔드포인트이므로 requestBody는 사용하지 않음)
  const { successResponse } = getRequestAndResponse(protocol);
  // C. callouts 설정
  const callouts = getCallouts(protocol);
  // D. 프로토콜에 따른 description 설정
  const protocolDescription = getDescription(protocol);

  return {
    get: {
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
// A. operationId 및 parameters 설정 (none vs. 그 외)
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
          "ethereum",
          "kaia",
          "optimism",
          "polygon",
          "luniverse",

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
        { ...Requests.subscriptionIdQuery, required: true },
        Requests.pageQuery,
        Requests.rppQuery,
        Requests.withEventMessageQuery,
        Requests.statusQuery,
        Requests.startAtQuery,
        Requests.endAtQuery,
        Requests.startSequenceNumberQuery,
      ],
    };
  } else {
    const chainInfo = getChainInfo(protocol);
    return {
      operationId: `${protocol}-${endpoint}`,
      parameters: [
        Requests.protocol(protocol, [protocol]),
        Requests.network(chainInfo?.mainnet || chainInfo?.testnet?.[0] || "", [
          ...(chainInfo?.mainnet || []),
          ...(chainInfo?.testnet || []),
        ]),
        { ...Requests.subscriptionIdQuery, required: true },
        Requests.pageQuery,
        Requests.rppQuery,
        Requests.withEventMessageQuery,
        Requests.statusQuery,
        Requests.startAtQuery,
        Requests.endAtQuery,
        Requests.startSequenceNumberQuery,
      ],
    };
  }
}

// ─────────────────────────────────────
// B. successResponse 설정 (프로토콜별로 다름)
// ─────────────────────────────────────
function getRequestAndResponse(protocol: string): {
  requestBody?: OpenAPIV3.SchemaObject;
  successResponse: OpenAPIV3.MediaTypeObject;
} {
  switch (protocol) {
    default:
      return {
        successResponse: {
          schema: {
            type: "object",
            properties: {
              total: Responses.total,
              page: Responses.page,
              rpp: Responses.rpp,
              items: Responses.items({
                type: "object",
                properties: {
                  subscriptionId: Responses.subscriptionId,
                  description: Responses.description,
                  // TODO: environment id 정체 확인할 것
                  protocol: Responses.protocol,
                  network: Responses.network,
                  subscriptionType: Responses.subscriptionType,
                  eventType: Responses.eventType,
                  notification: Responses.notification,
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
// C. callouts 설정 (프로토콜별로 다름)
// ─────────────────────────────────────
function getCallouts(protocol: string): string {
  switch (protocol) {
    default:
      return `> 💡 히스토리 데이터 저장 기간
> 최근 30일 동안의 Webhook 호출 이력만 적재됩니다. 30일을 초과한 데이터는 저장되지 않으므로, 필요한 이력은 그 기간 내에 조회하셔야 합니다.`;
  }
}

export default {
  summary,
  endpoint,
  isPublic,
  info,
};
