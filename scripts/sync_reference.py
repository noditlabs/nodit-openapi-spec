#!/usr/bin/env python3
"""Build the `reference/` tree (without manifest.json) from a nodit-docs-migration build.

Usage:
    python3 scripts/sync_reference.py <docs_build_dir> <out_reference_dir> --docs-repo <docs_checkout> [options]

<docs_build_dir> is the output of `python3 scripts/api.py build --locale en --out <dir>` run in <docs_checkout>
(it contains chains/ and services/). <docs_checkout> must be the same commit that produced the build: it provides
the YAML writer, the WebSocket method pages and the inputs of the public-scope gate. scripts/sync-reference.sh
prepares both.

File selection (fail-closed: anything not listed here aborts the run):
    chains/<chain>/{node-api, cometbft-api, cosmos-rest-api, web3-data-api, webhook-api, flexible-webhook-api}/**.yaml
        -> the directories the Nodit MCP server loads
    chains/<chain>/{fullnode-http-api, fullnode-solidity-http-api, grpc-api}/**.yaml
        -> published on the developer site, not loaded by the MCP server
    services/{web3-data-api, webhook-api, flexible-webhook-api, multichain-api}/**.yaml
        -> published on the developer site, not loaded by the MCP server
    services/node-api/** is skipped: the developer site does not publish it (docs sync_api_spec.py
        SERVICES_WITHOUT_MENU).
    chains/<chain>/node-api/websocket/<method>.md
        -> WebSocket method pages, copied from <docs_checkout>/languages/en/menu/chains/<chain>/rpc-api/websocket/
           (pages listed in menu/chains/<chain>/rpc-api/websocket/_order.json), front matter removed,
           file name lowercased.

Transforms (off with --no-transform):
    T1  every YAML file: delete components entries not reachable from the file's non-components part (transitive,
        cycle-safe). components.securitySchemes is kept whole. Reachability is computed on the docs build as is.
    T2  MCP chain directories only: operation parameters that are local Reference Objects are replaced with a copy
        of the referenced Parameter Object (a `description` sibling overrides). Any other sibling key, `summary`
        included (a Parameter Object has no summary), -> left as $ref and reported.
        Then a parameter `schema` that is a local $ref with only annotation siblings is inlined one level.
Files a transform does not change are copied byte for byte. Changed files are written with the docs generator's own
YAML writer (scripts/oasgen/yamlio.py, imported from <docs_checkout>, never vendored).

Gates (any failure -> exit code 1, after writing the report):
    G1 unchanged files are byte-identical to the build; changed files re-read to the transformed structure
    G2 every operation is semantically equal to the build: $refs are resolved on both sides and compared
       coinductively (cycle-safe); literal data (example/default/enum/const/x-*) is compared literally
    G3 top-level keys and components.securitySchemes unchanged; every kept components entry unchanged
    G4 no broken or non-local $ref in the output
    G5 public scope:
       (a) the string `x-is-public` appears nowhere in the output,
       (b) every operation matches a source template under oas/apis, and not only templates marked
           `x-is-public: false` (matched by operationId and covered chains; CometBFT/Cosmos/gRPC by file path),
       (c) every path-rendered chain file is referenced by menu/**/_order.json apiSpec, every per-chain
           data/webhook operation appears (same operationId, chain in the `chain` enum) in a menu-referenced
           api-spec/services file, and every services operation appears in a menu-referenced api-spec file
           of the same service.
    G6 every WebSocket page listed in a menu _order.json exists in the English menu tree.

Options:
    --no-transform          copy the selection only
    --report PATH           write the JSON report there (default: <out_reference_dir>/../<name>.report.json)
    --replace               delete <out_reference_dir> first if it exists
Deterministic: same inputs -> byte-identical output tree (files are processed in sorted order, no timestamps).
"""
from __future__ import annotations

import sys

sys.dont_write_bytecode = True  # never leave __pycache__ in the docs checkout we import yamlio from

import argparse
import collections
import copy
import hashlib
import importlib.util
import json
import os
import re
import shutil
from pathlib import Path

MCP_CHAIN_DIRS = ("node-api", "cometbft-api", "cosmos-rest-api", "web3-data-api", "webhook-api", "flexible-webhook-api")
SITE_ONLY_CHAIN_DIRS = ("fullnode-http-api", "fullnode-solidity-http-api", "grpc-api")
SERVICES_KEEP = ("web3-data-api", "webhook-api", "flexible-webhook-api", "multichain-api")
SERVICES_SKIP = ("node-api",)
PATH_RENDERED_DIRS = ("node-api", "cometbft-api", "cosmos-rest-api") + SITE_ONLY_CHAIN_DIRS
SERVICE_RENDERED_DIRS = ("web3-data-api", "webhook-api", "flexible-webhook-api")

ALL_METHODS = ("get", "post", "put", "patch", "delete", "options", "head", "trace")
LITERAL_KEYS = frozenset({"example", "default", "enum", "const"})
NAME_MAP_KEYS = frozenset({"properties", "patternProperties", "$defs", "definitions", "dependentSchemas", "headers",
                           "content", "encoding", "links", "callbacks"})
SCHEMA_SIBLINGS_OK = frozenset({"description", "title", "example", "examples", "default", "deprecated", "readOnly",
                                "writeOnly", "$comment"})
PARAM_REF_SIBLINGS_OK = frozenset({"description"})  # a Parameter Object has no summary


class _Sentinel:
    __slots__ = ("name",)

    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return self.name


MISSING = _Sentinel("MISSING")


def import_yamlio(repo: Path):
    path = repo / "scripts" / "oasgen" / "yamlio.py"
    if not path.is_file():
        sys.exit(f"{repo} is not a nodit-docs-migration checkout (missing scripts/oasgen/yamlio.py)")
    spec = importlib.util.spec_from_file_location("nodit_docs_yamlio", path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod, hashlib.sha256(path.read_bytes()).hexdigest()


# ─── JSON pointer / refs ─────────────────────────────────────────────────────

def is_ref(o) -> bool:
    return isinstance(o, dict) and isinstance(o.get("$ref"), str)


def unesc(s: str) -> str:
    return s.replace("~1", "/").replace("~0", "~")


def ptr(doc, ref: str):
    if not ref.startswith("#"):
        return MISSING
    node = doc
    body = ref[1:]
    if body == "":
        return doc
    if not body.startswith("/"):
        return MISSING
    for part in body[1:].split("/"):
        part = unesc(part)
        if isinstance(node, dict):
            if part not in node:
                return MISSING
            node = node[part]
        elif isinstance(node, list):
            if not part.isdigit() or int(part) >= len(node):
                return MISSING
            node = node[int(part)]
        else:
            return MISSING
    return node


def collect_refs(o, acc: list) -> list:
    """All $ref strings under o, plus discriminator.mapping targets (a bare name means #/components/schemas/<name>)."""
    stack = [o]
    while stack:
        n = stack.pop()
        if isinstance(n, dict):
            r = n.get("$ref")
            if isinstance(r, str):
                acc.append(r)
            disc = n.get("discriminator")
            if isinstance(disc, dict) and isinstance(disc.get("mapping"), dict):
                for v in disc["mapping"].values():
                    if isinstance(v, str):
                        acc.append(v if "#" in v or "/" in v else f"#/components/schemas/{v}")
            stack.extend(n.values())
        elif isinstance(n, list):
            stack.extend(n)
    return acc


def broken_local_refs(doc) -> list:
    return sorted({r for r in collect_refs(doc, []) if r.startswith("#") and ptr(doc, r) is MISSING})


def nonlocal_refs(doc) -> list:
    return sorted({r for r in collect_refs(doc, []) if not r.startswith("#")})


# ─── T1 prune ────────────────────────────────────────────────────────────────

def prune_components(doc) -> list:
    """Delete components entries unreachable from the non-components part. Returns removed '<section>/<name>'."""
    comps = doc.get("components") if isinstance(doc, dict) else None
    if not isinstance(comps, dict):
        return []
    todo = []
    for k, v in doc.items():
        if k != "components":
            collect_refs(v, todo)
    keep = set()
    while todo:
        r = todo.pop()
        if not r.startswith("#/components/"):
            if r.startswith("#/") and ptr(doc, r) is not MISSING:
                collect_refs(ptr(doc, r), todo)
            continue
        parts = r[len("#/components/"):].split("/")
        if len(parts) < 2:
            continue
        key = (unesc(parts[0]), unesc(parts[1]))
        if key in keep:
            continue
        keep.add(key)
        sec = comps.get(key[0])
        if isinstance(sec, dict) and key[1] in sec:
            collect_refs(sec[key[1]], todo)
    removed = []
    for sec in list(comps.keys()):
        items = comps[sec]
        if sec == "securitySchemes" or not isinstance(items, dict) or not items:
            continue
        for name in list(items.keys()):
            if (sec, name) not in keep:
                del items[name]
                removed.append(f"{sec}/{name}")
        if not items:
            del comps[sec]
    return removed


# ─── T2 parameters ───────────────────────────────────────────────────────────

def deref_chain(doc, node):
    """Follow a chain of pure Reference Objects. Returns (target, refs) or (MISSING, reason)."""
    seen = []
    cur = node
    while is_ref(cur):
        r = cur["$ref"]
        if not r.startswith("#"):
            return MISSING, "nonlocal"
        if r in seen:
            return MISSING, "loop"
        seen.append(r)
        if len(seen) > 1 and len(cur) > 1:
            return MISSING, "chained-ref-with-siblings"
        cur = ptr(doc, r)
        if cur is MISSING:
            return MISSING, "broken"
    return cur, seen


def inline_parameters(doc, op, st, where, notes):
    params = op.get("parameters")
    if not isinstance(params, list):
        return
    for i, p in enumerate(params):
        if is_ref(p):
            extra = sorted(k for k in p if k != "$ref" and k not in PARAM_REF_SIBLINGS_OK)
            if extra:
                st["param_ref_kept_sibling"] += 1
                notes.append(f"{where} parameters[{i}] {p['$ref']} kept as $ref: sibling key(s) {extra}")
                continue
            tgt, info = deref_chain(doc, p)
            if tgt is MISSING or not isinstance(tgt, dict):
                st["param_ref_kept_" + (info if isinstance(info, str) else "nondict")] += 1
                notes.append(f"{where} parameters[{i}] {p['$ref']} kept as $ref: {info}")
                continue
            new = copy.deepcopy(tgt)
            if "description" in p:
                new["description"] = copy.deepcopy(p["description"])
            params[i] = new
            st["param_ref_inlined"] += 1
            p = new
        if isinstance(p, dict) and is_ref(p.get("schema")):
            s = p["schema"]
            extra = sorted(k for k in s if k != "$ref" and k not in SCHEMA_SIBLINGS_OK)
            if extra:
                st["param_schema_ref_kept_sibling"] += 1
                notes.append(f"{where} parameters[{i}].schema {s['$ref']} kept as $ref: sibling key(s) {extra}")
                continue
            # one level: follow pure ref chains to the first concrete schema, do not touch refs inside it
            tgt, info = deref_chain(doc, {"$ref": s["$ref"]})
            if tgt is MISSING or not isinstance(tgt, dict):
                st["param_schema_ref_kept_" + (info if isinstance(info, str) else "nondict")] += 1
                notes.append(f"{where} parameters[{i}].schema {s['$ref']} kept as $ref: {info}")
                continue
            new = copy.deepcopy(tgt)
            for k, v in s.items():
                if k != "$ref":
                    new[k] = copy.deepcopy(v)
            p["schema"] = new
            st["param_schema_ref_inlined"] += 1


# ─── G2 semantic equality (coinductive, cycle-safe) ──────────────────────────

class Resolver:
    def __init__(self, doc):
        self.doc = doc
        self.cache = {}

    def __call__(self, node):
        if not is_ref(node):
            return node
        nid = id(node)
        hit = self.cache.get(nid)
        if hit is not None:
            return hit
        self.cache[nid] = ("LOOP", node["$ref"])
        tgt = ptr(self.doc, node["$ref"])
        if tgt is MISSING:
            eff = ("BROKEN", node["$ref"])
        else:
            eff = self(tgt)
            sib = {k: v for k, v in node.items() if k != "$ref"}
            if sib and isinstance(eff, dict):
                eff = {**eff, **sib}
        self.cache[nid] = eff
        return eff


def strict_eq(a, b) -> bool:
    if isinstance(a, bool) or isinstance(b, bool):
        return type(a) is type(b) and a == b
    if isinstance(a, (int, float)) and isinstance(b, (int, float)):
        return a == b or (a != a and b != b)
    if isinstance(a, dict) and isinstance(b, dict):
        return a.keys() == b.keys() and all(strict_eq(a[k], b[k]) for k in a)
    if isinstance(a, list) and isinstance(b, list):
        return len(a) == len(b) and all(strict_eq(x, y) for x, y in zip(a, b))
    return type(a) is type(b) and a == b


def child_ctx(ctx, k, val):
    if ctx == "namemap":
        return "normal"
    if ctx == "examples":
        return "exentry"
    if ctx == "exentry":
        return "lit" if k == "value" else "normal"
    if k in LITERAL_KEYS or (isinstance(k, str) and k.startswith("x-")):
        return "lit"
    if k == "examples":
        return "lit" if isinstance(val, list) else "examples"
    if k in NAME_MAP_KEYS:
        return "namemap"
    return "normal"


def sem_equal(a, ra: Resolver, b, rb: Resolver, where=""):
    """True if a (in doc A) and b (in doc B) denote the same structure once every $ref is resolved."""
    visited = set()
    stack = [(a, b, "normal", where)]
    while stack:
        x, y, ctx, path = stack.pop()
        if ctx == "lit":
            if not strict_eq(x, y):
                return False, path
            continue
        if ctx in ("normal", "exentry"):
            x, y = ra(x), rb(y)
        if isinstance(x, (dict, list)) and isinstance(y, (dict, list)):
            key = (id(x), id(y), ctx)
            if key in visited:
                continue
            visited.add(key)
        if isinstance(x, list) or isinstance(y, list):
            if not (isinstance(x, list) and isinstance(y, list)) or len(x) != len(y):
                return False, path
            for i, (cx, cy) in enumerate(zip(x, y)):
                stack.append((cx, cy, "normal", f"{path}[{i}]"))
            continue
        if isinstance(x, dict) or isinstance(y, dict):
            if not (isinstance(x, dict) and isinstance(y, dict)) or x.keys() != y.keys():
                return False, path
            for k in x:
                stack.append((x[k], y[k], child_ctx(ctx, k, x[k]), f"{path}/{k}"))
            continue
        if not strict_eq(x, y):
            return False, path
    return True, ""


# ─── selection ───────────────────────────────────────────────────────────────

def select_files(build: Path):
    """Return (selected [(rel, kind)], skipped [rel]) or exit on anything unexpected."""
    selected, skipped, problems = [], [], []
    for top in sorted(os.listdir(build)):
        if top not in ("chains", "services"):
            problems.append(f"unexpected top-level entry: {top}")
    for root, dirs, files in os.walk(build):
        dirs.sort()
        for f in sorted(files):
            rel = Path(root, f).relative_to(build).as_posix()
            parts = rel.split("/")
            if parts[0] == "chains" and len(parts) >= 4:
                kind = "mcp" if parts[2] in MCP_CHAIN_DIRS else "site" if parts[2] in SITE_ONLY_CHAIN_DIRS else None
                if kind is None:
                    problems.append(f"unknown chain subdirectory: {rel}")
                    continue
            elif parts[0] == "services" and len(parts) >= 3:
                if parts[1] in SERVICES_SKIP:
                    skipped.append(rel)
                    continue
                if parts[1] not in SERVICES_KEEP:
                    problems.append(f"unknown service directory: {rel}")
                    continue
                kind = "service"
            else:
                problems.append(f"unexpected file location: {rel}")
                continue
            if not f.endswith(".yaml"):
                problems.append(f"unexpected file type: {rel}")
                continue
            selected.append((rel, kind))
    if problems:
        sys.exit("selection failed (fail-closed):\n  " + "\n  ".join(problems[:50]))
    return selected, skipped


def product_of(rel: str) -> str:
    parts = rel.split("/")
    return parts[2] if parts[0] == "chains" else "services/" + parts[1]


def iter_ops(doc):
    for pk, item in (doc.get("paths") or {}).items() if isinstance(doc, dict) else []:
        if not isinstance(item, dict):
            continue
        for m in ALL_METHODS:
            op = item.get(m)
            if isinstance(op, dict):
                yield pk, m, op


def stem_of(op_id: str, chain: str | None) -> str:
    if chain:
        i = op_id.find("-")
        if i > 0 and op_id[:i].lower() == chain.lower():
            return op_id[i + 1:]
    return op_id


# ─── WebSocket method pages ──────────────────────────────────────────────────

_FRONT_MATTER = re.compile(r"\A---[ \t]*\r?\n(?:.*?\r?\n)??---[ \t]*(?:\r?\n|\Z)", re.S)


def strip_front_matter(text: str) -> str:
    """Remove a leading YAML front matter block (BOM, CRLF and empty blocks handled)."""
    text = text.lstrip("﻿")
    if text.startswith("---"):
        m = _FRONT_MATTER.match(text)
        if not m:
            raise ValueError("unterminated front matter")
        text = text[m.end():]
    return text.lstrip("\r\n")


def copy_websocket_pages(repo: Path, out: Path, node_chains: set, gate, st) -> list:
    """Copy English WebSocket method pages for chains that have node-api in the build. Returns written rels."""
    written = []
    for order in sorted((repo / "menu" / "chains").glob("*/rpc-api/websocket/_order.json")):
        chain = order.parts[-4]
        if chain not in node_chains:
            continue
        pages = json.loads(order.read_text(encoding="utf-8")).get("order") or []
        en_dir = repo / "languages" / "en" / "menu" / "chains" / chain / "rpc-api" / "websocket"
        for page in pages:
            src = en_dir / f"{page}.md"
            if not src.is_file():
                gate["G6"].append(f"{chain}: websocket page '{page}' listed in {order.relative_to(repo)} has no English file")
                continue
            rel = f"chains/{chain}/node-api/websocket/{page.lower()}.md"
            dst = out / rel
            dst.parent.mkdir(parents=True, exist_ok=True)
            dst.write_text(strip_front_matter(src.read_text(encoding="utf-8")), encoding="utf-8")
            written.append(rel)
            st["websocketPages"] += 1
    return written


# ─── G5 public scope (docs repo inputs) ──────────────────────────────────────

def public_scope_gate(repo: Path, out_ops, notes):
    """out_ops: list of (rel, path_key, method, operationId, services chain enum | None). Returns violations."""
    import yaml
    L = getattr(yaml, "CSafeLoader", yaml.SafeLoader)
    res = {"nonpublicTemplates": [], "nonpublicHits": [], "menuMissingFiles": [], "menuMissingOps": [],
           "apiSpecStale": []}
    chains_cfg = yaml.load((repo / "oas" / "chains.yaml").read_text(encoding="utf-8"), Loader=L)
    chains_list = chains_cfg if isinstance(chains_cfg, list) else chains_cfg.get("chains", [])
    family = {c["id"].lower(): c.get("family") for c in chains_list if isinstance(c, dict) and "id" in c}

    # (b) templates marked x-is-public: false. Each output operation is matched to the source templates it can
    # come from, then flagged when only non-public templates match. Several templates can share one operationId
    # (e.g. a non-public Solana-only getTransactionByHashSolana.yaml next to the public getTransactionByHash.yaml),
    # so a template also has the chains it covers: its `variants` keys (family or chain id) for Data API
    # templates, its family directory for Node API templates, every chain otherwise. CometBFT, Cosmos REST and
    # gRPC templates are matched by file path, because the build derives those operationIds from file names.
    # An output operation that matches no template at all is a failure too: the check could not vouch for it.
    templates = collections.defaultdict(list)  # match key -> [(public, covers: set | None, path)]
    for p in sorted((repo / "oas" / "apis").rglob("*.yaml")):
        try:
            d = yaml.load(p.read_text(encoding="utf-8"), Loader=L)
        except Exception as e:  # noqa: BLE001
            notes.append(f"G5: could not read template {p}: {e}")
            continue
        if not isinstance(d, dict) or not d.get("operationId"):
            continue
        relp = p.relative_to(repo / "oas" / "apis").as_posix()[:-len(".yaml")].split("/")
        prod = relp[0]
        public = d.get("x-is-public") is not False
        if prod == "cometbft-api":
            key, covers = ("file", prod, "/".join(relp[1:])), None
        elif prod == "cosmos-rest-api":
            key, covers = ("file", prod, relp[-1]), ({relp[1]} if len(relp) > 2 else None)
        elif prod == "node-api" and len(relp) > 3 and relp[2] == "grpc-api":
            key, covers = ("file", "grpc-api", "/".join(relp[3:])), {relp[1]}
        else:
            cov = {relp[1]} if prod == "node-api" and len(relp) > 2 else (
                set(d["variants"]) if isinstance(d.get("variants"), dict) else None)
            key, covers = ("id", prod, d["operationId"]), cov
        templates[key].append((public, covers, p.relative_to(repo).as_posix()))
    res["nonpublicTemplates"] = sorted(f"{t[2]}" for v in templates.values() for t in v if not t[0])
    res["unmatchedOps"] = []

    def covered(covers, chain):
        return covers is None or chain is None or chain.lower() in covers or family.get(chain.lower()) in covers

    for rel, pk, m, oid, svc_chains in out_ops:
        parts = rel.split("/")
        chain = parts[1] if parts[0] == "chains" else None
        prod = parts[2] if chain else parts[1]
        if prod in ("cometbft-api", "grpc-api"):
            key = ("file", prod, "/".join(parts[3:])[:-len(".yaml")])
        elif prod == "cosmos-rest-api":
            key = ("file", prod, Path(rel).stem)
        else:
            tprod = "node-api" if prod in ("node-api", "fullnode-http-api", "fullnode-solidity-http-api") else prod
            key = ("id", tprod, stem_of(oid, chain))
        # a services document merges every chain into one operation: check each chain of its `chain` enum
        for c in ([chain] if chain or not svc_chains else svc_chains):
            cands = [t for t in templates.get(key, []) if covered(t[1], c)]
            if not cands:
                res["unmatchedOps"].append(f"{rel} {m.upper()} {pk} {oid} [{c}]: no source template matched")
            elif not any(t[0] for t in cands):
                for t in cands:
                    res["nonpublicHits"].append(f"{rel} {m.upper()} {pk} {oid} [{c}] <- {t[2]}")
            elif not all(t[0] for t in cands):
                notes.append(f"G5b: {rel} {oid} [{c}] matches public and non-public templates {[t[2] for t in cands]}")

    # (c) menu apiSpec references
    menu_refs = set()
    for f in sorted((repo / "menu").rglob("_order.json")):
        d = json.loads(f.read_text(encoding="utf-8"))
        st = [d]
        while st:
            o = st.pop()
            if isinstance(o, dict):
                for k, v in o.items():
                    if k == "apiSpec":
                        for s in (v if isinstance(v, list) else [v]):
                            if isinstance(s, str):
                                menu_refs.add(s)
                    else:
                        st.append(v)
            elif isinstance(o, list):
                st.extend(o)
    res["menuRefs"] = len(menu_refs)
    # index of menu-referenced services api-spec files: service -> operationId -> set(chain enum) | None
    svc_index = collections.defaultdict(dict)
    for ref in sorted(r for r in menu_refs if r.startswith("services/")):
        p = repo / "api-spec" / ref
        if not p.is_file():
            res["apiSpecStale"].append(f"menu references missing api-spec file {ref}")
            continue
        d = yaml.load(p.read_text(encoding="utf-8"), Loader=L)
        svc = ref.split("/")[1]
        for pk, m, op in iter_ops(d):
            chains = None
            for prm in op.get("parameters") or []:
                prm = ptr(d, prm["$ref"]) if is_ref(prm) else prm
                if isinstance(prm, dict) and prm.get("name") == "chain" and prm.get("in") == "path":
                    sch = prm.get("schema") or {}
                    sch = ptr(d, sch["$ref"]) if is_ref(sch) else sch
                    chains = set((sch or {}).get("enum") or [])
            prev = svc_index[svc].get(op.get("operationId"), set())
            svc_index[svc][op.get("operationId")] = (prev | chains) if chains is not None and prev is not None else None
    seen_files = set()
    for rel, pk, m, oid, _ in out_ops:
        parts = rel.split("/")
        if parts[0] == "chains" and parts[2] in PATH_RENDERED_DIRS:
            if rel not in menu_refs and rel not in seen_files:
                res["menuMissingFiles"].append(rel)
            seen_files.add(rel)
        elif parts[0] == "chains" and parts[2] in SERVICE_RENDERED_DIRS:
            chain = parts[1]
            stem = stem_of(oid, chain)
            idx = svc_index.get(parts[2], {})
            if stem not in idx:
                res["menuMissingOps"].append(f"{rel} {oid}: no menu-referenced services/{parts[2]} op '{stem}'")
            elif idx[stem] is not None and chain.lower() not in {c.lower() for c in idx[stem]}:
                res["menuMissingOps"].append(f"{rel} {oid}: chain '{chain}' not in published chain enum of '{stem}'")
        elif parts[0] == "services":
            if oid not in svc_index.get(parts[1], {}):
                res["menuMissingOps"].append(f"{rel} {m.upper()} {pk} {oid}: not in a menu-referenced api-spec/services/{parts[1]} file")
    return res


# ─── main ────────────────────────────────────────────────────────────────────

def tree_sha(root: Path) -> str:
    h = hashlib.sha256()
    for p in sorted(root.rglob("*")):
        if p.is_file():
            h.update(p.relative_to(root).as_posix().encode() + b"\0" + hashlib.sha256(p.read_bytes()).digest())
    return h.hexdigest()


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("docs_build_dir")
    ap.add_argument("out_reference_dir")
    ap.add_argument("--docs-repo", required=True)
    ap.add_argument("--no-transform", action="store_true")
    ap.add_argument("--report")
    ap.add_argument("--replace", action="store_true")
    a = ap.parse_args(argv)

    build = Path(a.docs_build_dir).resolve()
    out = Path(a.out_reference_dir).resolve()
    repo = Path(a.docs_repo).resolve()
    if not (build / "chains").is_dir():
        sys.exit(f"{build} has no chains/ directory")
    if out == build or build in out.parents or out in build.parents:
        sys.exit("output must not overlap the docs build directory")
    if out.exists() and any(out.iterdir()):
        if not a.replace:
            sys.exit(f"{out} is not empty (use --replace)")
        if (out / ".git").exists():
            sys.exit(f"refusing to delete {out}: it contains .git")
        shutil.rmtree(out)
    yamlio, yamlio_sha = import_yamlio(repo)
    sys.setrecursionlimit(100000)

    selected, skipped = select_files(build)
    transform = not a.no_transform

    st = collections.Counter()
    by_product = collections.defaultdict(collections.Counter)
    notes, gate = [], collections.defaultdict(list)
    out_ops = []
    removed_names = collections.Counter()
    for rel, kind in selected:
        src_p = build / rel
        dst_p = out / rel
        dst_p.parent.mkdir(parents=True, exist_ok=True)
        raw = src_p.read_bytes()
        text = raw.decode("utf-8")
        prod = product_of(rel)
        pc = by_product[prod]
        pc["files"] += 1
        pc["bytesIn"] += len(raw)
        st["files"] += 1
        st["bytesIn"] += len(raw)
        src = yamlio.load_yaml_text(text)
        if not isinstance(src, dict):
            gate["G1"].append(f"{rel}: not a mapping")
            continue
        changed = False
        doc = None
        if transform:
            doc = yamlio.load_yaml_text(text)  # independent copy to mutate
            removed = prune_components(doc)
            if removed:
                changed = True
                pc["componentsRemoved"] += len(removed)
                st["componentsRemoved"] += len(removed)
                for r in removed:
                    removed_names[r.split("/")[0]] += 1
            if kind == "mcp":
                for pk, m, op in iter_ops(doc):
                    pst = collections.Counter()
                    inline_parameters(doc, op, pst, f"{rel} {m.upper()} {pk}", notes)
                    if any(v for k, v in pst.items() if k.endswith("_inlined")):
                        changed = True
                    pc.update(pst)
                    st.update(pst)
        if changed:
            out_text = yamlio.dump_yaml(doc)
            if yamlio.dump_yaml(src) != text:
                st["buildNotYamlioRoundTrip"] += 1
                notes.append(f"{rel}: the docs build itself does not round-trip through yamlio (diff shows reformatting)")
            dst_p.write_text(out_text, encoding="utf-8")
            pc["filesChanged"] += 1
            st["filesChanged"] += 1
        else:
            dst_p.write_bytes(raw)
            out_text = text
        ob = len(out_text.encode("utf-8"))
        pc["bytesOut"] += ob
        st["bytesOut"] += ob

        # ── gates on what was written
        written = dst_p.read_bytes()
        if not changed and written != raw:
            gate["G1"].append(f"{rel}: unchanged file not byte-identical")
        outd = yamlio.load_yaml_text(written.decode("utf-8"))
        if changed and not strict_eq(outd, doc):
            gate["G1"].append(f"{rel}: written YAML does not re-read to the transformed structure")
        if "x-is-public" in written.decode("utf-8"):
            gate["G5a"].append(f"{rel}: contains x-is-public")
        for k in set(src) | set(outd):
            if k != "paths" and k != "components" and not strict_eq(src.get(k, MISSING), outd.get(k, MISSING)):
                gate["G3"].append(f"{rel}: top-level '{k}' changed")
        sc, oc = src.get("components") or {}, outd.get("components") or {}
        if not strict_eq(sc.get("securitySchemes", MISSING), oc.get("securitySchemes", MISSING)):
            gate["G3"].append(f"{rel}: securitySchemes changed")
        for sec, items in oc.items():
            if isinstance(items, dict):
                for name, v in items.items():
                    if not isinstance(sc.get(sec), dict) or name not in sc[sec] or not strict_eq(sc[sec][name], v):
                        gate["G3"].append(f"{rel}: components/{sec}/{name} changed or added")
        bsrc, bout = broken_local_refs(src), broken_local_refs(outd)
        st["brokenRefsInBuild"] += len(bsrc)
        if bout:
            gate["G4"].append(f"{rel}: broken local refs {bout[:5]}")
        nl = nonlocal_refs(outd)
        if nl:
            gate["G4"].append(f"{rel}: non-local refs {nl[:5]}")
        # G2: per path item, every key; ops compared coinductively against the build
        ra, rb = Resolver(src), Resolver(outd)
        sp, op_ = src.get("paths") or {}, outd.get("paths") or {}
        if sp.keys() != op_.keys():
            gate["G2"].append(f"{rel}: path keys differ")
        for pk in sp:
            if pk not in op_:
                continue
            if not isinstance(sp[pk], dict) or not isinstance(op_[pk], dict) or sp[pk].keys() != op_[pk].keys():
                gate["G2"].append(f"{rel} {pk}: path item keys differ")
                continue
            for k in sp[pk]:
                ok, where = sem_equal(sp[pk][k], ra, op_[pk][k], rb, f"{pk}/{k}")
                if not ok:
                    gate["G2"].append(f"{rel}: {where}")
                if k in ALL_METHODS:
                    st["opsCompared"] += 1
                    pc["ops"] += 1
        for pk, m, op in iter_ops(outd):
            svc_chains = None
            if rel.startswith("services/"):
                for prm in op.get("parameters") or []:
                    prm = ptr(outd, prm["$ref"]) if is_ref(prm) else prm
                    if isinstance(prm, dict) and prm.get("name") == "chain" and prm.get("in") == "path":
                        sch = prm.get("schema") or {}
                        sch = ptr(outd, sch["$ref"]) if is_ref(sch) else sch
                        svc_chains = list((sch or {}).get("enum") or [])
            out_ops.append((rel, pk, m, op.get("operationId"), svc_chains))

    node_chains = {rel.split("/")[1] for rel, _ in selected if rel.split("/")[0] == "chains" and rel.split("/")[2] == "node-api"}
    ws = copy_websocket_pages(repo, out, node_chains, gate, st)

    scope = public_scope_gate(repo, out_ops, notes)
    gate["G5b"].extend(scope["nonpublicHits"] + scope["unmatchedOps"])
    gate["G5c"].extend(scope["menuMissingFiles"] + scope["menuMissingOps"] + scope["apiSpecStale"])

    gates = ("G1", "G2", "G3", "G4", "G5a", "G5b", "G5c", "G6")
    report = {
        "input": str(build), "docsRepo": str(repo), "transform": transform,
        "steps": (["T1 prune unreachable components", "T2 inline parameter $refs (MCP chain dirs)"]
                  if transform else ["copy only"]),
        "yamlioSha256": yamlio_sha,
        "selected": len(selected), "skipped": skipped and {"services/node-api": len(skipped)},
        "websocketPages": len(ws),
        "totals": dict(st), "componentsRemovedBySection": dict(removed_names),
        "byProduct": {k: dict(v) for k, v in sorted(by_product.items())},
        "gates": {g: {"failures": len(gate.get(g, [])), "examples": gate.get(g, [])[:20]} for g in gates},
        "publicScope": {k: (v if isinstance(v, int) else {"count": len(v), "items": v[:40]}) for k, v in scope.items()},
        "notes": notes[:200], "notesTotal": len(notes),
        "outputTreeSha256": tree_sha(out),
    }
    rp = Path(a.report) if a.report else out.parent / f"{out.name}.report.json"
    rp.write_text(json.dumps(report, indent=1, ensure_ascii=False), encoding="utf-8")
    failed = sum(len(v) for v in gate.values())
    print(json.dumps({"files": st["files"], "filesChanged": st["filesChanged"], "websocketPages": len(ws),
                      "bytesIn": st["bytesIn"], "bytesOut": st["bytesOut"], "opsCompared": st["opsCompared"],
                      "gateFailures": {g: len(v) for g, v in gate.items() if v}, "report": str(rp),
                      "tree": report["outputTreeSha256"]}))
    if failed:
        sys.exit(1)


if __name__ == "__main__":
    main()
