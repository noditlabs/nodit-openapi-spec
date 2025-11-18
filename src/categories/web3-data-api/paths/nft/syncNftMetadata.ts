import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Examples from "../../library/examples";
import { ERC721, INPUT_LIMITS, getChainInfo } from "../../../../constants";
import {
  kaiaUsingTipsForCommon,
  kaiaUsingTipsForNftSync,
  whatIsTokenUriAndNftMetadataMessage,
} from "../../../../callouts";

const summary = "Sync Nft Metadata";
const endpoint = "syncNftMetadata";
const isPublic = true;
const tags = ["NFT API"];

// 체인별 description을 반환하는 헬퍼 함수
function getDescription(chain: string): string {
  switch (chain) {
    default:
      return `특정 NFT의 Metadata를 동기화합니다. 최대 100개의 NFT를 동기화할 수 있으며, 동기화까지 최대 10초가 소요될 수 있습니다.

${whatIsTokenUriAndNftMetadataMessage}
`;
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
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "동기화 요청에 대한 결과 메시지를 반환합니다.",
                example:
                  "NFT Metadata synchronization request has been successfully submitted.",
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
function getCallouts(chain: string): string {
  switch (chain) {
    case "web3":
    case "kaia":
      return `${kaiaUsingTipsForCommon(kaiaUsingTipsForNftSync)}`;
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
