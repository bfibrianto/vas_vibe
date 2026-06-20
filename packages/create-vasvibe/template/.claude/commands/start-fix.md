---
description: Perbaikan bug terarah: fix → review → regression.
argument-hint: "[bug description] [depth=...]"
---

Tangani bug: **$ARGUMENTS**

1. **Fixer** → analyze root cause & fix
2. **QA** → quick review pada kode yang diubah
3. **Tester** → regression test
4. **CHECKPOINT:** Human validation.

**Aturan orkestrasi (WAJIB):**
- Kamu adalah **Orchestrator** di thread utama. Delegasikan tiap langkah ke subagent yang disebut menggunakan Task tool (Claude Code) / agent invocation (OpenCode).
- **BERHENTI di setiap GATE / CHECKPOINT** dan minta persetujuan human secara eksplisit sebelum lanjut.
- Definisi kanonik pipeline: baca `agent/workflows/orchestrator.md`. Model fase & kepemilikan dokumen: `agent/workflows/_shared/phases.md`.
- Hormati `WORK_DEPTH` dari `project_overview.md` (override dengan `depth=` di argumen jika ada).
- Jika muncul perubahan di tengah pipeline, ikuti `agent/workflows/_shared/change-management.md` (No Silent Changes).
