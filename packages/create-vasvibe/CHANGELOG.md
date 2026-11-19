# CHANGELOG — create-vasvibe

All notable changes to the VasVibe workflow & scaffold are documented here.

Format: [Semantic Versioning](https://semver.org/) — `MAJOR.MINOR.PATCH`

---

## [2.9.0] — 2026-11-11

### Added — `/discover-project`: Phase 1 for Existing Codebases

New `/discover-project "[goal]" [docs=...] [depth=]` command — the Phase 1 entry point when `codes/` already contains source code, replacing `/plan-project` for brownfield projects. Produces the same blueprint, so Phases 2–4 run unchanged.

- **Bootstrap** — creates the missing `state/` files and knowledge-base folders (`schemas/context.template.json`, new `knowledge_base/codebase/`) without overwriting existing ones; detects greenfield vs brownfield; greenfield runs discovery + overview then hands off to `/plan-project`.
- **Code first, questions second** — Explorer (discover mode) writes `codebase/inventory.md` + `as-is-overview.md` with evidence paths and an *Unknowns for Discovery* list; Discovery interviews only for what the code cannot answer (business context, pain points, To-Be goals, what must not change). Conflicts between documents and code are raised, not silently resolved.
- **Document ingest** — PRDs, meeting notes, briefs, README and OpenAPI files (`docs=`), plus Google Docs/Drive when a connector is available.
- **Reverse-engineered blueprint** — SysArch, Data Architect, UX Designer and Security (Mode S) document As-Is (with file evidence) vs Target/Gap; Analyst writes the environment spec for the existing code, an As-Is API Contract and a To-Be backlog.
- **Resumable** — progress per step and per interview round in `state/context.json` → `discovery`.

### Changed — Discovery, Initiator & planning templates

- **Discovery** — greenfield/brownfield modes, multiple-choice questions where answers are predictable, saves `requirements.md` after every round, stable `FR-`/`NFR-` IDs, MoSCoW, Definition of Ready checklist before sign-off.
- **`schemas/requirements.template.md`** — Sources, Stakeholders, As-Is section, ID'd scope & NFR tables, Glossary, Definition of Ready.
- **`schemas/project-overview.template.md`** (new) — the overview template moves out of `initiator.md`; adds the previously missing `## 7. Project Settings` (`WORK_DEPTH`, `SOURCE`), origin tags (`[REQ]`, `[confirmed]`, `[AI-rec]`) and Known Gaps & Technical Debt.
- **`state/context.json`** — optional `phase`, `work_depth`, `source` and `discovery` fields; agents must keep fields they do not recognize.
- **`/plan-project`** redirects to `/discover-project` when `codes/` has code, skips steps 0–3 when requirements and overview are already approved, and now lists the Toolsmith step (3b) like the canonical pipeline.

---

## [2.8.0] — 2026-10-23

### Added — Manual Tester Vascomm: UAT Report to Spreadsheet Template

New `manual-tester-vascomm` agent and `/manual-test-vascomm "[fitur]" [storage=gdrive|local] [phase=UAT|SIT]` command — an extension of `/manual-test` that keeps the same test approach but changes where and how test cases and results are stored.

- **Vascomm spreadsheet template** (`state/templates/manual-test-vascomm/test-case-template.xlsx`) — `Summary` (schedule, defect result, one row per test round via `INDIRECT` formulas), `TC Template` (test case + test result in one sheet: steps per row, per-TC columns merged), `Defect List` (Major/Minor, status lifecycle with colors), and the defect status legend.
- **One sheet per test round** — `UAT-R1`, `UAT-R2`, `SIT-R1`, …; earlier rounds are never overwritten, defects move `New` → `Closed`/`Reopened` on retest.
- **Google Drive mode** — the spreadsheet is created from the template in a named Drive folder, screenshots go to `Screenshots/[SHEET]/` in the same folder, and the Screenshot/Capture columns link to them.
- **Local mode** — user's choice, or automatic fallback when the Google Drive/Sheets connection is unavailable: `.xlsx` + screenshot folder in `tests/manual-test-vascomm/[slug]/`, written by `state/templates/manual-test-vascomm/vascomm-xlsx.mjs` (exceljs).
- **Registry & round data** — `task/[TASK-ID]_[nama-task]/manual_test_vascomm.json` and `vascomm-rounds/[SHEET].json`; Fixer reads them for defect context.
- **Template sync** — `sync-template` now ships `state/templates/` with the scaffold.

### Changed — Antigravity: Migrated Workflows to Modern Skills

Updated Antigravity integration from deprecated `.agents/workflows/` format to modern `.agents/skills/<name>/SKILL.md` format in compliance with the latest Antigravity specification.

- **15 Antigravity Skills** (`.agents/skills/`) — Migrated workflows (`build-feature`, `build-prototype`, `daily-standup`, `deliver-feature`, `explorer`, `harden-release`, `load-test`, `logger`, `plan-feature`, `plan-project`, `release`, `security-audit`, `setup-workspace`, `start-fix`, `test-feature`) to skill packages with standard YAML frontmatter (`name`, `description`) and markdown instructions.
- **Native Slash Command Support** — Skills support direct invocation in Antigravity chat via `/<name>` (e.g. `/plan-project`, `/build-feature`, `/load-test`) alongside progressive disclosure and semantic skill discovery.
- **Legacy Workflows Safely Archived** — Existing `.agents/workflows/*.md` files safely archived as `*.md.bak`.
- **Codex & Scaffolder Synchronization** — Updated `scripts/sync-codex.mjs` to resolve from new skill paths, synchronized `packages/create-vasvibe/template/`, and updated package metadata.

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
