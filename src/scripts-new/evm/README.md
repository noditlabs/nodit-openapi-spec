# EVM Scripts

EVM 체인의 API 문서를 ReadMe에 업로드/업데이트/삭제하는 스크립트 모음입니다.

## 📁 스크립트 목록

### 1. create.ts - API 생성

일반 EVM API를 생성합니다 (WebSocket 메소드 제외).

```bash
npm run evm:create <version> <chain> [namespace]
```

**예시:**

```bash
npm run evm:create 1.2.24 arc eth
npm run evm:create 1.2.24 ethereum
```

**참고:**

- `eth_subscribe`, `eth_unsubscribe`는 자동으로 스킵됩니다
- 이 메소드들은 `create-websocket.ts`를 사용하세요

---

### 2. update.ts - API 업데이트

기존 EVM API를 업데이트합니다 (WebSocket 메소드 제외).

```bash
npm run evm:update <version> <chain> [namespace]
```

**예시:**

```bash
npm run evm:update 1.2.24 arc eth
```

---

### 3. delete.ts - API 삭제

EVM API를 삭제합니다.

```bash
npm run evm:delete <version> <chain>
```

**예시:**

```bash
npm run evm:delete 1.2.24 arc
```

---

### 4. create-websocket.ts - WebSocket 메소드 업데이트

`eth_subscribe`, `eth_unsubscribe` 문서를 업데이트합니다.

```bash
npm run evm:websocket <version> <chain>
```

**예시:**

```bash
npm run evm:websocket 1.2.24 arc
```

**중요:**

- 이 스크립트는 **업데이트만** 가능합니다
- 문서가 존재하지 않으면 먼저 ReadMe UI에서 수동으로 생성해야 합니다

**수동 생성 방법:**

1. ReadMe 웹사이트 접속
2. 해당 버전 선택
3. 카테고리: `{chain}` (예: `arc`)
4. 부모 문서: `{chain}-eth` (예: `arc-eth`)
5. 새 문서 생성:
   - Title: `eth_subscribe` 또는 `eth_unsubscribe`
   - Slug: `eth_subscribe` 또는 `{chain}-eth_subscribe`
   - Content: 임시 내용 (나중에 스크립트로 업데이트)
6. 저장 후 `npm run evm:websocket` 실행

---

### 5. move.ts - 문서 이동

EVM API 문서를 다른 카테고리로 이동합니다.

```bash
npm run evm:move <version> <chain>
```

**참고:** ReadMe API v2 제한으로 현재 작동하지 않을 수 있습니다.

---

### 6. hidden.ts - 문서 숨김 처리

EVM 문서를 숨김 처리하거나 공개합니다.

```bash
npm run evm:hidden <version> <chain>
```

**참고:** ReadMe API v2 제한으로 현재 작동하지 않을 수 있습니다.

---

## 🔧 지원 체인

- ethereum
- polygon
- arbitrum (arc)
- optimism
- base
- avalanche
- kaia
- 기타 EVM 호환 체인

---

## 📝 WebSocket 메소드 처리 가이드

### 왜 별도로 처리해야 하나요?

`eth_subscribe`와 `eth_unsubscribe`는:

- Markdown 파일로 작성됨 (.md)
- 일반 API spec이 아님
- ReadMe API v2의 `/branches/{version}/docs` 엔드포인트가 404 반환

### 처리 순서

1. **첫 번째 실행 (일반 API 생성)**

   ```bash
   npm run evm:create 1.2.24 arc eth
   ```

   - 일반 API들이 생성됨
   - WebSocket 메소드는 자동 스킵

2. **ReadMe UI에서 WebSocket 문서 생성**

   - 수동으로 `eth_subscribe`, `eth_unsubscribe` 문서 생성
   - 임시 내용으로 저장

3. **WebSocket 문서 업데이트**
   ```bash
   npm run evm:websocket 1.2.24 arc
   ```
   - Markdown 파일 내용으로 업데이트

---

## ⚠️ 알려진 제한사항

### ReadMe API v2 이슈

다음 기능들은 ReadMe API v2의 제한으로 작동하지 않을 수 있습니다:

1. **문서 생성** (`/branches/{version}/docs` POST)

   - 404 에러 반환
   - WebSocket 메소드 자동 생성 불가

2. **카테고리 조회** (`/branches/{version}/categories` GET)

   - 404 에러 반환
   - move, hidden 스크립트 영향

3. **카테고리별 문서 조회** (`/branches/{version}/categories/{slug}/docs` GET)
   - 422 에러 반환
   - move, hidden 스크립트 영향

### 해결 방법

- WebSocket 메소드: 수동 생성 후 스크립트로 업데이트
- move/hidden: ReadMe 웹 UI에서 수동 처리

---

## 🆘 문제 해결

### "API specification already exists" (409)

이미 존재하는 API입니다. `evm:update`를 사용하세요.

### "API specification not found" (404)

API가 존재하지 않습니다. `evm:create`를 먼저 실행하세요.

### "Request failed with status code 500"

ReadMe API 내부 오류입니다. 잠시 후 다시 시도하거나 ReadMe 지원팀에 문의하세요.

### WebSocket 메소드가 업데이트되지 않음

1. ReadMe UI에서 문서가 존재하는지 확인
2. Slug가 올바른지 확인 (예: `eth_subscribe` 또는 `arc-eth_subscribe`)
3. 수동으로 생성 후 다시 시도

---

## 📚 참고 자료

- [ReadMe API Documentation](https://docs.readme.com/main/reference)
- [EVM Node API Methods](../../categories/evm-node-api/methods/)
