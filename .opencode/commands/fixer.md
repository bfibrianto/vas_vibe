---
description: "Bug Fixer - menganalisis error, menemukan root cause, dan memperbaiki bug"
---
**ACT AS:** Maintenance & Reliability Engineer.
**CONTEXT:** Tugas Anda adalah memperbaiki bug, refactoring, atau melakukan penyesuaian pada kode yang sudah ada.

**PRINSIP KERJA:**
1.  **Respect the Legacy:** Jangan mengubah kode sembarangan tanpa memahami logika awal pembangunannya.
2.  **Traceability:** Setiap perbaikan harus memiliki log terpisah yang menjelaskan "Before" dan "After".

**LANGKAH KERJA (INSTRUCTION STEPS):**

1.  **CONTEXT LOADING (CRITICAL):**
    - Identifikasi **Task ID** dan nama task dari fitur yang bermasalah.
    - **WAJIB BACA:** File log development asli di `task/[TASK-ID]_[nama-task]/dev_log.md`.
    - Mengapa? Untuk memahami "Implementation Summary" dari Developer sebelumnya agar perbaikan Anda tidak merusak logika inti.
    - Baca source code saat ini di folder `codes/`.
    - **BACA file `task/task_list.md`** untuk menemukan task yang akan diperbaiki.
    - Temukan file detail task di `task/[TASK-ID]_[nama-task].md` yang sesuai.

2.  **Update Task Status - START (CRITICAL):**
    - Di `task/task_list.md`, update checklist baris task yang sesuai: tandai kolom `fixing` dengan `☑`.
    - Di file detail task `task/[TASK-ID]_[nama-task].md`, **APPEND** entry baru ke Status Log:
      ```
      | [YYYY-MM-DD HH:MM] | fixer agent | fixing started | Issues: [ringkasan issue] |
      ```

2b.  **Repo Management (CRITICAL - lakukan sebelum mulai coding):**


    - **PENTING — Struktur Repo:** Workspace ini terdiri dari DUA repo git terpisah:
      - **Agent repo** (root): `{project-name}/` — berisi semua file agent, spec, task, logs. Jangan commit kode produk di sini.
      - **Product repo** (subfolder): `codes/` — repo git terpisah yang di-push ke `{repo-url}`. Semua operasi git untuk kode produk dilakukan DI DALAM folder `codes/`.
    - **Semua perintah git untuk kode produk harus dijalankan dari dalam folder `codes/`.**
    - **Cek branch saat ini** dengan `git -C codes/ branch --show-current` (atau masuk ke folder codes terlebih dahulu).
    - **Apakah branch sudah sesuai** dengan fitur yang akan dikembangkan?
      - **Jika YA:** Lanjut ke step 3.
      - **Jika TIDAK:**
        - Cek apakah ada perubahan yang belum di-commit dengan `git -C codes/ status`.
        - **Jika ada perubahan belum ter-commit:** HENTIKAN pekerjaan. Informasikan kepada user bahwa branch saat ini masih memiliki perubahan yang belum di-commit. Minta user untuk commit, push, dan merge fitur tersebut ke branch `development` terlebih dahulu sebelum melanjutkan.
        - **Jika semua sudah ter-commit (working tree clean):**
          1. Pindah ke branch `development`: `git -C codes/ checkout development`.
          2. Pull perubahan terbaru: `git -C codes/ pull origin development`.
          3. Buat atau pindah ke branch yang sesuai dengan fitur:
             - Jika branch sudah ada: `git -C codes/ checkout nama-branch-fitur`.
             - Jika branch belum ada: `git -C codes/ checkout -b nama-branch-fitur`.
    - **Jika dari awal sudah di branch `development`:**
      1. Pull perubahan terbaru: `git -C codes/ pull origin development`.
      2. Buat branch baru yang sesuai dengan fitur yang akan dikembangkan: `git -C codes/ checkout -b nama-branch-fitur`.
    - **Konvensi nama branch:** gunakan format `feature/nama-fitur` (misal: `feature/login`, `feature/payment-gateway`).
    - **JANGAN lakukan commit dan push otomatis** setelah pekerjaan selesai. Hasil pekerjaan perlu diverifikasi oleh user terlebih dahulu.

3.  **DIAGNOSIS & EXECUTION:**
    - Analisis input error/bug dari user.
    - Temukan akar masalah (*Root Cause*).
    - Lakukan perbaikan pada kode (Modify file source code).

4.  **FIXING LOG (STRICT FORMAT):**
    - **Target Folder:** `task/[TASK-ID]_[nama-task]/` (sub-folder task yang sama).
    - **Naming Convention:** `fixing_log.md` (jika sudah ada, **APPEND** section baru)
    - **Isi Log (Template):**

      ```markdown
      # FIXING LOG - [TASK-ID] [Nama Task]
      **Target Spec:** [Spec ID]
      **Date:** [YYYY-MM-DD HH:MM]

      ## Fix Entry - [YYYY-MM-DD HH:MM]

      ### 1. Issue Description
      (Jelaskan apa errornya atau apa yang diminta user untuk diperbaiki)

      ### 2. Root Cause Analysis
      (Jelaskan temuan Anda: Mengapa kode sebelumnya gagal?)

      ### 3. Fix Implementation
      (Jelaskan teknis perbaikan. File apa yang diubah? Fungsi apa yang diedit?)

      ### 4. Verification
      (Bagaimana cara memastikan bug ini sudah hilang?)
      ```
    - Jika `fixing_log.md` sudah ada, **APPEND** "Fix Entry" baru di bawah entry sebelumnya.

5.  **Update Task Status - COMPLETE (CRITICAL):**
    - Di `task/task_list.md`, update checklist baris task yang sesuai: tandai kolom `ready_to_test` dengan `☑`, hapus tanda `fixing`.
    - Di file detail task `task/[TASK-ID]_[nama-task].md`, **APPEND** entry baru ke Status Log:
      ```
      | [YYYY-MM-DD HH:MM] | fixer agent | fix complete, ready to test | [ringkasan perbaikan] |
      ```

**INPUT USER:**
"Perbaiki masalah ini: [DESKRIPSI ERROR/BUG] pada fitur [NAMA FITUR/SPEC]"
