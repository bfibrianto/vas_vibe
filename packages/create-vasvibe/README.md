# create-vasvibe

Scaffold a new VasVibe project with **21 agents**, **4-phase workflow**, and **multi-tool support** preconfigured.

**VasVibe v2.3** — AI-native development framework with:
- ✅ 4-Phase Model (Perencanaan → Pengerjaan → Testing → Hardening) with gates
- ✅ 21 specialized agents (Discovery, Backend/Frontend/Fullstack, Security, Reliability, Perf Tester, DevOps, Manual Tester, etc.)
- ✅ Toolsmith agent for agentic workspace provisioning (skills + MCP)
- ✅ Multi-tool support (OpenAI Codex, Claude Code, OpenCode, GitHub Copilot, Antigravity)
- ✅ No Silent Changes protocol (every change tracked in docs)
- ✅ Work Depth system (fast/standard/deep)

```bash
npx create-vasvibe my-new-project
```

The command produces a project folder containing all agent toolchains, workflows, schemas, and standard working folders (`codes/`, `specifications/`, `state/`, `tests/`) with `.gitignore` rules already configured.

## What you get

```
my-new-project/
├── AGENTS.md                       # Codex project instructions
├── .codex/agents/                  # Codex custom agents (VasVibe personas)
├── .agents/skills/vasvibe-*/       # Explicitly invokable Codex workflow/persona skills
├── .agents/                        # Antigravity agent wrappers & skills
├── .claude/                        # Claude Code agents & skills
├── .opencode/                      # OpenCode commands & skills
├── .github/prompts/                # GitHub Copilot prompt files (21 agents)
├── agent/workflows/                # Source of truth: agent definitions (21 total)
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
│   ├── qa.md, tester.md, manual-tester.md, fixer.md # QA & testing
│   ├── security.md, reliability.md, perf-tester.md # Hardening phase
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
├── AGENT_PERSONAS.md               # All 21 agents documented
├── GIT_STRUCTURE_GUIDE.md
└── .gitignore
```

**Codex:** Start a new Codex session in the project. Invoke workflows with skills such as `$vasvibe-plan-project` and `$vasvibe-build-feature`; Codex personas are available as custom subagents from `.codex/agents/`.

**Multi-Tool:** Agent instructions propagate from `agent/workflows/` to Codex, `.claude/`, `.opencode/`, `.agents/`, and `.github/prompts/`.

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

For Codex users, start a new session in the scaffolded project and invoke workflows directly with skills, for example `$vasvibe-plan-project` or `$vasvibe-build-feature`. Invoke a persona in the current conversation with `$vasvibe-agent-backend`; pipeline delegation uses the custom subagent `vasvibe_backend`.

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
| `--no-claude`    | Exclude `.claude/` and Antigravity wrapper files         |
| `--no-codex`     | Exclude Codex subagents and VasVibe Codex skills          |
| `--no-github`    | Exclude `.github/prompts/`                               |
| `--no-workflows` | Exclude `agent/workflows/` when Codex is disabled         |
| `--depth=<level>` | Set work depth: `fast`, `standard`, or `deep`             |
| `--dry-run`      | Preview an upgrade without writing files                  |
| `-h, --help`     | Show help                                                |
| `-v, --version`  | Print version                                            |

### Examples

```bash
# Interactive (choose depth + tools)
npx create-vasvibe my-app

# Standard mode MVP scaffold (default depth, all tools)
npx create-vasvibe my-app --yes

# Only Codex + workflows
npx create-vasvibe my-app --yes --no-opencode --no-claude --no-github
```

### Quick Start

After scaffold, read **`QUICK-START.md`** for step-by-step workflow guide (Indonesian):
- Mental model of 4 phases
- Command reference (/plan-project, /build-feature, /test-feature, /release)
- Work depth strategy
- Gate approval process

## Development (for maintainers)

This package lives at `packages/create-vasvibe/` in the monorepo. Source of truth for content is the repo root (`agent/workflows/`, `schemas/`, `.claude/`, `.opencode/`, `.agents/`, `.github/prompts/`); `template/` is generated by a sync script.

**Key changes in v2.8:**
- Added `manual-tester-vascomm` agent (`/manual-test-vascomm`) — same headful UAT as `manual-tester`, but test cases and results go into the Vascomm spreadsheet template (`state/templates/manual-test-vascomm/`), one sheet per test round, on Google Sheets with screenshots linked from Google Drive, or a local `.xlsx` + screenshot folder in `tests/` as fallback.

**Key changes in v2.7:**
- Added `perf-tester` agent (`/load-test`) — performance & load testing as code with **k6** (default) or **JMeter** (non-GUI, when the project already uses it): smoke/load/stress/spike/soak/breakpoint, SLA thresholds from architecture docs, baseline regression tracking, `performance_report.md`. Reliability now delegates load test execution to it during `/harden-release`.

**Key changes in v2.3:**
- Added `manual-tester` agent (`/manual-test`) — headful Playwright UAT: scenario matrix (Normal/Abnormal), screenshot evidence, Major/Minor defect triage, retest-iteration report. Optional and independent from `tester` (scripted E2E); does not change the Fase 3 gate.

**Key changes in v2.2:**
- Source of truth → 19 agents in `agent/workflows/` (not 8)
- Multi-tool propagation: auto-syncs to `.claude/`, `.opencode/`, `.agents/`, `.github/prompts/`
- Added: `schemas/workspace-registry.json`, `schemas/workspace-manifest.template.json`
- Added: `state/` folder with `workspace-manifest.json` and `knowledge_base/` template
- Added: `_shared/` docs (phases.md, change-management.md, work-depth.md, git-branch-management.md)
- Renamed: `developer.md` → `fullstack.md`

```bash
# Regenerate Codex subagents/skills and sync template/ from repo root
npm run sync-codex
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
