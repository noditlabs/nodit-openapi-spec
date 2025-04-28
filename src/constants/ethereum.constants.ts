export const ERC20 = {
	USDT: {
		CONTRACT_ADDRESS: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
		ABI: `[{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[],"name":"Pause","type":"event"},{"anonymous":false,"inputs":[],"name":"Unpause","type":"event"}]`,
	},
	USDC: {
		CONTRACT_ADDRESS: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
	},
};

export const ERC721 = {
	BAYC: {
		CONTRACT_ADDRESS: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
	},
	MAYC: {
		CONTRACT_ADDRESS: "0x60E4d786628Fea6478F785A6d7e704777c86a7c6",
	},
};

export const ERC1155 = {
	RARE_PEPE: {
		CONTRACT_ADDRESS: "0x7E6027a6A84fC1F6Db6782c523EFe62c923e46ff",
		TOKEN_ID: "35454851340381403053777570024400663652390298901786737272698135080385313339362",
	},
};

export const ETHEREUM_ACCOUNTS = {
	VITALIK_BUTERIN: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", // vitalik.eth
	BINANCE: "0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE",
};
