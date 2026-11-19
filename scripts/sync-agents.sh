#!/usr/bin/env bash
# sync-agents.sh
# Sync agent/workflows/*.md to platform copies (.opencode/agents/, .claude/agents/).
# Frontmatter in platform copies is preserved; only the body is replaced.
# Run this after editing any file in agent/workflows/.

set -euo pipefail

WORKFLOWS_DIR="agent/workflows"
OPENCODE_DIR=".opencode/agents"
CLAUDE_DIR=".claude/agents"

# Extract the `---\n...\n---\n` frontmatter block from a file, always followed
# by exactly one blank line if frontmatter is present. Prints nothing if the
# file has no frontmatter. Pure awk — no python3 dependency, works everywhere
# bash does.
get_frontmatter() {
  awk '
    NR==1 && $0=="---" { print; infm=1; next }
    infm==1 { print; if ($0=="---") { infm=2 }; next }
    infm==2 { print ""; exit }
    { exit }
  ' "$1"
}

# Replace the body of $2 (destination) with the content of $1 (source),
# preserving $2's existing frontmatter. Writes through a temp file — piping
# `get_frontmatter "$dest" | cat - "$src" > "$dest"` directly would truncate
# $dest (via the `>` redirect) before it's read.
sync_with_frontmatter() {
  local src="$1" dest="$2" tmp
  tmp=$(mktemp)
  get_frontmatter "$dest" > "$tmp"
  cat "$tmp" "$src" > "$dest"
  rm -f "$tmp"
}

synced=0

for src in "$WORKFLOWS_DIR"/*.md; do
  base=$(basename "$src")

  if [ -f "$CLAUDE_DIR/$base" ]; then
    sync_with_frontmatter "$src" "$CLAUDE_DIR/$base"
    echo "  [claude]   $base"
    synced=$((synced + 1))
  fi

  if [ -f "$OPENCODE_DIR/$base" ]; then
    sync_with_frontmatter "$src" "$OPENCODE_DIR/$base"
    echo "  [opencode] $base"
    synced=$((synced + 1))
  fi
done

echo ""
echo "Synced $synced platform copies. Then run 'node scripts/sync-codex.mjs' and 'npm run sync-template' in packages/create-vasvibe to update Codex assets and the scaffold template."
