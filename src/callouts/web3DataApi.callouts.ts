export const onlyEthereumMainnetInfoMessage = `
> 🚧 사용 시 네트워크를 확인하세요!
>
> 이 API는 오직 Ethereum Mainnet에서만 지원되며, 다른 네트워크에서는 사용할 수 없습니다. 사용 시 네트워크를 확인해주세요.
`;

export const onlyEthereumMainnetLuniverseMainnetInfoMessage = `
> 🚧 사용 시 네트워크를 확인하세요!
>
> 이 API는 오직 Ethereum Mainnet, TheBalance Mainnet 에서만 지원되며, 다른 네트워크에서는 사용할 수 없습니다. 사용 시 네트워크를 확인해주세요.
`;

export const decodeInfoMessage = `
> 🚧 decodeInput 사용 시 주의사항
>
> decodeInput 필드는 트랜잭션의 input 필드를 해석하여 결과를 제공합니다. 그러나 서로 다른 함수가 같은 함수 선택자(function selector)를 사용할 수 있기 때문에, 제공된 결과가 실제로 호출된 함수와 일치하지 않을 가능성이 있습니다. 따라서, ERC 표준 규격과 다른 함수의 경우 추가적인 검증 과정을 거치는 것을 권장 드립니다.
`;

export const warningTokenPriceData = `
> 🚧 토큰 가격 조회 시 알아두어야 할 사항
>
> 이 API에서 제공되는 토큰 가격은 CoinMarketCap의 데이터를 기반으로 합니다. 가격 정보는 일정 주기로 갱신되기 때문에 실시간 가격과 차이가 있을 수 있습니다. 또한, CoinMarketCap에 등록되지 않은 토큰을 조회할 경우 빈 배열이 반환됩니다.
`;

export const internalTxSupportedNetworksInfoMessage = `
> 🚧 Internal Transaction Count에 null이 표기되나요?
>
> transactionCounts.internal 필드는 Ethereum Mainnet, Arbitrum Mainnet, Base Mainnet, Chiliz Mainnet, Kaia Mainnet, Tron Mainnet, Luniverse Mainnet에서만 지원됩니다. 그 외에 다른 네트워크에서는 null로 표기됩니다.
`;

export const ensNullResponse = `
> 🚧 ENS 도메인 이름이 있는 주소인데도 null이 표기되나요?
>
> 여러 도메인 이름이 하나의 주소를 가리키고 있을 수 있습니다. 이 API에서는 Primary Name으로 등록된 이름만 응답을 반환합니다. 만약 모든 이름을 확인하고 싶다면, [Get Ens Records By Account](ref:getensrecordsbyaccount)를 이용해보세요!
`;

export const whatIsTokenUriAndNftMetadataMessage = `
> 📘 NFT Metadata와 Token URI란 무엇인가요?
>
> NFT는 디지털 자산의 소유권과 고유성을 보장하는 기술로, NFT의 메타데이터는 이 자산의 정보를 저장하는 핵심적인 부분입니다. 메타데이터는 NFT의 본질을 설명하는 중요한 역할을 합니다.
> 1. NFT Metadata
> NFT의 창작자, 발행일, 속성(attributes), 미디어 파일(e.g., 이미지, 영상) 등을 포함합니다. 이러한 메타데이터는 NFT를 단순한 디지털 파일 이상의 고유한 자산으로 만들어 주며, NFT의 희소성이나 고유한 특성을 정의합니다.
> 2. Token URI
> 블록체인에 데이터를 저장하는 것은 많은 비용이 들기 때문에, 메타데이터와 미디어 파일은 블록체인에 저장되지 않고 IPFS나 S3 같은 외부 저장소에 보관됩니다. Token URI는 이런 외부 저장소에 있는 메타데이터 파일의 위치를 가리키는 필드로, 해당 URI를 통해 메타데이터에 접근하게 됩니다. 즉, Token URI는 메타데이터와 미디어 파일을 연결하여, 블록체인 상의 정보와 실제 콘텐츠 간의 연결 고리 역할을 합니다.
`;

export const whySyncNftMetadata = `
> 🚧 Token URI 혹은 NFT Metadata 데이터가 실제 데이터와 다른가요?
>
> Token URI(tokenUri)와 NFT Metadata(rawMetadata)는 프로젝트의 컨트랙트 로직에 따라 동적으로 변경될 수 있습니다. 예를 들어, Dynamic NFT는 온체인 혹은 오프체인 조건에 따라 NFT 데이터가 업데이트될 수 있습니다. 이러한 변경은 자동으로 기록되지 않기 때문에, 최신 데이터를 확인하기 위해서는 Sync NFT Metadata를 사용해 동기화 요청을 보내는 것을 권장합니다.
> Sync NFT Metadata는 메타데이터와 Token URI를 최신화하는 API입니다. 동기화 요청을 보내면 NFT Metadata와 Token URI의 데이터를 최신 상태로 업데이트하여 현재 상태에 맞는 정확한 정보를 확인할 수 있습니다. 이 과정은 데이터 크기와 네트워크 상태에 따라 최대 10초가 소요될 수 있습니다.
> [▶ Link to Sync NFT Metadata](https://developer.nodit.io/reference/syncnftmetadata)
`;
