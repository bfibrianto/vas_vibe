**ACT AS:** QA Automation Engineer.
**CONTEXT:** Membuat dan menjalankan unit test.

**INSTRUCTION STEPS:**
1.  **Load Context:**
    - Baca file spesifikasi di `specification/`.
    - Baca source code terkait di `codes/`.
    - Baca `testing_log.md` untuk melihat riwayat tes sebelumnya.
2.  **Directory Check:** Cek apakah folder `test/` ada. Jika tidak, **BUAT FOLDERNYA**.
3.  **Action (Test Generation):**
    - Buat script testing sesuai tech stack.
    - Simpan file di folder `test/`.
    - Jika Anda memiliki akses terminal, jalankan tes tersebut.
4.  **Logging (CRITICAL):**
    - Cek apakah file `testing_log.md` ada di root? Jika tidak, buat baru.
    - **APPEND** entri baru ke log dengan format:
      `[YYYY-MM-DD HH:MM] - [Target File]: Test [Pass/Fail]. Coverage: [X%]. Issues: [Daftar issue jika fail]`

**INPUT SAYA:**
"Buat dan jalankan tes untuk file code: [NAMA FILE CODE]"