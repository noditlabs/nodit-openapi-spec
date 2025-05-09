import { OpenAPIV3 } from "openapi-types";

interface Success200Interface {
	(option: OpenAPIV3.MediaTypeObject): OpenAPIV3.ResponseObject;
}

namespace Responses {
	/* Success Response Objects */
	export const Success200: Success200Interface = (option) => ({
		description: "Successful Response",
		content: {
			"application/json": option,
		},
	});
	export const Success201: Success200Interface = (option) => ({
		description: "Created",
		content: {
			"application/json": option,
		},
	});

	/* Error Response Objects */
	export const Error400: OpenAPIV3.ResponseObject = {
		description: "Bad Request",
		content: {
			"application/json": {
				schema: {
					type: "object",
					properties: {
						code: {
							type: "string",
						},
						message: {
							type: "string",
						},
					},
					example: {
						code: "INVALID_PARAMETER",
						message:
							"Invalid parameter: { PARAMETER1_NAME = PARAMETER1_VALUE, PARAMETER2_NAME = PARAMETER2_VALUE, ... }",
					},
				},
			},
		},
	};

	export const Error401: OpenAPIV3.ResponseObject = {
		description: "Unauthorized",
		content: {
			"application/json": {
				schema: {
					type: "object",
					properties: {
						code: {
							type: "string",
						},
						message: {
							type: "string",
						},
					},
					example: {
						code: "AUTHENTICATION_FAILED",
						message: "Authentication failed",
					},
				},
			},
		},
	};

	export const Error403: OpenAPIV3.ResponseObject = {
		description: "Forbidden",
		content: {
			"application/json": {
				schema: {
					type: "object",
					properties: {
						code: {
							type: "string",
						},
						message: {
							type: "string",
						},
					},
					example: {
						code: "PERMISSION_DENIED",
						message: "Permission denied",
					},
				},
			},
		},
	};

	export const Error404: OpenAPIV3.ResponseObject = {
		description: "Not Found",
		content: {
			"application/json": {
				schema: {
					type: "object",
					properties: {
						code: {
							type: "string",
						},
						message: {
							type: "string",
						},
					},
					example: {
						code: "RESOURCE_NOT_FOUND",
						message: "Resource not found: { RESOURCE1_NAME = RESOURCE1_VALUE, RESOURCE2_NAME = RESOURCE2_VALUE, ... }",
					},
				},
			},
		},
	};

	export const Error429: OpenAPIV3.ResponseObject = {
		description: "Too Many Requests",
		content: {
			"application/json": {
				schema: {
					type: "object",
					properties: {
						code: {
							type: "string",
						},
						message: {
							type: "string",
						},
					},
					example: {
						code: "TOO_MANY_REQUESTS",
						message: "Too many requests",
					},
				},
			},
		},
	};

	/* Schemas */
	export const subscriptionId: OpenAPIV3.SchemaObject = {
		type: "string",
		description:
			"Webhook에 할당된 subscriptionId를 나타내는 필드입니다. subscriptionId는 Webhook을 식별하는 유니크한 값으로, Webhook을 조회, 수정 또는 삭제할 때 사용됩니다.",
	};

	export const description: OpenAPIV3.SchemaObject = {
		type: "string",
		description: "Webhook의 설명을 나타내는 필드입니다.",
	};

	export const protocol: OpenAPIV3.SchemaObject = {
		type: "string",
		description: "해당 Webhook의 프로토콜을 나타내는 필드입니다. (e.g., ETHEREUM, POLYGON, OPTIMISM, ...)",
	};

	export const network: OpenAPIV3.SchemaObject = {
		type: "string",
		description: "해당 Webhook의 네트워크를 나타내는 필드입니다. (e.g., MAINNET, SEPOLIA, MUMBAI, ...)",
	};

	export const subscriptionType: OpenAPIV3.SchemaObject = {
		type: "string",
		description: "구독 유형을 식별할 수 있는 필드입니다.",
		example: "WEBHOOK",
	};

	export const eventType: OpenAPIV3.SchemaObject = {
		type: "string",
		description: "해당 Webhook이 구독하는 이벤트 타입을 나타내는 필드입니다.",
	};

	export const notification: OpenAPIV3.SchemaObject = {
		type: "object",
		required: ["webhookUrl"],
		description: "Webhook으로 알림을 받기 위한 정보를 나타내는 필드입니다.",
		properties: {
			webhookUrl: {
				type: "string",
				description: "Webhook으로 알림을 받을 URL을 나타내는 필드입니다.",
			},
		},
	};

	export const signingKey: OpenAPIV3.SchemaObject = {
		type: "string",
		description:
			"Webhook 알림의 인증을 위한 서명 키를 나타내는 필드입니다. Webhook 알림을 수신한 후 서명 키를 사용하여 알림의 유효성을 검증할 수 있습니다. 서명 키는 Webhook 생성 시 자동으로 생성되며, Webhook 수정 시 변경할 수 없습니다.",
	};

	export const condition: OpenAPIV3.SchemaObject = {
		type: "object",
		description: "Webhook 구독 조건을 나타내는 필드입니다. 이벤트 타입에 따라 다른 조건을 가질 수 있습니다.",
	};

	export const isActive: OpenAPIV3.SchemaObject = {
		type: "boolean",
		description:
			"Webhook의 활성화 여부를 나타내는 필드입니다. Webhook이 활성화되어 있으면 true, 비활성화되어 있으면 false입니다. Webhook이 비활성화되어 있으면 해당 Webhook으로 알림을 받을 수 없습니다.",
	};

	export const createdAt: OpenAPIV3.SchemaObject = {
		type: "string",
		description: "웹훅 이벤트가 발생하고 로그가 생성된 시점을 나타냅니다. 이 필드는 ISO 8601 형식으로 반환됩니다.",
	};

	export const updatedAt: OpenAPIV3.SchemaObject = {
		type: "string",
		description:
			"웹훅 전송 결과(status)에 변화가 생긴 시점을 나타냅니다. 예를 들어, 실패 후 재시도되어 성공으로 변경된 경우 등이 해당됩니다. 이 필드는 ISO 8601 형식으로 반환됩니다.",
	};

	export const result: OpenAPIV3.SchemaObject = {
		type: "boolean",
		description: "호출 결과를 나타내는 필드입니다. 성공 시 true, 실패 시 false를 반환합니다.",
	};

	export const total: OpenAPIV3.SchemaObject = {
		type: "number",
		description: "조건에 맞는 총 이벤트 개수입니다.",
	};

	export const rpp: OpenAPIV3.SchemaObject = {
		type: "number",
		description: "요청에 따라 반환된 한 페이지당 이벤트 수입니다.",
	};

	export const page: OpenAPIV3.SchemaObject = {
		type: "number",
		description: "현재 조회된 페이지 번호입니다.",
	};

	export const items: (item: OpenAPIV3.SchemaObject) => OpenAPIV3.SchemaObject = (item) => ({
		type: "array",
		description: "이벤트 상세 데이터를 포함하는 배열입니다.",
		items: item,
	});
}

export default Responses;
