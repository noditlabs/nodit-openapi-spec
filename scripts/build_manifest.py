#!/usr/bin/env python3
"""Build reference/manifest.json from a reference tree written by scripts/sync_reference.py.

Usage:
    python3 scripts/build_manifest.py <reference_dir> <docs_chains_yaml> --previous <manifest.json> [--out PATH]

API lists come only from the files in <reference_dir>. <docs_chains_yaml> (oas/chains.yaml of the same
nodit-docs-migration commit) is used only for each chain's family, which picks the Node API axis
(evm -> nodeApi.evmJsonrpc, others -> nodeApi.apis) and the webhookApi.type value.

The output keeps the key layout of the previous manifest, because the Nodit MCP server reads this file:
    {chains: {<chain>: {nodeApi, web3DataApi, webhookApi, flexibleWebhookApi, multichainApi}}, summary, services}
Directories the previous layout has no key for (chains/<chain>/{fullnode-http-api, fullnode-solidity-http-api,
grpc-api}) are not listed; their files stay in reference/ for other readers.

Gates (any failure -> exit code 1, nothing written):
    M1 key-path parity with --previous: the set of key paths (chain ids, service API keys and array items
       normalized) and the value type at each path must be equal in both directions
    M2 every file the manifest points to exists with exactly that case
    M3 the services documents and the per-chain files list the same APIs: web3-data-api keys (from the per-chain
       files) == operations of services/web3-data-api; webhook-api / flexible-webhook-api per-chain operations exist
       in services; multichain-api keys <-> chains.*.multichainApi
    M4 for per-chain data/webhook operations, the chain-networks in the services documents equal the chain files'
       `network` enums
    M5 every chain directory has a family in chains.yaml with a known webhook type when it has a webhook spec
"""
from __future__ import annotations

import sys

sys.dont_write_bytecode = True

import argparse
import json
import os
from pathlib import Path

import yaml

L = getattr(yaml, "CSafeLoader", yaml.SafeLoader)
METHODS = ("get", "post", "put", "patch", "delete")
AXES = ("nodeApi", "web3DataApi", "webhookApi", "flexibleWebhookApi", "multichainApi")
WEBHOOK_TYPE = {"evm": "evm", "aptos": "aptos", "tron": "tron"}  # family -> webhookApi.type (decide new ones explicitly)
NODE_SUBDIRS = (("cometbft-api/json-rpc-api", "cometbftJsonrpc"), ("cometbft-api/rest-api", "cometbftRest"),
                ("cosmos-rest-api", "cosmosRest"))


def load(p: Path):
    with open(p, encoding="utf-8") as fh:
        return yaml.load(fh, Loader=L)


def deref(doc, node):
    seen = set()
    while isinstance(node, dict) and isinstance(node.get("$ref"), str) and node["$ref"].startswith("#/"):
        r = node["$ref"]
        if r in seen:
            break
        seen.add(r)
        cur = doc
        for part in r[2:].split("/"):
            cur = cur.get(part.replace("~1", "/").replace("~0", "~")) if isinstance(cur, dict) else None
        node = cur
    return node


def ops(doc):
    for pk, item in (doc.get("paths") or {}).items():
        if isinstance(item, dict):
            for m in METHODS:
                if isinstance(item.get(m), dict) and item[m].get("operationId"):
                    yield pk, m, item[m]


def stem(op_id: str, chain: str) -> str:
    i = op_id.find("-")
    return op_id[i + 1:] if i > 0 and op_id[:i].lower() == chain.lower() else op_id


def param(doc, op, name):
    for p in op.get("parameters") or []:
        p = deref(doc, p)
        if isinstance(p, dict) and p.get("name") == name and p.get("in") == "path":
            return p
    return None


def enum_of(doc, p):
    sch = deref(doc, (p or {}).get("schema") or {}) or {}
    return list(sch.get("enum") or [])


def yaml_stems(d: Path, recursive: bool) -> list:
    if not d.is_dir():
        return []
    out = []
    for root, dirs, files in os.walk(d):
        dirs.sort()
        out += [Path(root, f).relative_to(d).as_posix()[:-5] for f in files if f.endswith(".yaml")]
        if not recursive:
            break
    return sorted(out)


def chain_networks(doc, op) -> list:
    """<chain>-<network> pairs a services operation documents (chain enum x network x-enum-by / enum); [] if none."""
    pc, pn = param(doc, op, "chain"), param(doc, op, "network")
    if pc is None:
        return []
    by = (pn or {}).get("x-enum-by") or {}
    opts = by.get("options") if by.get("param") == "chain" else None
    out = []
    for c in enum_of(doc, pc):
        nets = (opts or {}).get(c, enum_of(doc, pn)) if opts is not None else enum_of(doc, pn)
        out += [f"{c}-{n}" for n in nets]
    return sorted(out)


def key_paths(o, prefix="", out=None, norm_keys=()):
    out = {} if out is None else out
    if isinstance(o, dict):
        out[prefix or "/"] = "object"
        for k, v in o.items():
            seg = "*" if prefix in norm_keys else k
            key_paths(v, f"{prefix}/{seg}", out, norm_keys)
    elif isinstance(o, list):
        out[prefix] = "array"
        for v in o:
            key_paths(v, f"{prefix}[]", out, norm_keys)
    else:
        out[prefix] = type(o).__name__
    return out


def manifest_paths(m):
    norm = {"/chains"} | {f"/services/{s}/apis" for s in (m.get("services") or {})}
    return key_paths(m, "", None, norm)


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("reference_dir")
    ap.add_argument("docs_chains_yaml")
    ap.add_argument("--previous", required=True, help="manifest.json whose key layout must be kept")
    ap.add_argument("--out")
    a = ap.parse_args(argv)

    ref = Path(a.reference_dir)
    raw = load(Path(a.docs_chains_yaml))
    families = {c["id"].lower(): c.get("family") for c in (raw if isinstance(raw, list) else raw["chains"]) if "id" in c}
    errors = []

    chains = {}
    services_web3 = {}  # key -> {chain: networks}
    perchain_webhook = {"webhook-api": {}, "flexible-webhook-api": {}}  # svc -> stem -> {chain: networks}
    chain_dirs = sorted(d for d in os.listdir(ref / "chains") if (ref / "chains" / d).is_dir())
    for cdir in chain_dirs:
        cid = cdir.lower()
        fam = families.get(cid)
        if not fam:
            errors.append(f"M5: chains/{cdir} has no family in chains.yaml")
            continue
        base = ref / "chains" / cdir
        e = {}

        node = {}
        apis = [s for s in yaml_stems(base / "node-api", True) if not s.startswith("websocket/")]
        ws = sorted(p.stem for p in (base / "node-api" / "websocket").glob("*.md"))
        if apis or ws:
            body = {"apis": apis}
            if ws:
                body["websocketApis"] = ws
            if fam == "evm":
                node["evmJsonrpc"] = body
            else:
                node.update(body)
        for sub, key in NODE_SUBDIRS:
            sapis = yaml_stems(base / sub, False)
            if sapis:
                node[key] = {"apis": sapis}
        e["nodeApi"] = {"supported": True, **node} if node else {"supported": False}

        w3apis = []
        for sec in yaml_stems(base / "web3-data-api", False):
            d = load(base / "web3-data-api" / f"{sec}.yaml")
            for _, _, op in ops(d):
                k = f"{sec}/{stem(op['operationId'], cdir)}"
                w3apis.append(k)
                services_web3.setdefault(k, {})[cid] = sorted(enum_of(d, param(d, op, "network")))
        e["web3DataApi"] = {"supported": True, "apis": sorted(w3apis)} if w3apis else {"supported": False}

        for svc, axis, fname in (("webhook-api", "webhookApi", "webhook.yaml"),
                                 ("flexible-webhook-api", "flexibleWebhookApi", "flexible-webhook.yaml")):
            f = base / svc / fname
            if not f.is_file():
                e[axis] = {"supported": False}
                continue
            d = load(f)
            stems = []
            for _, _, op in ops(d):
                s = stem(op["operationId"], cdir)
                stems.append(s)
                perchain_webhook[svc].setdefault(s, {})[cid] = sorted(enum_of(d, param(d, op, "network")))
            entry = {"supported": True}
            if axis == "webhookApi":
                if fam not in WEBHOOK_TYPE:
                    errors.append(f"M5: chains/{cdir} has a webhook spec but family '{fam}' has no webhookApi.type mapping")
                entry["type"] = WEBHOOK_TYPE.get(fam, fam)
            entry["apis"] = sorted(stems)
            e[axis] = entry
        e["multichainApi"] = {"supported": False}  # filled below
        chains[cid] = e

    # services (chain-agnostic view): each API -> supported <chain>-<network>, keyed like the previous generator:
    # web3-data-api '<section file>/<operationId>', multichain-api '<file>' (one operation per file),
    # webhook-api / flexible-webhook-api the operationId ('<file>/<operationId>' when a service has several files).
    # An operation without a `chain` path parameter (e.g. Address Set) is chain-independent -> [].
    services = {}
    multichain_by_chain = {}
    services_web3_docs = {}  # key -> chain-networks documented by the services file (checked against per-chain, M3)
    sdir = ref / "services"
    for svc in sorted(d for d in os.listdir(sdir) if (sdir / d).is_dir()):
        files = sorted(f for f in os.listdir(sdir / svc) if f.endswith(".yaml"))
        apis = {}
        if svc == "web3-data-api":
            for k in sorted(services_web3):
                apis[k] = sorted(f"{c}-{n}" for c, nets in services_web3[k].items() for n in nets)
            for f in files:
                d = load(sdir / svc / f)
                for _, _, op in ops(d):
                    services_web3_docs[f"{f[:-5]}/{op['operationId']}"] = chain_networks(d, op)
        else:
            for f in files:
                d = load(sdir / svc / f)
                for _, _, op in ops(d):
                    oid = op["operationId"]
                    if svc == "multichain-api":
                        k = f[:-5]
                        rb = deref(d, op.get("requestBody") or {}) or {}
                        sch = deref(d, (((rb.get("content") or {}).get("application/json") or {}).get("schema")) or {}) or {}
                        items = deref(d, ((sch.get("properties") or {}).get("chains") or {}).get("items") or {}) or {}
                        vals = sorted(items.get("enum") or [])
                        if not vals:
                            errors.append(f"M3: services/{svc}/{f} {oid}: no chains enum")
                        for v in vals:
                            multichain_by_chain.setdefault(v.split("-")[0], set()).add(k)
                    else:
                        k = f"{f[:-5]}/{oid}" if len(files) > 1 else oid
                        vals = chain_networks(d, op)
                    if k in apis:
                        errors.append(f"M3: services/{svc}: duplicate API key {k}")
                    apis[k] = vals
        services[svc] = {"apis": apis}

    for cid, e in chains.items():
        mc = sorted(multichain_by_chain.get(cid, []))
        e["multichainApi"] = {"supported": True, "apis": mc} if mc else {"supported": False}
    unknown_mc = sorted(set(multichain_by_chain) - set(chains))
    if unknown_mc:
        errors.append(f"M3: multichain chains without a chain directory: {unknown_mc}")

    cs = chains.values()
    manifest = {
        "chains": {cid: {ax: chains[cid][ax] for ax in AXES} for cid in sorted(chains)},
        "summary": {
            "totalChains": len(chains),
            "nodeApiChains": sum(c["nodeApi"]["supported"] for c in cs),
            "web3DataApiChains": sum(c["web3DataApi"]["supported"] for c in cs),
            "webhookApiChains": sum(c["webhookApi"]["supported"] for c in cs),
            "flexibleWebhookApiChains": sum(c["flexibleWebhookApi"]["supported"] for c in cs),
            "multichainApiChains": sum(c["multichainApi"]["supported"] for c in cs),
        },
        "services": services,
    }

    # M1 key-path parity
    prev = json.loads(Path(a.previous).read_text(encoding="utf-8"))
    pp, np_ = manifest_paths(prev), manifest_paths(manifest)
    for p in sorted(set(pp) - set(np_)):
        errors.append(f"M1: key path missing vs previous manifest: {p}")
    for p in sorted(set(np_) - set(pp)):
        errors.append(f"M1: key path not in previous manifest: {p}")
    for p in sorted(set(pp) & set(np_)):
        if pp[p] != np_[p]:
            errors.append(f"M1: value type at {p}: previous {pp[p]}, new {np_[p]}")

    # M2 referenced files exist with exact case
    def exists_exact(p: Path) -> bool:
        cur = ref
        for part in p.relative_to(ref).parts:
            if part not in os.listdir(cur):
                return False
            cur = cur / part
        return cur.is_file()

    for cid, e in manifest["chains"].items():
        cdir = next(d for d in chain_dirs if d.lower() == cid)
        n = e["nodeApi"]
        for key, sub in (("apis", "node-api"), ("evmJsonrpc", "node-api"), ("cometbftJsonrpc", "cometbft-api/json-rpc-api"),
                         ("cometbftRest", "cometbft-api/rest-api"), ("cosmosRest", "cosmos-rest-api")):
            lst = n.get(key) if key == "apis" else (n.get(key) or {}).get("apis")
            for s in lst or []:
                if not exists_exact(ref / "chains" / cdir / sub / f"{s}.yaml"):
                    errors.append(f"M2: missing chains/{cdir}/{sub}/{s}.yaml")
        for s in {x.split("/")[0] for x in e["web3DataApi"].get("apis", [])}:
            if not exists_exact(ref / "chains" / cdir / "web3-data-api" / f"{s}.yaml"):
                errors.append(f"M2: missing chains/{cdir}/web3-data-api/{s}.yaml")

    # M3 / M4 services <-> per-chain consistency. web3-data-api values come from the per-chain files, so they are
    # compared with what the services documents state (same keys, same chain-networks).
    w3 = services.get("web3-data-api", {}).get("apis", {})
    for k in sorted(set(w3) | set(services_web3_docs)):
        if k not in services_web3_docs:
            errors.append(f"M3: web3-data-api {k}: per-chain operation missing from services/web3-data-api")
        elif k not in w3:
            errors.append(f"M3: web3-data-api {k}: services operation has no per-chain operation")
        elif w3[k] != services_web3_docs[k]:
            errors.append(f"M4: web3-data-api {k}: per-chain networks differ from the services document "
                          f"(only per-chain: {sorted(set(w3[k]) - set(services_web3_docs[k]))[:6]}, "
                          f"only services: {sorted(set(services_web3_docs[k]) - set(w3[k]))[:6]})")
    for svc, axis in (("webhook-api", "webhookApi"), ("flexible-webhook-api", "flexibleWebhookApi")):
        sapis = services.get(svc, {}).get("apis", {})
        for s, by_chain in perchain_webhook[svc].items():
            k = next((x for x in sapis if x == s or x.endswith("/" + s)), None)
            if k is None:
                errors.append(f"M3: {svc} per-chain op {s} missing from services")
                continue
            want = sorted(f"{c}-{n}" for c, nets in by_chain.items() for n in nets)
            if sapis[k] != want:
                errors.append(f"M4: {svc} {s}: services networks differ from per-chain files "
                              f"(only services: {sorted(set(sapis[k]) - set(want))[:6]}, only per-chain: {sorted(set(want) - set(sapis[k]))[:6]})")
    for k, nets in services.get("multichain-api", {}).get("apis", {}).items():
        sc = {x.split("-")[0] for x in nets}
        pcs = {c for c, e in manifest["chains"].items() if k in e["multichainApi"].get("apis", [])}
        if sc != pcs:
            errors.append(f"M3: multichain-api {k}: chain sets differ")

    if errors:
        print("\n".join(errors[:200]), file=sys.stderr)
        print(f"build_manifest: {len(errors)} gate failure(s); manifest not written", file=sys.stderr)
        sys.exit(1)
    text = json.dumps(manifest, indent=2, ensure_ascii=False)  # same formatting as the previous generator
    Path(a.out or ref / "manifest.json").write_text(text, encoding="utf-8")
    print(json.dumps({"summary": manifest["summary"], "services": {k: len(v["apis"]) for k, v in services.items()},
                      "keyPaths": len(np_)}))


if __name__ == "__main__":
    main()
