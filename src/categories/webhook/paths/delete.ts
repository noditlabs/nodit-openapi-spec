import { OpenAPIV3 } from "openapi-types";
import Requests from "../library/requests";
import Responses from "../library/responses";
import Examples from "../library/examples";
import { getChainInfo } from "../../../constants";

const summary = "Delete Webhook";
const endpoint = "deleteWebhook";
const isPublic = true;
const tags = ["Webhook API"];

// 체인별 description을 반환하는 헬퍼 함수
function getDescription(chain: string): string {
  switch (chain) {
    default:
      return `Webhook을 삭제하기 위한 API입니다. Webhook을 삭제하면 해당 Webhook의 구독이 취소되며, 더 이상 이벤트를 받지 않습니다.`;
  }
}

const info = (chain: string): OpenAPIV3.PathItemObject => {
  // A. operationId와 parameters 설정
  const { operationId, parameters } = getOpIdAndParams(chain);
  // B. successResponse 설정
  const { successResponse } = getRequestAndResponse(chain);
  // C. callouts 설정
  const callouts = getCallouts(chain);
  // D. protocol에 따른 description 설정
  const chainDescription = getDescription(chain);

  return {
    delete: {
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
// A. operationId, parameters 설정
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
          "giwa",
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
        Requests.subscriptionId,
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
        Requests.subscriptionId,
      ],
    };
  }
}

// ─────────────────────────────────────
// B. successResponse 설정
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
// C. callouts 설정
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
