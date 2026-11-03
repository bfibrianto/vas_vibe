---
description: Manual/headful UAT testing (Vascomm) — test case & hasil per putaran ke Google Sheets bertemplate Vascomm + screenshot di Google Drive (fallback Excel lokal).
---

Jalankan **Manual/Headful UAT Testing (Vascomm Edition)** untuk fitur: **$ARGUMENTS**

Langkah:
1. **CHECKPOINT — Storage & Phase:** cek koneksi Google Drive + Google Sheets, lalu tanya user mau menyimpan di **Google Drive** (`storage=gdrive`, Google Sheet + folder screenshot di Drive) atau **lokal** (`storage=local`, file `.xlsx` + folder screenshot di `tests/manual-test-vascomm/`), dan test phase (`phase=UAT|SIT|...`, default `UAT`). Jika Google dipilih tapi koneksi tidak tersedia → beri tahu user lalu fallback ke lokal.
2. **Manual Tester Vascomm** → susun test case (Normal + Abnormal) sesuai template Vascomm (`state/templates/manual-test-vascomm/test-case-template.xlsx`), eksekusi headful Playwright dengan screenshot tiap TC, tulis test case **dan** hasilnya ke **satu sheet putaran** `[PHASE]-R[N]` (mis. `UAT-R1`), link screenshot di kolom `Screenshot`, temuan `Fail` ke `Defect List` (Major/Minor), dan satu baris baru di `Summary`.
3. Jika ada temuan **Major** → rekomendasikan **Fixer**, lalu jalankan ulang `/manual-test-vascomm` untuk retest — putaran baru ditulis ke **sheet baru** (`UAT-R2`, …), sheet putaran lama tidak ditimpa; status defect diperbarui ke `Closed`/`Reopened`.
4. **GATE — UAT hijau:** semua TC Pass di putaran terakhir, atau temuan Minor yang tersisa sudah didokumentasikan dan diterima human.

**Catatan integrasi (PENTING):**
- Varian dari `/manual-test`: cara pengujian sama, bedanya **tempat & format laporan** (spreadsheet bertemplate Vascomm, bukan `manual_test_report.md`). Independen dan opsional — tidak mengubah gate Fase 3 atau alur `/deliver-feature`.
- Agent **tidak pernah mengubah** `Current Status` di `task/task_list.md` — hanya menambah baris di `Status Logs:`.
- Definisi lengkap agent: `agent/workflows/manual-tester-vascomm.md`.
- Registry laporan (ID/URL spreadsheet & folder, daftar putaran): `task/[TASK-ID]_[nama-task]/manual_test_vascomm.json`; data tiap putaran: `task/[TASK-ID]_[nama-task]/vascomm-rounds/[SHEET].json`.
- Agent tidak mengubah sharing/permission file Google Drive kecuali diminta.
- Hormati `WORK_DEPTH` dari `project_overview.md` (override dengan `depth=` di argumen jika ada).
- Jika muncul perubahan scope di tengah pipeline, ikuti `agent/workflows/_shared/change-management.md` (No Silent Changes).
