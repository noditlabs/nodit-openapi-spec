import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Domains from "../../library/domains";
import Examples from "../../library/examples";
import { ERC20, getChainInfo } from "../../../../constants";
import { onlyEthereumMainnetLuniverseMainnetInfoMessage } from "../../../../callouts";

const summary = "Get Hourly Transactions Stats By Contract";
const endpoint = "getHourlyTransactionsStatsByContract";
const isPublic = true;
const tags = ["Statistics API"];

// 체인별 description을 반환하는 헬퍼 함수
function getDescription(chain: string): string {
  switch (chain) {
    default:
      return `지정한 범위 내에서 발생한 특정 컨트랙트의 시간별 트랜잭션 수를 조회할 수 있습니다

> 📘 데이터는 언제 반영되나요?
> 
> 현재 시간별 통계 API에서 시간은 UTC 기준으로, 응답의 각 항목에는 date로부터 +1시간 내의 통계치가 제공됩니다. 시간별 통계의 경우 최근 1시간의 통계치 반영이 최대 40분까지 지연될 수 있으므로 최신 데이터 조회 시 고려가 필요합니다.

${onlyEthereumMainnetLuniverseMainnetInfoMessage}`;
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
        Requests.chain("ethereum", ["ethereum", "luniverse"]),
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
    default:
      return {
        requestBody: {
          additionalProperties: false,
          type: "object",
          properties: {
            contractAddress: {
              ...Requests.Ethereum.contractAddress,
              default: ERC20.USDT.CONTRACT_ADDRESS,
            },
            startDateTime: {
              ...Requests.startDateTime,
              default: "2024-01-01-00",
            },
            endDateTime: {
              ...Requests.endDateTime,
              default: "2024-02-01-00",
            },
          },
          required: ["contractAddress", "startDateTime", "endDateTime"],
        },
        successResponse: {
          schema: Domains.PaginationStats(Domains.HourlyStats),
          example: Examples.Ethereum[endpoint],
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
