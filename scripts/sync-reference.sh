#!/usr/bin/env bash
set -euo pipefail

SOURCE_REPO="https://github.com/Lambda256/nodit-docs-migration.git"
SOURCE_BRANCH="main"
SOURCE_PATH="oas/dist-en"
TARGET_DIR="reference"
PR_BRANCH="sync/reference-$(date +%Y%m%d-%H%M%S)"

REPO_ROOT="$(git -C "$(dirname "$0")/.." rev-parse --show-toplevel)"
cd "$REPO_ROOT"

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Working tree has uncommitted changes. Commit or stash first." >&2
  exit 1
fi

git fetch origin main --quiet
git checkout main --quiet
git pull --ff-only origin main --quiet

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "Cloning $SOURCE_REPO ($SOURCE_BRANCH, sparse: $SOURCE_PATH)..."
git clone --depth 1 --filter=blob:none --sparse \
  --branch "$SOURCE_BRANCH" "$SOURCE_REPO" "$TMP/src" --quiet
git -C "$TMP/src" sparse-checkout set "$SOURCE_PATH" --quiet

if [[ ! -d "$TMP/src/$SOURCE_PATH" ]]; then
  echo "Source path not found: $SOURCE_PATH" >&2
  exit 1
fi

echo "Syncing into $TARGET_DIR/..."
rm -rf "$TARGET_DIR"
mkdir -p "$TARGET_DIR"
rsync -a --delete "$TMP/src/$SOURCE_PATH/" "$TARGET_DIR/"

if [[ -z "$(git status --porcelain "$TARGET_DIR")" ]]; then
  echo "No changes. Nothing to sync."
  exit 0
fi

git checkout -b "$PR_BRANCH"
git add "$TARGET_DIR"
git commit -m "chore: sync reference from nodit-docs-migration"
git push -u origin "$PR_BRANCH"

if command -v gh >/dev/null 2>&1; then
  gh pr create \
    --title "chore: sync reference from nodit-docs-migration" \
    --body "Manual sync from \`Lambda256/nodit-docs-migration\` \`$SOURCE_PATH/\`." \
    --base main --head "$PR_BRANCH"
else
  echo "Branch pushed: $PR_BRANCH"
  echo "Open PR manually at: https://github.com/noditlabs/nodit-openapi-spec/pull/new/$PR_BRANCH"
fi
