import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Domains from "../../library/domains";
import Examples from "../../library/examples";
import { getChainInfo } from "../../../../constants";

const summary = "Get Transaction By Transaction ID";
const endpoint = "getTransactionByTransactionId";
const isPublic = true;
const tags = ["Blockchain API"];

// 체인별 description을 반환하는 헬퍼 함수
function getDescription(chain: string): string {
  switch (chain) {
    default:
      return `특정 트랜잭션의 정보를 조회합니다.`;
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
        Requests.chain("bitcoin", [
          // utxo
          "bitcoin",
          "dogecoin",
          "bitcoincash",
        ]),
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
    case "bitcoincash":
      return {
        requestBody: {
          additionalProperties: false,
          allOf: [
            {
              type: "object",
              properties: {
                transactionId: {
                  ...Requests.Bitcoin.transactionId,
                  default:
                    "0028e50ae5021b84597a32e6174c2f636b334457a41b0bdd872ba4d7b4f120f6",
                },
              },
              required: ["transactionId"],
            },
          ],
        },
        successResponse: {
          schema: {
            allOf: [
              Domains.Bitcoin.Transaction,
              {
                type: "object",
                properties: {
                  vin: {
                    allOf: [Domains.Bitcoin.Vin, Domains.BitcoinCash.Token],
                  },
                  vout: {
                    allOf: [Domains.Bitcoin.Vout, Domains.BitcoinCash.Token],
                  },
                },
              },
            ],
          },
          example: Examples.BitcoinCash[endpoint],
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
                transactionId: {
                  ...Requests.Bitcoin.transactionId,
                  default:
                    "b3554fe6689fddb99446c78a3bb1d08f59cfa479505e87e9b948e14b42ea9aef",
                },
              },
              required: ["transactionId"],
            },
          ],
        },
        successResponse: {
          schema: {
            allOf: [
              Domains.Bitcoin.Transaction,
              {
                type: "object",
                properties: {
                  vin: Domains.Bitcoin.Vin,
                  vout: Domains.Bitcoin.Vout,
                },
              },
            ],
          },
          example: Examples.Bitcoin[endpoint],
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
