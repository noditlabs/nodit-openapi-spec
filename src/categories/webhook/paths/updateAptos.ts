import { OpenAPIV3 } from "openapi-types";
import Requests from "../library/requests";
import Responses from "../library/responses";
import Examples from "../library/examples";

const summary = "Update Webhook (Aptos)";
const endpoint = "aptos-updateWebhook";
const isPublic = true;
const tags = ["Webhook API"];
const description = `Webhook의 구독 조건(condition)을 변경하거나 Webhook을 활성화, 또는 비활성화 할 수 있습니다.`;

// 체인별 description을 반환하는 헬퍼 함수
function getDescription(chain?: string): string {
  switch (chain) {
    default:
      return description;
  }
}

const info = (chain?: string): OpenAPIV3.PathItemObject => {
  // A. operationId 및 parameters 설정
  const { operationId, parameters } = getOpIdAndParams(chain);
  // B. requestBody, successResponse 설정
  const { requestBody, successResponse } = getRequestAndResponse(chain);
  // C. callouts 설정
  const callouts = getCallouts(chain);
  // D. 체인에 따른 description 설정
  const chainDescription = getDescription(chain);

  return {
    patch: {
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

// ─────────────────────────────────────
// A. operationId, parameters 설정 (none vs. 그 외)
// ─────────────────────────────────────
function getOpIdAndParams(chain?: string): {
  operationId: string;
  parameters: OpenAPIV3.ParameterObject[];
} {
  return {
    operationId: endpoint,
    parameters: [
      Requests.networkForAptos("mainnet", ["mainnet", "testnet"]),
      Requests.subscriptionId,
    ],
  };
}

// ─────────────────────────────────────
// B. requestBody, successResponse 설정 (체인별로 다름)
// ─────────────────────────────────────
function getRequestAndResponse(chain?: string): {
  requestBody: OpenAPIV3.SchemaObject;
  successResponse: OpenAPIV3.MediaTypeObject;
} {
  switch (chain) {
    default:
      return {
        requestBody: {
          additionalProperties: false,
          type: "object",
          properties: {
            notification: Requests.notification,
            description: Requests.description,
            isActive: Requests.isActive,
            condition: Requests.conditionForAptos,
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
// C. callouts 설정 (체인별로 다름)
// ─────────────────────────────────────
function getCallouts(chain?: string): string {
  switch (chain) {
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
