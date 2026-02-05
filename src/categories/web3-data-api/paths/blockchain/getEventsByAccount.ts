import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Domains from "../../library/domains";
import Examples from "../../library/examples";
import { getChainInfo, APTOS_ACCOUNTS } from "../../../../constants";

const summary = "Get Events By Account";
const endpoint = "getEventsByAccount";
const isPublic = true;
const tags = ["Blockchain API"];

// 체인별 description을 반환하는 헬퍼 함수
function getDescription(chain: string): string {
  switch (chain) {
    default:
      return `특정 계정과 관련된 이벤트 목록을 조회합니다. 지정한 주소가 이벤트의 accountAddress, objectAddress, 또는 objectOwnerAddress와 일치하는 경우 조회 결과에 포함됩니다.`;
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
        Requests.chain("ethereum", ["aptos"]),
        Requests.network("mainnet", ["mainnet", "testnet"]),
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
    default:
      return {
        requestBody: {
          additionalProperties: false,
          allOf: [
            {
              type: "object",
              properties: {
                accountAddress: {
                  ...Requests.Aptos.accountAddress,
                  default: APTOS_ACCOUNTS.ACCOUNT_1,
                },
                eventTypes: {
                  type: "array",
                  items: Requests.Aptos.eventType,
                },
                fromBlock: Requests.Aptos.fromBlock,
                toBlock: Requests.Aptos.toBlock,
                fromDate: Requests.Aptos.fromDate,
                toDate: Requests.Aptos.toDate,
              },
            },
            Requests.PaginationSet,
          ],
          required: ["accountAddress"],
        },
        successResponse: {
          schema: Domains.Pagination(Domains.Aptos.Event),
          example: Examples.Aptos[endpoint],
        },
      };
  }
}

// ─────────────────────────────────────
// C. callouts 설정
//   - "web3"일 때 모든 케이스의 callouts 포함
// ─────────────────────────────────────
function getCallouts(chain: string): string {
  switch (chain) {
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
