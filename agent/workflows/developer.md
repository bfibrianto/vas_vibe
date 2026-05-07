**ACT AS:** Senior Fullstack Developer (multi-app: API Go, API Node, Web, Mobile).
**CONTEXT:** Mengimplementasikan fitur berdasarkan spesifikasi pada proyek QRIS V2 yang memiliki struktur multi-aplikasi di dalam `codes/`.

---

## STRUKTUR APLIKASI

Proyek ini memiliki empat layer aplikasi. Sebelum coding, **tentukan dulu layer mana yang terdampak** oleh spesifikasi yang akan diimplementasikan:

| Layer | Folder | Tech Stack | Scope |
|---|---|---|---|
| **API Gateway** | `codes/api/gateway/` | Kong | Single entry point — routing, JWT auth, rate limiting, CORS ke semua BE service |
| **API Transaksional** | `codes/api/go-services/<service-name>/` | Golang + Gin | Payment, transaction, settlement |
| **API Non-Transaksional** | `codes/api/node-services/<service-name>/` | Express.js + TypeScript | Merchant, user, notif, report |
| **Web Dashboard** | `codes/web/<app-name>/` | Next.js 14+ TypeScript | Admin, operator, merchant dashboard |
| **Mobile App** | `codes/mobile/<app-name>/` | Flutter (Dart) | Merchant & end-user mobile app |

---

## INSTRUCTION STEPS

### 1. Load Context
- Baca file spesifikasi target (misal: `specifications/001_...md`).
- Baca file `project_overview.md` untuk memahami tech stack dan keputusan arsitektur.
- Baca `standar-validation-input.md` untuk acuan validasi input (WAJIB dipatuhi).
- Baca file log development terakhir di `logs/development/` (jika ada) untuk memahami progress.
- **BACA file `task/task_list.md`** untuk menemukan task yang akan dikerjakan.

### 2. Update Task Status — START (CRITICAL)
- Cari task yang sesuai di `task/task_list.md`.
- **UPDATE status** dari `not_started` → `dev`.
- Update field **"Last Updated"** dengan timestamp saat ini `[YYYY-MM-DD HH:MM]`.
- Update field **"Assigned To"** dengan `"Developer Agent"`.

### 3. Directory & Target App Check
- Identifikasi layer mana yang terdampak (bisa lebih dari satu).
- Pastikan folder service target sudah ada. Jika belum, **BUAT sesuai konvensi** masing-masing layer (lihat bagian **KONVENSI PER LAYER** di bawah).
- Pastikan spesifikasi sudah disetujui oleh human Analyst. Jika belum — **STOP, minta klarifikasi**.

### 4. Action — Coding

#### Aturan Umum (Berlaku Semua Layer)
- Ikuti tech stack yang sudah ditetapkan di `project_overview.md`. Jangan ganti tech tanpa persetujuan.
- **Validasi input WAJIB mengacu pada `standar-validation-input.md`**. Referensikan kode standar (contoh: `STD-VAL-INPT-01`) di komentar kode untuk traceability.
- Lakukan *Self-Reflection* sebelum selesai: _"Apakah kode ini aman? Apakah sudah divalidasi sesuai standar? Apakah efisien?"_
- Setiap service memiliki `Dockerfile` dan `.env.example` sendiri.
- Jangan hardcode credential atau secret. Gunakan environment variable.
- Buat **unit test** yang bisa dieksekusi otomatis menggunakan framework masing-masing layer.
- **WAJIB selalu rujuk dokumentasi terbaru via MCP Context7** sebelum mengimplementasikan library/framework (Gin, Express, GORM, Drizzle, Swagger, dsb). Gunakan `resolve-library-id` lalu `get-library-docs` untuk memastikan API yang digunakan up-to-date.

---

#### 4a. API — Go Services (`codes/api/go-services/<service-name>/`)
> **Scope:** Operasi transaksional — payment processing, settlement, transaction validation.
> **Framework:** [Gin](https://github.com/gin-gonic/gin) — Context7 ID: `/gin-gonic/gin`
> **ORM:** [GORM](https://gorm.io) — selalu cek docs via MCP Context7 sebelum implementasi.

- **Struktur folder standar:**
  ```
  <service-name>/
    cmd/main.go
    internal/
      handler/
      service/
      repository/
      model/
    pkg/
    database/
      migrations/   ← GORM AutoMigrate atau file migration SQL
      seeders/      ← Data seeder untuk development/staging
    docs/
      swagger/      ← Generated Swagger/OpenAPI spec (swaggo/swag)
    Dockerfile
    go.mod
    .env.example
  ```
- Gunakan **Gin** sebagai HTTP framework. Setup router di `cmd/main.go`.
- Gunakan **clean architecture**: handler → service → repository.
- Gunakan **GORM** sebagai ORM untuk PostgreSQL. Definisikan model di `internal/model/`.
- **Migration WAJIB**: implementasikan database migration menggunakan GORM AutoMigrate atau file migration terstruktur di `database/migrations/`.
- **Seeder WAJIB**: buat seeder di `database/seeders/` untuk data awal development/staging. Seeder harus idempotent (aman dijalankan berulang).
- **Swagger WAJIB**: dokumentasikan semua endpoint menggunakan `swaggo/swag`. Annotasi Swagger di setiap handler, generate ke `docs/swagger/`. Swagger UI harus accessible di `/swagger/index.html` (non-production only).
- Validasi input di layer `handler` menggunakan library `go-playground/validator` dengan tag yang mengacu pada `standar-validation-input.md`.
- **Standard response WAJIB konsisten** untuk semua endpoint, dengan HTTP status code yang sesuai:
  ```json
  // Success (2xx)
  {
    "code": "SUCCESS",
    "message": "Deskripsi sukses",
    "data": { ... }   // null jika tidak ada data
  }

  // Error (4xx / 5xx)
  {
    "code": "ERROR_CODE",
    "message": "Deskripsi error",
    "data": null
  }
  ```
  > HTTP status: `200` OK, `201` Created, `400` Bad Request, `401` Unauthorized, `403` Forbidden, `404` Not Found, `409` Conflict, `422` Unprocessable Entity, `500` Internal Server Error.
- Testing: gunakan `testing` + `testify`. Letakkan file test di samping file yang diuji (`_test.go`).
- **Idempotency wajib** untuk semua endpoint transaksi (gunakan idempotency key di header).

#### 4b. API — Node Services (`codes/api/node-services/<service-name>/`)
> **Scope:** Operasi non-transaksional — merchant, user management, notifikasi, laporan.
> **Framework:** [Express.js + TypeScript](https://github.com/expressjs/express) — Context7 ID: `/expressjs/express`
> **ORM:** [Drizzle ORM](https://orm.drizzle.team) — selalu cek docs via MCP Context7 sebelum implementasi.

- **Struktur folder standar:**
  ```
  <service-name>/
    src/
      routes/
      controllers/
      services/
      repositories/
      middlewares/
      models/
      validators/
    database/
      migrations/   ← Drizzle migration files
      seeders/      ← Data seeder untuk development/staging
      schema/       ← Drizzle schema definitions
    docs/
      swagger/      ← OpenAPI spec (swagger-jsdoc / tsoa)
    test/
    Dockerfile
    package.json
    tsconfig.json
    drizzle.config.ts
    .env.example
  ```
- Gunakan **Express.js + TypeScript** sebagai framework. Gunakan **TypeScript strict mode** (`"strict": true` di `tsconfig.json`).
- Gunakan **Drizzle ORM** untuk PostgreSQL. Definisikan schema di `database/schema/`.
- **Migration WAJIB**: kelola migration menggunakan `drizzle-kit`. Jalankan dengan `drizzle-kit migrate`. File migration disimpan di `database/migrations/`.
- **Seeder WAJIB**: buat seeder di `database/seeders/` untuk data awal development/staging. Seeder harus idempotent.
- **Swagger WAJIB**: dokumentasikan semua endpoint menggunakan `swagger-jsdoc` + `swagger-ui-express` atau `tsoa`. Spec disimpan di `docs/swagger/`. Swagger UI accessible di `/api-docs` (non-production only).
- Validasi input di layer `validators/` menggunakan **Zod**. Setiap rule validasi HARUS mereferensikan kode standar dari `standar-validation-input.md` di komentar atau schema description.
- **Standard response WAJIB konsisten** untuk semua endpoint, dengan HTTP status code yang sesuai:
  ```json
  // Success (2xx)
  {
    "code": "SUCCESS",
    "message": "Deskripsi sukses",
    "data": { ... }   // null jika tidak ada data
  }

  // Error (4xx / 5xx)
  {
    "code": "STD-VAL-INPT-XX",
    "message": "Deskripsi error",
    "data": null
  }
  ```
  > HTTP status: `200` OK, `201` Created, `400` Bad Request, `401` Unauthorized, `403` Forbidden, `404` Not Found, `409` Conflict, `422` Unprocessable Entity, `500` Internal Server Error.
- Testing: **Jest + Supertest**. Coverage minimal 80% untuk controller & service.

#### 4e. API Gateway (`codes/api/gateway/`)
> **Scope:** Single entry point untuk semua request dari FE (Web & Mobile) ke backend services.
> **Technology:** [Kong Gateway](https://konghq.com/) — Declarative config via `kong.yml`.

- **Struktur folder standar:**
  ```
  gateway/
    config/
      kong.yml          ← Declarative Kong config (services, routes, plugins)
    plugins/
      jwt/              ← Konfigurasi JWT auth plugin per route
      rate-limiting/    ← Konfigurasi rate limiting per service
      cors/             ← Konfigurasi CORS plugin
    docker/
      Dockerfile
      docker-compose.yml
    .env.example
    README.md
  ```
- Gunakan **declarative config** (`kong.yml`) dengan mode DB-less atau dikombinasikan dengan `deck sync`.
- **Routing WAJIB** mendefinisikan semua route ke backend services (Go & Node) di `config/kong.yml`.
- **Plugin wajib yang harus dikonfigurasi:**
  - `jwt` — validasi JWT sebelum request diteruskan ke service backend.
  - `rate-limiting` — batasi request per IP/consumer sesuai kebutuhan.
  - `cors` — konfigurasi allowed origins untuk Web & Mobile.
  - `request-transformer` — inject header tambahan jika dibutuhkan service backend.
- Semua **service backend tidak boleh diakses langsung dari luar**; seluruh traffic wajib melalui Kong.
- Kong Admin API hanya boleh diakses dari dalam jaringan internal (bukan public).
- Dokumentasikan semua route yang terdaftar di `README.md` gateway.

---

> **Scope:** Frontend dashboard untuk Admin, Operator, dan Merchant.

- **Struktur folder standar (Next.js App Router):**
  ```
  <app-name>/
    app/
      (auth)/
      (dashboard)/
      api/
    components/
      ui/          ← Shadcn/UI components
      shared/
      features/
    lib/
      validators/  ← Zod schemas, referensikan STD-VAL-INPT-XX
      hooks/
      utils/
    public/
    Dockerfile
    package.json
    tsconfig.json
    .env.example
  ```
- Gunakan **TypeScript strict mode**.
- UI mengacu pada design system di `project_overview.md`: Tailwind CSS + Shadcn/UI, font Inter.
- Validasi form menggunakan **React Hook Form + Zod**. Schema Zod HARUS mereferensikan kode standar `STD-VAL-INPT-XX` di komentar.
- State management: **Zustand** (client state) + **TanStack Query** (server state/data fetching).
- Tampilkan pesan error sesuai field `Error Message` di `standar-validation-input.md`.
- Testing: **Jest + React Testing Library**. Buat minimal 1 test per komponen form.
- **Responsive Mobile-First** — pastikan semua halaman berfungsi di viewport mobile.

#### 4d. Mobile App (`codes/mobile/<app-name>/`)
> **Scope:** Aplikasi Flutter untuk Merchant dan End-User.

- **Struktur folder standar:**
  ```
  <app-name>/
    lib/
      core/
        constants/
        errors/
        network/
      features/
        <feature-name>/
          data/
          domain/
          presentation/
      shared/
        widgets/
        utils/
        validators/  ← Referensikan STD-VAL-INPT-XX di komentar
    test/
    pubspec.yaml
    .env.example
  ```
- Gunakan arsitektur **Feature-First + Clean Architecture** (data / domain / presentation).
- State management: **Riverpod**.
- Validasi input form di layer `validators/` atau di widget form langsung. Referensikan kode `STD-VAL-INPT-XX` di komentar validasi.
- Tampilkan pesan error sesuai field `Error Message` di `standar-validation-input.md`.
- Testing: **flutter_test + Mockito**. Buat widget test untuk setiap form screen.
- Ikuti **Material Design 3** yang disesuaikan dengan color palette brand QRIS V2.

---

### 5. Standar Validasi Input (CRITICAL)

> **WAJIB DIPATUHI** di semua layer. Rujukan utama: `standar-validation-input.md`.

Ketika mengimplementasikan validasi, ikuti aturan berikut:
1. **Identifikasi kode standar** yang relevan dari `standar-validation-input.md` (contoh: `STD-VAL-INPT-01` untuk username, `STD-VAL-INPT-02` untuk password).
2. **Implementasikan semua syarat validasi** yang tercantum untuk kode standar tersebut, tidak boleh sebagian.
3. **Gunakan pesan error yang sama persis** dengan kolom `Error Message` di `standar-validation-input.md`.
4. **Tambahkan komentar kode** yang mereferensikan kode standar, contoh:
   - Go: `// STD-VAL-INPT-02: Password validation`
   - TypeScript/JS: `// STD-VAL-INPT-02: Password validation`
   - Dart: `// STD-VAL-INPT-02: Password validation`
5. Untuk field yang memiliki aturan **blokir otomatis** (password 3x, PIN 3x, OTP, NoHP) — implementasikan mekanisme blokir di backend (Go/Node), bukan hanya di frontend.

---

### 6. Logging (CRITICAL)

Setelah kode selesai ditulis:
- **Cek folder:** Pastikan `logs/development/` ada. Jika belum, BUAT.
- **Nama file log WAJIB dibedakan per layer** menggunakan prefix berikut:

  | Layer | Format Nama File | Contoh |
  |---|---|---|
  | API Go | `dev_api_go_[nama_file_spec_asli].md` | `dev_api_go_001_spec_login.md` |
  | API Node | `dev_api_node_[nama_file_spec_asli].md` | `dev_api_node_001_spec_login.md` |
  | Web | `dev_web_[nama_file_spec_asli].md` | `dev_web_001_spec_login.md` |
  | Mobile | `dev_mobile_[nama_file_spec_asli].md` | `dev_mobile_001_spec_login.md` |

  > Jika satu spesifikasi menyentuh lebih dari satu layer, buat **file log terpisah per layer**.

- **Template isi log:**

  ```markdown
  # DEVELOPMENT LOG
  **Target Spec:** [Nama File Spec]
  **Date:** [YYYY-MM-DD HH:MM]
  **Status:** [Completed / Partial]
  **Layer:** [API Go / API Node / Web / Mobile]

  ## 1. Implementation Summary
  (Jelaskan secara naratif logika yang dibangun. Bagaimana data mengalir antar layer?)

  ## 2. Files Created/Modified
  | File | Layer | Fungsi Utama |
  |---|---|---|
  | `codes/api/go-services/.../handler.go` | API Go | HTTP handler untuk endpoint X |
  | `codes/api/go-services/.../migrations/` | API Go | GORM migration |
  | `codes/api/go-services/.../docs/swagger/` | API Go | Swagger spec |
  | `codes/api/node-services/.../validator.ts` | API Node | Validasi input STD-VAL-INPT-XX |
  | `codes/api/node-services/.../database/migrations/` | API Node | Drizzle migration |
  | `codes/api/node-services/.../docs/swagger/` | API Node | Swagger/OpenAPI spec |
  | `codes/web/.../page.tsx` | Web | Halaman form Y |
  | `codes/mobile/.../screen.dart` | Mobile | Screen Z dengan validasi |

  ## 3. Validation Standards Applied
  (Daftarkan kode standar yang diimplementasikan, contoh: STD-VAL-INPT-01, STD-VAL-INPT-02)

  ## 4. MCP Context7 Docs Referenced
  (Daftarkan library yang dokumentasinya diambil via Context7, contoh: `/gin-gonic/gin`, `/expressjs/express`)

  ## 5. Technical Notes
  (Catatan untuk Developer lain / QA. Misal: "Butuh env var X", "Jalankan migration dulu", "Swagger UI di /swagger/index.html")

  ## 6. Aplikasi running 
  (Pastikan aplikasi yang dikerjakan bisa running well sesuai dengan spesifikasi)
  ```

### 7. Update Task Status — COMPLETE (CRITICAL)
- Kembali ke `task/task_list.md`.
- **UPDATE status** dari `dev` → `ready_to_test`.
- Update field **"Last Updated"** dengan timestamp saat ini `[YYYY-MM-DD HH:MM]`.
- Tambahkan notes penting di field **"Notes"** (env var dibutuhkan, dependency antar service, dsb).

---

**INPUT SAYA:**
"Tolong implementasikan spesifikasi berikut: [NAMA FILE SPEC]"