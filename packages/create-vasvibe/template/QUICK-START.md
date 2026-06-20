# 🚀 Quick Start — VasVibe Workflow

Panduan singkat memulai proyek dengan workflow agen VasVibe setelah scaffold selesai.

> **Sudah install?** Kamu menjalankan `npx create-vasvibe my-app`. Folder `my-app/` sudah berisi semua agen & command. Buka folder itu di **Claude Code** atau **OpenCode**, lalu ikuti langkah di bawah.

---

## 1. Mental Model (1 menit)

Proyek dikerjakan dalam **4 fase**, masing-masing diakhiri **gerbang (gate)** — kamu (human) menyetujui sebelum lanjut:

```
🟦 Perencanaan → 🟩 Pengerjaan → 🟨 Testing → 🟧 Hardening
   (blueprint)     (coding)        (E2E)        (security+reliability)
       ↑ gate          ↑ gate         ↑ gate         ↑ gate
```

3 hal yang perlu kamu tahu:
- **Work Depth** — atur kedalaman kerja: `fast` (prototype), `standard` (default), `deep` (kritikal). Diset di `project_overview.md`.
- **Gate** — agen BERHENTI minta approval di tiap akhir fase. Tidak ada yang jalan diam-diam.
- **No Silent Changes** — setiap perubahan yang kamu minta otomatis ditulis ke dokumen acuan + agen terkait di-notify.

---

## 2. Alur Pertama Kali (langkah demi langkah)

### Langkah 0 — Tentukan Work Depth
Buka `project_overview.md`, bagian `## 7. Project Settings`:
```
WORK_DEPTH: standard   # fast | standard | deep
```
Mau cepat dulu? Pakai `fast`. Mau matang? `deep`. Bisa diubah kapan saja, atau di-override per pipeline dengan `depth=`.

### Langkah 1 — 🟦 Perencanaan
```
/plan-project "aplikasi booking kapal wisata Labuan Bajo, Next.js, ada payment"
```
**Dimulai dengan Discovery** — agen akan **mewawancaraimu** dulu (tanya-jawab tentang tujuan, pengguna, scope, constraint) supaya rencananya matang. Jawab pertanyaannya; hasilnya `requirements.md`.
Setelah kamu sign-off, barulah Initiator menyusun `project_overview.md`, lalu arsitektur, data model, design system, security standards, dan **spesifikasi + API Contract**.
👉 **Review & setujui di tiap gate.** API Contract harus final sebelum lanjut.

### Langkah 2 — 🟩 Pengerjaan
```
/build-feature "Login dengan email & password"
```
- `depth=standard|deep` → **Backend** & **Frontend** engineer kerja paralel
- `depth=fast` → satu **Developer** fullstack
Lalu **QA** review kode.
👉 **Review kode di gate.**

### Langkah 3 — 🟨 Testing
```
/test-feature "Login dengan email & password"
```
**Tester** jalankan E2E; kalau gagal **Fixer** perbaiki sampai hijau.
👉 **Approve saat semua test hijau.**

> 💡 Gabung langkah 2+3 sekaligus: `/deliver-feature "Login..."`

### Langkah 4 — 🟧 Hardening + Rilis (per-release)
Setelah beberapa fitur selesai:
```
/release "2.0.0"
```
Menjalankan hardening (security audit + reliability/load test), update CHANGELOG, dan bikin git tag.
👉 **Sign-off siap produksi.**

---

## 3. Daftar Command

| Command | Fase | Fungsi |
|---------|------|--------|
| `/plan-project "[ide]"` | 🟦 Perencanaan | Buat semua blueprint/acuan |
| `/build-feature "[fitur]" [depth=]` | 🟩 Pengerjaan | Implementasi satu fitur |
| `/test-feature "[fitur]"` | 🟨 Testing | E2E test fungsional |
| `/harden-release "[versi]"` | 🟧 Hardening | Security + reliability audit |
| `/deliver-feature "[fitur]"` | 🟩→🟨 | Build + test sekaligus |
| `/release "[versi]"` | — | Hardening → changelog → tag |
| `/start-fix "[bug]"` | — | Perbaikan bug terarah |
| `/security-audit "[scope]"` | — | Audit keamanan ad-hoc |
| `/daily-standup` | — | Ringkasan progres per fase |

> Bisa juga panggil agen langsung tanpa command, mis. *"pakai agent ux-designer untuk rancang design system"*.

---

## 4. Work Depth — Kapan Pakai Apa

| Level | Untuk | Yang dikerjakan |
|-------|-------|-----------------|
| **fast** | Prototype, MVP, eksplorasi | Inti fitur saja, 1 Developer fullstack, skip test/hardening opsional |
| **standard** | Produksi normal *(default)* | Backend+Frontend terpisah, full spec, unit test, review |
| **deep** | Fintech, auth, data sensitif | + security standards, full coverage, hardening penuh |

---

## 5. Di Mana Semuanya?

```
project_overview.md          → setting proyek + WORK_DEPTH
specifications/              → user story + API Contract (Analyst)
state/knowledge_base/        → acuan: architecture, data-model, design-system, security, decisions (ADR)
codes/                      → source code (Backend/Frontend/Developer)
tests/                      → E2E test (Tester)
task/                       → task list + log per task
agent/workflows/            → definisi agen (source of truth)
agent/workflows/_shared/    → phases.md, work-depth.md, change-management.md
```

---

## 6. Tips

- **Selalu mulai dari `/plan-project`.** Coding tanpa blueprint = utang.
- **Hormati gate.** Approval-mu di tiap fase yang menjaga kualitas.
- **Minta perubahan kapan saja** — agen wajib mencatatnya ke acuan (No Silent Changes), jadi spec & dokumen tidak akan basi.
- **Mulai `fast`, naik ke `standard`/`deep`** saat fitur makin serius.

Selamat membangun. 🛠️
