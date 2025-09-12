import { OpenAPIV3 } from "openapi-types";
import Requests from "../../library/requests";
import Responses from "../../library/responses";
import Domains from "../../library/domains";
import Examples from "../../library/examples";
import {
  APTOS_ACCOUNTS,
  getChainInfo,
  XRPL_ACCOUNTS,
} from "../../../../constants";

const summary = "Get Token Balance Changes by Account";
const endpoint = "getTokenBalanceChangesByAccount";
const isPublic = true;
const tags = ["Token API"];

// 프로토콜별 description을 반환하는 헬퍼 함수
function getDescription(protocol: string): string {
  switch (protocol) {
    case "aptos":
      return `특정 계정의 자산 변화 내역을 조회합니다.`;
    default:
      return `특정 계정의 IOU 토큰 잔고 변동 내역을 조회합니다.`;
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
        Requests.protocol("xrpl", ["xrpl", "aptos"]),
        Requests.network("mainnet", ["mainnet", "testnet"]),
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
          oneOf: [
            {
              title: "XRPL",
              type: "object",
              allOf: [
                {
                  type: "object",
                  properties: {
                    accountAddress: Requests.XRPL.accountAddress,
                    currency: Requests.XRPL.currency,
                    issuer: Requests.XRPL.issuer,
                    fromLedger: Requests.XRPL.fromLedger,
                    toLedger: Requests.XRPL.toLedger,
                    fromDate: Requests.XRPL.fromDate,
                    toDate: Requests.XRPL.toDate,
                  },
                },
                Requests.PaginationSet,
              ],
            },
            {
              title: "Aptos",
              type: "object",
              allOf: [
                {
                  type: "object",
                  properties: {
                    accountAddress: Requests.Aptos.accountAddress,
                    assetTypes: Requests.Aptos.assetType,
                    linkedAssetTypes: Requests.Aptos.linkedAssetType,
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
                title: "XRPL",
                allOf: [Domains.XRPL.BalanceChanges],
                example: Examples.XRPL[endpoint],
              },
              {
                title: "Aptos",
                allOf: [Domains.Aptos.BalanceChange],
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
                accountAddress: {
                  ...Requests.Aptos.accountAddress,
                  default: APTOS_ACCOUNTS.ACCOUNT_1,
                },
                assetTypes: {
                  type: "array",
                  items: Requests.Aptos.assetType,
                  description: `${Requests.Aptos.assetType.description}

<strong style='color: red;'>*</strong> assetTypes과 linkedAssetTypes는 동시에 사용할 수 없습니다.`,
                },
                linkedAssetTypes: {
                  type: "array",
                  items: Requests.Aptos.linkedAssetType,
                  description: `${Requests.Aptos.linkedAssetType.description}

<strong style='color: red;'>*</strong> assetTypes과 linkedAssetTypes는 동시에 사용할 수 없습니다.`,
                },
                fromBlock: Requests.Aptos.fromBlock,
                toBlock: Requests.Aptos.toBlock,
                fromDate: Requests.Aptos.fromDate,
                toDate: Requests.Aptos.toDate,
              },
              required: ["accountAddress"],
            },
            Requests.PaginationSet,
          ],
        },
        successResponse: {
          schema: Domains.Pagination(Domains.Aptos.BalanceChange),
          example: Examples.Aptos[endpoint],
        },
      };
    case "xrpl":
      return {
        requestBody: {
          additionalProperties: false,
          allOf: [
            {
              type: "object",
              properties: {
                accountAddress: {
                  ...Requests.XRPL.accountAddress,
                  default: XRPL_ACCOUNTS.ACCOUNT_1,
                },
                currency: Requests.XRPL.currency,
                issuer: Requests.XRPL.issuer,
                fromLedger: Requests.XRPL.fromLedger,
                toLedger: Requests.XRPL.toLedger,
                fromDate: Requests.XRPL.fromDate,
                toDate: Requests.XRPL.toDate,
              },
              required: ["accountAddress"],
            },
            Requests.PaginationSet,
          ],
        },
        successResponse: {
          schema: Domains.Pagination({
            allOf: [Domains.XRPL.BalanceChanges],
          }),
          example: Examples.XRPL[endpoint],
        },
      };
  }
}

// ─────────────────────────────────────
// C. callouts 설정
//   - 프로토콜별로 모두 다름
// ─────────────────────────────────────
function getCallouts(protocol: string): string {
  switch (protocol) {
    case "web3":
    case "aptos":
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
