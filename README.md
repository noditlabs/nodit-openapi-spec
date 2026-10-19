# nodit-openapi-spec

This repository contains the OpenAPI specifications for [Nodit](https://developer.nodit.io/)'s Web3 Data APIs, Node APIs, Webhook APIs, and related blockchain services.

[![OpenAPI 3.1](https://img.shields.io/badge/OpenAPI-3.1-blue.svg)](https://swagger.io/specification/)

The specs are generated from the Nodit developer documentation release that is live on [developer.nodit.io](https://developer.nodit.io/). The [Nodit MCP server](https://github.com/noditlabs/nodit-mcp-server) ships this `reference/` tree. See [How `reference/` is produced](#how-reference-is-produced).

## Repository layout

```
reference/
├── manifest.json              # Index of every chain × API surface and the methods supported
├── chains/                    # Per-chain specs
│   └── <chain>/
│       ├── node-api/          # JSON-RPC / chain-native node methods (+ websocket/*.md)
│       ├── cometbft-api/      # CometBFT JSON-RPC and REST (Cosmos-based chains)
│       ├── cosmos-rest-api/   # Cosmos SDK REST (Cosmos-based chains)
│       ├── fullnode-http-api/ # Tron FullNode HTTP API
│       ├── fullnode-solidity-http-api/  # Tron FullNode Solidity HTTP API
│       ├── grpc-api/          # Sui gRPC API
│       ├── web3-data-api/     # Indexed Web3 Data API endpoints
│       ├── webhook-api/       # Webhook subscription endpoints
│       └── flexible-webhook-api/  # Flexible Webhook (stream-based) endpoints
└── services/                  # Product-level specs (one document per product, chain as a parameter)
    ├── web3-data-api/
    ├── webhook-api/
    ├── flexible-webhook-api/
    └── multichain-api/
```

Each `*.yaml` file is a self-contained OpenAPI 3.1 document describing a single endpoint, method, or resource group.

### `reference/chains/`

Specs are grouped by chain, then by API surface. The internal layout of the Node API portion mirrors the chain's native namespacing:

| Chain family | Node API sub-structure |
| ------------ | ---------------------- |
| EVM chains   | `node-api/{debug,eth,net,web3,websocket}/` plus chain namespaces: `trace/` (Ethereum), `bor/` (Polygon), `op-stack/` (OP Stack chains), `kaia/` and `klay/` (Kaia). `websocket/` holds Markdown pages for `eth_subscribe`, `eth_unsubscribe` and the Nodit subscription types. |
| Aptos        | `node-api/{accounts,blocks,events,general,tables,transactions,view}/` |
| Solana       | `node-api/{http,websocket}/` — HTTP RPC methods as YAML, subscribe/unsubscribe methods as Markdown under `websocket/`. |
| Sui          | `node-api/{sui,suix,unsafe}/`, and `grpc-api/<Service>/` for the gRPC API. |
| Tron         | `node-api/{build-transaction,eth,net,web3}/` (JSON-RPC), `fullnode-http-api/` and `fullnode-solidity-http-api/`. |
| XRPL         | `node-api/{account,ledger,path-and-order-book,payment-channel,server-info,transaction,utility,vault}/` |
| Bitcoin      | `node-api/{blockchain,rawtransactions,util}/` |
| Cosmos-based | `cometbft-api/{json-rpc-api,rest-api}/` and `cosmos-rest-api/` at the chain root (Injective and Sei additionally have an EVM-style `node-api/`). |

`web3-data-api/`, `webhook-api/`, and `flexible-webhook-api/` use a flat resource grouping (e.g. `blockchain.yaml`, `native.yaml`, `nft.yaml`, `token.yaml`, `stats.yaml`, `ens.yaml`, `asset.yaml`, `webhook.yaml`, `flexible-webhook.yaml`). The exact set of files depends on what each chain supports.

### `reference/services/`

Product-level documents, as the developer site renders them: one operation per API, with the chain and network as path parameters (`x-enum-by` lists the networks of each chain). The Webhook document also contains the chain-independent Address Set APIs.

### `reference/manifest.json`

A machine-readable index describing, for every chain, which API surfaces are supported and which methods/resources exist under each. The Nodit MCP server reads this file, so its layout is kept stable:

```jsonc
{
  "chains": {
    "<chain>": {
      "nodeApi": {
        "supported": true,
        // EVM chains:      "evmJsonrpc": { "apis": [...], "websocketApis": [...] }
        // other families:  "apis": [...], "websocketApis": [...]          (websocketApis only when present)
        // Cosmos-based:    "cometbftJsonrpc": { "apis": [...] }, "cometbftRest": { "apis": [...] },
        //                  "cosmosRest": { "apis": [...] }
      },
      "web3DataApi":        { "supported": true, "apis": [ "<section>/<operation>", ... ] },
      "webhookApi":         { "supported": true, "type": "evm" | "aptos" | "tron", "apis": [ ... ] },
      "flexibleWebhookApi": { "supported": true, "apis": [ ... ] },
      "multichainApi":      { "supported": true, "apis": [ ... ] }
    }
  },
  "summary": {
    "totalChains": 30, "nodeApiChains": 26, "web3DataApiChains": 18,
    "webhookApiChains": 12, "flexibleWebhookApiChains": 12, "multichainApiChains": 17
  },
  "services": {
    "<service>": { "apis": { "<api key>": [ "<chain>-<network>", ... ] } }
  }
}
```

Notes:

- Each chain entry has five API axes. Axes a chain does not expose are `{ "supported": false }`.
- `nodeApi.apis` / `evmJsonrpc.apis` entries are file paths under `node-api/` without `.yaml`; `cometbft*`/`cosmosRest` entries are file names under their directories.
- `web3DataApi.apis` entries are `<section file>/<operation>`; the section file is `web3-data-api/<section>.yaml`.
- `webhookApi.type` tells which webhook spec shape applies (`evm`, `aptos` or `tron`).
- `services.<service>.apis` maps each API (`<section>/<operation>` for `web3-data-api`, the file name for `multichain-api`, the operationId otherwise) to the chain-networks it supports. Chain-independent APIs (the Webhook Address Set APIs) map to `[]`.
- Tron `fullnode-http-api/`, `fullnode-solidity-http-api/` and Sui `grpc-api/` have no manifest key; their files are in `reference/` for other readers.

## How `reference/` is produced

```bash
pip install -r scripts/requirements.txt
./scripts/sync-reference.sh --docs-ref <tag>     # add --push to push the branch
```

1. **Source**: the `nodit-docs-migration` release tag that is live on developer.nodit.io, given explicitly with `--docs-ref`, so that only published APIs are included. The deploy history cannot tell the live release after a rollback; run the script without `--docs-ref` to list the recent production deploy and rollback runs (needs `gh` with read access to `Lambda256/nodit-docs-migration`).
2. **Build**: the docs repository's own generator (`python3 scripts/api.py build`), then its `scripts/sync_api_spec.py`. The regenerated `api-spec/`, `menu/` and `languages/` must equal the files committed in the tag, i.e. the published site matches the source the build came from. The English build is used.
3. **Select and transform** (`scripts/sync_reference.py`):
   - copies only the specs the developer site publishes, and the English WebSocket method pages without their front matter;
   - removes `components` entries that no operation in the file references (`securitySchemes` is kept);
   - in the directories the MCP server loads, replaces parameter `$ref`s with the referenced Parameter Object.

   Every operation is checked to be semantically equal to the docs build once `$ref`s are resolved, along with no broken `$ref`, every operation coming from a public source template (none from an `x-is-public: false` one), and every file/operation being referenced by the published site menu. Any failure stops the run.
4. **Manifest** (`scripts/build_manifest.py`): generated from the files, with the family of each chain taken from the docs' `oas/chains.yaml`. The run fails if the key layout differs from the previous `manifest.json` or if `services` and the per-chain axes disagree.
5. The script replaces `reference/` and commits (on a new `sync/reference-*` branch when run on `main`; a branch must contain `origin/main`). If a step fails after `reference/` was replaced, `reference/` is restored. The gate report of the last run is written to `.sync/sync-report.json` (not committed).

`./scripts/sync-reference.sh --docs-ref <tag> --no-transform` produces the docs build as is, which is useful to review a transform change separately.

## Supported chains

The matrix below mirrors the `supported` flags in `manifest.json` (30 chains total: 26 Node API, 18 Web3 Data API, 12 Webhook API, 12 Flexible Webhook API, 17 Multichain API).

| Chain            | Node API | Web3 Data API | Webhook API | Flexible Webhook API | Multichain API |
| ---------------- | :------: | :-----------: | :---------: | :------------------: | :------------: |
| Aptos            | ✓        | ✓             | ✓           | ✓                    | ✓              |
| Arbitrum         | ✓        | ✓             | ✓           | ✓                    | ✓              |
| Arc              | ✓        | ✓             | ✓           | ✓                    | ✓              |
| Avalanche        | ✓        | ✓             | ✓           | ✓                    |                |
| Babylon          | ✓        |               |             |                      |                |
| Base             | ✓        | ✓             | ✓           | ✓                    | ✓              |
| Bitcoin          | ✓        | ✓             |             |                      | ✓              |
| Bitcoin Cash     |          | ✓             |             |                      | ✓              |
| BNB              | ✓        | ✓             | ✓           | ✓                    | ✓              |
| Celestia         | ✓        |               |             |                      |                |
| Chiliz           |          | ✓             |             |                      | ✓              |
| Cosmos           | ✓        |               |             |                      |                |
| Cronos POS       | ✓        |               |             |                      |                |
| Dogecoin         |          | ✓             |             |                      | ✓              |
| Ethereum         | ✓        | ✓             | ✓           | ✓                    | ✓              |
| Ethereum Classic |          | ✓             |             |                      | ✓              |
| GIWA             | ✓        | ✓             | ✓           | ✓                    | ✓              |
| Hippo Protocol   | ✓        |               |             |                      |                |
| Initia           | ✓        |               |             |                      |                |
| Injective        | ✓        |               |             |                      |                |
| Kaia             | ✓        | ✓             | ✓           | ✓                    | ✓              |
| Metal            | ✓        |               |             |                      |                |
| Optimism         | ✓        | ✓             | ✓           | ✓                    | ✓              |
| Polygon          | ✓        | ✓             | ✓           | ✓                    | ✓              |
| Sei              | ✓        |               |             |                      |                |
| Solana           | ✓        |               |             |                      |                |
| Sui              | ✓        |               |             |                      |                |
| Tron             | ✓        | ✓             | ✓           | ✓                    | ✓              |
| World Chain      | ✓        |               |             |                      |                |
| XRPL             | ✓        | ✓             |             |                      | ✓              |
