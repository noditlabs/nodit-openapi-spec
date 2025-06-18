export const fromBlockToBlockInfoMessage = `
> 🚧 응답 시간이 오래 걸리시나요? 블록 범위에 따라 응답 시간이 길어질 수 있습니다!
>
> 넓은 블록 범위를 지정하거나 이벤트가 많은 블록을 포함하면, 응답이 지연되거나 타임아웃이 발생할 수 있습니다.
>
> 빠른 응답을 원하신다면 다음 권장사항을 참고하세요:
>
> - fromBlock ~ toBlock 범위는 1000 블록 이하로 설정하는 것이 좋습니다.
> - 특히 blockTag에 latest를 사용하는 경우, 내부적으로 명확한 블록 번호를 알 수 없어 응답 시간이 길어질 수 있습니다.
  이 경우, eth_blockNumber로 최신 블록 번호를 조회한 후 명시적으로 지정하세요.
`;

// eth_getBlockByHash, eth_getBlockByNumber
export const ethGetBlockByInfoMessage = `
> 🚧 응답 시간이 오래 걸리나요? 트랜잭션을 함께 요청하면 응답시간이 길어질 수 있습니다!
>
> 특정 블록에 대한 모든 정보를 요청할 때, 해당 블록에 많은 트랜잭션이 포함된 경우 응답 시간이 길어질 수 있습니다.
> 만약 빠른 응답을 원한다면 요청 시 블록의 트랜잭션을 제외하고 블록 헤더만 요청하세요 (include transactions=false).
`;

// eth_call
export const ethCallInfoMessage = `
> 🚧 응답 시간이 오래 걸리나요? 함수 복잡성에 따라 응답 시간이 길어질 수 있습니다!
>
> 특정 상태에서의 스마트 컨트랙트 함수를 실행할 때, 함수의 복잡성에 따라 응답 시간이 길어질 수 있습니다.
> 만약 빠른 응답을 원한다면 실행할 함수를 최적화하고, 함수의 실행 결과를 최소화하세요.
`;

// eth_getTransactionReceipt
export const ethGetTransactionReceiptInfoMessage = `
> 🚧 응답 시간이 오래 걸리나요? 트랜잭션 상태에 따라 응답 시간이 길어질 수 있습니다!
>
> 특정 트랜잭션의 정보를 조회할 때, 해당 트랜잭션에 포함된 이벤트 로그의 양, 블록 내 트랜잭션 순서 등에 따라 응답 시간이 길어질 수 있습니다.
> 만약 빠른 응답을 원한다면 트랜잭션의 이벤트 로그를 제외하고 요청하세요.
`;

export const ethGetBlockReceiptsInfoMessage = `
> 🚧 응답 시간이 오래 걸리시나요? 블록 내 트랜잭션 수에 따라 응답 시간이 길어질 수 있습니다!
>
> eth_getBlockReceipts는 특정 블록에 포함된 모든 트랜잭션의 실행 결과(receipts)를 한 번에 조회합니다. 이때 트랜잭션 수가 많거나 실행 결과가 복잡한 경우, 응답 시간이 지연될 수 있습니다.
>
> 빠른 응답을 원하신다면 다음 권장사항을 참고하세요:
>
> - 특정 트랜잭션만 필요한 경우, eth_getTransactionReceipt를 사용하여 원하는 트랜잭션의 실행 결과만 개별 조회하는 것을 권장합니다.
`;