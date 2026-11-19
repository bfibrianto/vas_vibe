---
description: Fase 1 untuk proyek existing (brownfield) — siapkan state, knowledge base, requirements, overview & blueprint dari source code + wawancara. Pengganti /plan-project bila codes/ sudah berisi kode.
argument-hint: "[konteks/tujuan] [docs=path,...] [depth=fast|standard|deep]"
---

Jalankan **Discovery Project** (Fase 1 versi brownfield) untuk: **$ARGUMENTS**

Langkah:
0. **Bootstrap & deteksi (kamu sendiri, thread utama)**
   - Buat struktur state yang belum ada — **JANGAN timpa** file yang sudah ada: `state/context.json` (dari `schemas/context.template.json`), `state/pipeline_log.md`, `state/knowledge_base/{requirements,codebase,architecture,data-model,design-system,security,decisions}/`.
   - **Deteksi mode:** `codes/` berisi source code → **brownfield** (lanjut workflow ini). `codes/` kosong → **greenfield**: jalankan langkah 2, 4–7 saja (wawancara mode greenfield), lalu arahkan ke `/plan-project` — yang akan melewati Discovery & Initiator karena `requirements.md` sudah `Approved`.
   - **Resume:** jika `state/context.json` → `discovery.step` sudah terisi, tawarkan lanjut dari langkah tersebut, revisi, atau mulai ulang.
   - Tentukan `WORK_DEPTH` (argumen `depth=` > `project_overview.md` lama > tanya human; default `standard`).
1. **Explorer** (delegasi) → baca `codes/`, hasilkan `state/knowledge_base/codebase/inventory.md` + `state/knowledge_base/codebase/as-is-overview.md` (tag `[confirmed]`/`[inferred]`/`[unknown]`, sertakan path file bukti). **Explorer TIDAK menulis `project_overview.md` di workflow ini.**
2. **Ingest dokumen (kamu sendiri)** → baca dokumen yang diberikan (`docs=` atau disebut human: PRD, notulen, brief, README, OpenAPI, link Google Docs/Drive bila connector tersedia). Catat sebagai sumber di `requirements.md`.
3. **CHECKPOINT — Temuan codebase:** tampilkan ringkasan tech stack, modul/fitur (implemented/partial), gap & daftar `[unknown]`. Human koreksi sebelum wawancara.
4. **Discovery (INTERAKTIF — JANGAN delegasikan ke subagent)** → kamu sendiri wawancara human dengan **mode brownfield** di `agent/workflows/discovery.md`: fokus pada `[unknown]`, konteks bisnis, pain point sistem sekarang, dan **tujuan pengembangan berikutnya (To-Be)**. Simpan `requirements.md` (status `Gathering`) setiap selesai satu ronde.
5. **GATE:** Cek *Definition of Ready* di `requirements.md`, lalu human sign-off (`Status: Approved`).
6. **Initiator** (delegasi) → `project_overview.md` dari `schemas/project-overview.template.md`: fakta As-Is dari codebase + arah To-Be dari requirements, `## 7. Project Settings` dengan `Source: brownfield`.
7. **CHECKPOINT:** Human review overview (stack existing, UI vibe, work depth, To-Be).
8. **Toolsmith** (mode `init`, delegasi) → skill + MCP sesuai tech stack existing. Lewati jika `state/workspace-manifest.json` sudah ter-apply untuk tool aktif.
9. **Reverse-engineer acuan As-Is** (delegasi, paralel bila bisa) — setiap dokumen memisahkan **As-Is** (dengan path bukti) dan **Target/Gap**:
   - **SysArch** → `state/knowledge_base/architecture/` (dari docker/CI/infra config; lewati di `depth=fast` jika tidak ada infra)
   - **Data Architect** → `state/knowledge_base/data-model/` (dari migration/ORM schema)
   - **UX Designer** → `state/knowledge_base/design-system/` (ekstrak token dari theme/tailwind config & komponen yang ada; lewati jika tidak ada UI)
   - **Security (Mode S)** → `state/knowledge_base/security/security-standards.md` (baseline + gap; wajib di `depth=deep`)
10. **Analyst** (delegasi) → `specifications/000_spec_environment_setup.md` (cara menjalankan kode **existing**), **API Contract As-Is** dari endpoint/OpenAPI yang ada, dan backlog user story untuk item To-Be & gap (mereferensikan ID `FR-`/`NFR-`).
11. **GATE — Blueprint disetujui:** Human approve semua acuan. Finalisasi: update `state/context.json` (`phase: planning-approved`, `discovery.step: done`), log ke `state/pipeline_log.md`, tulis `state/agent_handoff.json`. Langkah berikutnya: `/plan-feature` atau `/build-feature`.

**Aturan orkestrasi (WAJIB):**
- Kamu adalah **Orchestrator** di thread utama. Delegasikan tiap langkah ke subagent yang disebut menggunakan Task tool (Claude Code) / agent invocation (OpenCode). Langkah 0, 2, 4 dan semua GATE/CHECKPOINT tetap di thread utama.
- **BERHENTI di setiap GATE / CHECKPOINT** dan minta persetujuan human secara eksplisit sebelum lanjut.
- **Kode adalah fakta, dokumen adalah klaim:** jika dokumen/jawaban human bertentangan dengan kode, catat di `requirements.md` → Open Questions dan tanyakan; jangan pilih diam-diam.
- **Read-only terhadap `codes/`** — workflow ini tidak mengubah source code.
- Simpan progres di `state/context.json` → `discovery` setiap selesai langkah, agar bisa dilanjutkan di sesi lain.
- Definisi kanonik pipeline: baca `agent/workflows/orchestrator.md`. Model fase & kepemilikan dokumen: `agent/workflows/_shared/phases.md`.
- Hormati `WORK_DEPTH` (override dengan `depth=` di argumen jika ada).
- Jika muncul perubahan di tengah pipeline, ikuti `agent/workflows/_shared/change-management.md` (No Silent Changes).
