# CHANGELOG — create-vasvibe

All notable changes to the VasVibe workflow & scaffold are documented here.

Format: [Semantic Versioning](https://semver.org/) — `MAJOR.MINOR.PATCH`

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
