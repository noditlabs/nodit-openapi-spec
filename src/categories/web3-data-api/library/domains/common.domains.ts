import { OpenAPIV3 } from "openapi-types";
import { Patterns } from "../../../../patterns";

export const Pagination = (items: OpenAPIV3.SchemaObject): OpenAPIV3.SchemaObject => ({
	type: "object",
	required: ["items"],
	properties: {
		page: {
			type: "integer",
			description:
				"page 파라미터에 지정된 페이지 번호를 나타내는 필드입니다. 이 필드는 page 파라미터에 0보다 큰 값을 입력한 경우에만 응답에 포함됩니다.",
		},
		rpp: {
			type: "integer",
			description: "rpp 파라미터에 지정된 페이지당 결과 수를 나타내는 필드입니다.",
		},
		cursor: {
			type: "string",
			description:
				"cursor 페이지네이션을 위한 필드로, 다음 페이지의 데이터를 로드하기 위해 다음 요청에 제공해야 하는 값입니다.",
		},
		count: {
			type: "integer",
			description:
				"요청한 데이터의 총 개수를 나타내는 필드입니다. 이 필드는 withCount 파라미터에 true를 입력한 경우에만 응답에 포함됩니다.",
		},
		items: {
			type: "array",
			description: "조회된 데이터의 목록을 나타내는 필드입니다.",
			items,
		},
	},
});

export const PaginationStats = (items: OpenAPIV3.SchemaObject): OpenAPIV3.SchemaObject => ({
	type: "object",
	required: ["items"],
	properties: {
		count: {
			type: "integer",
			description:
				"요청한 데이터의 총 개수를 나타내는 필드입니다. 이 필드는 withCount 파라미터에 true를 입력한 경우에만 응답에 포함됩니다.",
		},
		items: {
			type: "array",
			description: "조회된 데이터의 목록을 나타내는 필드입니다.",
			items,
		},
	},
});

export const DailyStats: OpenAPIV3.SchemaObject = {
	type: "object",
	required: ["date", "count"],
	properties: {
		date: {
			type: "string",
			description: "날짜를 나타내는 필드입니다. YYYY-MM-DD 형식으로 제공됩니다. (e.g., 2021-01-01)",
			pattern: Patterns.date.yyyymmdd.source,
		},
		count: {
			type: "integer",
			description: "날짜별 거래 수를 나타내는 필드입니다.",
		},
	},
};

export const HourlyStats: OpenAPIV3.SchemaObject = {
	type: "object",
	required: ["date", "count"],
	properties: {
		date: {
			type: "string",
			description: "날짜와 시간을 나타내는 필드입니다. YYYY-MM-DD-HH 형식으로 제공됩니다. (e.g., 2021-01-01-00)",
			pattern: Patterns.date.yyyymmddhh.source,
		},
		count: {
			type: "integer",
			description: "시간별 거래 수를 나타내는 필드입니다.",
		},
	},
};
