import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Domains from "../../library/domains";
import Examples from "../../library/examples";
import { ERC1155, getChainInfo } from "../../../../constants";
import {
  kaiaUsingTipsForCommon,
  kaiaUsingTipsForNftTransfer,
} from "../../../../callouts";

const summary = "Get NFT Transfers By TokenId";
const endpoint = "getNftTransfersByTokenId";
const isPublic = true;
const tags = ["NFT API"];

// 프로토콜별 description을 반환하는 헬퍼 함수
function getDescription(protocol: string): string {
  switch (protocol) {
    default:
      return `특정 NFT가 전송된 목록을 조회합니다. 조회 결과에는 컨트랙트 메타데이터와 NFT 메타데이터가 포함됩니다.`;
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
        Requests.protocol("ethereum", [
          // evm
          "arbitrum",
          "base",
          // "bnb",
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
    case "kaia":
      return {
        requestBody: {
          additionalProperties: false,
          allOf: [
            {
              type: "object",
              properties: {
                contractAddress: {
                  ...Requests.Ethereum.contractAddress,
                  default: ERC1155.RARE_PEPE.CONTRACT_ADDRESS,
                },
                tokenId: {
                  ...Requests.Ethereum.tokenId,
                  default: ERC1155.RARE_PEPE.TOKEN_ID,
                },
                fromBlock: Requests.Kaia.fromBlock, // 카이아 하드포크로 인한 안내 문구 포함
                toBlock: Requests.Ethereum.toBlock,
                fromDate: Requests.Ethereum.fromDate,
                toDate: Requests.Ethereum.toDate,
              },
              required: ["contractAddress", "tokenId"],
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
                contractAddress: {
                  ...Requests.Ethereum.contractAddress,
                  default: ERC1155.RARE_PEPE.CONTRACT_ADDRESS,
                },
                tokenId: {
                  ...Requests.Ethereum.tokenId,
                  default: ERC1155.RARE_PEPE.TOKEN_ID,
                },
                fromBlock: Requests.Ethereum.fromBlock,
                toBlock: Requests.Ethereum.toBlock,
                fromDate: Requests.Ethereum.fromDate,
                toDate: Requests.Ethereum.toDate,
              },
              required: ["contractAddress", "tokenId"],
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
function getCallouts(protocol: string): string {
  switch (protocol) {
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
