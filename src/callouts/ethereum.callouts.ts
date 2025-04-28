// eth_getLogs
export const ethGetLogsInfoMessage = `
> 🚧 응답 시간이 오래 걸리나요? 블록 범위에 따라 응답 시간이 길어질 수 있습니다!
>
> 특정 블록 범위 내의 이벤트 로그를 검색할 때, 검색 범위가 넓거나 많은 이벤트가 발생한 블록을 포함하는 경우 응답 시간이 길어질 수 있습니다.
> 만약 빠른 응답을 원한다면 검색 범위를 좁히고, 특정 이벤트 필터를 추가하여 요청하는 데이터를 최소화하세요.
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

// eth_getBlockReceipts
export const ethGetBlockReceiptsInfoMessage = `
> 🚧 응답 시간이 오래 걸리나요? 블록 범위에 따라 응답 시간이 길어질 수 있습니다!
>
> 특정 블록을 조회할 때, 해당 블록에 포함된 트랜잭션의 양, 트랜잭션의 실행 결과 등에 따라 응답 시간이 길어질 수 있습니다.
> 만약 빠른 응답을 원한다면 eth_getTransactionReceipt를 사용하여 원하는 트랜잭션의 실행 결과만 조회하세요.
`;
