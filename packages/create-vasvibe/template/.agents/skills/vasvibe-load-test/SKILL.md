---
name: vasvibe-load-test
description: Run the VasVibe load test workflow with its approval gates.
---

Jalankan **Performance & Load Testing** untuk: **$ARGUMENTS**

Langkah:
1. **CHECKPOINT — Scope & Safety:** konfirmasi ke human target environment (URL), SLA/threshold (dari `state/knowledge_base/architecture/` atau usulan default), tipe test (`type=smoke|load|stress|spike|soak|breakpoint`), dan puncak beban. **Jangan pernah** load test production / layanan pihak ketiga tanpa izin eksplisit.
2. **Perf Tester** → susun workload model (user journey + mix trafik), tulis script sebagai kode di `tests/performance/` (default **k6**; **JMeter** non-GUI hanya jika `tool=jmeter`, project sudah punya `.jmx`, atau butuh protokol khusus), jalankan **smoke test** dulu, lalu test sesuai `type`/Work Depth, dan tulis `performance_report.md` (p50/p95/p99, RPS, error rate, SLA Pass/Fail, delta vs baseline, temuan PERF-xx).
3. Jika SLA gagal → **Reliability** (saat hardening) atau **Backend** memperbaiki bottleneck; bug fungsional → **Fixer**. Lalu jalankan ulang `/load-test` untuk verifikasi (run bertambah, histori tetap tersimpan).
4. **GATE — SLA terpenuhi:** semua threshold Pass, atau risiko tersisa didokumentasikan & diterima human. Update `tests/performance/baseline.json` hanya atas persetujuan human.

**Catatan integrasi (PENTING):**
- Command ini bisa dipanggil **ad-hoc** (per fitur/endpoint) dan juga dipakai otomatis oleh **Reliability** pada `/harden-release` (Fase 4).
- Perf Tester **tidak pernah mengubah** `Current Status` di `task/task_list.md` — hanya menambah baris di `Status Logs:`.
- Definisi lengkap agent: `agent/workflows/perf-tester.md`.
- Laporan: `task/[RELEASE-VERSION]/performance_report.md` (per-release) atau `task/[TASK-ID]_[nama-task]/performance_report.md` (per-fitur). Script & hasil: `tests/performance/`.
- Hormati `WORK_DEPTH` dari `project_overview.md` (override dengan `depth=` di argumen jika ada).
- Jika muncul perubahan SLA/scope di tengah pipeline, ikuti `agent/workflows/_shared/change-management.md` (No Silent Changes).

For delegation, invoke the configured Codex custom subagent named vasvibe_<persona> (for example, PM → vasvibe_pm). Keep interactive discovery and every human approval gate in the main conversation.
