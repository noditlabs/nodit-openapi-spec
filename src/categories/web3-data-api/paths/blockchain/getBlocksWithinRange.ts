import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Domains from "../../library/domains";
import Examples from "../../library/examples";
import {
  kaiaUsingTipsForBlock,
  kaiaUsingTipsForCommon,
} from "../../../../callouts";
import { getChainInfo } from "../../../../constants";

const summary = "Get Blocks Within Range";
const endpoint = "getBlocksWithinRange";
const isPublic = true;
const tags = ["Blockchain API"];

// 체인별 description을 반환하는 헬퍼 함수
function getDescription(chain: string): string {
  switch (chain) {
    default:
      return "특정 기간, 특정 구간의 블록 리스트 정보를 조회합니다.";
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
        Requests.chain("ethereum", [
          // evm
          "arbitrum",
          "base",
          "bnb",
          "chiliz",
          "ethereum",
          "ethereumclassic",
          "giwa",
          "kaia",
          "optimism",
          "polygon",
          "luniverse",

          // Move 기반 체인
          "aptos",
        ]),
        Requests.network("mainnet", [
          "mainnet",
          "testnet",
          "sepolia",
          "hoodi",
          "amoy",
        ]),
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
    case "web3":
    case "kaia":
      return {
        requestBody: {
          additionalProperties: false,
          oneOf: [
            {
              title: "EVM (Ethereum, Optimism, ...)",
              allOf: [
                {
                  type: "object",
                  properties: {
                    fromBlock: Requests.Kaia.fromBlock, // 카이아 하드포크로 인한 안내 문구 포함
                    toBlock: Requests.Ethereum.toBlock,
                    fromDate: Requests.Ethereum.fromDate,
                    toDate: Requests.Ethereum.toDate,
                  },
                },
                Requests.PaginationSet,
              ],
            },
            {
              title: "Aptos",
              allOf: [
                {
                  type: "object",
                  properties: {
                    fromBlock: Requests.Aptos.fromBlock,
                    toBlock: Requests.Aptos.toBlock,
                    fromDate: Requests.Aptos.fromDate,
                    toDate: Requests.Aptos.toDate,
                  },
                },
                Requests.PaginationSet,
              ],
            },
          ],
        },
        successResponse: {
          schema: Domains.Pagination({
            oneOf: [
              {
                title: "EVM (Ethereum, Optimism, ...)",
                ...Domains.Ethereum.Block,
                example: Examples.Ethereum[endpoint],
              },
              {
                title: "Aptos",
                ...Domains.Aptos.Block,
                example: Examples.Aptos[endpoint],
              },
            ],
          }),
        },
      };

    case "aptos":
      return {
        requestBody: {
          additionalProperties: false,
          allOf: [
            {
              type: "object",
              properties: {
                fromBlock: Requests.Aptos.fromBlock,
                toBlock: Requests.Aptos.toBlock,
                fromDate: Requests.Aptos.fromDate,
                toDate: Requests.Aptos.toDate,
              },
            },
            Requests.PaginationSet,
          ],
        },
        successResponse: {
          schema: Domains.Pagination(Domains.Aptos.Block),
          example: Examples.Aptos[endpoint],
        },
      };

    default:
      // 그 외 (Ethereum, Polygon, Arbitrum, etc.)
      return {
        requestBody: {
          additionalProperties: false,
          allOf: [
            {
              type: "object",
              properties: {
                fromBlock: Requests.Ethereum.fromBlock,
                toBlock: Requests.Ethereum.toBlock,
                fromDate: Requests.Ethereum.fromDate,
                toDate: Requests.Ethereum.toDate,
              },
            },
            Requests.PaginationSet,
          ],
        },
        successResponse: {
          schema: Domains.Pagination(Domains.Ethereum.Block),
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
    case "web3":
    case "kaia":
      return `${kaiaUsingTipsForCommon(kaiaUsingTipsForBlock)}`;
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
