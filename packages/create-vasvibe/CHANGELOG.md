# CHANGELOG — create-vasvibe

All notable changes to the VasVibe workflow & scaffold are documented here.

Format: [Semantic Versioning](https://semver.org/) — `MAJOR.MINOR.PATCH`

---

## [2.7.0] — 2026-10-06

### Added — Perf Tester: Performance & Load Testing as Code

New agent (**21 agents total**) that executes performance & load tests and tracks them against SLA — Reliability keeps ownership of review & root-cause fixes.

- **`perf-tester` agent** (`agent/workflows/perf-tester.md`) — builds a workload model (critical user journeys, traffic mix, think time, varied test data), writes tests as code in `tests/performance/`, runs smoke → load → stress/spike/soak/breakpoint per Work Depth, compares p50/p95/p99, RPS and error rate with SLA thresholds and `tests/performance/baseline.json`, and reports PERF-xx findings with suspected bottlenecks.
- **Tooling** — **k6** by default (JavaScript scripts, thresholds as SLA gates with non-zero exit code, CLI-first); **JMeter** in non-GUI mode when the project already has `.jmx` plans, needs protocols like JDBC/JMS/LDAP/SOAP, or `tool=jmeter` is passed.
- **`/load-test "[target]" [type=] [tool=]` command** — Claude, OpenCode, Antigravity (`.agents/workflows/`), and Codex (`$vasvibe-load-test`); Copilot via `perf-tester.prompt.md`.
- **Safety rules** — never load-tests production or third-party services without explicit human approval; credentials only via env vars; `abortOnFail` on error rate.
- **Hardening integration** — `reliability.md`, `orchestrator.md`, `phases.md`, and `/harden-release` now delegate load test execution to Perf Tester and add Performance to the hardening checkpoint.

### Fixed
- **Template no longer ships the repo's own project state** — `sync-template` now copies only the `state/` skeleton (directories, `.gitkeep`, `workspace-manifest.json`), so local `context.json`, knowledge-base docs, and `pipeline_log.md` are never published.

---

## [2.3.0] — 2026-07-09

### Added — Manual Tester: Headful UAT with Scenario Matrix & Defect Triage

New agent (**20 agents total**) that runs human-style acceptance testing — distinct from `tester`, which does scripted/assertion-based E2E for CI.

- **`manual-tester` agent** (`agent/workflows/manual-tester.md`) — builds a Normal/Abnormal scenario matrix per feature/function, executes it **headful** in Playwright (no headless mode), screenshots every scenario, marks Pass/Fail, and triages failures as **Major** or **Minor** with a description for the Fixer agent.
- **`/manual-test "[fitur]"` command** (Claude, OpenCode) — optional, runs alongside `/test-feature` without changing the Fase 3 gate or the `/deliver-feature` pipeline.
- **Report format** — `task/[TASK-ID]_[nama-task]/manual_test_report.md`: a Summary table (aggregate pass/fail/major/minor counts per iteration) plus a Scenario Detail table (steps, expected/actual result, severity, screenshot path). Retests append a new iteration section — history is kept, not overwritten.
- **Non-invasive status handling** — Manual Tester only appends to `Status Logs:`; it never touches the `Current Status` state machine field owned by `tester`/`fixer`, so it can be invoked independently without conflicting with the scripted pipeline.
- **Fixer integration** — `fixer.md` now also reads `manual_test_report.md` (if present) for Major/Minor UAT findings before diagnosing.

### Changed
- Docs updated: `AGENT_PERSONAS.md` (20 agents, new §5b), `README.md`, `QUICK-START.md`.

---

## [2.2.0] — 2026-06-22

### Added — Toolsmith: Agentic Workspace Provisioning

New cross-phase agent (**19 agents total**) that sets up the *AI agent's own toolkit* — distinct from DevOps, which provisions the *product's* runtime.

- **`toolsmith` agent** (`agent/workflows/toolsmith.md`) — installs needed **skills** and configures **MCP servers** for the active AI tool, declaratively. Modes: `init` (initial), `switch` (tool change), `sync` (fix drift).
- **`/setup-workspace` command** (Claude, OpenCode, Antigravity) — `[init|switch|sync] [tool=...]`.
- **Desired-state architecture** — `state/workspace-manifest.json` is the platform-agnostic source of truth (which skills + MCP the project wants); per-tool config files (`.mcp.json`, `opencode.json`, `.vscode/mcp.json`, `.agents/mcp.json`) are derived artifacts. Switching tools re-applies the same manifest to the new tool's format — that's what makes tool-switch seamless.
- **Curated registry** — `schemas/workspace-registry.json`: tech-stack→{skills,mcp} mappings, a catalog of common MCP servers (filesystem, git, fetch, postgres, playwright, shadcn), and per-platform MCP config recipes. Hybrid: registry default + agent augmentation via `find-skills`.
- **Manifest template** — `schemas/workspace-manifest.template.json`.

### Changed
- **Orchestrator wiring** — `/plan-project` runs Toolsmith `init` after tech stack is known (step 3b); `/build-feature` runs Toolsmith `sync`/`switch` before coding (step 0). `/setup-workspace` added to meta commands.
- **phases.md** — Toolsmith added to Fase 1 and cross-phase tables.
- **Declarative + no secrets** — MCP config written to files (commit-able); sensitive env values written as `${VAR}` placeholders for the human to fill.
- Docs updated: `AGENT_PERSONAS.md` (19 agents), `QUICK-START.md`.

---

## [2.0.0] — 2026-06-20

### Workflow Overhaul — 4-Phase Model

Major restructure of the agent workflow into four gated phases: **Perencanaan → Pengerjaan → Testing → Hardening**, each ending with a human gate.

> ⚠️ This release currently materializes the new agents only in `.opencode/agents/` and `.claude/agents/` (plus source of truth `agent/workflows/`) for workflow testing. Propagation to the create-vasvibe template, `.github/prompts/`, and `.agents/` JSON — and npm publish — are deferred until the workflow is validated.

### Added
- **4-phase model** — `agent/workflows/_shared/phases.md` defining phases, agent ownership, and gates.
- **Rigid change management** — `agent/workflows/_shared/change-management.md` ("No Silent Changes"): every user-requested change must be written to its reference doc, recorded as an ADR when significant, and propagated to downstream agents.
- **5 new agents:**
  - `backend` — Backend Engineer (API, logic, DB) — implementation phase, `depth=standard|deep`
  - `frontend` — Frontend Engineer & UI Specialist — implementation phase, `depth=standard|deep`
  - `data-architect` — Data model & governance — planning phase
  - `ux-designer` — Design system & UI guidelines — planning phase
  - `reliability` — Reliability & Performance Engineer — hardening phase (per-release)
- **Knowledge base** under `state/knowledge_base/` (architecture, data-model, design-system, security, decisions/ADRs).
- **New schema templates:** `adr.template.md`, `data-model.template.md`, `design-system.template.md`, `security-standards.template.md`.
- **Phase-gated orchestrator pipelines:** `/plan-project`, `/build-feature`, `/test-feature`, `/harden-release`, `/deliver-feature` (alongside existing `/release`, `/start-fix`, `/security-audit`, `/daily-standup`).
- **Security Mode S** — security standards-setting during the planning phase (complements existing audit/fix Modes A–D in hardening).

### Changed
- **Developer split** into Backend + Frontend specialists. The `developer` agent is now **fast-mode only** (`depth=fast` fullstack); `standard`/`deep` use the separate engineers, unified by the **API Contract**.
- **Analyst** repositioned to the planning phase as primary owner of `specifications/`, with a just-in-time **spec-lock** touchpoint at the start of implementation.
- All 17 agents now carry a **Change Management** pointer enforcing rigid communication.

---

## [1.2.0] — 2026-06-20

### Added
- **Work Depth system** (`fast` / `standard` / `deep`) across all agents via `_shared/work-depth.md`, settable in `project_overview.md`, per-pipeline (`depth=`), or per-agent.
- CLI work-depth prompt on scaffold + `--depth=<level>` flag.
- Security Expert agent and `/security-audit` pipeline.

### Fixed
- Added required YAML frontmatter (`name`/`description`) to all `.claude/agents/` files for Claude Code auto-discovery.

---

## [1.1.0]

### Added
- `upgrade` subcommand to refresh agent files in existing projects.
- Changelog & release workflow.
