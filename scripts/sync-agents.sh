#!/usr/bin/env bash
# sync-agents.sh
# Sync agent/workflows/*.md to platform copies (.opencode/agents/, .claude/agents/).
# Frontmatter in platform copies is preserved; only the body is replaced.
# Run this after editing any file in agent/workflows/.

set -euo pipefail

WORKFLOWS_DIR="agent/workflows"
OPENCODE_DIR=".opencode/agents"
CLAUDE_DIR=".claude/agents"

strip_frontmatter() {
  python3 -c "
import sys, re
content = open(sys.argv[1]).read()
m = re.match(r'^---\n.*?\n---\n\n?', content, re.DOTALL)
sys.stdout.write(content[len(m.group(0)):] if m else content)
" "$1"
}

get_frontmatter() {
  python3 -c "
import sys, re
content = open(sys.argv[1]).read()
m = re.match(r'^---\n.*?\n---\n\n?', content, re.DOTALL)
sys.stdout.write(m.group(0) if m else '')
" "$1"
}

synced=0
skipped=0

for src in "$WORKFLOWS_DIR"/*.md; do
  base=$(basename "$src")

  # .claude/agents/ — no frontmatter, direct copy
  if [ -f "$CLAUDE_DIR/$base" ]; then
    cp "$src" "$CLAUDE_DIR/$base"
    echo "  [claude]   $base"
    ((synced++))
  fi

  # .opencode/agents/ — preserve existing frontmatter
  if [ -f "$OPENCODE_DIR/$base" ]; then
    fm=$(get_frontmatter "$OPENCODE_DIR/$base")
    body=$(cat "$src")
    printf '%s%s' "$fm" "$body" > "$OPENCODE_DIR/$base"
    echo "  [opencode] $base"
    ((synced++))
  fi
done

echo ""
echo "Synced $synced platform copies. Run 'npm run sync-template' in packages/create-vasvibe to update the scaffold template."
