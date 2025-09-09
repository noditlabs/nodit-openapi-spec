import { OpenAPIV3 } from "openapi-types";
import Requests from "../library/requests";
import Responses from "../library/responses";
import Examples from "../library/examples";
import { getChainInfo } from "../../../constants";

const summary = "Update Webhook (EVM)";
const endpoint = "updateWebhook";
const isPublic = true;
const tags = ["Webhook API"];
const description = `Webhook의 구독 조건(condition)을 변경하거나 Webhook을 활성화, 또는 비활성화 할 수 있습니다.`;

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
  // B. requestBody, successResponse 설정
  const { requestBody, successResponse } = getRequestAndResponse(protocol);
  // C. callouts 설정
  const callouts = getCallouts(protocol);
  // D. 프로토콜에 따른 description 설정
  const protocolDescription = getDescription(protocol);

  return {
    patch: {
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
// A. operationId, parameters 설정 (none vs. 그 외)
// ─────────────────────────────────────
function getOpIdAndParams(protocol: string): {
  operationId: string;
  parameters: OpenAPIV3.ParameterObject[];
} {
  return {
    operationId: endpoint,
    parameters: [
      Requests.protocol("ethereum", [
        // evm
        "arbitrum",
        "base",
        "ethereum",
        "giwa",
        "kaia",
        "optimism",
        "polygon",
        "luniverse",
      ]),
      Requests.networkForEvm("mainnet", [
        "mainnet",
        "testnet",
        "sepolia",
        "hoodi",
        "amoy",
      ]),
      Requests.subscriptionId,
    ],
  };
}

// ─────────────────────────────────────
// B. requestBody, successResponse 설정 (프로토콜별로 다름)
// ─────────────────────────────────────
function getRequestAndResponse(protocol: string): {
  requestBody: OpenAPIV3.SchemaObject;
  successResponse: OpenAPIV3.MediaTypeObject;
} {
  switch (protocol) {
    default:
      return {
        requestBody: {
          additionalProperties: false,
          type: "object",
          properties: {
            notification: Requests.notification,
            description: Requests.description,
            isActive: Requests.isActive,
            condition: Requests.conditionForEvm,
          },
        },
        successResponse: {
          schema: {
            type: "object",
            properties: {
              result: Responses.result,
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
      return ""; // 해당 체인에서는 별도 callouts가 없음
  }
}

export default {
  summary,
  endpoint,
  isPublic,
  info,
};
