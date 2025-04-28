import { OpenAPIV3 } from "openapi-types";

export const Transaction: OpenAPIV3.SchemaObject = {
	type: "object",
	required: [
		"transactionHash",
		"transactionIndex",
		"transactionTimestamp",
		"blockNumber",
		"blockTimestamp",
		"refBlockBytes",
		"refBlockHash",
		"type",
		"typeUrl",
		"isMultiSig",
		"from",
		"to",
		"value",
		"assetId",
		"input",
		"functionSelector",
		"result",
		"contractRet",
		"resMessage",
		"fee",
		"feeLimit",
		"netFee",
		"netUsage",
		"energyFee",
		"energyUsage",
		"originEnergyUsage",
		"energyUsageTotal",
		"energyPenaltyTotal",
	],
	properties: {
		transactionHash: {
			type: "string",
			description: `트랜잭션을 식별하는 고유한 해시 값입니다. 이 필드는 prefix(0x)를 제외한 64자리 16진수 문자열 형식을 가집니다.`,
		},
		transactionIndex: {
			type: "integer",
			description: `특정 블록 내에 트랜잭션이 포함된 순서로, 트랜잭션이 실행되는 순서를 나타냅니다.`,
		},
		transactionTimestamp: {
			type: "integer",
			description: `트랜잭션이 생성된 시점을 밀리초 단위로 나타냅니다. 트랜잭션이 생성된 시점과 트랜잭션이 블록에 포함되는 시점은 다를 수 있으며, 실제 상태 변경이 적용되는 시점은 트랜잭션이 블록이 포함되는 block timestamp에 의해 결정됩니다.`,
		},
		blockNumber: {
			type: "integer",
			description: `블록의 고유한 숫자입니다. 이 숫자는 블록체인 상에서 해당 블록이 생성된 순서를 나타냅니다.`,
		},
		blockTimestamp: {
			type: "integer",
			description: `블록 생성 시점의 타임스탬프를 밀리초 단위로 제공합니다. Unix 타임스탬프 형식으로 저장됩니다.`,
		},
		refBlockBytes: {
			type: "string",
			description: `트랜잭션이 참조하는 블록을 나타냅니다. 이 필드는 참조 블록 넘버의 6번째에서 7번째 바이트를 사용하여 총 2 바이트 크기를 갖습니다. 참조 블록은 가장 최근에 확정된 블록으로, 이 값을 트랜잭션에 고정하여 트랜잭션이 재사용되는 것을 방지합니다.`,
		},
		refBlockHash: {
			type: "string",
			description: `트랜잭션이 참조하는 블록을 나타냅니다. 이 필드는 참조 블록 해시의 8번째에서 15번째 바이트를 사용하여 총 8 바이트 크기를 갖습니다. 참조 블록은 가장 최근에 확정된 블록으로, 이 값을 트랜잭션에 고정하여 트랜잭션이 재사용되는 것을 방지합니다.`,
		},
		type: {
			type: "string",
			description: `트랜잭션의 유형을 나타냅니다. 이 필드는 트랜잭션이 수행하는 구체적인 동작을 지정하여, 네트워크가 해당 트랜잭션을 의도대로 처리할 수 있도록 합니다. TransferContract, TriggerSmartContract 등이 여기에 사용되며, TRX 전송, 스마트 컨트랙트 실행 등의 작업을 정의합니다.`,
		},
		typeUrl: {
			type: "string",
			description: `트랜잭션 유형의 구체적인 경로를 지정하는 필드입니다. 이 필드는 프로토콜 버퍼(Protocol Buffers) 형식으로 정의된 트랜잭션 유형을 식별하는데 사용됩니다. `,
		},
		isMultiSig: {
			type: "boolean",
			description: `해당 트랜잭션이 멀티시그(Multi-Signature) 트랜잭션인지 여부를 나타내는 필드입니다. 멀티시그는 여러 계정의 서명이 필요한 트랜잭션으로, 보안성을 높이기 위해 사용됩니다.`,
		},
		from: {
			type: "string",
			description: `트랜잭션을 생성한 발신자의 주소를 나타냅니다. 즉, 트랜잭션이 시작되는 계정의 주소를 의미합니다. 이 필드는 "T"로 시작하는 34자리 base58 문자열 형식을 가집니다.`,
		},
		to: {
			type: "string",
			description: `트랜잭션을 받을 수신자의 주소를 나타냅니다. 트랜잭션 유형에 따라 전송되는 TRX을 받을 주소 또는 호출할 스마트 컨트랙트를 의미하기도 합니다. 이 필드는 "T"로 시작하는 34자리 base58 문자열 형식을 가집니다.`,
		},
		value: {
			type: "string",
			description: `트랜잭션에서 전송되는 자산의 양을 나타냅니다. 이 자산에는 TRX 또는 TRC10 토큰이 포함됩니다. 

<strong style='color: red;'>*</strong> 이 필드는 "assetId" 필드 값에 따라 전송되는 자산의 유형이 다릅니다. "assetId"가 0일 경우 TRX 수량을 의미하며, 이 값이 0이 아닌 경우 특정 TRC10 토큰의 수량을 의미합니다. 자산의 양은 가장 작은 단위(e.g., TRX의 경우 sun)로 표기되며, 10진수 문자열 형식을 가집니다.`,
		},
		assetId: {
			type: "integer",
			description: `전송하는 토큰(TRX, TRC10)을 식별하는 값입니다. 

<strong style='color: red;'>*</strong> "assetId" 필드가 0이면 TRX를 의미하며, 이 값이 0이 아닌 경우 특정 TRC10 토큰을 의미합니다.`,
		},
		input: {
			type: "string",
			description: `스마트 컨트랙트 호출 시 전달되는 데이터 또는 입력 값을 나타내는 값입니다. 주로 스마트 컨트랙트 함수의 파라미터 값으로 사용되며, 컨트랙트가 특정 동작을 수행하도록 지정합니다.`,
		},
		functionSelector: {
			type: "string",
			description: `트랙잭션에서 실행한 함수의 고유 식별자를 나타냅니다. 예를 들어, transfer(address,uint256) 함수의 시그니처는 keccak-256 해싱을 통해 특정 해시값을 생성하고, 이 해시값의 앞 4바이트를 function selector로 사용합니다.`,
		},
		result: {
			type: "string",
			description: `트랜잭션 수행 결과의 최종 상태를 나타냅니다. 전체 트랜잭션이 정상적으로 처리되었는지에 대한 최종 결과를 제공하여, 사용자가 트랜잭션이 성공적으로 이루어졌는지 쉽게 확인할 수 있습니다. 상태는 SUCCESS, FAILED 두 가지 값이 존재합니다.

<strong style='color: red;'>*</strong> 스마트 컨트랙트 실행이 실패하더라도 트랜잭션이 블록체인에 기록되었다면 트랜잭션 자체는 성공으로 구분됩니다.`,
		},
		contractRet: {
			type: "string",
			description: `스마트 컨트랙트 실행 결과를 나타내며, 트랜잭션의 성공 여부에 대한 보다 구체적인 정보를 제공합니다.
- 예시: SUCCESS, REVERT, BAD_JUMP_DESTINATION, OUT_OF_MEMORY, PRECOMPILED_CONTRACT, ...`,
		},
		resMessage: {
			type: "string",
			description: `트랜잭션 실행이 샐패했을 경우, 실패 원인이나 오류 메시지를 나타냅니다. 성공한 트랜잭션의 경우에는 빈 문자열을 반환합니다.`,
		},
		fee: {
			type: "string",
			description: `트랜잭션 실행 시 소모된 총 TRX 비용입니다. 트랜잭션을 생성한 계정의 대역폭(Bandwidth)과 에너지(Energy)가 부족할 때, 그 차액을 TRX로 충당하게 됩니다. 이 필드는 이 때의 차액을 의미하며, netFee와 energyFee의 합산 값을 가집니다. 예들 들어, 만약 대역폭과 에너지가 충분하다면 fee는 0입니다. 그렇지 않다면 부족한 만큼 TRX로 소모된 양을 나타냅니다. 이 필드의 단위는 "sun"이며, 1 TRX = 1,000,000 sun입니다.`,
		},
		feeLimit: {
			type: "string",
			description: `트랜잭션 생성 시 사용자가 설정한 최대 수수료 한도로, 트랜잭션이 실행될 때 소모할 수 있는 수수료의 상한선을 지정합니다. 만약 실제 사용된 수수료가 feeLimit을 초과하면 트랜잭션은 실패합니다. 이를 통해 사용자는 예상치 못한 높은 수수료로 인한 피해를 사전에 예방할 수 있습니다. 이 필드의 단위는 "sun"이며, 1 TRX = 1,000,000 sun입니다.`,
		},
		netFee: {
			type: "string",
			description: `트랜잭션 생성 계정의 대역폭(Bandwidth)이 부족할 때 그 부족분을 TRX로 충당한 비용입니다. 만약 사용할 수 있는 대역폭이 충분하다면 netFee는 발생하지 않습니다. 이 필드의 단위는 "sun"이며, 1 TRX = 1,000,000 sun입니다.`,
		},
		netUsage: {
			type: "string",
			description: `트랜잭션에서 실제 사용된 대역폭(Bandwidth)의 양입니다. 트랜잭션을 생성한 계정에 남아있는 대역폭이 부족할 경우, 부족한 대역폭만큼의 비용을 TRX로 지불하게 되며, 이때 지불한 TRX의 양은 netFee에 기록됩니다.`,
		},
		energyFee: {
			type: "string",
			description: `트랜잭션 생성 계정의 에너지(Energy)가 부족할 때, 부족한 에너지를 TRX로 충당한 비용을 나타냅니다. 스마트 컨트랙트 실행에 필요한 에너지가 생성 계정의 보유량을 초과한 경우에만 발생합니다. 이 필드의 단위는 "sun"이며, 1 TRX = 1,000,000 sun입니다.`,
		},
		energyUsage: { type: "string", description: `트랜잭션을 생성한 계정에서 사용된 에너지(Energy)의 양입니다. ` },
		originEnergyUsage: {
			type: "string",
			description: `스마트 컨트랙트를 배포한 계정에서 사용된 에너지(Energy)의 양을 나타냅니다. 특정 상황에서 컨트랙트 배포자가 일부 에너지를 대신 부담할 수 있습니다.`,
		},
		energyUsageTotal: {
			type: "string",
			description: `트랜잭션에서 소모된 전체 에너지(Energy)의 양입니다. 트랜잭션 생성 계정에서 소모한 에너지(energyUsage)와 호출된 스마트 컨트랙트 배포자가 소모한 에너지(originEnergyUsage)를 합산으로, 트랜잭션 실행에 발생한 총 에너지 사용량을 나타냅니다.`,
		},
		energyPenaltyTotal: {
			type: "string",
			description: `몇몇 인기 있는 스마트 컨트랙트를 호출하는 데 지불해야 하는 추가 에너지(Energy) 양입니다. 트론 네트워크는 리소스(대역폭과 에너지)가 한정적이기 때문에, 페널티를 부여하여 특정 인기 스마트 컨트랙트의 과도한 리소스 사용을 방지합니다.`,
		},
		permissionId: {
			type: "integer",
			description: `트랜잭션에 사용할 권한을 지정하는 필드입니다.
- 0: Owner 권한을 의미합니다.
- 1: Witness 권한을 의미합니다. 블록 생성과 관련된 권한으로, 트랜잭션 서명에 사용될 수 없습니다.
- 2 이상: Active 권한 그룹을 의미합니다. 트랜잭션을 실행하는 사용자 그룹을 지정할 수 있습니다.`,
		},
		assetIssueId: {
			type: "integer",
			description: `트랜잭션으로 발행된 TRC10을 식별하는 값입니다. 트랜잭션 타입이 AssetIssueContract인 경우 TRC10의 asset ID를 반환하며, 그 외의 트랜잭션에서는 null을 반환합니다.`,
		},
		withdrawAmount: {
			type: "string",
			description: `인출되는 보상 수량을 나타내며 단위는 sun입니다. 보상 출금(withdrawal reward) 트랜잭션과 언프리즈(unfreeze) 트랜잭션의 경우, 투표 보상이 계정으로 인출됩니다. 이 필드의 단위는 "sun"이며, 1 TRX = 1,000,000 sun입니다.`,
		},
		withdrawExpireAmount: {
			type: "string",
			description: `Stake2.0 단계에서 다음과 같은 트랜잭션이 있을 때, 계정으로 출금된 TRX 수량을 나타냅니다. 이 필드의 단위는 "sun"이며, 1 TRX = 1,000,000 sun입니다.
1. 언스테이킹(unstaking) 트랜잭션
2. 언프로즌(unfrozen) 잔액을 계정으로 출금하는 트랜잭션
3. 모든 언스테이킹 요청을 취소하는 트랜잭션`,
		},
		unfreezeAmount: {
			type: "string",
			description: `Stake1.0 단계에서 언스테이킹(unstaking) 트랜잭션의 경우, 이 필드는 언스테이킹된 TRX의 수량을 반환하며, 이 필드의 단위는 "sun"이며, 1 TRX = 1,000,000 sun입니다.`,
		},
		cancelUnfreezeV2Amount: {
			type: "object",
			description: `취소된 언스테이킹 원금을 다시 스테이킹하여 대역폭(BANDWIDTH), 에너지(ENERGY), 또는 트론 파워(TRON POWER)와 같은 다양한 리소스를 얻기 위해 사용된 TRX의 양입니다.`,
			properties: {
				energy: {
					type: "string",
					description: `취소된 언스테이킹 원금을 다시 스테이킹하여 에너지를 얻기 위해 사용된 TRX의 양입니다. 값은 SUN 단위로 표현됩니다.`,
				},
				tronPower: {
					type: "string",
					description: `취소된 언스테이킹 원금을 다시 스테이킹하여 트론 파워(트론 네트워크의 의사결정 및 투표 참여 권한)를 얻기 위해 사용된 TRX의 양입니다. 값은 SUN 단위로 표현됩니다.`,
				},
				bandwidth: {
					type: "string",
					description: `취소된 언스테이킹 원금을 다시 스테이킹하여 대역폭을 얻기 위해 사용된 TRX의 양입니다. 값은 SUN 단위로 표현됩니다.`,
				},
			},
		},
		exchangeId: {
			type: "integer",
			description: `트론 네트워크에서 제공하는 탈중앙화 거래소(DEX)의 교환 거래(Swap)를 식별하는 고유 ID입니다. 이 ID를 통해 특정 교환 트랜잭션을 구분하고, 어떤 자산 페어에서 거래가 이루어졌는지 추적할 수 있습니다.`,
		},
		exchangeReceivedAmount: {
			type: "string",
			description: `트론 네트워크에서 제공하는 탈중앙화 거래소(DEX)의 교환 거래(Swap)을 통해 최종적으로 받은 자산의 양을 나타냅니다.`,
		},
		exchangeInjectAnotherAmount: {
			type: "string",
			description: `트론 네트워크에서 제공하는 탈중앙화 거래소(DEX)의 교환 거래(Swap) 중 추가로 투입된 다른 자산의 양입니다.`,
		},
		exchangeWithdrawAnotherAmount: {
			type: "string",
			description: `트론 네트워크에서 제공하는 탈중앙화 거래소(DEX)의 교환 거래(Swap) 후 다른 자산으로 인출된 양을 나타냅니다.`,
		},
		decodedInput: {
			type: "object",
			description: `스마트 컨트랙트 호출 시 입력 데이터(input)를 ABI를 기반으로 디코딩한 값입니다. Native Token(TRX) 전송과 같이 스마트 컨트랙트 호출이 아닌 일반 거래에서는 input 데이터가 존재하지 않으므로 이 필드는 제공되지 않습니다.
<strong style='color: red;'>*</strong> withDecode가 true인 경우에만 제공되는 필드입니다.`,
			properties: {
				type: {
					type: "string",
					description: `디코딩된 데이터의 유형을 나타냅니다. 예를 들어, 스마트 컨트랙트의 함수 호출인 경우 "function"을 반환합니다.`,
				},
				name: {
					type: "string",
					description: `호출된 스마트 컨트랙트 함수의 이름을 나타냅니다. 함수 이름은 ABI 정의에 따라 결정됩니다.`,
				},
				signature: {
					type: "string",
					description: `스마트 컨트랙트 함수의 시그니처로, 함수명과 파라미터의 데이터 타입을 명시적으로 표현합니다. 함수의 고유성을 식별하는 데 사용됩니다.`,
				},
				args: {
					type: "array",
					description: `호출된 함수에 전달된 인자들의 목록으로, 각 인자의 이름, 타입, 실제 값을 포함하여 제공합니다. ABI에 따라 여러 개의 인자를 가질 수 있습니다.`,
					items: {
						type: "object",
						properties: {
							name: {
								type: "string",
								description: `함수 호출 시 사용된 특정 인자의 이름으로, ABI에서 정의한 인자명을 나타냅니다.`,
							},
							type: {
								type: "string",
								description: `인자의 데이터 타입을 나타냅니다. 일반적으로 사용되는 데이터 타입은 "address", "integer", "string", "bool" 등이 있습니다.`,
							},
							value: {
								type: "string",
								description: `인자에 전달된 실제 값을 나타냅니다. 데이터 타입에 따라 값의 형태가 달라지며, 예를 들어 "address" 타입인 경우 지갑 주소가 표기됩니다.`,
							},
						},
					},
				},
			},
		},
	},
};

export const Log: OpenAPIV3.SchemaObject = {
	type: "object",
	required: ["contractAddress", "transactionHash", "transactionIndex", "blockNumber", "data", "logIndex", "topics"],
	properties: {
		contractAddress: {
			type: "string",
			description: `이벤트가 발생한 스마트 컨트랙트의 주소를 나타냅니다. 이는 해당 이벤트가 발행된 컨트랙트의 식별자 역할을 합니다. 이 필드는 "T"로 시작하는 34자리 base58 문자열 형식을 가집니다.`,
		},
		transactionHash: {
			type: "string",
			description: `해당 로그가 발생한 트랜잭션의 고유 해시 값입니다. 이 필드는 prefix(0x)를 제외한 64자리 16진수 문자열 형식을 가집니다.`,
		},
		transactionIndex: {
			type: "integer",
			description: `로그가 발생한 트랜잭션의 인덱스(블록 내)를 나타냅니다. 동일한 블록 내 여러 트랜잭션 중 위치를 표시합니다.`,
		},
		blockNumber: {
			type: "integer",
			description: `로그가 포함된 블록 번호를 나타냅니다. 이는 로그가 저장된 블록을 식별하는 데 사용됩니다.`,
		},
		data: {
			type: "string",
			description: `이벤트와 관련된 추가 정보를 포함하는 필드입니다. 이벤트 로그의 데이터 중 indexed로 지정하지 않은 데이터가 반환되며, indexed로 지정된 값은 topics 필드에 반환됩니다.`,
		},
		logIndex: {
			type: "integer",
			description: `블록 내에서 로그의 인덱스를 나타냅니다. 블록 안에서 여러 로그 중 특정 로그의 위치를 식별할 수 있습니다.`,
		},
		topics: {
			type: "array",
			description: `로그의 이벤트를 설명하는 토픽(Topics)의 배열입니다. 각 토픽은 이벤트의 주요 속성을 설명하며, indexed로 지정된 필드가 반환됩니다. indexed로 지정되지 않은 필드는 data로 반환됩니다.`,
			items: { type: "string" },
		},
		decodedLog: {
			type: "object",
			description: `스마트 컨트랙트의 이벤트 정의에 따라 디코딩된 정보를 제공하며, 아래와 같은 하위 필드가 있습니다.
<strong style='color: red;'>*</strong> withDecode가 true인 경우에만 제공되는 필드입니다.`,
			properties: {
				name: { type: "string", description: `이벤트의 이름을 나타냅니다.` },
				eventFragment: { type: "string", description: `이벤트의 프래그먼트 또는 간단한 형태의 시그니처입니다.` },
				signature: {
					type: "string",
					description: `이벤트의 전체 시그니처로, 이벤트의 구조를 나타내는 필드입니다. 이 필드에는 이벤트 이름과 인자 타입을 포함합니다.`,
				},
				eventHash: {
					type: "string",
					description: `이벤트의 고유 해시 값으로, 이벤트를 식별하기 위한 키로 사용됩니다. 이 값은 이벤트 시그니처를 Keccak-256 해시 함수로 해싱하여 생성됩니다.`,
				},
				args: {
					type: "array",
					description: `이벤트에 전달된 인자 목록입니다. 예를 들어 Transfer 이벤트의 경우, 송신자(from), 수신자(to), 값(value) 등이 포함됩니다.`,
					items: {
						type: "object",
						properties: {
							name: { type: "string", description: `이벤트 인자의 이름을 나타냅니다.` },
							type: { type: "string", description: `이벤트 인자의 데이터 타입을 나타냅니다.` },
							value: { type: "string", description: `이벤트 인자의 값을 나타냅니다.` },
						},
					},
				},
			},
		},
	},
};

export const InternalTransaction: OpenAPIV3.SchemaObject = {
	type: "object",
	required: [
		"internalTransactionHash",
		"internalTransactionIndex",
		"transactionHash",
		"transactionIndex",
		"blockNumber",
		"blockTimestamp",
		"rejected",
		"from",
		"to",
		"callValueInfo",
		"note",
		"extra",
	],
	properties: {
		internalTransactionHash: {
			type: "string",
			description: `내부 트랜잭션의 고유 해시(ID)로, 내부 트랜잭션을 식별하는 키로 사용됩니다.`,
		},
		internalTransactionIndex: {
			type: "integer",
			description: `블록 내에서 해당 내부 트랜잭션의 순서를 나타내는 인덱스입니다. 같은 블록에서 여러 내부 트랜잭션이 있을 경우, 이 값으로 내부 트랜잭션의 순서를 확인할 수 있습니다.`,
		},
		transactionHash: {
			type: "string",
			description: `상위 트랜잭션의 고유 해시(ID)입니다. 내부 트랜잭션은 외부 트랜잭션에 의해 실행되므로, 상위 트랜잭션의 정보를 통해 어떤 트랜잭션에서 발생했는지 확인할 수 있습니다.`,
		},
		transactionIndex: {
			type: "integer",
			description: `상위 트랜잭션의 블록 내 인덱스입니다. 상위 트랜잭션이 블록에서 몇 번째 위치에 있는지 나타냅니다.`,
		},
		blockNumber: {
			type: "integer",
			description: `내부 트랜잭션이 포함된 블록 번호입니다.`,
		},
		blockTimestamp: {
			type: "integer",
			description: `내부 트랜잭션이 포함된 블록 생성 시점을 밀리초 단위로 기록한 값입니다.`,
		},
		rejected: {
			type: "boolean",
			description: `내부 트랜잭션 실행이 실패되었는지 여부를 나타냅니다. true인 경우, 해당 트랜잭션이 실패되었음을 의미합니다.`,
		},
		from: {
			type: "string",
			description: `내부 트랜잭션에서 송신자 주소를 나타냅니다. 일반적으로 스마트 컨트랙트 실행을 호출한 계정 주소가 기록됩니다. 이 필드는 "T"로 시작하는 34자리 base58 문자열 형식을 가집니다.`,
		},
		to: {
			type: "string",
			description: `내부 트랜잭션에서 수신자 주소를 나타냅니다. 스마트 컨트랙트 또는 일반 계정이 수신자로 설정될 수 있습니다. 이 필드는 "T"로 시작하는 34자리 base58 문자열 형식을 가집니다.`,
		},
		callValueInfo: {
			type: "array",
			description: `내부 트랜잭션에서 전송된 자산(TRX 또는 TRC10)의 정보를 포함하는 배열입니다. 그 외의 경우는 빈배열을 반환합니다.`,
			items: {
				type: "object",
				properties: {
					value: { type: "string", description: `전송된 TRX 또는 TRC10 자산의 수량입니다.` },
					assetId: {
						type: "integer",
						description: `TRC10 자산의 고유 ID를 나타냅니다. TRX가 전송될 경우, 이 필드는 0을 반환합니다.`,
					},
				},
			},
		},
		note: {
			type: "string",
			description: `내부 트랜잭션이 실행된 명령의 타입을 나타냅니다. 예를 들어, call(스마트 컨트랙트 호출), create(컨트랙트 생성) 등의 값이 포함될 수 있습니다.`,
		},
		extra: {
			type: "string",
			description: `내부 트랜잭션과 관련된 추가 데이터를 나타냅니다.`,
		},
	},
};

export const Transfer: OpenAPIV3.SchemaObject = {
	type: "object",
	required: ["from", "to", "value", "blockTimestamp", "blockNumber", "transactionHash", "transactionIndex"],
	properties: {
		from: {
			type: "string",
			description: `트랜잭션을 발생시킨 주소를 나타냅니다. 이 주소는 자산을 받는 계정이나 스마트 컨트랙트의 주소를 의미합니다. 이 필드는 "T"로 시작하는 34자리 base58 문자열 형식을 가집니다.`,
		},
		to: {
			type: "string",
			description: `트랜잭션의 수신자 주소를 나타냅니다. 이 주소는 자산을 받는 계정이나 스마트 컨트랙트의 주소를 의미합니다. 이 필드는 "T"로 시작하는 34자리 base58 문자열 형식을 가집니다.`,
		},
		value: {
			type: "string",
			description: `전송된 자산의 양 또는 데이터를 나타냅니다. TRC10, TRC20의 경우 전송된 금액을 의미합니다.`,
		},
		blockTimestamp: {
			type: "integer",
			description: `트랜잭션이 포함된 블록이 생성된 시간을 나타냅니다. 밀리초 단위의 UNIX 타임스탬프 형식으로 기록되며, 이를 통해 트랜잭션 발생 시점을 확인할 수 있습니다.`,
		},
		blockNumber: {
			type: "integer",
			description: `트랜잭션이 포함된 블록의 번호를 나타냅니다. 블록체인 상에서 해당 트랜잭션을 추적하는 데 사용되며, 특정 블록 내에서 트랜잭션의 위치를 식별합니다.`,
		},
		transactionHash: {
			type: "string",
			description: `트랜잭션의 고유 해시 값을 나타냅니다. 트랜잭션의 식별자로 사용되며, 해당 트랜잭션과 관련된 모든 데이터를 추적할 수 있는 키 역할을 합니다.`,
		},
		transactionIndex: {
			type: "integer",
			description: `트랜잭션이 포함된 블록 내에서의 위치를 나타냅니다. 여러 트랜잭션이 있는 블록에서 해당 트랜잭션의 순서를 식별하는 데 사용됩니다.`,
		},
		logIndex: {
			type: "integer",
			description: `해당 Transfer 이벤트가 포함된 로그의 인덱스를 나타냅니다. 동일한 블록 내 여러 로그가 존재할 경우 특정 로그를 구분하는 데 사용됩니다.`,
		},
		internalTransactionIndex: {
			type: "integer",
			description: `TRX 또는 TRC10 전송과 관련된 내부 트랜잭션의 인덱스를 나타냅니다. 블록 내에서 여러 내부 트랜잭션이 있는 경우 이를 구분하는 데 사용됩니다.
<strong style='color: red;'>*</strong> 이 값이 "-1"인 경우, Root Transaction을 의미합니다.`,
		},
		exchangeId: {
			type: "integer",
			description: `트론 네트워크에서 제공하는 탈중앙화 거래소(DEX)의 교환 거래(Swap)를 식별하는 고유 ID입니다. 이 ID를 통해 특정 교환 트랜잭션을 구분하고, 어떤 자산 페어에서 거래가 이루어졌는지 추적할 수 있습니다. 교환 거래로 인한 전송이 아닌 경우, null을 반환합니다.`,
		},
	},
};

export const TRC10Meta: OpenAPIV3.SchemaObject = {
	type: "object",
	required: [
		"id",
		"name",
		"symbol",
		"totalSupply",
		"decimals",
		"startTime",
		"endTime",
		"description",
		"url",
		"blockNumber",
		"blockTimestamp",
		"transactionHash",
		"deployer",
		"trxNum",
		"num",
	],
	properties: {
		id: {
			type: "integer",
			description: `TRC10 토큰의 고유 ID를 나타냅니다. 이 ID는 트론 네트워크에서 발행된 특정 TRC10 자산을 식별하는 데 사용됩니다.`,
		},
		name: {
			type: "string",
			description: `컨트랙트의 이름을 나타냅니다. 표준을 따르지 않거나, 컨트랙트 생성 단계에서 이름("name")을 입력하지 않은 경우 빈 문자열을 반환합니다.`,
		},
		symbol: {
			type: "string",
			description: `컨트랙트의 심볼을 나타냅니다. 표준을 따르지 않거나, 컨트랙트 생성 단계에서 심볼("symbol")을 입력하지 않은 경우 빈 문자열을 반환합니다.`,
		},
		totalSupply: {
			type: "string",
			description: `컨트랙트의 총 공급량을 나타냅니다. 이 값은 토큰의 총 발행량이며, 10진수 문자열 형태로 표시됩니다.`,
		},
		decimals: {
			type: "integer",
			description: `토큰의 소수점 자릿수를 나타냅니다. TIP10 표준이 도입되기 이전에는 "precision" 값이 0으로 설정되었습니다.`,
		},
		startTime: {
			type: "integer",
			description: `ICO(Initial Coin Offering) 시작 시간을 나타냅니다. 이 값은 UNIX 타임스탬프(밀리초 단위)로 기록됩니다.`,
		},
		endTime: {
			type: "integer",
			description: `ICO가 종료되는 시간을 나타냅니다. 이 값도 UNIX 타임스탬프(밀리초 단위)로 기록됩니다.`,
		},
		description: {
			type: "string",
			description: `TRC10 토큰에 대한 설명을 나타냅니다. 이 값은 발행자에 의해 설정되며, 변경 가능성이 있는 데이터입니다.`,
		},
		url: {
			type: "string",
			description: `TRC10 토큰에 대한 URL을 나타냅니다. 이 값도 발행자에 의해 설정되며, 변경 가능성이 있습니다.`,
		},
		blockNumber: {
			type: "integer",
			description: `TRC10 토큰이 생성된 블록의 번호를 나타냅니다. 이 값은 토큰 생성 트랜잭션이 포함된 블록의 번호로, 블록체인 상에서 해당 트랜잭션을 추적하는 데 사용됩니다.`,
		},
		blockTimestamp: {
			type: "integer",
			description: `TRC10 토큰이 생성된 시간을 나타냅니다. UNIX 타임스탬프(밀리초 단위)로 기록되어 있으며, 이 값으로 해당 자산의 생성 시점을 확인할 수 있습니다.`,
		},
		transactionHash: {
			type: "string",
			description: `TRC10 토큰을 발행한 트랜잭션의 해시 값을 나타냅니다. 이 값은 특정 TRC10 발행 트랜잭션을 식별하고 관련 정보를 조회하는 데 사용됩니다.`,
		},
		deployer: {
			type: "string",
			description: `TRC10 토큰을 발행한 계정 또는 주소를 나타냅니다. 발행자의 소유 계정을 식별하며, 관련된 모든 자산 관리 및 정보 조회의 기준이 됩니다.`,
		},
		trxNum: {
			type: "integer",
			description: `TRC10 자산의 가치를 결정하는 데 사용되는 TRX의 수량을 나타냅니다. 이 값은 "trx_num/num" 비율로 계산되며, 단위는 sun입니다.`,
		},
		num: {
			type: "integer",
			description: `TRC10 자산의 가치를 결정하는 데 사용되는 TRC10의 수량을 나타냅니다. TRC10 자산의 가치는 "trx_num/num" 비율로 계산됩니다.`,
		},
	},
};

export const ContractMeta: OpenAPIV3.SchemaObject = {
	type: "object",
	required: ["address", "deployedTransactionHash", "deployedAt", "deployerAddress", "logoUrl", "type"],
	properties: {
		address: {
			type: "string",
			description: `컨트랙트의 주소를 반환합니다. 이 주소는 컨트랙트가 배포된 블록체인 네트워크 내에서의 고유 식별자 역할을 합니다.`,
		},
		deployedTransactionHash: {
			type: "string",
			description: `컨트랙트 배포 시 생성된 트랜잭션의 해시 값을 반환합니다.`,
		},
		deployedAt: {
			type: "string",
			description: `컨트랙트가 배포된 정확한 시간을 반환합니다. ISO 8601 형식의 날짜와 시간으로 표시됩니다.`,
		},
		deployerAddress: {
			type: "string",
			description: `컨트랙트를 배포한 주소를 반환합니다. 이 주소는 컨트랙트를 생성하고 네트워크에 배포한 개체 또는 계정을 나타냅니다.`,
		},
		logoUrl: {
			type: "string",
			description: `컨트랙트와 연관된 로고 또는 이미지의 URL을 반환합니다. 이 URL은 컨트랙트를 시각적으로 식별하는 데 사용될 수 있습니다. 
<strong style='color: red;'>*</strong> 모든 컨트랙트의 로고 이미지를 제공하지 않습니다.`,
		},
		type: {
			type: "string",
			description: `컨트랙트 타입을 반환합니다. 컨트랙트 타입은 표준 규격의 이름이 표기됩니다. (e.g., TRC20)`,
		},
	},
};

export const TokenMeta: OpenAPIV3.SchemaObject = {
	type: "object",
	required: ["name", "symbol", "totalSupply", "decimals"],
	properties: {
		name: {
			type: "string",
			description: `컨트랙트의 이름을 나타냅니다. 표준을 따르지 않거나, 컨트랙트 생성 단계에서 name을 입력하지 않은 경우 빈 문자열을 반환합니다.`,
		},
		symbol: {
			type: "string",
			description: `컨트랙트의 심볼을 나타냅니다. 표준을 따르지 않거나, 컨트랙트 생성 단계에서 symbol을 입력하지 않은 경우 빈 문자열을 반환합니다.`,
		},
		totalSupply: {
			type: "string",
			description: `컨트랙트의 총 공급량을 나타냅니다. 이 값은 토큰의 총 발행량을 나타내며, 10진수 문자열 형태로 표시됩니다.`,
		},
		decimals: {
			type: "integer",
			description: `토큰의 소수점 자릿수를 나타냅니다.`,
		},
	},
};

export const Balance: OpenAPIV3.SchemaObject = {
	type: "object",
	required: ["ownerAddress", "balance"],
	properties: {
		ownerAddress: {
			type: "string",
			description: `계정 소유자의 트론(TRON) 주소입니다. 주소는 "T"로 시작하는 34자리 Base58 문자열 형식입니다.`,
		},
		balance: {
			type: "string",
			description: `계정의 현재 잔액을 나타냅니다. 값은 10진수 문자열이며, 단위는 TRX의 최소단위인 SUN(1 TRX = 1,000,000 SUN)입니다.`,
		},
	},
};

export const AccountStats: OpenAPIV3.SchemaObject = {
	type: "object",
	properties: {
		transactionCounts: {
			type: "object",
			description: "조회하는 address와 연관된 트랜잭션 개수 정보를 갖고 있는 객체입니다.",
			properties: {
				external: {
					type: "number",
					description: "조회하는 address가 from 또는 to 필드에 포함된 external transaction 개수를 의미합니다.",
				},
				internal: {
					type: "number",
					description: "조회하는 address가 from 또는 to 필드에 포함된 internal transaction 개수를 의미합니다.",
				},
			},
		},
		transferCounts: {
			type: "object",
			description: "조회하는 address와 연관된 전송 이벤트 개수 정보를 갖고 있는 객체입니다.",
			properties: {
				tokens: {
					type: "number",
					description:
						"조회하는 address가 from 또는 to 필드에 포함된 토큰 transfer 이벤트 개수를 의미합니다. 토큰의 타입은 TRC10, TRC20을 모두 포함합니다.",
				},
			},
		},
		assets: {
			type: "object",
			description: "조회하는 address가 소유한 자산 정보를 갖고 있는 객체입니다.",
			properties: {
				tokens: {
					type: "number",
					description:
						"조회하는 address가 보유한 토큰 종류 수를 의미합니다. 토큰의 타입은 TRC10, TRC20을 모두 포함합니다.",
				},
			},
		},
	},
};
