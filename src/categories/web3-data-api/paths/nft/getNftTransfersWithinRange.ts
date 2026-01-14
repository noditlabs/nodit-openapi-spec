import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Domains from "../../library/domains";
import Examples from "../../library/examples";
import {
  kaiaUsingTipsForCommon,
  kaiaUsingTipsForNftTransfer,
} from "../../../../callouts";
import { getChainInfo } from "../../../../constants";

const summary = "Get NFT Transfers Within Range";
const endpoint = "getNftTransfersWithinRange";
const isPublic = true;
const tags = ["NFT API"];

// 체인별 description을 반환하는 헬퍼 함수
function getDescription(chain: string): string {
  switch (chain) {
    default:
      return `특정 기간동안 발생한 NFT 전송 목록을 조회합니다. 조회 결과에는 컨트랙트 메타데이터와 NFT 메타데이터가 포함됩니다. 
> 📘 기간 설정 팁 
> 설정한 기간이 길 경우 응답시간이 길어질 수 있습니다. 빠른 응답을 원한다면 필요한 기간만큼만 설정하는 것을 권장합니다.`;
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
        ]),
        Requests.network("mainnet", [
          "mainnet",
          "sepolia",
          "hoodi",
          "amoy",
          "testnet",
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
            {
              type: "object",
              properties: {
                withMetadata: Requests.Ethereum.withMetadata,
                withZeroValue: Requests.withZeroValue,
                withFunction: Requests.Ethereum.withFunction,
              },
            },
          ],
        },
        successResponse: {
          schema: Domains.Pagination({
            allOf: [
              Domains.Ethereum.Transfer,
              {
                type: "object",
                properties: {
                  contract: {
                    allOf: [
                      Domains.Ethereum.ContractMeta,
                      Domains.Ethereum.AssetMeta,
                    ],
                  },
                  nft: Domains.Ethereum.NftMeta,
                },
              },
            ],
          }),
          example: Examples.Ethereum[endpoint],
        },
      };
    default:
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
            {
              type: "object",
              properties: {
                withMetadata: Requests.Ethereum.withMetadata,
                withZeroValue: Requests.withZeroValue,
                withFunction: Requests.Ethereum.withFunction,
              },
            },
          ],
        },
        successResponse: {
          schema: Domains.Pagination({
            allOf: [
              Domains.Ethereum.Transfer,
              {
                type: "object",
                properties: {
                  contract: {
                    allOf: [
                      Domains.Ethereum.ContractMeta,
                      Domains.Ethereum.AssetMeta,
                    ],
                  },
                  nft: Domains.Ethereum.NftMeta,
                },
              },
            ],
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
function getCallouts(chain: string): string {
  switch (chain) {
    case "web3":
    case "kaia":
      return `${kaiaUsingTipsForCommon(kaiaUsingTipsForNftTransfer)}`;
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
