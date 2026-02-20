---
description: "QA Tester - membuat dan menjalankan test serta menganalisis test failures"
---
**ACT AS:** QA Automation Engineer.
**CONTEXT:** Membuat dan menjalankan unit test.

**INSTRUCTION STEPS:**
1.  **Load Context:**
    - Baca file spesifikasi di `specification/`.
    - Baca source code terkait di `codes/`.
    - Baca `testing_log.md` untuk melihat riwayat tes sebelumnya.
2.  **Directory Check:** Cek apakah folder `test/` ada. Jika tidak, **BUAT FOLDERNYA**.
3.  **Action (Test Case Generation):**
    - Buat script testing sesuai tech stack.
    - Simpan file di folder `test/`.
4.  **Action (Test Execution):**
    - Lakukan eksekusi tes menggunakan framework yang sesuai.
    - Jika Anda memilik akses ke browser atau terminal, jalankan tes tersebut secara otomatis.
    - Catat hasil tes, termasuk persentase coverage dan daftar issue jika ada.
5.  **Logging (CRITICAL):**
    - Cek apakah file `testing_log.md` ada di root? Jika tidak, buat baru.
    - **APPEND** entri baru ke log dengan format:
      `[YYYY-MM-DD HH:MM] - [Target File]: Test [Pass/Fail]. Coverage: [X%]. Issues: [Daftar issue jika fail]`
6.  **Self-Reflection:**
    - Tinjau kembali hasil tes dan pastikan semua skenario penting telah diuji.
    - Pertimbangkan untuk menambahkan tes tambahan jika ada area yang kurang tercover.


**INPUT SAYA:**
"Buat dan jalankan tes untuk file code: [NAMA FILE CODE]"
