import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Domains from "../../library/domains";
import Examples from "../../library/examples";
import { Patterns } from "../../../../patterns";
import { onlyEthereumMainnetInfoMessage } from "../../../../callouts";
import { ETHEREUM_ACCOUNTS, getChainInfo } from "../../../../constants";

const summary = "Get ENS Records By Account";
const endpoint = "getEnsRecordsByAccount";
const isPublic = true;
const tags = ["ENS API"];

// 프로토콜별 description을 반환하는 헬퍼 함수
function getDescription(protocol: string): string {
  switch (protocol) {
    default:
      return `ENS 도메인의 소유자 주소 또는 해당 주소가 가리키는 주소를 입력하여 ENS 도메인의 정보를 조회합니다. 
ownerAddress는 ENS 도메인의 소유자 주소를, resolvedAddress는 ENS 도메인이 가리키는 주소를 나타냅니다.
		
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
              oneOf: [
                {
                  title: "owner Address",
                  required: ["ownerAddress"],
                  type: "object",
                  properties: {
                    ownerAddress: {
                      type: "string",
                      description:
                        "ENS 도메인의 소유자 주소를 입력합니다. 0x로 시작하는 40자리 16진수 문자열입니다. ownerAddress 혹은 resolvedAddress 둘 중 하나의 파라미터는 반드시 지정해야합니다.",
                      pattern: Patterns.ethereum.address.source,
                      example: ETHEREUM_ACCOUNTS.VITALIK_BUTERIN,
                    },
                  },
                },
                {
                  title: "resolved Address",
                  required: ["resolvedAddress"],
                  type: "object",
                  properties: {
                    resolvedAddress: {
                      type: "string",
                      description:
                        "ENS 도메인이 가리키는 주소를 입력합니다. 0x로 시작하는 40자리 16진수 문자열입니다. ownerAddress 혹은 resolvedAddress 둘 중 하나의 파라미터는 반드시 지정해야합니다.",
                      pattern: Patterns.ethereum.address.source,
                      example: ETHEREUM_ACCOUNTS.VITALIK_BUTERIN,
                    },
                  },
                },
              ],
            },
            Requests.PaginationSet,
          ],
        },
        successResponse: {
          schema: Domains.Pagination({
            allOf: [Domains.Ethereum.EnsRecord],
          }),
          example: Examples.Ethereum[endpoint],
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
      return `${onlyEthereumMainnetInfoMessage}`;
  }
}

export default {
  summary,
  endpoint,
  isPublic,
  info,
};
