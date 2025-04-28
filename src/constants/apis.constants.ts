export const API_KEY = {
	NODIT_DOCS_DEMO: "nodit-demo",
};

export const API_VERSION = {
	NODIT: "v1",
	APTOS: "v1",
};

export const BASE_URL = {
	WEB3_DATA_API: "https://web3.nodit.io/v1",
	NODE_API: (protocol: string) => `https://{${protocol}-network}.nodit.io`,
	// NODE_API: "https://{protocol-network}.nodit.io",
	NODE_API_WSS: "wss://{protocol-network}.nodit.io",
};

export const PAGE_LIMITS = {
	MIN: 1,
	MAX: 100,
};

export const RPP_LIMITS = {
	MIN: 1,
	MAX: 1000,
};

export const DEFAULTS = {
	PAGE: 1,
	RPP: 20,
};

export const INPUT_LIMITS = {
	ITEM_MAX: 100,
};

export const CATEGORIES = {
	WEB3_DATA_API: "Web3 Data API",
	STREAM: "Event Stream",
	NODE_API: "Node API",
};
