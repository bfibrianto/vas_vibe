# create-vasvibe

Scaffold a new VasVibe project with **19 agents**, **4-phase workflow**, and **multi-tool support** preconfigured.

**VasVibe v2.2** — AI-native development framework with:
- ✅ 4-Phase Model (Perencanaan → Pengerjaan → Testing → Hardening) with gates
- ✅ 19 specialized agents (Discovery, Backend/Frontend/Fullstack, Security, Reliability, DevOps, etc.)
- ✅ Toolsmith agent for agentic workspace provisioning (skills + MCP)
- ✅ Multi-tool support (Claude Code, OpenCode, GitHub Copilot, Antigravity)
- ✅ No Silent Changes protocol (every change tracked in docs)
- ✅ Work Depth system (fast/standard/deep)

```bash
npx create-vasvibe my-new-project
```

The command produces a project folder containing all agent toolchains, workflows, schemas, and standard working folders (`codes/`, `specifications/`, `state/`, `tests/`) with `.gitignore` rules already configured.

## What you get

```
my-new-project/
├── .agents/                        # Antigravity agent wrappers & skills
├── .claude/                        # Claude Code agents & skills
├── .opencode/                      # OpenCode commands & skills
├── .github/prompts/                # GitHub Copilot prompt files (19 agents)
├── agent/workflows/                # Source of truth: agent definitions (19 total)
│   ├── _shared/
│   │   ├── phases.md               # 4-phase model definition
│   │   ├── change-management.md    # No Silent Changes protocol
│   │   ├── work-depth.md           # Work depth (fast/standard/deep)
│   │   └── git-branch-management.md # Git workflow for code-writing agents
│   ├── orchestrator.md             # Pipeline coordinator
│   ├── discovery.md                # Requirement gathering
│   ├── initiator.md                # Project overview
│   ├── backend.md, frontend.md, fullstack.md # Implementation agents
│   ├── data-architect.md, ux-designer.md    # Design phase
│   ├── analyst.md                  # Specifications
│   ├── qa.md, tester.md, fixer.md  # QA & testing
│   ├── security.md, reliability.md # Hardening phase
│   ├── toolsmith.md ⭐ NEW         # Agentic workspace provisioning
│   ├── devops.md, pm.md            # Infrastructure & project mgmt
│   └── document.md                 # Documentation
│
├── schemas/                        # Shared schemas ⭐ v2.2
│   ├── workspace-registry.json         # Skill + MCP catalog, tech-stack mappings
│   └── workspace-manifest.template.json # Workspace provisioning template
│
├── state/                          # Workspace & knowledge base ⭐ v2.2
│   ├── workspace-manifest.json     # Desired-state config (platform-agnostic)
│   └── knowledge_base/             # Living docs (architecture, data-model, etc.)
│
├── codes/                          # Source code (gitignored by default)
├── specifications/                 # Technical specs (gitignored by default)
├── tests/                          # Tests (gitignored by default)
├── task/                           # Task management
├── logs/                           # Auto-generated logs
├── project_overview_example.md
├── QUICK-START.md                  # Workflow guide (Indonesian)
├── AGENT_PERSONAS.md               # All 19 agents documented
├── GIT_STRUCTURE_GUIDE.md
└── .gitignore
```

**Multi-Tool:** Agents auto-propagate from `agent/workflows/` to `.claude/`, `.opencode/`, `.agents/`, and `.github/prompts/` for full tool parity.

**Workspace Provisioning:** Run `/setup-workspace init` to auto-detect your tool, derive skills + MCP from tech stack, and write `state/workspace-manifest.json`.

`opencode.json` is intentionally not generated. Create one yourself per your AI provider settings (see https://opencode.ai/docs).

## Usage

```bash
npx create-vasvibe <project-name> [options]
```

### Workflow

1. **Create project**
   ```bash
   npx create-vasvibe my-app
   ```

2. **Choose work depth** (when prompted)
   - `fast` — MVP, prototype, single Fullstack agent
   - `standard` — Production normal, Backend+Frontend parallel *(default)*
   - `deep` — Fintech/auth/sensitive data, full security+reliability

3. **Setup workspace** (after tech stack is known)
   ```bash
   cd my-app
   /setup-workspace init
   ```
   → Toolsmith detects active tool, derives skills+MCP from tech stack, writes `state/workspace-manifest.json` and tool-specific MCP config

4. **Start planning**
   ```bash
   /plan-project "Your project idea here"
   ```

### Options

| Flag             | Description                                              |
|------------------|----------------------------------------------------------|
| `-y, --yes`      | Skip prompts and use defaults                            |
| `--no-git`       | Do not initialize a git repository                       |
| `--no-opencode`  | Exclude `.opencode/` (commands, skills)                  |
| `--no-claude`    | Exclude `.claude/` and `.agents/`                        |
| `--no-github`    | Exclude `.github/prompts/`                               |
| `--no-workflows` | Exclude `agent/workflows/`                               |
| `-h, --help`     | Show help                                                |
| `-v, --version`  | Print version                                            |

### Examples

```bash
# Interactive (choose depth + tools)
npx create-vasvibe my-app

# Fast mode MVP
npx create-vasvibe my-app --yes   # uses fast depth, all tools

# Only OpenCode + workflows
npx create-vasvibe my-app --yes --no-claude --no-github
```

### Quick Start

After scaffold, read **`QUICK-START.md`** for step-by-step workflow guide (Indonesian):
- Mental model of 4 phases
- Command reference (/plan-project, /build-feature, /test-feature, /release)
- Work depth strategy
- Gate approval process

## Development (for maintainers)

This package lives at `packages/create-vasvibe/` in the monorepo. Source of truth for content is the repo root (`agent/workflows/`, `schemas/`, `.claude/`, `.opencode/`, `.agents/`, `.github/prompts/`); `template/` is generated by a sync script.

**Key changes in v2.2:**
- Source of truth → 19 agents in `agent/workflows/` (not 8)
- Multi-tool propagation: auto-syncs to `.claude/`, `.opencode/`, `.agents/`, `.github/prompts/`
- Added: `schemas/workspace-registry.json`, `schemas/workspace-manifest.template.json`
- Added: `state/` folder with `workspace-manifest.json` and `knowledge_base/` template
- Added: `_shared/` docs (phases.md, change-management.md, work-depth.md, git-branch-management.md)
- Renamed: `developer.md` → `fullstack.md`

```bash
# Sync template/ from repo root (runs on every npm publish)
npm run sync-template

# Test scaffold locally
node bin/cli.mjs /tmp/test-scaffold --yes

# Verify what gets published
npm pack --dry-run
```

**Template sync logic:**
- Reads source files from repo root: `agent/workflows/`, `schemas/`, `.claude/`, `.opencode/`, `.agents/`, `.github/prompts/`, `QUICK-START.md`, `AGENT_PERSONAS.md`
- Copies to `template/` directory
- On `npm publish`, `prepublishOnly` hook runs sync automatically

`prepublishOnly` runs `sync-template` automatically, so a regular `npm publish` always ships an up-to-date template.

## License

MIT
