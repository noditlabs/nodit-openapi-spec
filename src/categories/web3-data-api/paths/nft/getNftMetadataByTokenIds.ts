import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Domains from "../../library/domains";
import Examples from "../../library/examples";
import { ERC721, INPUT_LIMITS, getChainInfo } from "../../../../constants";
import {
  kaiaUsingTipsForCommon,
  kaiaUsingTipsForNftMetadata,
  whatIsTokenUriAndNftMetadataMessage,
} from "../../../../callouts";

const summary = "Get NFT Metadata by Token IDs";
const endpoint = "getNftMetadataByTokenIds";
const isPublic = true;
const tags = ["NFT API"];

// 프로토콜별 description을 반환하는 헬퍼 함수
function getDescription(protocol: string): string {
  switch (protocol) {
    default:
      return `특정 NFT의 메타데이터를 조회합니다. 다수의 NFT를 조회할 수 있으며, 최대 ${INPUT_LIMITS.ITEM_MAX}개의 NFT를 조회할 수 있습니다.

${whatIsTokenUriAndNftMetadataMessage}
`;
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
  if (protocol === "none") {
    return {
      operationId: endpoint,
      parameters: [
        Requests.protocol("ethereum", [
          // evm
          "arbitrum",
          "base",
          "ethereum",
          "kaia",
          "optimism",
          "polygon",
          "luniverse",
          "chiliz",
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
    case "none":
    default:
      return {
        requestBody: {
          additionalProperties: false,
          allOf: [
            {
              type: "object",
              properties: {
                tokens: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      contractAddress: {
                        ...Requests.Ethereum.contractAddress,
                      },
                      tokenId: {
                        ...Requests.Ethereum.tokenId,
                      },
                    },
                    required: ["contractAddress", "tokenId"],
                  },
                  default: [
                    {
                      contractAddress: ERC721.BAYC.CONTRACT_ADDRESS,
                      tokenId: "1",
                    },
                    {
                      contractAddress: ERC721.BAYC.CONTRACT_ADDRESS,
                      tokenId: "2",
                    },
                  ],
                },
              },
              required: ["tokens"],
              maximum: INPUT_LIMITS.ITEM_MAX,
            },
          ],
        },
        successResponse: {
          schema: {
            type: "array",
            items: {
              allOf: [
                Domains.Ethereum.NftMeta,
                {
                  type: "object",
                  properties: {
                    contract: {
                      allOf: [
                        Domains.Ethereum.ContractMeta,
                        Domains.Ethereum.AssetMeta,
                      ],
                    },
                  },
                },
              ],
            },
          },
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
    case "none":
    case "kaia":
      return `${kaiaUsingTipsForCommon(kaiaUsingTipsForNftMetadata)}`;
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
