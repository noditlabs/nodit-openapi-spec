import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Examples from "../../library/examples";
import { onlyEthereumMainnetInfoMessage } from "../../../../callouts";
import { getChainInfo } from "../../../../constants";

const summary = "Get Address By ENS Name";
const endpoint = "getAddressByEnsName";
const isPublic = true;
const tags = ["ENS API"];

// 프로토콜별 description을 반환하는 헬퍼 함수
function getDescription(protocol: string): string {
  switch (protocol) {
    default:
      return `ENS 도메인의 이름을 입력하여 매핑된 주소를 조회합니다.

${onlyEthereumMainnetInfoMessage}`;
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
  if (protocol === "web3") {
    return {
      operationId: endpoint,
      parameters: [
        Requests.protocol("ethereum", ["ethereum"]),
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
    case "web3":
    default:
      return {
        requestBody: {
          additionalProperties: false,
          allOf: [
            {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "ENS 도메인의 이름을 입력합니다.",
                  default: "vitalik.eth",
                },
              },
            },
          ],
        },
        successResponse: {
          schema: {
            type: "object",
            properties: {
              address: {
                type: "string",
                description:
                  "ENS 도메인의 가리키는 주소입니다. 도메인이 존재하지 않을 경우 null을 반환합니다. 만료 날짜가 지난 후에도 도메인 갱신 및 새로운 등록이 발생하지 않으면, 이전 도메인이 가리키고 있는 주소가 반환됩니다.",
                default: null,
                example: Examples.Ethereum[endpoint],
              },
              expiryDate: {
                type: "string",
                description:
                  "ENS 도메인의 만료 날짜를 나타냅니다. 만료 날짜가 지난 후에도 도메인 갱신 및 새로운 등록이 발생하지 않으면, 이전 만료 날짜를 반환됩니다.",
                example: Examples.Ethereum[endpoint],
              },
            },
          },
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
    case "web3":
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
