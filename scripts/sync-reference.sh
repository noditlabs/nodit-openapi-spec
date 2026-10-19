#!/usr/bin/env bash
# Rebuild reference/ from the nodit-docs-migration release that is live on developer.nodit.io.
#
#   ./scripts/sync-reference.sh --docs-ref <tag> [--docs-repo <git url or path>] [--no-transform] [--push]
#
# --docs-ref is the docs release tag deployed to production (e.g. v2.0.0-beta.8). It is required: the deploy
# history cannot tell which release is live after a rollback, so confirm the tag before running. Without it the
# script prints the recent production deploy/rollback runs (needs `gh`) and stops.
#
# 1. Sparse-clones the tag (oas, scripts, menu, api-spec, languages, settings), builds the OAS with the docs
#    generator (`python3 scripts/api.py build`) and re-runs the docs' own `scripts/sync_api_spec.py`. The
#    regenerated api-spec/, menu/ and languages/ must equal the tag's committed files, i.e. the published site
#    matches the oas/ source the build came from.
# 2. scripts/sync_reference.py selects the published files of the English build, copies the WebSocket method
#    pages, applies the transforms (prune unreachable components, inline parameter $refs) and runs its gates.
# 3. scripts/build_manifest.py writes reference/manifest.json with the key layout of origin/main's manifest.
# 4. Replaces reference/, checks that git records every path with the exact case, and commits (on a new
#    sync/reference-* branch when run on main, otherwise on the current branch, which must contain origin/main).
#    On any failure after reference/ was replaced, reference/ is restored. With --push the branch is pushed;
#    open the PR yourself.
# Requires: git, python3 with PyYAML (pip install -r scripts/requirements.txt); gh only for the run listing.
set -euo pipefail

DOCS_REPO="https://github.com/Lambda256/nodit-docs-migration.git"
DOCS_GH="Lambda256/nodit-docs-migration"
DOCS_REF=""
TRANSFORM_FLAG=""
PUSH=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --docs-ref) DOCS_REF="$2"; shift 2 ;;
    --docs-repo) DOCS_REPO="$2"; shift 2 ;;
    --no-transform) TRANSFORM_FLAG="--no-transform"; shift ;;
    --push) PUSH=1; shift ;;
    *) echo "unknown option: $1" >&2; exit 2 ;;
  esac
done

if [[ -z "$DOCS_REF" ]]; then
  echo "--docs-ref <tag> is required: the docs release tag that is live on developer.nodit.io." >&2
  echo "Recent production runs of $DOCS_GH (a rollback restores the release before the last deploy):" >&2
  for wf in prod_deploy.yml prod_rollback.yml; do
    gh run list -R "$DOCS_GH" --workflow "$wf" --limit 3 \
      --json createdAt,headBranch,conclusion,workflowName \
      --jq '.[] | "  \(.createdAt)  \(.workflowName)  \(.headBranch)  \(.conclusion)"' >&2 \
      || echo "  (could not list $wf runs with gh)" >&2
  done
  exit 2
fi
if [[ ! "$DOCS_REF" =~ ^v[0-9] ]]; then
  echo "--docs-ref must be a release tag (v*), got '$DOCS_REF'" >&2
  exit 2
fi
git ls-remote --exit-code --tags "$DOCS_REPO" "refs/tags/$DOCS_REF" >/dev/null \
  || { echo "tag $DOCS_REF not found in $DOCS_REPO" >&2; exit 2; }

REPO_ROOT="$(git -C "$(dirname "$0")/.." rev-parse --show-toplevel)"
cd "$REPO_ROOT"

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Working tree has uncommitted changes. Commit or stash first." >&2
  exit 1
fi
BRANCH="$(git branch --show-current)"
[[ -n "$BRANCH" ]] || { echo "Detached HEAD: check out main or a branch first." >&2; exit 1; }
git fetch -q origin main
if [[ "$BRANCH" == "main" ]]; then
  git merge -q --ff-only origin/main
elif ! git merge-base --is-ancestor origin/main HEAD; then
  echo "Branch $BRANCH does not contain origin/main. Rebase it first." >&2
  exit 1
fi

TMP="$(mktemp -d)"
RESTORE=0
cleanup() {
  if [[ "$RESTORE" == 1 ]]; then
    echo "Restoring reference/ to HEAD." >&2
    git reset -q -- reference || true
    git checkout -q -- reference || true
    git clean -fdq -- reference || true
  fi
  rm -rf "$TMP"
}
trap cleanup EXIT
REPORT_DIR="$REPO_ROOT/.sync"  # gitignored; keeps the gate report of the last run
mkdir -p "$REPORT_DIR"
git show origin/main:reference/manifest.json > "$TMP/previous-manifest.json"

echo "docs ref: $DOCS_REF"
git -c advice.detachedHead=false clone --quiet --depth 1 --filter=blob:none --sparse --branch "$DOCS_REF" "$DOCS_REPO" "$TMP/docs"
git -C "$TMP/docs" sparse-checkout set oas scripts menu api-spec languages settings
DOCS_SHA="$(git -C "$TMP/docs" rev-parse HEAD)"

(
  cd "$TMP/docs"
  export PYTHONDONTWRITEBYTECODE=1
  python3 scripts/api.py build
  python3 scripts/sync_api_spec.py --no-rewrite-links >/dev/null
)
if [[ -n "$(git -C "$TMP/docs" status --porcelain -- api-spec menu languages)" ]]; then
  echo "The published files of $DOCS_REF (api-spec/, menu/, languages/) differ from what its oas/ source generates:" >&2
  git -C "$TMP/docs" status --porcelain -- api-spec menu languages | head -20 >&2
  echo "Ask the docs team to run 'pnpm api:sync' for this release; the reference would not match the site." >&2
  exit 1
fi

python3 scripts/sync_reference.py "$TMP/docs/oas/dist-en" "$TMP/reference" --docs-repo "$TMP/docs" \
  --report "$REPORT_DIR/sync-report.json" $TRANSFORM_FLAG
python3 scripts/build_manifest.py "$TMP/reference" "$TMP/docs/oas/chains.yaml" \
  --previous "$TMP/previous-manifest.json" --out "$TMP/reference/manifest.json"

# Replace reference/ and re-add it from an empty index entry set, so that case-only renames
# (e.g. worldChain -> worldchain) are recorded even on case-insensitive file systems.
RESTORE=1
rm -rf reference
cp -R "$TMP/reference" reference
git rm -r -q --cached reference
git add reference
if ! diff <(git ls-files reference | LC_ALL=C sort) <(find reference -type f | LC_ALL=C sort) >/dev/null; then
  echo "git index paths differ from the generated paths (case?)" >&2
  diff <(git ls-files reference | LC_ALL=C sort) <(find reference -type f | LC_ALL=C sort) | head >&2
  exit 1
fi

if git diff --cached --quiet; then
  RESTORE=0
  echo "No changes. Nothing to sync."
  exit 0
fi

if [[ "$BRANCH" == "main" ]]; then
  BRANCH="sync/reference-${DOCS_REF}-$(date +%Y%m%d-%H%M%S)"
  git checkout -q -b "$BRANCH"
fi
git commit -q -m "chore: sync reference from nodit-docs-migration ${DOCS_REF}" \
  -m "Source: ${DOCS_GH}@${DOCS_SHA} (${DOCS_REF}), English build, ${TRANSFORM_FLAG:-transforms applied}."
RESTORE=0
echo "Committed on $BRANCH. Gate report: $REPORT_DIR/sync-report.json"

if [[ "$PUSH" == 1 ]]; then
  git push -u origin "$BRANCH"
  echo "Open a PR: https://github.com/noditlabs/nodit-openapi-spec/pull/new/$BRANCH"
fi
