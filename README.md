# 🌊 Vibe Coding Workflow

Selamat datang di ekosistem **Vibe Coding**.
Ini adalah standar alur kerja pengembangan software berbasis AI Agent (GitHub Copilot + Claude Sonnet) yang mengutamakan struktur, dokumentasi otomatis, dan validasi berjenjang.

## 🚀 Filosofi
1.  **Context is King:** AI tidak bisa bekerja tanpa konteks. `project_overview.md` adalah otak proyek ini.
2.  **Infrastructure First:** Jangan menulis kode fitur sebelum environment (Docker) siap.
3.  **Role Segregation:** Analis, Developer, dan QA adalah persona berbeda dengan tanggung jawab spesifik.
4.  **Log Everything:** Setiap sesi coding dan testing dicatat untuk menjaga kontinuitas memori AI.

---

## 📂 Struktur Direktori Otomatis
Workflow ini akan secara otomatis mengelola struktur folder berikut:

```text
root/
├── .github/
│   └── prompts/              # [BRAIN] Kumpulan System Instruction untuk Agent
│       ├── initiator.md
│       ├── analyst.md
│       ├── developer.md
│       ├── tester.md
│       └── document.md
├── project_overview.md       # [MASTER] Definisi produk, tech stack, & UI/UX
├── development_log.md        # [LOG] Riwayat perubahan kode oleh Developer
├── testing_log.md            # [LOG] Riwayat eksekusi tes oleh QA
├── specification/            # [DOCS] Output Analyst Agent
│   ├── 000_spec_env_setup.md # Spesifikasi Infrastruktur (Wajib Ada Pertama)
│   ├── 001_spec_login.md     # Spesifikasi Fitur
│   └── ...
├── codes/                    # [SRC] Output Developer Agent
│   ├── docker-compose.yml
│   ├── src/
│   └── ...
├── test/                     # [TEST] Output QA/Tester Agent
│   └── ...
└── documentation/            # [FINAL] FSD Gabungan

```

---

## 🤖 Peran & Perintah (Slash Commands)

Gunakan perintah slash berikut di chat GitHub Copilot untuk memanggil persona yang tersimpan di `.github/prompts/`.

| Role | Command | Fungsi Utama | Output |
| --- | --- | --- | --- |
| **Initiator** | `/initiator` | Mengubah ide kasar menjadi `project_overview.md`. | `project_overview.md` |
| **Analyst** | `/analyst` | Membuat spesifikasi teknis detail (Infra & Fitur). | `specification/*.md` |
| **Developer** | `/developer` | Menulis kode berdasarkan spesifikasi & update log. | `codes/*`, `development_log.md` |
| **Tester** | `/tester` | Membuat & menjalankan tes otomatis serta update log. | `test/*`, `testing_log.md` |
| **Document** | `/document` | Menggabungkan semua spec menjadi FSD. | `documentation/FSD.md` |

---

## 🛠️ Cara Memulai (Step-by-Step)

### 1. Inisialisasi Proyek

Mulailah dengan mendefinisikan apa yang ingin kita buat.

* **Action:** Panggil `/initiator`.
* **Input:** *"Aplikasi manajemen inventaris gudang sederhana, pakai Next.js, harus ada scan barcode."*
* **Hasil:** File `project_overview.md` akan dibuat. **Review file ini** dan pastikan Tech Stack & UI Guidelines sudah sesuai keinginan.

### 2. Setup Infrastruktur (Wajib)

Sebelum fitur dibuat, siapkan server/db.

* **Action:** Panggil `/analyst`.
* **Input:** *"Siapkan environment awal."*
* **Agent Logic:** Agent akan membaca `project_overview.md`, mendeteksi belum ada file `000_spec_environment_setup.md`, dan membuatnya.
* **Dev Execution:** Panggil `/developer` dengan input *"Implementasikan spec 000"*. Agent akan membuat `docker-compose.yml`.

### 3. Siklus Pengembangan Fitur (The Loop)

Ulangi siklus ini untuk setiap fitur baru:

1. **Analyst:**
* Command: `/analyst`
* Input: *"Buat fitur Login User."*
* Output: `001_spec_login_user.md`


2. **Developer:**
* Command: `/developer`
* Input: *"Implementasikan spec 001."*
* Output: Kode di folder `codes/` + Update `development_log.md`.


3. **Tester:**
* Command: `/tester`
* Input: *"Tes fitur login barusan."*
* Output: File test + Eksekusi Terminal + Update `testing_log.md`.



---

## 📝 Aturan Main (Rules of Engagement)

1. **Jangan Edit Log Manual:** Biarkan AI yang menulis `development_log.md` dan `testing_log.md` agar format konsisten.
2. **Baca Log:** Jika Anda baru membuka VS Code setelah istirahat, minta Copilot membaca log terakhir: *"Baca development_log.md, sampai mana progres terakhir?"*
3. **Terminal Access:** Berikan izin terminal pada Agent Tester dan Developer hanya jika Anda sudah mengonfirmasi perintahnya aman (terutama perintah `rm` atau deploy).
4. **UI/UX:** Jika hasil tampilan jelek/tidak konsisten, minta Analyst Agent update bagian **UI/UX Guidelines** di `project_overview.md` agar lebih spesifik.

---

## ⚙️ Maintenance Prompts

Jika Anda ingin mengubah perilaku Agent (misal: ingin Developer menggunakan TDD ketat), edit file terkait di folder `.github/prompts/`:

* `initiator.md` -> Logika inisiasi proyek.
* `analyst.md` -> Format spesifikasi & aturan infrastruktur.
* `developer.md` -> Gaya koding & format logging.
* `tester.md` -> Strategi testing & self-healing.
* `document.md` -> Format dokumentasi akhir.

---

*Happy Vibe Coding!* 🚀

```
