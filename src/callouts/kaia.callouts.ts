export const kaiaUsingTipsForCommon = (exampleCases?: string) => `
> 🚧 Kaia를 사용하시나요? 사용 전 꼭 확인하세요!
>
> Kaia는 Klaytn과 Finschia의 합병으로 탄생한 체인으로, 기존 Klaytn에서 하드포크된 체인입니다. 본 API는 하드포크 이후 데이터에 대한 정합성을 보장하지만, 하드포크 이전의 Klaytn 데이터는 조회 및 정합성을 보장하지 않습니다.
> Kaia 네트워크의 하드포크 블록은 아래와 같습니다.
> - Mainnet: 162,900,480 (Aug 29, 2024 11:08:01 UTC+9)
> - Kairos(Testnet): 156,660,000 (June 13, 2024 10:15:19 UTC+9)
>
> ${exampleCases && `예를 들어, 다음과 같은 동작은 정상 동작으로 간주됩니다. ${exampleCases}`}
`;

export const kaiaUsingTipsForNftContractMetadata = `
> - 하드포크 시점 이전에 배포된 NFT 컨트랙트의 메타데이터는 조회 되지 않을 수 있습니다. 
`;

export const kaiaUsingTipsForNftContractAsset = `
> - 하드포크 시점 이전에 배포된 NFT 컨트랙트의 경우, 자산 조회 결과에 포함되지 않을 수 있습니다.
`;

export const kaiaUsingTipsForNftHolder = `
> - 하드포크 시점 이전에 배포된 NFT 컨트랙트의 홀더를 조회하는 경우, 반환된 목록이 실제 홀더 목록과 상이할 수 있습니다.
`;

export const kaiaUsingTipsForNftMetadata = `
> - 하드포크 시점 이전에 배포된 NFT 컨트랙트를 입력한 경우, 발행된 NFT가 조회되지 않을 수 있습니다.
`;

export const kaiaUsingTipsForNftTransfer = `
> - NFT의 전송 내역을 조회할 때, 하드포크 시점 이전에 전송된 이력은 반환하지 않습니다.
`;

export const kaiaUsingTipsForNftOwned = `
> - 특정 계정이 보유한 NFT를 조회한 경우, 하드포크 시점 이전에 배포된 NFT는 조회 결과에 포함되지 않을 수 있습니다.
`;

export const kaiaUsingTipsForNftSync = `
> - 하드포크 시점 이전에 배포된 NFT를 입력한 경우, NFT의 Metadata 동기화가 진행되지 않을 수 있습니다.
`;

export const kaiaUsingTipsForTokenContractMetadata = `
> - 하드포크 시점 이전에 배포된 Token 컨트랙트의 메타데이터는 조회 되지 않을 수 있습니다.
`;

export const kaiaUsingTipsForTokenHolder = `
> - 하드포크 시점 이전에 배포된 Token 컨트랙트의 홀더를 조회하는 경우, 반환된 목록이 실제 홀더 목록과 상이할 수 있습니다.
`;

export const kaiaUsingTipsForTokenTransfer = `
> - Token의 전송 내역을 조회할 때, 하드포크 시점 이전에 전송된 이력은 반환하지 않습니다.
`;

export const kaiaUsingTipsForTokenOwned = `
> - 특정 계정이 보유한 Token을 조회한 경우, 하드포크 시점 이전에 배포된 Token은 조회 결과에 포함되지 않을 수 있습니다.
`;

export const kaiaUsingTipsForBlock = `
> - 하드포크 시점 이전에 발생한 블록은 조회되지 않을 수 있습니다.
`;

export const kaiaUsingTipsForTransaction = `
> - 하드포크 시점 이전에 발생한 트랜잭션은 조회 결과에 포함되지 않을 수 있습니다.
`;

export const kaiaUsingTipsForEvent = `
> - 하드포크 시점 이전에 발생한 이벤트는 조회 결과에 포함되지 않을 수 있습니다.
`;
