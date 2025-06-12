const Examples = {
	"aptos-createWebhook": {
		subscriptionId: "620",
		description: "Webhook Test",
		protocol: "aptos",
		network: "mainnet",
		eventType: "EVENT",
		notification: {
			webhookUrl: "https://example.com/webhook",
		},
		signingKey: "eff1e...",
		isInstant: false,
		condition: {
			eventType: "0x1::account::CoinRegisterEvent",
			eventAccountAddress: "0x0",
		},
		createdAt: "2025-06-12T05:52:52.038Z",
	},
	createWebhook: {
		subscriptionId: "322",
		description: "Webhook Test",
		protocol: "ETHEREUM",
		network: "MAINNET",
		eventType: "BLOCK_PERIOD",
		notification: {
			webhookUrl: "https://webhook.mock.server/blockperiod",
		},
		signingKey: "c5a4c...",
		isInstant: true,
		condition: {
			period: 3,
		},
		createdAt: "2023-04-21T05:55:12.084Z",
	},
	getWebhook: {
		total: 1,
		rpp: 10,
		page: 1,
		items: [
			{
				subscriptionId: "31",
				description: "test",
				protocol: "ETHEREUM",
				network: "MAINNET",
				subscriptionType: "WEBHOOK",
				eventType: "BLOCK_PERIOD",
				notification: {
					webhookUrl: "https://webhook.mock.server/blockperiod",
				},
				isActive: true,
				isInstant: true,
				updatedAt: "2023-04-21T09:40:49.678Z",
				createdAt: "2023-04-21T09:40:49.678Z",
				condition: {
					period: 1,
				},
			},
		],
	},
	"aptos-updateWebhook": {
		result: true,
	},
	updateWebhook: {
		result: true,
	},
	deleteWebhook: {
		result: true,
	},
	getWebhookHistory: {
		total: 146779,
		rpp: 2,
		page: 1,
		items: [
			{
				id: "1596",
				subscriptionId: "103524",
				sequenceNumber: "20",
				status: "FAIL",
				updatedAt: "2024-12-13T02:06:09.000Z",
				createdAt: "2024-12-13T02:06:07.000Z",
				eventMessage: {
					subscriptionId: "103524",
					sequenceNumber: "20",
					eventType: "EVENT",
					network: "MAINNET",
					protocol: "APTOS",
					event: {
						eventType: "0x1::block::NewBlockEvent",
						eventAccountAddress: null,
						payloadFunction: null,
						messages: [
							[
								{
									guid: {
										creation_number: "3",
										account_address: "0x0000000000000000000000000000000000000000000000000000000000000001",
									},
									sequence_number: "264073031",
									type: "0x1::block::NewBlockEvent",
									data: {
										epoch: "9559",
										failed_proposer_indices: [],
										hash: "0x7d360d5e499d93eb87ca34fe3f8f18eab602cb8d365e402da750b7e6c5786c4d",
										height: "264073031",
										previous_block_votes_bitvec: "0x177fffef57fbbf7ff63c15cfef4679a1bb79d8",
										proposer: "0xa651c7c52d64a2014379902bbc92439d196499bcc36d94ff0395aa45837c66db",
										round: "13485",
										time_microseconds: "1734048334428800",
									},
								},
							],
						],
					},
				},
			},
			{
				id: "1597",
				subscriptionId: "103524",
				sequenceNumber: "21",
				status: "FAIL",
				updatedAt: "2024-12-13T02:26:29.000Z",
				createdAt: "2024-12-13T02:26:28.000Z",
				eventMessage: {
					subscriptionId: "103524",
					sequenceNumber: "21",
					eventType: "EVENT",
					network: "MAINNET",
					protocol: "APTOS",
					event: {
						eventType: "0x1::block::NewBlockEvent",
						eventAccountAddress: null,
						payloadFunction: null,
						messages: [
							[
								{
									guid: {
										creation_number: "3",
										account_address: "0x0000000000000000000000000000000000000000000000000000000000000001",
									},
									sequence_number: "264073128",
									type: "0x1::block::NewBlockEvent",
									data: {
										epoch: "9559",
										failed_proposer_indices: [],
										hash: "0x53570fbecfb44c723c2db3bac968d467bd4d4a8185a383b094f7578c4a3f014",
										height: "264073128",
										previous_block_votes_bitvec: "0x7f048b4a700f7259fff3fafb9dc89141c2ddfc",
										proposer: "0x6d00d52f94579e51308ae83841b5133e3a7e93b51fcd8cf338d766e3f0331026",
										round: "13582",
										time_microseconds: "1734048354656343",
									},
								},
							],
						],
					},
				},
			},
		],
	},
};

export default Examples;
