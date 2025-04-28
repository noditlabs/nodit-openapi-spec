export function protocolNetwork(protocol: string, example: string, list: string[]) {
	return {
		[`${protocol}-network`]: {
			default: example,
			enum: list,
			// description: "조회 대상 체인의 프로토콜과 네트워크를 지정합니다.",
		},
	};
}
