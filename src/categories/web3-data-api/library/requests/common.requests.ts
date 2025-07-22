import { OpenAPIV3 } from "openapi-types";
import { Patterns } from "../../../../patterns";

/** Path Parameters **/
export function protocol(
  example: string,
  list: string[]
): OpenAPIV3.ParameterObject {
  return {
    name: "protocol",
    in: "path",
    required: true,
    schema: {
      type: "string",
      enum: list,
      default: example,
    },
    description: "조회 대상 체인의 프로토콜을 지정하기 위한 파라미터입니다.",
  };
}

export function network(
  example: string,
  list: string[]
): OpenAPIV3.ParameterObject {
  return {
    name: "network",
    in: "path",
    required: true,
    schema: {
      type: "string",
      default: example,
      enum: list,
    },
    description:
      "조회 대상 체인의 네트워크를 지정하기 위한 파라미터입니다. 프로토콜에 따라 지원되는 네트워크가 다를 수 있습니다.",
  };
}

/** Body Parameters **/
/* Pagination */
export const page: OpenAPIV3.SchemaObject = {
  type: "integer",
  description: `page 파라미터는 조회하려는 데이터 페이지를 지정하는 데 사용됩니다. 이 파라미터는 100 이하의 값을 받으며, 100을 초과하는 페이지가 필요한 경우 cursor 페이지네이션 방식을 사용해야 합니다.


page 파라미터와 cursor 파라미터는 동시에 사용할 수 없습니다. page와 cursor에 모두 빈 값을 입력한 경우, cursor 페이지네이션을 사용하는 것으로 간주합니다.`,
  pattern: Patterns.pagination.page.source,
};

export const rpp: OpenAPIV3.SchemaObject = {
  type: "integer",
  description:
    "rpp는 results per page의 약자로, 한 페이지의 사이즈를 지정하는 파라미터입니다. 0보다 크고 1000 이하의 숫자를 지정할 수 있습니다.",
  pattern: Patterns.pagination.rpp.source,
};

export const cursor: OpenAPIV3.SchemaObject = {
  type: "string",
  description: `cursor 파라미터는 페이지네이션을 위한 파라미터로, 이전 페이지와 다음 페이지 간의 데이터 이동을 지원합니다. 이전 페이지에서 얻은 cursor 값을 다음 요청에 제공하면 다음 페이지의 데이터를 로드할 수 있습니다.
			

page 파라미터와 cursor 파라미터는 동시에 사용할 수 없습니다. page와 cursor에 모두 빈 값을 입력한 경우, cursor 페이지네이션을 사용하는 것으로 간주합니다.`,
};

export const withCount: OpenAPIV3.SchemaObject = {
  type: "boolean",
  description:
    "응답에 count 필드의 포함 여부를 지정하는 파라미터이며, count 필드는 요청한 데이터의 총 개수를 나타냅니다. 이 파라미터에 true를 입력한 경우, 응답에 count 필드가 포함되며 응답속도가 느려질 수 있습니다.",
  default: false,
};

export const PaginationSet: OpenAPIV3.SchemaObject = {
  type: "object",
  properties: {
    page,
    rpp,
    cursor,
    withCount,
  },
};

/* Stats */
export const startDate: OpenAPIV3.SchemaObject = {
  type: "string",
  description: `조회 시작 날짜를 지정하는 파라미터입니다. 시작 일자로부터 종료 일자까지 최대 100일까지의 데이터를 조회할 수 있습니다. YYYY-MM-DD 타입을 지원합니다.`,
  pattern: Patterns.date.yyyymmdd.source,
};

export const endDate: OpenAPIV3.SchemaObject = {
  type: "string",
  description: `조회 종료 날짜를 지정하는 파라미터입니다. 시작 일자로부터 종료 일자까지 최대 100일까지의 데이터를 조회할 수 있습니다. YYYY-MM-DD 타입을 지원합니다.`,
  pattern: Patterns.date.yyyymmdd.source,
};

export const startDateTime: OpenAPIV3.SchemaObject = {
  type: "string",
  description: `조회 시작 날짜와 시간을 지정하는 파라미터입니다. 시작 일시로부터 종료 일시까지 최대 2400시간까지의 데이터를 조회할 수 있습니다. YYYY-MM-DD-HH 타입을 지원합니다.`,
  pattern: Patterns.date.yyyymmddhh.source,
};

export const endDateTime: OpenAPIV3.SchemaObject = {
  type: "string",
  description: `조회 종료 날짜와 시간을 지정하는 파라미터입니다. 시작 일시로부터 종료 일시까지 최대 2400시간까지의 데이터를 조회할 수 있습니다. YYYY-MM-DD-HH 타입을 지원합니다.`,
  pattern: Patterns.date.yyyymmddhh.source,
};

/* Others */
export const withZeroValue: OpenAPIV3.SchemaObject = {
  type: "boolean",
  description:
    "응답에 value가 0인 결과를 포함하는지 여부를 지정하는 파라미터입니다. 더 빠른 응답을 원한다면 이 파라미터를 true로 설정하세요.",
  default: false,
};

export const relation: OpenAPIV3.SchemaObject = {
  type: "string",
  description: `조회 대상 계정 주소가 송신자 또는 수신자에 속한 트랜잭션만 필터링하기 위한 파라미터입니다.  
- from: 송신자로만 필터링.  
- to: 수신자로만 필터링.  
- both(기본값): from과 to에 하나라도 포함된 모든 트랜잭션이 조회됩니다.`,
  enum: ["from", "to", "both"],
  pattern: `from|to|both`,
  default: "both",
};

export const currency: OpenAPIV3.SchemaObject = {
  type: "string",
  description: `조회하는 Token Price의 화폐 단위를 선택하는 파라미터입니다. USD와 KRW를 지원합니다. 기본 설정 값은 USD 입니다.`,
  default: "USD",
};
