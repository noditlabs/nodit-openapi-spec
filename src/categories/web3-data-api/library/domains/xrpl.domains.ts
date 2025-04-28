import { OpenAPIV3 } from "openapi-types";

export const Ledger: OpenAPIV3.SchemaObject = {
	type: "object",
	required: [
		"ledgerHash",
		"ledgerIndex",
		"ledgerIndex",
		"ledgerTimestamp",
		"parentLedgerHash",
		"accountHash",
		"totalCoins",
		"transactionHash",
		"transactionCount",
		"transactions",
	],
	properties: {
		ledgerHash: {
			type: "string",
			description:
				"현재 Ledger의 고유 식별 값으로, 256비트(64자리 16진수) 암호화 해시값입니다. Ledger의 데이터 무결성 검증 및 식별에 사용됩니다.",
			example: "655EB9D740CC572BFFEC725ABB0AA0D813AAF01C91F8577076F29258794D9445",
		},
		ledgerIndex: {
			type: "integer",
			description:
				"Ledger의 생성 순서를 나타내는 정수값으로, 네트워크 상에서 해당 Ledger의 위치(시퀀스 번호)를 확인하는 데 사용됩니다.",
			example: 95444296,
		},
		ledgerTimestamp: {
			type: "integer",
			description:
				"Ledger의 close time을 실제 Unix 타임스탬프로 변환한 값입니다. Ledger header에 기록된 close time은 Ripple Epoch(2000년 1월 1일 00:00 UTC)부터 경과한 초 단위로 표현되며, Unix Epoch(1970년 1월 1일 00:00 UTC) 기준과는 946,684,800초의 차이가 있습니다. 따라서 ledgerTimestamp는 기록된 close time에 946,684,800초를 더해 변환한 Unix 타임스탬프입니다.",
			example: 1744608171,
		},
		parentLedgerHash: {
			type: "string",
			description:
				"현재 Ledger의 직전 Ledger를 식별하는 256비트(64자리 16진수) 해시값입니다. 체인 구조의 무결성 유지를 위해 이전 Ledger의 해시값을 참조합니다.",
			example: "45E963AA7A3BB017D626D088C91E6C646B6BBF558DD027AAD974CBBE9A3977D3",
		},
		accountHash: {
			type: "string",
			description:
				"Ledger에 기록된 모든 계정 상태 정보를 요약한 256비트(64자리 16진수) 해시값입니다. 계정 데이터의 일관성과 무결성을 검증하는 데 활용됩니다.",
			example: "43DA3A81948A7392D14E4DDFB8215372C4B0590E3B28691C599296E4478B12AC",
		},
		totalCoins: {
			type: "string",
			description:
				"Ledger에 기록된 계정들이 소유한 XRP의 총 수량(XRP 단위)를 나타냅니다. 이 값은 트랜잭션 수수료로 소각된 XRP를 제외한 값이며, 일부 계정이 '블랙홀'(키가 존재하지 않는 계정) 상태이기 때문에 실제 유통 중인 XRP의 수는 이 값보다 더 낮을 수 있습니다.",
			example: "99986231517.566048",
		},
		transactionHash: {
			type: "string",
			description:
				"Ledger 내 포함된 모든 트랜잭션 데이터를 요약한 256비트(64자리 16진수) Merkle tree 루트 해시값입니다. 트랜잭션 내역의 무결성 검증에 사용됩니다.",
			example: "8BAD7583234AC463E09D6CF160E352DFF5B008FC071DD5226A53809D89E7F409",
		},
		transactionCount: {
			type: "integer",
			description:
				"Ledger에 포함된 트랜잭션의 총 개수를 나타내는 정수값입니다. Ledger 내 트랜잭션 내역의 규모 및 활성도를 파악하는 데 활용됩니다.",
			example: 40,
		},
		transactions: {
			type: "array",
			description:
				"Ledger에 포함된 트랜잭션의 해시값들의 배열입니다. 각 해시값은 트랜잭션을 고유하게 식별하는 256비트(64자리 16진수) 암호화 해시값이며, 트랜잭션 데이터의 무결성 및 식별에 사용됩니다.",
			example: [
				"044CD9B107E209F24F5342393F34493E7AFE99AE6F5051F2D75E186F07E1EAE8",
				"0D1DDF6974EA31918EB531F9212FC76BC47BCE9193839496474010D133C0BB1E",
				"1069423CDB7F19E082E6F418C779B19A0126B593832016D134A679EFB752CF0A",
			],
			items: {
				type: "string",
			},
		},
	},
};

export const Signer: OpenAPIV3.SchemaObject = {
	type: "object",
	required: ["account", "txnSignature", "signingPubKey"],
	properties: {
		account: {
			type: "string",
			description:
				"트랜잭션에 서명한 계정 주소입니다. 계정 주소는 25~35자리 길이의 Base58 인코딩 문자열로, 'r'로 시작하는 형식을 가집니다.",
			example: "ra88Lr8fyo9cUTuyjVFMTrvTSBU93erjyh",
		},
		txnSignature: {
			type: "string",
			description:
				"해당 서명 계정이 생성한 트랜잭션 서명 값으로, 트랜잭션의 유효성 검증에 사용됩니다. 이 서명은 DER 형식으로 인코딩되어 있으며, 길이는 가변적이나 보통 70~80자리의 16진수 문자열입니다.",
			example:
				"3044022061BFBBFF27890E13EB1B5B106042AF497FC57846B31CE633A5AD6B5C8736DDFF0220153FA9C62AAC532120F9CBCCED44A680D233DF96204E7CC3C3820E4C887006AC",
		},
		signingPubKey: {
			type: "string",
			description:
				"트랜잭션 서명에 사용된 공개키로, 보통 33바이트 압축 공개키를 16진수 문자열(약 66자리)로 표현합니다.",
			example: "02ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF12345678",
		},
	},
};

export const Memo: OpenAPIV3.SchemaObject = {
	type: "object",
	required: [],
	properties: {
		memoData: {
			type: "string",
			description: "메모의 내용을 포함하는 임의의 16진수 문자열입니다. 자유롭게 입력할 수 있습니다.",
			example: "72656e6577206d656d6f",
		},
		memoFormat: {
			type: "string",
			description: "메모의 인코딩 방식을 설명하는 16진수 문자열입니다. 일반적으로 MIME 타입을 지정하는 데 사용됩니다.",
			example: "746578742f706c61696e",
		},
		memoType: {
			type: "string",
			description:
				"메모의 유형을 설명하는 16진수 문자열입니다. 일반적으로 RFC 5988에 정의된 URL과 같은 고유한 관계를 나타냅니다.",
			example: "68747470733a2f2f6578616d706c652e636f6d",
		},
	},
};

export const Asset: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		currency: {
			type: "string",
			description: `자산의 통화 코드를 나타냅니다. 일반적으로 ISO 4217 표준 코드(예: "USD", "EUR")를 사용하지만, 필요에 따라 160비트 커스텀 코드도 사용할 수 있습니다. 커스텀 코드는 40자리 길이의 16진수 문자열로 표현되며, 특정 프로젝트나 플랫폼에서 정의한 독자적인 자산(예: "SOLO")을 나타낼 때 사용됩니다. 한편, XRP의 경우에는 "XRP"라는 고정된 문자열이 currency 필드에 사용되며, IOU 자산과 동일한 구조로 반환됩니다. `,
			example: "USD",
		},
		issuer: {
			type: "string",
			description: `자산을 발행한 계정의 주소입니다. 동일한 통화 코드(currency)라 하더라도, 발행자에 따라 자산의 신뢰도와 위험성이 달라질 수 있습니다. 따라서 XRP Ledger에서는 통화 코드와 발행자(issuer)의 조합으로 자산을 고유하게 식별합니다. 각 자산의 신뢰성은 발행자의 평판에 크게 좌우됩니다. 이 필드는 25~35자리 길이의 Base58 인코딩 문자열이며, 항상 'r'로 시작합니다. 단, XRP는 네이티브 자산이므로 발행자가 없으며, 이 경우 issuer는 빈 문자열("")로 표시됩니다.`,
			example: "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
		},
	},
};

export const Amount: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		currency: {
			type: "string",
			description: `자산의 통화 코드를 나타냅니다. 일반적으로 ISO 4217 표준 코드(예: "USD", "EUR")를 사용하지만, 필요에 따라 160비트 커스텀 코드도 사용할 수 있습니다. 커스텀 코드는 40자리 길이의 16진수 문자열로 표현되며, 특정 프로젝트나 플랫폼에서 정의한 독자적인 자산(예: "SOLO")을 나타낼 때 사용됩니다. 한편, XRP의 경우에는 "XRP"라는 고정된 문자열이 currency 필드에 사용되며, IOU 자산과 동일한 구조로 반환됩니다. `,
			example: "USD",
		},
		issuer: {
			type: "string",
			description: `자산을 발행한 계정의 주소입니다. 동일한 통화 코드(currency)라 하더라도, 발행자에 따라 자산의 신뢰도와 위험성이 달라질 수 있습니다. 따라서 XRP Ledger에서는 통화 코드와 발행자(issuer)의 조합으로 자산을 고유하게 식별합니다. 각 자산의 신뢰성은 발행자의 평판에 크게 좌우됩니다. 이 필드는 25~35자리 길이의 Base58 인코딩 문자열이며, 항상 'r'로 시작합니다. 단, XRP는 네이티브 자산이므로 발행자가 없으며, 이 경우 issuer는 빈 문자열("")로 표시됩니다.`,
			example: "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
		},
		value: {
			type: "string",
			description: `자산의 수량을 문자열(string) 형태로 반환합니다. 수량 표현 방식은 currency 값에 따라 달라집니다. currency가 "XRP"인 경우, 이 값은 표준 XRP 단위로 표기되며, 1 XRP는 1,000,000 drop에 해당합니다. IOU 자산의 경우에도 발행자가 정의한 정밀도(precision)를 기반으로 표현됩니다.`,
			example: "100.5",
		},
	},
};

export const PathSet: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		account: {
			type: "string",
			description:
				"경로 내에서 자산을 중계하는 계정 주소입니다. 중개 계정이 지정된 경우, 해당 계정은 이전 단계에서 받은 자산을 다음 단계로 전달할 수 있어야 하며, 신뢰라인이 존재해야 합니다.",
			example: "ra88Lr8fyo9cUTuyjVFMTrvTSBU93erjyh",
		},
		currency: {
			type: "string",
			description: `해당 단계에서 사용되는 자산의 통화 코드입니다. 일반적으로 ISO 4217 코드(예: "USD") 또는 40자리 16진수 커스텀 코드입니다. XRP인 경우에도 "XRP"라는 문자열로 제공됩니다.`,
			example: "USD",
		},
		issuer: {
			type: "string",
			description: `자산을 발행한 계정 주소입니다. IOU 자산일 경우 해당 통화를 발행한 계정이 포함됩니다. XRP는 네이티브 자산이므로 발행자가 없으며, 이 경우 issuer는 빈 문자열("")로 반환됩니다.`,
			example: "ra88Lr8fyo9cUTuyjVFMTrvTSBU93erjyh",
		},
		type: {
			type: "integer",
			description:
				"이 단계(path step)의 구조를 비트 플래그로 표현한 값입니다. 각 비트는 해당 단계에 어떤 필드(account, currency, issuer)가 포함되어 있는지를 나타냅니다. 현재는 deprecated 되었으며, 공식 문서에서도 더 이상 사용되지 않습니다.",
			example: 16,
		},
		typeHex: {
			type: "string",
			description:
				"type 값을 16진수로 표현한 문자열입니다. 해석 방식은 type과 동일하며, 마찬가지로 deprecated된 필드입니다. 현재는 각 필드(account, currency, issuer)를 명시적으로 포함하는 방식으로 대체되었습니다.",
			example: "0x01",
		},
	},
};

export const TransactionDetails: OpenAPIV3.SchemaObject = {
	type: "object",
	oneOf: [
		{
			title: "AMM",
			properties: {
				asset: {
					...Asset,
					description:
						"AMM 풀에서 사용되는 첫 번째 자산을 나타냅니다. Asset2와 함께 구성되며, 같은 통화 코드와 발행자를 가질 수 없습니다.",
				},
				asset2: {
					...Asset,
					description:
						"AMM 풀에서 사용되는 두 번째 자산을 나타냅니다. Asset과 함께 구성되며, 같은 통화 코드와 발행자를 가질 수 없습니다.",
				},
				amount: {
					...Amount,
					description:
						"AMM 풀에 추가되는 첫 번째 자산의 양을 나타냅니다. AMMWithdraw에서는 인출할 첫 번째 자산을 나타냅니다.",
				},
				amount2: {
					...Amount,
					description:
						"AMM 풀에 추가되는 두 번째 자산의 양을 나타냅니다. AMMWithdraw에서는 인출할 두 번째 자산을 나타냅니다.",
				},
				tradingFee: {
					type: "integer",
					description: "1/100,000 단위로 설정되는 거래 수수료 비율을 나타냅니다. 1은 0.001%, 최대값은 1000(1%)입니다.",
					example: 250,
				},
				effectivePrice: {
					...Amount,
					description: "AMMDeposit에서 유효한 최대 가격을 설정합니다. AMMWithdraw에서는 최소 보장 가격을 설정합니다.",
				},
				lpTokenIn: {
					...Amount,
					description: "AMM 풀에서 반환하는 LP 토큰의 수량을 나타냅니다.",
				},
				lpTokenOut: {
					...Amount,
					description: "AMM 풀에 유동성을 공급한 대가로 발행되는 LP 토큰의 수량을 나타냅니다.",
				},
				bidMin: {
					...Amount,
					description:
						"최소 입찰 금액을 설정합니다. 이 값을 높게 설정하면 다른 사용자가 더 높은 입찰가를 제시하기 어렵습니다.",
				},
				bidMax: {
					...Amount,
					description: "최대 입찰 금액을 설정합니다. 입찰 금액이 bidMax를 초과하면 트랜잭션이 실패합니다.",
				},
				authAccounts: {
					type: "array",
					description:
						"할인된 수수료를 적용할 수 있는 최대 4개의 추가 계정을 정의합니다. 이 목록에는 트랜잭션 발신자의 주소를 포함할 수 없습니다. 각 계정 주소는 25~35자리 길이의 Base58 인코딩 문자열로, 'r'로 시작하는 형식을 가집니다.",
					items: {
						type: "string",
					},
					example: ["rEqFohwoXqGFVik15uqF5nBdzfd5qEFh1X", "rBTwLga3i2gz3doX6Gva3MgEV8ZCD8jjah"],
				},
				holder: {
					type: "string",
					description:
						"AMMClawback 트랜잭션에서 회수 대상이 되는 계정 주소를 나타냅니다. 이는 AMM 풀 내 특정 자산을 보유하고 있는 계정으로, 발행자가 해당 계정에서 자산을 회수할 수 있도록 지정됩니다.",
					example: "rBTwLga3i2gz3doX6Gva3MgEV8ZCD8jjah",
				},
			},
		},
		{
			title: "Check",
			properties: {
				destination: {
					type: "string",
					description:
						"수표의 수취인 계정 주소가 표시됩니다. 주소는 Base58로 인코딩된 문자열이며, 항상 'r'로 시작하고 25~35자의 길이를 가집니다.",
					example: "rBTwLga3i2gz3doX6Gva3MgEV8ZCD8jjah",
				},
				sendMax: {
					...Amount,
					description:
						"수표 발행자가 해당 수표를 통해 송금할 수 있도록 설정한 최대 자산 수량입니다. 수취인은 이 값과 동일한 통화 및 발행자의 자산만 받을 수 있으며, 수수료를 포함한 총 금액은 이 값을 초과할 수 없습니다.",
				},
				destinationTag: {
					type: "integer",
					description:
						"수신자 계정 내에서 특정 사용자를 식별하기 위한 태그입니다. 거래소, 호스팅 지갑 등 여러 사용자가 하나의 주소를 공유할 때 사용됩니다.",
					example: 1337,
				},
				expiration: {
					type: "integer",
					description:
						"수표의 만료 시간이 초 단위 정수로 표시됩니다. 이 값은 Ripple Epoch(2000년 1월 1일 00:00 UTC)를 기준으로 경과한 시간이며, 실제 Unix 타임스탬프로 변환하려면 여기에 946,684,800초를 더해야 합니다. 수표는 만료 시간 이후에는 사용할 수 없습니다.",
					example: 673094400,
				},
				invoiceId: {
					type: "string",
					description:
						"이 수표와 관련된 외부 거래나 청구서를 식별하기 위해 사용되는 256비트 해시값(64자리 16진수 문자열)입니다. 응답에 포함될 경우, 수표가 특정 외부 요청과 연결되어 있음을 나타냅니다.",
					example: "6F1DFD1D0FE8A32E40E1F2C05CF1C15545BAB56B617F9C6C2D63A6B704BEF59B",
				},
				amount: {
					...Amount,
					description:
						"수표를 현금화할 때 실제로 적용된 자산의 수량이 표시됩니다. 이 값은 수표의 sendMax 필드와 동일한 자산 코드 및 발행자를 가져야 하며, 그 범위 내에서 정해집니다. CheckCash 트랜잭션에서는 amount 또는 deliverMin 중 하나만 포함되며, 두 필드가 동시에 존재할 수는 없습니다.",
				},
				deliverMin: {
					...Amount,
					description:
						"수취인이 수령한 최소 보장 자산 수량이 표시됩니다. CheckCash 트랜잭션에서 가능한 최대한 많은 금액을 수령하는 방식에서 사용되며, amount 필드와는 상호 배타적으로, 두 필드를 함께 포함할 수 없습니다. CheckCash 트랜잭션에서는 deliverMin 또는 amount 중 하나만 포함되며, 두 필드는 동시에 포함되지 않습니다.",
				},
				checkId: {
					type: "string",
					description:
						"해당 수표의 고유 ID가 64자리 16진수 문자열로 표시됩니다. 수표를 취소하거나 현금화할 때 이 값을 참조합니다.",
					example: "49647F0D748DC3FE26BDACBC57F251AADEFFF391403EC9BF87C97F67E9977FB0",
				},
			},
		},
		{
			title: "Escrow",
			properties: {
				amount: {
					...Amount,
					description:
						"에스크로(Escrow)에 예치된 자산의 수량이 표시됩니다. 이 값은 송금자의 계정에서 차감되며, 설정된 조건을 만족하면 수령인에게 지급됩니다.",
				},
				destination: {
					type: "string",
					description:
						"에스크로 자산을 수령할 계정 주소가 표시됩니다. 주소는 Base58로 인코딩되며 'r'로 시작하고, 길이는 25~35자입니다.",
					example: "rBTwLga3i2gz3doX6Gva3MgEV8ZCD8jjah",
				},
				cancelAfter: {
					type: "integer",
					description:
						"에스크로가 만료되는 시간이 초 단위로 표시됩니다. 해당 시간이 경과하면 EscrowCancel 트랜잭션을 통해 자금을 송금자에게 반환할 수 있습니다. 이 값은 Ripple Epoch(2000년 1월 1일 00:00 UTC) 기준이며, Unix 시간으로 변환하려면 946,684,800초를 더해야 합니다.",
					example: 533257958,
				},
				finishAfter: {
					type: "integer",
					description:
						"수령인이 에스크로 자산을 수령할 수 있는 최소 시간이 초 단위로 표시됩니다. 이 시간이 지나야 EscrowFinish 트랜잭션을 실행할 수 있습니다. cancelAfter와 마찬가지로 Ripple Epoch 기준 시간입니다.",
					example: 533171558,
				},
				destinationTag: {
					type: "integer",
					description:
						"수신자 계정 내에서 특정 사용자를 식별하기 위한 태그입니다. 거래소, 호스팅 지갑 등 여러 사용자가 하나의 주소를 공유할 때 사용됩니다.",
					example: 23480,
				},
				condition: {
					type: "string",
					description:
						"PREIMAGE-SHA-256 조건에 기반한 해시 값입니다. 이 값은 에스크로 자금을 수령하기 위해 제공해야 하는 fulfillment 값과 연관되며, EscrowFinish 시 조건이 충족되지 않으면 수령할 수 없습니다.",
					example: "A0258020E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855810100",
				},
				fulfillment: {
					type: "string",
					description:
						"condition 필드에 설정된 해시 조건을 충족하는 원본 데이터(preimage)가 표시됩니다. 이 값은 EscrowFinish 트랜잭션에 포함되어야 하며, 해당 조건이 충족될 경우 자금 수령이 가능합니다.",
					example: "A0028000",
				},
				owner: {
					type: "string",
					description:
						"에스크로(Escrow)를 생성한 계정 주소가 표시됩니다. 주소는 25~35자리 길이의 Base58 인코딩 문자열로, 'r'로 시작하는 형식을 가집니다.",
					example: "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
				},
				offerSequence: {
					type: "integer",
					description:
						"에스크로를 식별하기 위해 사용되는 시퀀스 번호입니다. 이 값은 해당 에스크로를 생성한 EscrowCreate 트랜잭션의 계정 시퀀스(AccountSequence)를 기준으로 합니다.",
					example: 7,
				},
			},
		},
		{
			title: "Offer",
			properties: {
				takerPays: {
					...Amount,
					description:
						"오퍼를 통해 구매자가 지불하기로 제안한 자산의 수량이 표시됩니다. 오퍼 작성자는 이 필드를 통해 지불 대상 자산(구매 측면)을 명시하며, 이는 상대방이 받을 자산에 해당합니다.",
				},
				takerGets: {
					...Amount,
					description:
						"오퍼를 통해 구매자가 수령하고자 제안한 자산의 수량이 표시됩니다. 오퍼 작성자는 이 필드를 통해 얻고자 하는 자산(판매 측면)을 명시하며, 이는 상대방이 제공할 자산에 해당합니다.",
				},
				expiration: {
					type: "integer",
					description:
						"오퍼가 만료되는 시간이 초 단위 정수로 표시됩니다. 이 값은 Ripple Epoch(2000년 1월 1일 00:00 UTC)를 기준으로 하며, Unix 타임스탬프로 변환하려면 946,684,800초를 더해야 합니다. 만료 시간이 경과하면 해당 오퍼는 자동으로 무효 처리됩니다.",
					example: 673094400,
				},
				offerSequence: {
					type: "integer",
					description:
						"오퍼를 식별하기 위한 고유 기준인 시퀀스 번호가 표시됩니다. OfferCancel 트랜잭션에서는 이 값을 사용해 취소할 오퍼를 지정하며, OfferCreate 트랜잭션에서는 동일 계정의 이전 오퍼를 덮어쓰기(overwrite) 하는 용도로 사용될 수 있습니다.",
					example: 1024,
				},
			},
		},
		{
			title: "Payment",
			required: ["amount", "deliverMax", "deliveredAmount", "destination"],
			properties: {
				amount: {
					...Amount,
					description:
						"송신자가 수신자에게 전달하고자 한 자산의 수량이 표시됩니다. 이 값은 요청된 송금 금액이며, 실제 수령 금액은 이보다 작을 수 있습니다. 부분 결제가 발생한 경우, deliveredAmount와 차이가 날 수 있습니다.",
				},
				deliverMax: {
					...Amount,
					description:
						"트랜잭션 처리 시 사용된 송금 상한선이 표시됩니다. 경유 수수료나 환율 조건을 고려한 금액이며, amount와 동일한 경우도 많지만 내부 처리 결과에 따라 달라질 수 있습니다.",
				},
				deliverMin: {
					...Amount,
					description:
						"부분 결제가 허용된 경우, 수신자가 반드시 수령해야 하는 최소 자산 수량입니다. 이보다 적은 금액이 도달하면 트랜잭션은 실패합니다.",
				},
				destinationAmount: {
					...Amount,
					description: `실제로 수신자에게 전달된 자산 수량입니다. 부분 결제가 발생한 경우 amount보다 작을 수 있으며, 과거 원장(2014-01-20 이전)에서는 "unavailable" 값으로 표시될 수 있습니다.`,
				},
				destination: {
					type: "string",
					description:
						"결제를 수신한 계정 주소입니다. Base58 인코딩 형식이며, 항상 'r'로 시작하고 25~35자의 길이를 가집니다.",
					example: "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
				},
				destinationTag: {
					type: "integer",
					description:
						"수신자에게 추가적인 정보를 제공하는 태그입니다. 특정 서비스 또는 호스팅된 수신자를 식별하는 데 사용할 수 있습니다.",
					example: 23480,
				},
				invoiceId: {
					type: "string",
					description:
						"수신자 계정 내에서 특정 사용자를 식별하기 위한 태그입니다. 거래소, 호스팅 지갑 등 여러 사용자가 하나의 주소를 공유할 때 사용됩니다.",
					example: "F8D38C1E27FADF5F5ED1C19B0ACED3B8",
				},
				paths: {
					type: "array",
					description: `이 결제에 사용된 경유 경로(PathSet) 정보입니다. 경유 계정, 거래쌍 등이 포함되며, "XRP → XRP" 결제에서는 생략됩니다.`,
					items: {
						type: "array",
						items: PathSet,
					},
					example: [[{ account: "rNyMZc18D4yRonb2D9MCjhcHxn8yx9gr31", type: 1 }]],
				},
				sendMax: {
					...Amount,
					description:
						"송신자가 결제를 위해 지불할 수 있는 최대 자산 수량입니다. 환전 수수료, 경유 비용 등을 포함할 수 있으며, 트랜잭션 수수료(XRP 소각)는 포함되지 않습니다. “XRP → XRP” 결제에서는 사용되지 않습니다.",
				},
				credentialIds: {
					type: "array",
					description:
						"트랜잭션 승인을 위해 참조된 Credential 엔트리들의 원장 ID 목록입니다. 이 필드는 Credentials 개정(Amendment)이 활성화된 네트워크에서만 포함됩니다.",
					items: {
						type: "string",
					},
					example: ["E3B0C44298FC1C149AFBF4C8996FB924"],
				},
			},
		},
		{
			title: "Payment Channel",
			properties: {
				amount: {
					...Amount,
					description:
						"PaymentChannelCreate 시 예치할 금액, PaymentChannelFund 시 추가 자금, PaymentChannelClaim 시 청구 요청 금액을 나타냅니다. 모든 경우 XRP 단위로 표시되며, 1 XRP는 1,000,000 drop에 해당합니다.",
				},
				destination: {
					type: "string",
					description:
						"채널의 수신자 주소입니다. 채널을 통해 전송된 XRP는 이 주소로만 보낼 수 있습니다. 계정 주소는 25~35자리 길이의 Base58 인코딩 문자열로, 'r'로 시작하는 형식을 가집니다.",
					example: "rD1D3nQ13NjqXUuP3oqdeP1upvPr2iXZxV",
				},
				settleDelay: {
					type: "integer",
					description: `채널 소유자가 채널을 닫기 전에 대기해야 하는 최소 시간(초)입니다.

이 필드는 Ripple Epoch(2000년 1월 1일 00:00 UTC)부터 경과한 시간을 초 단위로 나타냅니다. 실제 Unix 타임스탬프로 변환하려면 이 값에 946,684,800초를 더해야 합니다.`,
					example: 86400,
				},
				publicKey: {
					type: "string",
					description:
						"채널에 대한 서명을 생성할 때 사용된 공개 키입니다. PaymentChannelClaim에서 서명 검증을 위해 사용됩니다.",
					example: "32D2471DB72B27E3310F355BB33E339BF26F8392D5A93D3BC0FC3B566612DA0F0A",
				},
				cancelAfter: {
					type: "integer",
					description: `채널이 만료되는 시간입니다. 이 시간이 지나면 해당 채널은 자동으로 닫히며 더 이상 사용할 수 없습니다. cancelAfter 값은 변경할 수 없으며, 설정된 시간보다 채널을 일찍 닫을 수는 있지만, 이 시간이 지나면 반드시 채널이 닫혀야 합니다.

이 필드는 Ripple Epoch(2000년 1월 1일 00:00 UTC)부터 경과한 시간을 초 단위로 나타냅니다. 실제 Unix 타임스탬프로 변환하려면 이 값에 946,684,800초를 더해야 합니다.`,
					example: 712345678,
				},
				destinationTag: {
					type: "integer",
					description:
						"수신자 주소 내에서 특정 사용자를 식별하기 위한 태그입니다. 거래소나 다중 사용자 환경에서 사용됩니다.",
					example: 23480,
				},
				credentialIds: {
					type: "array",
					description:
						"채널 청구 요청을 승인하기 위해 사용된 Credential 원장 항목의 ID 목록입니다. Credential Amendment가 활성화된 네트워크에서만 사용됩니다.",
					items: {
						type: "string",
					},
					example: [
						"1CB67D082CF7D9102412D34258CEDB400E659352D3B207348889297A6D90F5EF",
						"1562511F573A19AE9BD103B5D6B9E01B3B46805AEC5D3C4805C902B514399146",
					],
				},
				channel: {
					type: "string",
					description:
						"채널의 고유 ID를 나타내는 64자리 16진수 문자열입니다. PaymentChannelFund 및 PaymentChannelClaim에서 채널을 지정하는 데 사용됩니다.",
					example: "5DB01B7155F30A68D91B50A1B26A6C6C64D86DBB2282E95F",
				},
				expiration: {
					type: "integer",
					description: `채널의 만료 시점을 나타냅니다. 이 시간이 지나면 해당 채널에 대한 추가 작업은 차단되며 남은 XRP는 원래 소유자에게 반환됩니다.

이 필드는 Ripple Epoch(2000년 1월 1일 00:00 UTC)부터 경과한 시간을 초 단위로 나타냅니다. 실제 Unix 타임스탬프로 변환하려면 이 값에 946,684,800초를 더해야 합니다.`,
					example: 820000000,
				},
				balance: {
					...Amount,
					description:
						"현재까지 수신자에게 청구된 총 금액을 나타냅니다. XRP 단위이며, 채널 상에서 청구 가능한 누적 금액입니다.",
				},
				signature: {
					type: "string",
					description:
						"PaymentChannelClaim에서 청구 요청의 진위를 확인하기 위한 서명 문자열입니다. publicKey에 해당하는 비공개 키로 서명한 값입니다.",
					example:
						"30440220718D264EF05CAED7C781FF6DE298DCAC68D002562C9BF3A07C1E721B420C0DAB02203A5A4779EF4D2CCC7BC3EF886676D803A9981B928D3B8ACA483B80ECA3CD7B9B",
				},
			},
		},
	],
};

export const BalanceChangesInTransaction: OpenAPIV3.SchemaObject = {
	type: "object",
	required: ["affectedNodesIndex", "account", "currency", "issuer", "previousBalance", "finalBalance", "changeValue"],
	properties: {
		affectedNodesIndex: {
			type: "integer",
			description: "AffectedNodes 배열 내에서 해당 노드의 인덱스를 나타냅니다.",
			example: 1,
		},
		account: {
			type: "string",
			description:
				"트랜잭션으로 인해 잔액이 변경된 계정 주소입니다. 계정 주소는 25~35자리 길이의 Base58 인코딩 문자열로, 'r'로 시작하는 형식을 가집니다.",
			example: "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
		},
		currency: {
			type: "string",
			description: `자산의 통화 코드를 나타냅니다. 일반적으로 ISO 4217 표준 코드(예: "USD", "EUR")를 사용하지만, 필요에 따라 160비트 커스텀 코드도 사용할 수 있습니다. 커스텀 코드는 40자리 길이의 16진수 문자열로 표현되며, 특정 프로젝트나 플랫폼에서 정의한 독자적인 자산(예: "SOLO")을 나타낼 때 사용됩니다. 한편, XRP의 경우에는 "XRP"라는 고정된 문자열이 currency 필드에 사용되며, IOU 자산과 동일한 구조로 반환됩니다. `,
			example: "USD",
		},
		issuer: {
			type: "string",
			description: `자산을 발행한 계정의 주소입니다. 동일한 통화 코드(currency)라 하더라도, 발행자에 따라 자산의 신뢰도와 위험성이 달라질 수 있습니다. 따라서 XRP Ledger에서는 통화 코드와 발행자(issuer)의 조합으로 자산을 고유하게 식별합니다. 각 자산의 신뢰성은 발행자의 평판에 크게 좌우됩니다. 이 필드는 25~35자리 길이의 Base58 인코딩 문자열이며, 항상 'r'로 시작합니다. 단, XRP는 네이티브 자산이므로 발행자가 없으며, 이 경우 issuer는 빈 문자열("")로 표시됩니다.`,
			example: "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
		},
		previousBalance: {
			type: "string",
			description:
				"변경 전 자산의 수량을 나타냅니다. XRP인 경우, XRP 단위로 표기되며 1 XRP는 1,000,000 drop에 해당합니다.",
			example: "1000.34",
		},
		finalBalance: {
			type: "string",
			description:
				"변경 후 자산의 수량을 나타냅니다. XRP인 경우, XRP 단위로 표기되며 1 XRP는 1,000,000 drop에 해당합니다.",
			example: "900.12",
		},
		balanceChange: {
			type: "string",
			description:
				"트랜잭션으로 인해 변경된 수량을 나타냅니다. 수량의 증감 여부를 포함하며, XRP인 경우 XRP 단위로 표기되며 1 XRP는 1,000,000 drop에 해당합니다.",
			example: "-100.22",
		},
	},
};

export const BalanceChanges: OpenAPIV3.SchemaObject = {
	type: "object",
	required: [
		"ledgerIndex",
		"ledgerTimestamp",
		"transactionIndex",
		"transactionHash",
		"transactionType",
		"affectedNodesIndex",
		"account",
		"currency",
		"issuer",
		"previousBalance",
		"finalBalance",
		"changeValue",
	],
	properties: {
		ledgerIndex: {
			type: "integer",
			description:
				"Ledger의 생성 순서를 나타내는 정수값으로, 네트워크 상에서 해당 Ledger의 위치(시퀀스 번호)를 확인하는 데 사용됩니다. Balance Changes 조회 API에서 필수인 필드입니다.",
			example: 95444296,
		},
		ledgerTimestamp: {
			type: "integer",
			description:
				"Ledger의 close time을 실제 Unix 타임스탬프로 변환한 값입니다. Ledger header에 기록된 close time은 Ripple Epoch(2000년 1월 1일 00:00 UTC)부터 경과한 초 단위로 표현되며, Unix Epoch(1970년 1월 1일 00:00 UTC) 기준과는 946,684,800초의 차이가 있습니다. 따라서 ledgerTimestamp는 기록된 close time에 946,684,800초를 더해 변환한 Unix 타임스탬프입니다. Transfer 조회 API에서 필수인 필드입니다.",
			example: 1744608171,
		},
		transactionIndex: {
			type: "integer",
			description:
				"Ledger 내에서 해당 트랜잭션의 처리 순서를 나타내는 인덱스입니다. 이 값은 Ledger 내 트랜잭션들의 순서를 파악하는 데 사용됩니다. Balance Changes 조회 API에서 필수인 필드입니다.",
			example: 2,
		},
		transactionHash: {
			type: "string",
			description:
				"트랜잭션을 고유하게 식별하는 256비트(64자리 16진수) 암호화 해시값입니다. 트랜잭션 데이터의 무결성 및 식별에 사용됩니다. Balance Changes 조회 API에서 필수인 필드입니다.",
			example: "8BAD7583234AC463E09D6CF160E352DFF5B008FC071DD5226A53809D89E7F409",
		},
		transactionType: {
			type: "string",
			description:
				"트랜잭션의 종류(Payment, OfferCreate, EscrowCreate 등)를 나타내는 문자열입니다. Transfer 조회 API에서 필수인 필드입니다.",
			example: "OfferCreate",
		},
		...BalanceChangesInTransaction.properties,
	},
};

export const Transfer: OpenAPIV3.SchemaObject = {
	type: "object",
	required: ["affectedNodesIndex", "from", "to", "issuer", "currency", "value"],
	properties: {
		ledgerIndex: {
			type: "integer",
			description:
				"Ledger의 생성 순서를 나타내는 정수값으로, 네트워크 상에서 해당 Ledger의 위치(시퀀스 번호)를 확인하는 데 사용됩니다. Transfer 조회 API에서 필수인 필드입니다.",
			example: 95444296,
		},
		ledgerTimestamp: {
			type: "integer",
			description:
				"Ledger의 close time을 실제 Unix 타임스탬프로 변환한 값입니다. Ledger header에 기록된 close time은 Ripple Epoch(2000년 1월 1일 00:00 UTC)부터 경과한 초 단위로 표현되며, Unix Epoch(1970년 1월 1일 00:00 UTC) 기준과는 946,684,800초의 차이가 있습니다. 따라서 ledgerTimestamp는 기록된 close time에 946,684,800초를 더해 변환한 Unix 타임스탬프입니다. Transfer 조회 API에서 필수인 필드입니다. Transfer 조회 API에서 필수인 필드입니다.",
			example: 1744608171,
		},
		transactionIndex: {
			type: "integer",
			description:
				"Ledger 내에서 해당 트랜잭션의 처리 순서를 나타내는 인덱스입니다. Transfer 조회 API에서 필수인 필드입니다.",
			example: 0,
		},
		transactionHash: {
			type: "string",
			description:
				"트랜잭션을 고유하게 식별하는 256비트(64자리 16진수) 암호화 해시값입니다. 트랜잭션 데이터의 무결성 및 식별에 사용됩니다. Transfer 조회 API에서 필수인 필드입니다.",
			example: "4770851929AD74B3EF36D818C7100564B2F3333AE60FA1B05BFAA95020D18D5B",
		},
		transactionType: {
			type: "string",
			description:
				"트랜잭션의 종류를 나타내는 문자열입니다. Payment, OfferCreate, EscrowCreate 등 다양한 트랜잭션 유형을 구분하며, 처리 방식에 따라 분류됩니다. Transfer 조회 API에서 필수인 필드입니다.",
			example: "Payment",
		},
		affectedNodesIndex: {
			type: "integer",
			description: "AffectedNodes 배열 내에서 해당 노드의 인덱스를 나타냅니다.",
			example: 1,
		},
		from: {
			type: "string",
			description:
				"트랜잭션을 발생시킨 계정 주소입니다. 계정 주소는 25~35자리 길이의 Base58 인코딩 문자열로, 'r'로 시작하는 형식을 가집니다.",
			example: "rLuSZRKfW2oFVDEHab6U7tBSfnzSovzcw4",
		},
		to: {
			type: "string",
			description:
				"트랜잭션의 수신 계정 주소입니다. 계정 주소는 25~35자리 길이의 Base58 인코딩 문자열로, 'r'로 시작하는 형식을 가집니다.",
			example: "rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De",
		},
		currency: {
			type: "string",
			description: `자산의 통화 코드를 나타냅니다. 일반적으로 ISO 4217 표준 코드(예: "USD", "EUR")를 사용하지만, 필요에 따라 160비트 커스텀 코드도 사용할 수 있습니다. 커스텀 코드는 40자리 길이의 16진수 문자열로 표현되며, 특정 프로젝트나 플랫폼에서 정의한 독자적인 자산(예: "SOLO")을 나타낼 때 사용됩니다. 한편, XRP의 경우에는 "XRP"라는 고정된 문자열이 currency 필드에 사용되며, IOU 자산과 동일한 구조로 반환됩니다. `,
			example: "USD",
		},
		issuer: {
			type: "string",
			description: `자산을 발행한 계정의 주소입니다. 동일한 통화 코드(currency)라 하더라도, 발행자에 따라 자산의 신뢰도와 위험성이 달라질 수 있습니다. 따라서 XRP Ledger에서는 통화 코드와 발행자(issuer)의 조합으로 자산을 고유하게 식별합니다. 각 자산의 신뢰성은 발행자의 평판에 크게 좌우됩니다. 이 필드는 25~35자리 길이의 Base58 인코딩 문자열이며, 항상 'r'로 시작합니다. 단, XRP는 네이티브 자산이므로 발행자가 없으며, 이 경우 issuer는 빈 문자열("")로 표시됩니다.`,
			example: "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
		},
		value: {
			type: "string",
			description: `자산의 수량을 문자열(string) 형태로 반환합니다. 수량 표현 방식은 currency 값에 따라 달라집니다. currency가 "XRP"인 경우, 이 값은 표준 XRP 단위로 표기되며, 1 XRP는 1,000,000 drop에 해당합니다. IOU 자산의 경우에도 발행자가 정의한 정밀도(precision)를 기반으로 표현됩니다.`,
			example: "100.5",
		},
	},
};

export const Transaction: OpenAPIV3.SchemaObject = {
	type: "object",
	required: [
		"ledgerIndex",
		"ledgerTimestamp",
		"transactionIndex",
		"transactionHash",
		"transactionType",
		"transactionResult",
		"account",
		"sequence",
		// "lastLedgerSequence",
		// "ticketSequence",
		"signingPubKey",
		// "txnSignature",
		"fee",
		// "flags",
		// "accountTxnId",
		// "sourceTag",
		// "signers",
		// "memos",
		"transactionCategory",
		"transactionDetails",
		// "balanceChanges",
		// "tokenTransfer"
	],
	properties: {
		ledgerIndex: {
			type: "integer",
			description:
				"트랜잭션이 포함된 Ledger의 순번을 나타냅니다. 이를 통해 해당 트랜잭션이 어느 Ledger에 기록되었는지 확인할 수 있습니다.",
			example: 95444296,
		},
		ledgerTimestamp: {
			type: "integer",
			description:
				"이 값은 해당 트랜잭션이 포함된 Ledger의 close time을 Unix 타임스탬프 형식으로 변환한 결과를 반환합니다. XRP Ledger에서 close time은 Ripple Epoch(2000년 1월 1일 00:00 UTC)를 기준으로 초 단위로 기록됩니다. 반면, 일반적인 Unix 타임스탬프는 Unix Epoch(1970년 1월 1일 00:00 UTC)를 기준으로 하며, 이 둘 사이에는 946,684,800초의 차이가 있습니다. 따라서 ledgerTimestamp는 Ledger에 기록된 close time에 946,684,800초를 더해 계산됩니다.",
			example: 1744608171,
		},
		transactionIndex: {
			type: "integer",
			description:
				"Ledger 내에서 해당 트랜잭션의 처리 순서를 나타내는 인덱스입니다. 이 값은 Ledger 내 트랜잭션들의 순서를 파악하는 데 사용됩니다.",
			example: 1,
		},
		transactionHash: {
			type: "string",
			description:
				"트랜잭션을 고유하게 식별하는 256비트(64자리 16진수) 암호화 해시값입니다. 트랜잭션 데이터의 무결성 및 식별에 사용됩니다.",
			example: "0D1DDF6974EA31918EB531F9212FC76BC47BCE9193839496474010D133C0BB1E",
		},
		transactionType: {
			type: "string",
			description:
				"트랜잭션의 종류를 나타내는 문자열입니다. Payment, OfferCreate, EscrowCreate 등 다양한 트랜잭션 유형을 구분하며, 처리 방식에 따라 분류됩니다.",
			example: "Payment",
		},
		transactionResult: {
			type: "string",
			description:
				"트랜잭션 처리 결과를 나타내는 문자열로, 'tesSUCCESS'와 같이 결과 코드로 표시됩니다. 이를 통해 트랜잭션의 성공 여부를 확인할 수 있습니다.",
			example: "tesSUCCESS",
		},
		account: {
			type: "string",
			description:
				"해당 트랜잭션을 발생시킨 계정 주소입니다. 계정 주소는 25~35자리 길이의 Base58 인코딩 문자열로, 'r'로 시작하는 형식을 가집니다.",
			example: "rEqFohwoXqGFVik15uqF5nBdzfd5qEFh1X",
		},
		sequence: {
			type: "integer",
			description: "계정에서 발행한 트랜잭션의 순차 번호로, 중복 제출이나 재생 공격을 방지하기 위해 사용됩니다.",
			example: 94536309,
		},
		lastLedgerSequence: {
			type: "integer",
			description:
				"트랜잭션이 유효한 마지막 Ledger의 순번을 나타냅니다. 이 값 이후의 Ledger에서는 해당 트랜잭션이 처리되지 않습니다.",
			example: 95444315,
		},
		ticketSequence: {
			type: "integer",
			description:
				"티켓 기반 트랜잭션의 경우, 티켓 번호를 나타내는 값입니다. 티켓을 사용하는 트랜잭션에 한해 존재합니다.",
			example: 5,
		},
		signingPubKey: {
			type: "string",
			description: "트랜잭션 서명에 사용된 공개키로, 보통 33바이트(66자리 16진수) 압축된 공개키 형식으로 표현됩니다.",
			example: "ED1BCAE2B5F146BF30F40D36D4D8565A7E6F758B7062288336BE74D969E4543A19",
		},
		txnSignature: {
			type: "string",
			description: "signingPubKey으로 생성된 트랜잭션 서명 값입니다. 해당 서명은 트랜잭션 검증 및 인증에 사용됩니다.",
			example: "744E21E3E298BC06B874EA43ABDEB762A23EEA3630F6DD4215AD32C7B35C2C630777DDC3687245766E3CA7BF0B747A085E44",
		},
		fee: {
			type: "string",
			description:
				"트랜잭션 처리 수수료를 나타내며, XRP 수량(XRP 단위)을 문자열로 표현됩니다. 이 값은 XRP 단위로 표기되며, 1 XRP는 1,000,000 drop에 해당합니다",
			example: "0.000012",
		},
		flags: {
			type: "string",
			description:
				"트랜잭션에 적용된 플래그 값을 나타냅니다. 각 비트는 특정 옵션이나 동작을 제어하며, 기본값은 0으로 설정되는 경우가 많습니다.",
			example: "131072",
		},
		accountTxnId: {
			type: "string",
			description:
				"이 필드는 다른 트랜잭션을 식별하는 256비트 해시값입니다. 만약 이 값을 설정하면, 해당 트랜잭션은 송신 계정의 가장 최근 트랜잭션 ID와 일치해야만 유효합니다. 이 필드는 트랜잭션의 중복 전송을 방지하거나, 이전 트랜잭션 이후 계정 상태가 변경되지 않았음을 확인하는 용도로 사용됩니다",
			example: "D84B7A07E9FAD27D8782DAF4A5AD8C8C4D1D1F18E9D62D0384A2E1A2A4D3AD11",
		},
		sourceTag: {
			type: "integer",
			description: `송신자가 트랜잭션을 보낼 때 함께 지정할 수 있는 32비트 부호 없는 정수 값입니다. 주로 여러 사용자가 공유하는 주소(예: 거래소나 호스팅 지갑)에서 송신 사용자를 식별하는 데 사용됩니다. 즉, 수신자가 "누가 보냈는지"를 정확히 알 수 있도록 도와주는 추가 정보입니다.`,
			example: 123456,
		},
		signers: {
			type: "array",
			description:
				"다중 서명이 적용된 트랜잭션의 경우, 각 서명자의 정보를 포함하는 객체 배열입니다. 각 객체는 서명자 계정, 서명 공개키, 서명 값 등을 포함합니다.",
			items: Signer,
		},
		memos: {
			type: "array",
			description:
				"트랜잭션에 첨부된 메모 데이터를 포함하는 객체 배열입니다. 각 메모 객체는 메모 내용, 형식 등의 추가 정보를 제공합니다.",
			items: Memo,
		},
		transactionCategory: {
			type: "string",
			description:
				"트랜잭션의 분류 정보를 나타내는 열거형 문자열입니다. 가능한 값에는 AMM, Check, Escrow, Offer, Payment, Payment Channel 등이 있으며, 각 분류는 해당 트랜잭션 유형(예: Payment, OfferCreate 등)에 따라 정의됩니다.",
		},
		transactionDetails: {
			...TransactionDetails,
			description:
				"트랜잭션과 관련된 상세 정보를 포함하는 객체입니다. 이 객체는 트랜잭션 처리에 필요한 추가 데이터 및 세부 필드들을 포함할 수 있습니다.",
		},
		balanceChanges: {
			...BalanceChangesInTransaction,
			description:
				"트랜잭션으로 인해 발생한 계정별 잔액 변동 내역을 포함하는 객체 배열입니다. 각 객체는 변경된 계정, 변동 금액, 통화 종류 등을 명시합니다.",
		},
		tokenTransfers: {
			...Transfer,
			description:
				"트랜잭션에 포함된 토큰 전송 내역을 나타내는 객체 배열입니다. 각 객체는 전송된 토큰의 종류, 전송 금액, 송수신 계정 등의 정보를 포함합니다.",
		},
	},
};

export const Balance: OpenAPIV3.SchemaObject = {
	type: "object",
	required: ["ownerAddress", "balance"],
	properties: {
		ownerAddress: {
			type: "string",
			description: `잔고를 소유한 계정의 주소를 반환하는 필수 응답 필드로, 25~35자리 길이의 Base58 인코딩 문자열이며 항상 "r"로 시작합니다.`,
		},
		balance: {
			type: "string",
			description: `계정이 보유한 잔고의 총량을 나타내는 필수 응답 필드로, XRP의 최소 단위인 drop 대신 표준 XRP 단위(1 XRP =1,000,000 drop)로 값을 제공합니다.`,
		},
	},
};
