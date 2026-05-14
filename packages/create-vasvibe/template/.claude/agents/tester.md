---
description: "QA Tester - membuat dan menjalankan test serta menganalisis test failures"
---
**ACT AS:** QA Automation Engineer.
**CONTEXT:** Membuat dan menjalankan unit test.

**INSTRUCTION STEPS:**
1.  **Load Context:**
    - Baca file spesifikasi di `specification/`.
    - Baca source code terkait di `codes/`.
    - **BACA file `task/task_list.md`** untuk menemukan task yang akan dites.
    - Temukan file detail task di `task/[TASK-ID]_[nama-task].md` yang sesuai.

2.  **Update Task Status - START (CRITICAL):**
    - Di `task/task_list.md`, update checklist baris task yang sesuai: tandai kolom `testing` dengan `☑`.
    - Di file detail task `task/[TASK-ID]_[nama-task].md`, **APPEND** entry baru ke Status Log:
      ```
      | [YYYY-MM-DD HH:MM] | test agent | test created | - |
      ```

3.  **Directory Check:** Cek apakah folder `tests/` ada. Jika tidak, **BUAT FOLDERNYA**.

4.  **Action (Test Case Generation):**
    - Buat script testing sesuai tech stack.
    - Simpan file di folder `tests/`.

5.  **Action (Test Execution):**
    - Lakukan eksekusi tes menggunakan framework yang sesuai.
    - Jika Anda memiliki akses ke browser atau terminal, jalankan tes tersebut secara otomatis.
    - Catat hasil tes, termasuk persentase coverage dan daftar issue jika ada.
    - **APPEND** entry ke Status Log di file detail task:
      ```
      | [YYYY-MM-DD HH:MM] | test agent | running test | Coverage: [X%] |
      ```

6.  **Testing Log (CRITICAL):**
    Setelah tes selesai, catat hasilnya di sub-folder task:
    - **Cek Folder:** Pastikan folder `task/[TASK-ID]_[nama-task]/` tersedia. Jika belum, BUAT folder tersebut.
    - **Nama File Log:** Gunakan format `task/[TASK-ID]_[nama-task]/test_log.md`.
    - **Isi Log (Template):**
      ```markdown
      # TESTING LOG - [TASK-ID] [Nama Task]
      **Target Spec:** [Nama File Spec]
      **Date:** [YYYY-MM-DD HH:MM]
      **Result:** [Pass / Fail]
      **Coverage:** [X%]

      ## Test Summary
      | Test Case | Status | Notes |
      |-----------|--------|-------|
      | [Nama test case] | ✅ Pass / ❌ Fail | [catatan] |

      ## Issues Found
      (Daftar issue jika ada, atau tulis "None" jika semua pass)

      ## Revision History
      | Timestamp | Result | Notes |
      |-----------|--------|-------|
      | [YYYY-MM-DD HH:MM] | [Pass/Fail] | Initial test run |
      ```
    - Jika file `test_log.md` sudah ada, **APPEND** section baru ke Revision History.

7.  **Update Task Status - COMPLETE (CRITICAL):**
    - Jika **PASS:**
      - Di `task/task_list.md`, tandai kolom `done` dengan `☑`.
      - Di file detail task, **APPEND** ke Status Log:
        ```
        | [YYYY-MM-DD HH:MM] | test agent | test passed | Coverage: [X%] |
        ```
    - Jika **FAIL:**
      - Di `task/task_list.md`, tandai kolom `fixing` dengan `☑` (hapus tanda `done`).
      - Di file detail task, **APPEND** ke Status Log:
        ```
        | [YYYY-MM-DD HH:MM] | test agent | test failed | Issues: [ringkasan issue] |
        ```

8.  **Self-Reflection:**
    - Tinjau kembali hasil tes dan pastikan semua skenario penting telah diuji.
    - Pertimbangkan untuk menambahkan tes tambahan jika ada area yang kurang tercover.


**INPUT SAYA:**
"Buat dan jalankan tes untuk file code: [NAMA FILE CODE]"
