# nodit-openapi-spec

This repository contains the OpenAPI specifications for [Nodit](https://developer.nodit.io/)'s Web3 Data APIs, Node APIs, Webhook APIs, and related blockchain services.

[![OpenAPI 3.1](https://img.shields.io/badge/OpenAPI-3.1-blue.svg)](https://swagger.io/specification/)

## Repository layout

```
reference/
├── manifest.json              # Index of every chain × API surface and the methods supported
├── chains/                    # Per-chain specs
│   └── <chain>/
│       ├── node-api/          # JSON-RPC / chain-native node methods
│       ├── web3-data-api/     # Indexed Web3 Data API endpoints
│       └── webhook-api/       # Webhook subscription endpoints
└── services/                  # Cross-chain (chain-agnostic) service specs
    ├── multichain-api/
    ├── web3-data-api/
    └── webhook-api/
```

Each `*.yaml` file is a self-contained OpenAPI 3.1 document describing a single endpoint, method, or resource group.

### `reference/chains/`

Specs are grouped by chain, then by API surface. The internal layout of the Node API portion varies by chain family because it mirrors the chain's native namespacing:

| Chain family       | Node API sub-structure                                                                        |
| ------------------ | --------------------------------------------------------------------------------------------- |
| EVM chains         | `node-api/{debug,eth,net,web3,websocket}/` — Ethereum additionally has `trace/`. `websocket/` holds Markdown specs for `eth_subscribe`/`eth_unsubscribe`. |
| Aptos              | `node-api/{accounts,blocks,events,general,tables,transactions,view}/`                         |
| Solana             | `node-api/{http,websocket}/` — HTTP RPC methods as YAML, subscribe/unsubscribe methods as Markdown under `websocket/`. |
| Sui                | `node-api/{sui,suix,unsafe}/`                                                                 |
| Cosmos-based       | `cometbft-api/{json-rpc-api,rest-api}/` and `cosmos-rest-api/` directories at the chain root (Injective and Sei additionally have an EVM-style `node-api/`). |

`web3-data-api/` and `webhook-api/` use a flat resource grouping (e.g. `blockchain.yaml`, `native.yaml`, `nft.yaml`, `token.yaml`, `stats.yaml`, `ens.yaml`, `asset.yaml`, `webhook.yaml`). The exact set of resource files present depends on what each chain supports.

### `reference/services/`

Cross-cutting service specs whose definitions are shared across many chains:

- `multichain-api/` — cross-chain lookup endpoints (e.g. `lookupEntities`). Per-chain coverage is reported under each chain's `multichainApi` entry in `manifest.json`.
- `web3-data-api/` — shared Web3 Data API resource definitions referenced by chain-specific Web3 Data specs.
- `webhook-api/` — shared webhook subscription definitions referenced by chain-specific Webhook specs.

### `reference/manifest.json`

A machine-readable index describing, for every chain, which API surfaces are supported and which methods/resources exist under each. The top-level shape is:

```jsonc
{
  "chains": {
    "<chainName>": {
      "nodeApi":       { "supported": true, "apis": [ ... ] },
      "web3DataApi":   { "supported": true, "apis": [ ... ] },
      "webhookApi":    { "supported": true, "type": "evm" | "aptos", "operations": [ ... ] },
      "multichainApi": { "supported": true, "apis": [ ... ] }
    }
  },
  "summary": {
    "totalChains": 31,
    "nodeApiChains": 24,
    "web3DataApiChains": 20,
    "webhookApiChains": 10,
    "multichainApiChains": 17
  }
}
```

Notes:

- Each chain entry has four API axes: `nodeApi`, `web3DataApi`, `webhookApi`, and `multichainApi`. Set `supported: false` for axes the chain does not expose.
- `webhookApi` uses `operations` (not `apis`) and adds a `type` discriminator (`evm` or `aptos`) that indicates which webhook spec shape applies.
- For Cosmos-based chains, the CometBFT and Cosmos REST endpoints are both reported under `nodeApi`, even though the underlying YAML files live in separate `cometbft-api/` and `cosmos-rest-api/` directories on disk.

## Supported chains

The matrix below mirrors the `supported` flags in `manifest.json` (31 chains total: 24 Node API, 20 Web3 Data API, 10 Webhook API, 17 Multichain API).

| Chain            | Node API | Web3 Data API | Webhook API | Multichain API |
| ---------------- | :------: | :-----------: | :---------: | :------------: |
| Aptos            | ✓        | ✓             | ✓           | ✓              |
| Arbitrum         | ✓        | ✓             | ✓           | ✓              |
| Arc              | ✓        | ✓             | ✓           |                |
| Avalanche        | ✓        |               |             |                |
| Babylon          | ✓        |               |             |                |
| Base             | ✓        | ✓             | ✓           | ✓              |
| Bitcoin          |          | ✓             |             | ✓              |
| Bitcoin Cash     |          | ✓             |             | ✓              |
| BNB              | ✓        | ✓             | ✓           | ✓              |
| Celestia         | ✓        |               |             |                |
| Chiliz           |          | ✓             |             | ✓              |
| Cosmos           | ✓        |               |             |                |
| Cronos PoS       | ✓        |               |             |                |
| Dogecoin         |          | ✓             |             | ✓              |
| Ethereum         | ✓        | ✓             | ✓           | ✓              |
| Ethereum Classic |          | ✓             |             | ✓              |
| Giwa             | ✓        | ✓             | ✓           | ✓              |
| Hippo            | ✓        |               |             |                |
| Initia           | ✓        |               |             |                |
| Injective        | ✓        |               |             |                |
| Kaia             | ✓        | ✓             | ✓           | ✓              |
| Luniverse        | ✓        | ✓             |             | ✓              |
| Metal            | ✓        | ✓             |             |                |
| Optimism         | ✓        | ✓             | ✓           | ✓              |
| Polygon          | ✓        | ✓             | ✓           | ✓              |
| Sei              | ✓        |               |             |                |
| Solana           | ✓        |               |             |                |
| Sui              | ✓        |               |             |                |
| Tron             |          | ✓             |             | ✓              |
| World Chain      | ✓        | ✓             |             |                |
| XRPL             |          | ✓             |             | ✓              |
