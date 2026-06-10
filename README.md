# 🌊 Vibe Coding Workflow

Selamat datang di ekosistem **Vibe Coding**.
Ini adalah standar alur kerja pengembangan software berbasis **AI Agent** yang mengutamakan struktur, dokumentasi otomatis, dan validasi berjenjang. 
Template ini telah berevolusi dan secara *native* mendukung integrasi untuk berbagai AI agent environment mutakhir:
- **Google Antigravity** (`.agents/`)
- **Claude Code** (`.claude/`)
- **OpenCode** (`.opencode/`)
- **GitHub Copilot Workspace** (`.github/prompts/`)
- Serta dilengkapi **Shared Agent Workflows** (`agent/workflows/`) sebagai *source of truth* agar perilaku agen konsisten di seluruh platform.

---

## ⚡ Quick start (untuk tim baru)

Gunakan *command* CLI resmi untuk melakukan scaffolding project baru. Proses ini akan meng-copy seluruh konfigurasi agent, prompt, skills, serta kerangka direktori standar tim ke project baru Anda:

```bash
# Interaktif (akan ada pertanyaan)
npx create-vasvibe my-new-project

# Masuk ke direktori kerja
cd my-new-project
```

**Struktur yang Ter-scaffold Otomatis:**
- `codes/`, `specifications/`, `tests/` — folder kerja utama (telah dilindungi oleh aturan `.gitignore` agar tidak berantakan).
- Kerangka prompt dari seluruh environment (`.agents`, `.claude`, `.opencode`, `.github`, `agent/workflows`).
- File standard: `project_overview_example.md`, `GIT_STRUCTURE_GUIDE.md`, `skills-lock.json`.

**Opsi / Flag Tambahan:**
| Flag | Deskripsi |
|------|-----------|
| `-y, --yes` | Skip semua pertanyaan (gunakan setting default) |
| `--no-git` | Jangan jalankan `git init` secara otomatis |
| `--no-opencode` | Abaikan folder `.opencode/` |
| `--no-claude` | Abaikan folder `.claude/` dan `.agents/` |
| `--no-github` | Abaikan folder `.github/prompts/` |
| `--no-workflows` | Abaikan folder `agent/workflows/` |


## 🤖 Tentang AI Agent

**AI Agent** adalah sistem cerdas berbasis Large Language Model (LLM) yang dapat mengeksekusi tugas-tugas kompleks secara mandiri dengan menggunakan **tools** (function calling). Berbeda dengan chatbot biasa yang hanya menjawab pertanyaan, AI Agent dapat:

- 🔍 **Membaca & menganalisis** file di workspace
- ✍️ **Menulis & mengedit** kode berdasarkan spesifikasi
- 🔧 **Menjalankan command** di terminal (build, test, deploy)
- 🧠 **Mengambil keputusan** berdasarkan context dan error feedback
- 📝 **Membuat dokumentasi** otomatis dari perubahan yang dilakukan

Dalam workflow ini, kita menggunakan **8 AI Agent persona** yang bekerja secara terspesialisasi (mirip tim development sesungguhnya).

---

## 🚀 Filosofi
1.  **Context is King:** AI tidak bisa bekerja tanpa konteks. `project_overview.md` adalah otak proyek ini.
2.  **Infrastructure First:** Jangan menulis kode fitur sebelum environment (Docker) siap.
3.  **Role Segregation:** Analis, Developer, dan QA adalah persona berbeda dengan tanggung jawab spesifik.
4.  **Log Everything:** Setiap sesi coding dan testing dicatat untuk menjaga kontinuitas memori AI.
5.  **Human-in-the-Loop:** Manusia sebagai Decision Maker, AI sebagai Executor.
6.  **Git Branching & Repo Management:** Agent seperti Developer, Fixer, dan Tester dibekali pemahaman ketat mengenai *git branching* (membuat branch, pull/merge origin) untuk menjaga keutuhan `main`/`development` branch.

---

## 📂 Struktur Direktori Otomatis
Workflow ini akan secara otomatis mengelola struktur folder berikut:

```text
root/
├── .agents/                  # [BRAIN] Konfigurasi Google Antigravity & Skills
│   ├── agents/               # Definisi persona agent (analyst, developer, tester, dll)
│   └── skills/               # Folder berisi reusable tools/skills yang dapat diakses oleh agent
│
├── .claude/                  # [BRAIN] Konfigurasi & Prompt Claude Code
│   └── agents/
│
├── .opencode/                # [BRAIN] Konfigurasi & Commands OpenCode
│   └── commands/
│
├── .github/                  # [BRAIN] Konfigurasi GitHub Copilot Workspace
│   └── prompts/
│
├── agent/workflows/          # [CORE] Source of Truth untuk semua instruksi agent
│   ├── analyst.md
│   ├── developer.md
│   └── ... 
│
├── project_overview.md       # [MASTER] Definisi produk, tech stack, & UI/UX
│                             # 👤 HUMAN: Review & approve setelah Initiator Agent buat
│
├── specifications/           # [DOCS] Output dari Analyst Agent
│   ├── README.md            # Index semua spesifikasi
│   ├── 000_spec_environment_setup.md # Infrastruktur (Wajib pertama)
│   ├── 001_spec_database_schema.md
│   └── ...                  # 👤 HUMAN: Review setiap spec sebelum dev
│
├── task/                     # [PROJECT MANAGEMENT] Output dari PM Agent ⭐ NEW
│   ├── task_list.md         # Central task tracking (priority, status, dependencies)
│   ├── PROJECT_STATUS_REPORT.md # Progress reports
│   ├── TASK-001/            # Folder khusus per task
│   │   ├── plan.md          # Rencana kerja & log eksekusi task terkait
│   │   └── ...
│   └── TASK-002/            # Setiap task baru akan diisolasi ke dalam sub-folder tersendiri
│
├── architecture/             # [INFRA] Output dari SysArch Agent
│   ├── current_state.md     # Application analysis
│   ├── server_specifications.md # Server specs (CPU, RAM, Storage)
│   └── ...
│
├── codes/                    # [SRC] Output dari Developer Agent
│   ├── docker-compose.yml
│   ├── package.json
│   ├── app/                 # Aplikasi utama
│   └── ...                  # 👤 HUMAN: Code review & testing manual
│
├── tests/                    # [TEST] Output dari Tester Agent
│   └── e2e/                 # 👤 HUMAN: Verify test results
│
├── logs/                     # [TRACKING] Auto-generated logs
│   ├── development/         # Developer Agent logs
│   ├── testing/             # Tester Agent logs
│   └── fixing/              # Bug fixing logs
│
└── documentation/            # [FINAL] Technical Writer output
    └── FSD_VasVibe.md       # Functional Specification Document
```

**Legend:**
- 🤖 **Auto-generated:** File dibuat oleh AI Agent
- 👤 **Human review required:** File perlu di-review manusia sebelum lanjut
- 📝 **Living document:** File yang terus di-update

---

## 🤖 AI Agent Personas & Capabilities

Dalam workflow ini, kita memecah siklus SDLC (Software Development Life Cycle) menjadi 8 **persona agen terspesialisasi**:

1. **Initiator Agent** (`/initiator`) - Project kickoff & overview
2. **PM Agent** (`/pm`) - Task management & coordination
3. **Analyst Agent** (`/analyst`) - Technical specifications
4. **Developer Agent** (`/developer`) - Code implementation (termasuk Repo Management)
5. **Tester Agent** (`/tester`) - Test automation & QA (termasuk Repo Management)
6. **Fixer Agent** (`/fixer`) - Bug fixing & debugging (termasuk Repo Management)
7. **SysArch Agent** (`/sysarch`) - Infrastructure & deployment planning
8. **Document Agent** (`/document`) - Final documentation

> 🔗 **Detail lengkap** mengenai cara kerja, rules, integrasi alur tugas, serta kemampuan (*capabilities*) dari tiap-tiap agen dapat dibaca di panduan terpisah:
> 👉 **[BACA: Panduan Persona & Kemampuan Agen (AGENT_PERSONAS.md)](./AGENT_PERSONAS.md)**

---

## 🛠️ Cara Memulai (Step-by-Step)

### **Phase 0: Project Initialization** 👤🤖

**👤 Human Decision:**
1. Tentukan ide proyek (apa yang ingin dibuat?)
2. Tentukan scope minimal (MVP) vs future features
3. Tentukan deadline & budget constraints

**🤖 AI Execution:**

**Step 1: Inisialisasi Proyek**

```bash
# Di VS Code, panggil Initiator Agent
/initiator
```

**Input ke Agent:**
```
"Aplikasi manajemen booking kapal wisata Labuan Bajo.
Customer bisa booking online, admin bisa manage booking 
& pricing, kru bisa lihat jadwal. 
Pakai Next.js, PostgreSQL, payment gateway Midtrans.
Target launch April 2025."
```

**Output:**
- File `project_overview.md` akan dibuat dengan lengkap

**👤 Human Review (CRITICAL):**
- [ ] Baca `project_overview.md` dari awal sampai akhir
- [ ] Check tech stack (sudah sesuai kebutuhan?)
- [ ] Check UI/UX guidelines (warna, font, component library)
- [ ] Check development roadmap (realistis tidak?)
- [ ] **APPROVE** atau minta revisi ke Agent

**⚠️ Jangan lanjut ke Phase 1 jika belum approve!**

---

### **Phase 1: Infrastructure Setup** 👤🤖

**👤 Human Decision:**
- Hosting: Local Docker? Cloud (Vercel + Supabase)? VPS?
- Database size estimate?
- Backup strategy?

**🤖 AI Execution:**

**Step 2: Spesifikasi Infrastruktur**

```bash
/analyst

"Buat spesifikasi environment setup"
```

**Agent Logic:**
- Agent akan deteksi `000_spec_environment_setup.md` belum ada
- Otomatis membuat spec infrastruktur (Docker, DB, Redis, dll)

**Output:**
- `specifications/000_spec_environment_setup.md`

**👤 Human Review:**
- [ ] Check Docker services (App, DB, Redis - perlu semua?)
- [ ] Check environment variables (API keys, secrets)
- [ ] Check port configuration (conflict dengan app lain?)

**Step 3: Implementasi Infrastructure**

```bash
/developer

"Implementasikan SPEC-000 (Environment Setup)"
```

**Output:**
- `codes/docker-compose.yml`
- `codes/.env.example`
- `codes/Dockerfile`
- `logs/development/dev_000_environment_setup.md`

**👤 Human Execution:**
```bash
# Jalankan Docker manually
cd codes
cp .env.example .env
# Edit .env sesuai kebutuhan (database password, etc.)

docker-compose up -d
docker-compose logs -f
```

**Verify:**
- [ ] Database running? (`docker ps`)
- [ ] App accessible? (`http://localhost:3000`)
- [ ] No errors di logs?

---

### **Phase 2: Database Design** 👤🤖

**Step 4: Database Schema Specification**

```bash
/analyst

"Buat spesifikasi database schema"
```

**Output:**
- `specifications/001_spec_database_schema.md`

**👤 Human Review:**
- [ ] Check ERD (relasi antar table masuk akal?)
- [ ] Check field types (JSONB vs separate table?)
- [ ] Check indexes (performance critical fields?)

**Step 5: Prisma Migration**

```bash
/developer

"Implementasikan SPEC-001 (Database Schema)"
```

**Output:**
- `codes/prisma/schema.prisma`
- `logs/development/dev_001_database_schema.md`

**👤 Human Execution:**
```bash
cd codes
npm install
npx prisma migrate dev --name init
npx prisma generate
```

**Verify:**
- [ ] Migration success?
- [ ] Tables created? (check via Prisma Studio: `npx prisma studio`)

---

### **Phase 3: Feature Development Loop** 🔄 👤🤖

Ulangi siklus ini untuk **setiap fitur**:

#### **Step 3.1: Specification (Analyst)**

**👤 Human:** Tentukan fitur mana yang dikerjakan duluan (prioritas)

```bash
/analyst

"Buat spesifikasi untuk fitur Booking Management"
```

**🤖 Agent Output:**
- `specifications/003_spec_booking_management.md`
- Atau breakdown menjadi atomic specs (003-001, 003-002, dll)

**👤 Human Review:**
- [ ] User stories jelas?
- [ ] API contracts lengkap?
- [ ] UI mockups sesuai design system?
- [ ] Validation rules masuk akal?

**⚠️ Approve spec → Then create task:**
```bash
/pm

"Buat task di task_list.md berdasarkan SPEC-003 (Booking Management)"
```

**🤖 PM Agent Output:**
- New task entry di `task/task_list.md`:
  ```
  ### TASK-003: Booking Management
  - **Priority:** P0 (Critical)
  - **Status:** not_started
  - **Spec:** specifications/003_spec_booking_management.md
  - **Dependencies:** TASK-001 (Database Schema), TASK-002 (Authentication)
  - **Assigned To:** -
  - **Description:** Implement booking CRUD operations with DP calculation
  ```

#### **Step 3.2: Implementation (Developer)**

```bash
/developer

"Implementasikan SPEC-003 (Booking Management)"
```

**🤖 Agent akan:**
1. Read `task/task_list.md` → Find TASK-003
2. **Update status:** `not_started` → `dev`
3. **Set Assigned To:** Developer Agent
4. Implement code
5. Create development log
6. **Update status:** `dev` → `ready_to_test`

**🤖 Agent Output:**
- API routes: `codes/app/api/backoffice/bookings/route.ts`
- Components: `codes/components/bookings/BookingForm.tsx`
- Development log: `logs/development/dev_003_booking_management.md`

**👤 Human Tasks:**
1. **Code Review:**
   - [ ] Logic benar? (hitung DP 50%, validasi tanggal, dll)
   - [ ] Security OK? (authentication, authorization)
   - [ ] Performance? (N+1 query problem?)
   
2. **Manual Testing:**
   ```bash
   # Start dev server
   cd codes
   npm run dev
   ```
   - [ ] Buka browser → Test create booking
   - [ ] Test validation (input invalid data)
   - [ ] Test edge cases (booking di tanggal yang sudah full)

3. **Check Errors:**
   ```bash
   # Lihat TypeScript errors
   npm run type-check
   
   # Lihat lint errors
   npm run lint
   ```

**If bugs found:**
```bash
/fixer

"Ada bug di create booking: DP amount tidak ter-kalkulasi.
Error: totalPrice is undefined di line 45
Stack trace: [paste error dari terminal]

Reproduce steps:
1. Buka form create booking
2. Isi pax = 15
3. Click Submit
4. Error muncul"
```

**🤖 Fixer Agent akan:**
1. Read `task/task_list.md` → Find TASK-003 with status "failed"
2. **Update status:** `failed` → `fixing`
3. Analyze error & stack trace
4. Read related code files
5. Identify root cause
6. Apply fix
7. **PENTING:** Lakukan update dokumen spesifikasi di direktori `specifications/` terkait fitur yang difixing sesuai dengan scope fixing yang diberikan oleh user.
8. Run tests untuk verify fix
9. **Update status:** `fixing` → `ready_to_test` (back to Tester)
10. Create fixing log di `logs/fixing/fixing_003_booking_dp_bug.md`

**👤 Human verify:**
- [ ] Bug fix works? (test manually)
- [ ] No side effects? (test related features)
- [ ] Root cause addressed? (bukan just symptom fix)

#### **Step 3.3: Testing (Tester)**

```bash
/tester

"Buat dan jalankan test untuk Booking Management API"
```

**🤖 Agent akan:**
1. Read `task/task_list.md` → Find TASK-003 with status "ready_to_test"
2. Create test scenarios → **Update status:** `ready_to_test` → `testing_ready`
3. Run tests → **Update status:** `testing_ready` → `testing`
4. Analyze results → **Update status:** `testing` → `passed` (or `failed`)

**🤖 Agent Output:**
- `tests/integration/booking.test.ts`
- `logs/testing/test_003_booking_management.md`

**👤 Human Tasks:**
1. **Verify Test Coverage:**
   - [ ] Happy path tested?
   - [ ] Error cases tested?
   - [ ] Edge cases tested?

2. **Run Tests Manually:**
   ```bash
   cd codes
   npm test
   ```

3. **Exploratory Testing:**
   - Test scenario yang tidak tercakup automated test
   - Test dengan real user behavior (random input, rapid clicking, dll)

---

### **Phase 4: Infrastructure Planning & Deployment** 👤🤖 ⭐ NEW

**When to do this:**
- Setelah MVP selesai development & testing (minimum 3-5 features implemented)
- Sebelum deployment ke production
- Saat merencanakan scaling untuk high season
- Saat ada budget review atau cost optimization needs

**Step 7: Infrastructure Requirements Gathering**

```bash
/sysarch

"Analyze current application and design server specifications 
for production deployment. Create deployment plan."
```

**🤖 SysArch Agent akan:**
1. Read `project_overview.md`, `specifications/*.md`, codebase
2. Analyze database schema, API endpoints, file storage needs
3. **ASK critical questions** tentang:
   - User load (concurrent users, growth rate)
   - Transaction volume (bookings/day, payments/day)
   - Data & storage (file uploads, backup requirements)
   - Performance targets (response time, page load)
   - Availability (uptime, HA requirements)
   - Budget & deployment preferences
   - Security & compliance needs

**👤 Human Tasks:**
- [ ] **ANSWER semua questions** dari SysArch Agent dengan data yang akurat
  - Estimasi conservative (jangan over-promise)
  - Consider seasonal peaks (high season bisa 3-5x normal)
  - Include growth projection (6 months, 1 year, 2 years)

**Step 8: Review Architecture Plan**

**🤖 SysArch Agent Output:**
- `architecture/current_state.md` - Application analysis & tech stack summary
- `architecture/server_specifications.md` - Detailed specs:
  - Development server specs
  - Staging server specs
  - Production server specs (with scaling recommendations)
  - Database server specs
  - Storage requirements
- `architecture/deployment_plan.md` - Step-by-step deployment guide
- `architecture/cost_analysis.md` - Monthly cost breakdown by component
- `architecture/monitoring_plan.md` - Observability setup (metrics, alerts, logs)

**👤 Human Review (CRITICAL):**
- [ ] Server specs realistic untuk workload?
- [ ] Cost analysis sesuai budget? (jika over budget, diskusikan trade-offs)
- [ ] Deployment plan clear & executable?
- [ ] Monitoring plan comprehensive? (uptime, performance, errors, business metrics)
- [ ] Backup & disaster recovery adequate?
- [ ] Security measures sufficient? (SSL, firewall, WAF, DDoS)

**If cost too high:**
```bash
/sysarch

"Cost analysis shows $500/month but budget is $200/month.
Provide cost optimization options with trade-offs.

Priorities:
1. Data integrity & backup (non-negotiable)
2. Reasonable performance (acceptable: 2-3s page load)
3. 99% uptime (99.9% nice to have)

Can consider:
- Smaller instance sizes (scale later when needed)
- Managed database vs self-hosted
- CDN optional for MVP
- Monitoring with free tier tools"
```

**🤖 SysArch Agent will:**
- Provide 2-3 cost optimization scenarios
- Show trade-offs for each option
- Recommend which option for MVP vs scale-up plan

**Step 9: Deploy to Production**

**👤 Human Tasks:**
1. **Setup Infrastructure:**
   ```bash
   # Follow deployment_plan.md step-by-step
   # Example: Setup VPS, install Docker, configure firewall
   ```

2. **Ask Developer/SysArch Agent for deployment help:**
   ```bash
   /developer
   
   "Follow architecture/deployment_plan.md, deploy application to production.
   
   Server: Ubuntu 22.04 VPS (IP: xxx.xxx.xxx.xxx)
   Domain: vasvibe.com
   SSL: Let's Encrypt
   
   Setup:
   1. Docker & Docker Compose
   2. PostgreSQL (managed service: Supabase/AWS RDS)
   3. Redis (optional for caching)
   4. Nginx reverse proxy
   5. SSL certificate
   6. Environment variables from .env.production"
   ```

3. **Setup Monitoring:**
   ```bash
   /sysarch
   
   "Setup monitoring following monitoring_plan.md.
   
   Tools available:
   - Uptime: UptimeRobot (free tier)
   - APM: New Relic / Datadog (free tier)
   - Logs: Papertrail / Logtail (free tier)
   - Error tracking: Sentry (free tier)
   
   Setup alerts for:
   - Server down (uptime < 99%)
   - API response time > 2s
   - Database connections > 80%
   - Disk usage > 80%
   - Error rate > 1%"
   ```

**Verify Production Deployment:**
- [ ] Application accessible via domain (https://vasvibe.com)
- [ ] SSL certificate valid (green padlock)
- [ ] Database connected & migrations applied
- [ ] All API endpoints working
- [ ] Monitoring alerts configured
- [ ] Backup scheduled (daily database backup)
- [ ] Test booking flow end-to-end
- [ ] Test payment flow (if integrated)
- [ ] Performance check (page load < 3s)

---

### **Phase 5: Documentation** 👤🤖

**Step 10: Generate Final Documentation**

```bash
/document

"Generate FSD lengkap dari semua specifications"
```

**Output:**
- `documentation/FSD_VasVibe.md`
- `documentation/API_Documentation.md`

**👤 Human Review:**
- [ ] Documentation complete?
- [ ] Deployment guide clear?
- [ ] API examples working?

---

## 👤 Tanggung Jawab Manusia (Human-in-the-Loop)

AI Agent **TIDAK DAPAT** dan **TIDAK BOLEH** mengambil keputusan untuk hal-hal berikut:

### **1. Business Decisions** 🎯
- ❌ Menentukan prioritas fitur (mana yang dikerjakan duluan?)
- ❌ Menentukan pricing strategy (berapa harga produk?)
- ❌ Menentukan target market (siapa user kita?)
- ❌ Approve budget & timeline

**👤 Human:** Product Owner / Business Stakeholder

---

### **2. Architecture Decisions** 🏗️
- ❌ Pilih monolith vs microservices?
- ❌ Pilih SQL vs NoSQL?
- ❌ Pilih cloud provider (AWS vs GCP vs Azure)?
- ❌ Approve tech stack yang diusulkan Agent

**👤 Human:** Tech Lead / Solution Architect

**✅ Agent:** Memberikan **rekomendasi** + pros/cons, tapi **final decision** tetap di manusia

---

### **3. Security & Compliance** 🔒
- ❌ Approve deployment ke production
- ❌ Approve perubahan database schema di production
- ❌ Approve akses ke production secrets/API keys
- ❌ Menentukan data retention policy (GDPR, UU PDP)

**👤 Human:** Security Engineer / Compliance Officer

**⚠️ Warning:** Agent **DAPAT** menjalankan command berbahaya (`rm -rf`, `DROP TABLE`, dll) jika tidak diawasi!

---

### **4. Code Quality Gates** ✅
- ❌ Approve merge ke `main` branch
- ❌ Approve deployment ke staging/production
- ❌ Skip failing tests (NEVER!)

**👤 Human:** Senior Developer / Team Lead

**Process:**
1. Agent creates code → Human reviews
2. If OK → Human approves (via Git PR)
3. If NOT OK → Human provides feedback → Agent fixes

---

### **5. User Experience Decisions** 🎨
- ❌ Final approval untuk UI/UX design
- ❌ Menentukan user flow (apakah flow ini intuitif?)
- ❌ Approve wording (error messages, button labels, dll)

**👤 Human:** UX Designer / Product Manager

**✅ Agent:** Generate UI berdasarkan guidelines, tapi **final polish** tetap perlu human touch

---

## 📋 Daily Workflow Checklist

### **Morning Routine** ☀️

```bash
# 1. Check project progress
/pm

"Tampilkan status project saat ini dari task_list.md"
```

```bash
# 2. Sync context dengan Agent
/developer

"Baca logs/development/dev_*.md, apa progres terakhir?"
```

**👤 Human:**
- [ ] Review task progress dari task_list.md
- [ ] Review semua changes semalam (git diff)
- [ ] Check error logs (jika ada background process)
- [ ] Prioritize tasks hari ini (based on task_list.md priorities)

---

### **Development Cycle** 🔄

```
[Analyst] → [👤 Review] → [PM] → [Developer] → [👤 Test] → [Fixer (if bugs)] → [Tester] → [👤 Approve]
                             ↓
                    (Create task in 
                     task_list.md)                                    ↓
                                                                 (After MVP)
                                                                      ↓
                                        [SysArch] → [👤 Review] → [Deploy] → [Monitor]
```

**Per Feature (2-4 hours):**
1. **Analyst:** Create spec (30 min)
2. **👤 Human:** Review & approve spec (15 min)
3. **PM:** Create task in task_list.md (5 min) ⭐ NEW
4. **Developer:** Implement code + update task status (1-2 hours)
5. **👤 Human:** Code review + manual test (30 min)
6. **Fixer:** Fix bugs if found + update task status (15-30 min) ← **OPTIONAL**
7. **Tester:** Create & run tests + update task status (30 min)
8. **👤 Human:** Verify test results (15 min)

**Repeat** untuk fitur berikutnya

**Before Production Deploy (after MVP complete):**
1. **SysArch:** Analyze app & create infrastructure plan (2-3 hours)
2. **👤 Human:** Answer requirements questions & review plan (1 hour)
3. **SysArch/Developer:** Deploy to production (2-4 hours)
4. **SysArch:** Setup monitoring & alerts (1 hour)
5. **👤 Human:** Verify deployment & monitor metrics (ongoing)

---

### **Evening Routine** 🌙

**👤 Human:**
- [ ] Review semua development logs hari ini
- [ ] Commit & push changes ke Git
- [ ] Update project board (Trello/Jira/Linear)
- [ ] Note blocker untuk besok

```bash
# Optional: Update task status based on logs
/pm

"Update task_list.md berdasarkan development logs hari ini"
```

```bash
# Optional: Minta Agent summarize hari ini
/developer

"Summarize semua development logs hari ini, 
apa saja yang sudah selesai dan apa yang masih pending?"
```

```bash
# Optional: Generate status report
/pm

"Generate project status report untuk hari ini"
```

---

## ⚠️ Common Pitfalls & How to Avoid

### **1. Agent Tidak Punya Context** 🤔
**Symptom:** Agent buat code yang tidak sesuai project

**Fix:**
```bash
# Selalu arahkan Agent untuk baca context dulu
/developer

"Baca project_overview.md dan specification/003_*.md 
sebelum implementasi fitur Booking"
```

---

### **2. Agent Menjalankan Command Berbahaya** ⚠️
**Symptom:** Agent suggest `rm -rf` atau `DROP DATABASE`

**Fix:**
- **👤 Human:** ALWAYS review command sebelum execute
- Use Git (semua changes bisa di-rollback)
- Backup database sebelum migration

---

### **3. Spec Tidak Jelas → Code Salah** 📝
**Symptom:** Developer Agent tanya-tanya terus karena spec ambiguous

**Fix:**
- **👤 Human:** Review spec dari Analyst dengan detail
- Minta Analyst revisi jika ada yang unclear
- Jangan approve spec yang setengah-setengah

---

### **4. Infrastructure Planning & Deployment** ⚙️ ⭐ NEW
**Symptom:** Aplikasi sudah siap, tapi bingung deploy dimana dan butuh server apa

**Solution:**
```bash
/sysarch

"Analyze current application (VAS Vibe Reservation System).

Context:
- Next.js 14 App Router
- PostgreSQL database with 15 tables
- File uploads: 10-20 photos/day (~5MB each)
- Target: 100 concurrent users, 50 bookings/day
- Budget: $200/month
- Location: Indonesia users only
- Required: 99% uptime, daily backups

Design server specifications and deployment plan."
```

**SysArch Agent akan:**
1. Analyze codebase & database schema
2. Ask clarifying questions tentang load, growth, budget
3. Create server specifications (CPU, RAM, Storage)
4. Design deployment architecture (1-server, 2-server, or cloud)
5. Estimate monthly costs
6. Provide deployment step-by-step guide
7. Setup monitoring plan

**👤 Human:**
- [ ] Answer all requirements questions dengan data akurat
- [ ] Review cost analysis (sesuai budget?)
- [ ] Review server specs (cukup untuk load?)
- [ ] Approve deployment plan
- [ ] Execute deployment following the guide

---

### **5. Performance Issues in Production** 🐌
**Symptom:** Aplikasi lambat, page load > 5 seconds, API timeout

**Solution:**
```bash
/sysarch

"Performance analysis request.

Current metrics:
- Page load time: 8 seconds (target: < 3s)
- API response time: 3-5 seconds (target: < 500ms)
- Database query time: 2-4 seconds per request
- Server CPU: 85% average
- Server RAM: 90% usage

Analyze bottlenecks and provide optimization recommendations.
Consider: database indexing, query optimization, caching, CDN, server upgrade."
```

**SysArch Agent akan:**
1. Analyze performance metrics
2. Identify bottlenecks (database, server resources, network)
3. Recommend optimizations
4. Estimate performance improvement & costs
5. Provide implementation plan

---

### **6. Test Coverage Rendah** 🧪
**Symptom:** Production bug yang seharusnya ketahuan di test

**Fix:**
```bash
/tester

"Test coverage untuk Booking API masih 60%, 
tambahkan test untuk edge cases:
- Booking di tanggal yang sudah penuh
- Booking dengan pax > 22
- Booking dengan tanggal di masa lalu"
```

### **7. Bugs di Production** 🐛
**Symptom:** User report bug di production, perlu hotfix cepat

**Fix:**
```bash
/fixer

"URGENT: Production bug reported.

Issue: User tidak bisa cancel booking yang sudah DP_PAID
Error: 500 Internal Server Error
Endpoint: POST /api/backoffice/bookings/:id/cancel

Expected: Booking bisa di-cancel dengan refund policy
Actual: Server error, booking tidak ter-cancel

Reproduce:
1. Login as admin
2. Open booking detail (status: DP_PAID)
3. Click Cancel button
4. Error 500 muncul

Logs: [paste error logs dari production]"
```

**Fixer Agent akan:**
1. Analyze production logs
2. Reproduce locally
3. Fix bug dengan minimal changes (hotfix approach)
4. Update dokumen spesifikasi terkait fitur yang difixing sesuai dengan scope fixing yang diberikan oleh user
4. Run regression tests
5. Create fixing log dengan deployment notes

**👤 Human:**
- [ ] Test fix di staging
- [ ] Approve deployment ke production
- [ ] Monitor production logs setelah deploy
- [ ] Notify users bug sudah fixed

---

## 🎯 Success Metrics

**Project dianggap berhasil jika:**
- ✅ Semua spesifikasi di-review & approve manusia
- ✅ Test coverage > 80%
- ✅ Zero critical bugs di production
- ✅ Development logs lengkap (easy onboarding developer baru)
- ✅ Documentation up-to-date
- ✅ Infrastructure well-planned & cost-optimized ⭐ NEW
- ✅ Production deployment smooth dengan monitoring active ⭐ NEW
- ✅ Performance meets SLA (response time, uptime) ⭐ NEW

**AI Agent membantu achieve ini dengan:**
- 🤖 Konsistensi code quality (follow standards)
- 🤖 Dokumentasi otomatis (never outdated)
- 🤖 Fast iteration (spec → code → test dalam 1 hari)
- 🤖 Infrastructure planning data-driven (SysArch Agent) ⭐ NEW
- 🤖 Cost optimization recommendations ⭐ NEW
- 🤖 Performance monitoring & alerting setup ⭐ NEW

**Tapi final quality tetap tanggung jawab Human!** 👤



---

## 📝 Aturan Main (Rules of Engagement)

### **For AI Agents** 🤖
1. **Always Read Context First:**
   - Baca `project_overview.md` sebelum mulai task
   - Baca specification terkait sebelum coding
   - Baca logs terakhir untuk tahu progres

2. **Never Assume:**
   - Jika spec tidak jelas → ASK human clarification
   - Jika ada breaking change → WARN human terlebih dahulu
   - Jika perlu run destructive command → CONFIRM dulu

3. **Document Everything:**
   - Setiap code change harus ada di development log
   - Setiap test run harus ada di testing log
   - Setiap bug fix harus ada di fixing log

### **For Humans** 👤
1. **Don't Edit Logs Manually:**
   - Biarkan Agent yang menulis `logs/development/*.md` dan `logs/testing/*.md`
   - Format konsisten, easy to parse untuk Agent

2. **Always Review Before Approve:**
   - Specifications (apakah sesuai bisnis requirement?)
   - Code (apakah logic benar & secure?)
   - Tests (apakah coverage cukup?)

3. **Read Logs After Break:**
   ```bash
   # Jika baru buka VS Code setelah istirahat
   /developer
   
   "Baca semua logs/development/dev_*.md, 
   summarize progres terakhir dan apa yang pending"
   ```

4. **Terminal Safety:**
   - **⚠️ NEVER** auto-approve terminal commands tanpa review
   - Especially: `rm`, `DROP`, `DELETE`, deployment commands
   - Use Git (easy rollback jika ada masalah)

5. **UI/UX Consistency:**
   - Jika hasil UI jelek/tidak konsisten:
     ```bash
     /analyst
     
     "Update UI/UX Guidelines di project_overview.md.
     Warna button inconsistent, seharusnya pakai Ocean Teal (#0E7490)
     untuk primary button, Sunset Coral (#F97316) untuk CTA"
     ```

6. **Infrastructure Planning:** ⭐ NEW
   - Before production deployment, always consult SysArch Agent
   - Provide accurate data (realistic estimates, not best-case scenario)
   - Consider growth: plan for 6-12 months, not just current needs
   - Budget for monitoring & backups (non-negotiable)
   ```bash
   /sysarch
   
   "Analyze app and design production infrastructure.
   Be conservative with estimates, include 50% growth buffer.
   Budget: $200/month (strict), prioritize reliability over features."
   ```

---

## ⚙️ Customizing Agent Behavior

Jika ingin mengubah cara kerja Agent (misal: Developer pakai TDD strict, atau Analyst harus bikin ERD diagram), edit file di `.github/prompts/`:

### **File Structure:**
```
.github/prompts/
├── initiator.prompt.md      # Aturan buat project_overview.md
├── analyst.prompt.md        # Aturan buat specifications
├── developer.prompt.md      # Coding standards & logging format
├── fixer.prompt.md          # Bug fixing strategy & debugging approach
├── tester.prompt.md         # Testing strategy & coverage requirements
├── sysarch.prompt.md        # Infrastructure planning & deployment ⭐ NEW
└── document.prompt.md       # Documentation format
```

### **Example Modification:**

**File:** `.github/prompts/developer.prompt.md`

**Before:**
```markdown
**CODING STYLE:** Follow Next.js App Router best practices
```

**After:**
```markdown
**CODING STYLE:** 
- Follow Next.js App Router best practices
- MUST use Test-Driven Development (TDD)
- Write test first before implementation
- Minimum test coverage: 90%
```

**Effect:** Developer Agent akan selalu bikin test dulu sebelum coding

---

**File:** `.github/prompts/fixer.prompt.md`

**Customize:**
```markdown
**BUG FIXING PRIORITY:**
1. Security vulnerabilities (CRITICAL - fix within 2 hours)
2. Data loss bugs (HIGH - fix within 4 hours)
3. Payment/financial bugs (HIGH - fix within 4 hours)
4. UI/UX bugs (MEDIUM - fix within 24 hours)
5. Performance issues (LOW - fix within 1 week)

**DEBUGGING APPROACH:**
- Always reproduce bug locally first
- Use git bisect to find regression commit
- Write test case that fails before fix
- Verify test passes after fix
- Check for similar bugs in codebase
```

**Effect:** Fixer Agent akan prioritize bugs berdasarkan severity

---

**File:** `.github/prompts/sysarch.prompt.md` ⭐ NEW

**Customize:**
```markdown
**INFRASTRUCTURE PREFERENCES:**
- Default cloud provider: DigitalOcean (cost-effective for startups)
- Minimum server specs: 2 vCPU, 4GB RAM (never go below this)
- Database: Always use managed database (Supabase/AWS RDS)
- Backups: Daily automated backups, 30 days retention (non-negotiable)
- Monitoring: Free tier tools only (UptimeRobot, Sentry, Papertrail)
- CDN: Optional for MVP, required when traffic > 10k users/month

**COST OPTIMIZATION PRIORITIES:**
1. Data integrity & backups (non-negotiable)
2. Acceptable performance (2-3s page load OK for MVP)
3. 99% uptime (99.9% nice to have)
4. CDN (add later when needed)

**SCALING TRIGGERS:**
- CPU > 70% for 24 hours → Vertical scaling
- RAM > 80% for 24 hours → Vertical scaling
- Response time > 3s → Add caching layer
- Traffic > 1000 concurrent users → Horizontal scaling
```

**Effect:** SysArch Agent akan always recommend cost-effective solutions untuk startup

---

## 🚨 Troubleshooting

### **Problem: Agent Lupa Context**
**Symptom:** Agent buat code yang tidak sesuai dengan project

**Solution:**
```bash
/developer

"STOP. Baca ulang:
1. project_overview.md (tech stack & UI guidelines)
2. specifications/004_spec_pricing.md (requirement)
3. logs/development/dev_003_*.md (code yang sudah ada)

Lalu implementasi ulang dengan benar"
```

---

### **Problem: Specification Terlalu Umum**
**Symptom:** Developer Agent tanya-tanya terus karena spec tidak detail

**Solution:**
```bash
/analyst

"SPEC-005 terlalu general. Breakdown menjadi atomic specifications:
- 005-001: Revenue Summary Card
- 005-002: Profit Trend Chart
- 005-003: Upcoming Trips Timeline

Setiap spec harus punya:
- User story jelas
- API contract lengkap
- UI mockup dengan Tailwind classes"
```

---

### **Problem: Task Status Out of Sync** ⭐ NEW
**Symptom:** task_list.md status tidak sesuai dengan development logs atau test results

**Solution:**
```bash
/pm

"Update task_list.md berdasarkan logs di logs/development/ dan logs/testing/.
Check semua task status dan pastikan sinkron dengan actual progress"
```

**PM Agent akan:**
1. Read all logs di logs/development/ dan logs/testing/
2. Identify completed tasks
3. Update task status accordingly
4. Update "Last Updated" timestamps
5. Generate summary of changes

**Manual Fix (if needed):**
- Edit `task/task_list.md` langsung
- Update status field: `not_started`, `dev`, `ready_to_test`, `testing_ready`, `testing`, `passed`, `failed`
- Update "Last Updated" timestamp: `[YYYY-MM-DD HH:MM]`
- Update "Assigned To" field if task handed off

---

### **Problem: Too Many Tasks, Tidak Tahu Prioritas** ⭐ NEW
**Symptom:** Bingung mau kerjakan task mana dulu

**Solution:**
```bash
/pm

"Tampilkan semua task dengan status 'not_started', 
sort by priority (P0 → P1 → P2 → P3), 
dan cek dependencies"
```

**PM Agent akan:**
1. List all not_started tasks
2. Sort by priority level
3. Show dependencies for each task
4. Recommend next task to work on (no blockers, highest priority)

**👤 Human Decision:**
- Focus on P0 (Critical) tasks first
- Check dependencies (don't start task if dependency not done)
- Consider business impact vs technical complexity

---

### **Problem: Agent Lupa Context**
**Symptom:** Agent buat code yang tidak sesuai dengan project

**Solution:**
```bash
/developer

"STOP. Baca ulang:
1. project_overview.md (tech stack & UI guidelines)
2. specifications/004_spec_pricing.md (requirement)
3. logs/development/dev_003_*.md (code yang sudah ada)

Lalu implementasi ulang dengan benar"
```

---

### **Problem: Specification Terlalu Umum**
**Symptom:** Developer Agent tanya-tanya terus karena spec tidak detail

**Solution:**
```bash
/analyst

"SPEC-005 terlalu general. Breakdown menjadi atomic specifications:
- 005-001: Revenue Summary Card
- 005-002: Profit Trend Chart
- 005-003: Upcoming Trips Timeline

Setiap spec harus punya:
- User story jelas
- API contract lengkap
- UI mockup dengan Tailwind classes"
```

---

### **Problem: Task Status Out of Sync** ⭐ NEW
**Symptom:** task_list.md status tidak sesuai dengan development logs atau test results

**Solution:**
```bash
/pm

"Update task_list.md berdasarkan logs di logs/development/ dan logs/testing/.
Check semua task status dan pastikan sinkron dengan actual progress"
```

**PM Agent akan:**
1. Read all logs di logs/development/ dan logs/testing/
2. Identify completed tasks
3. Update task status accordingly
4. Update "Last Updated" timestamps
5. Generate summary of changes

**Manual Fix (if needed):**
- Edit `task/task_list.md` langsung
- Update status field: `not_started`, `dev`, `ready_to_test`, `testing_ready`, `testing`, `passed`, `failed`
- Update "Last Updated" timestamp: `[YYYY-MM-DD HH:MM]`
- Update "Assigned To" field if task handed off

---

### **Problem: Too Many Tasks, Tidak Tahu Prioritas** ⭐ NEW
**Symptom:** Bingung mau kerjakan task mana dulu

**Solution:**
```bash
/pm

"Tampilkan semua task dengan status 'not_started', 
sort by priority (P0 → P1 → P2 → P3), 
dan cek dependencies"
```

**PM Agent akan:**
1. List all not_started tasks
2. Sort by priority level
3. Show dependencies for each task
4. Recommend next task to work on (no blockers, highest priority)

**👤 Human Decision:**
- Focus on P0 (Critical) tasks first
- Check dependencies (don't start task if dependency not done)
- Consider business impact vs technical complexity

---

### **Problem: Agent Lupa Context**
**Symptom:** Agent buat code yang tidak sesuai dengan project

**Solution:**
```bash
/developer

"STOP. Baca ulang:
1. project_overview.md (tech stack & UI guidelines)
2. specifications/004_spec_pricing.md (requirement)
3. logs/development/dev_003_*.md (code yang sudah ada)

Lalu implementasi ulang dengan benar"
```

---

### **Problem: Specification Terlalu Umum**
**Symptom:** Developer Agent tanya-tanya terus karena spec tidak detail

**Solution:**
```bash
/analyst

"SPEC-005 terlalu general. Breakdown menjadi atomic specifications:
- 005-001: Revenue Summary Card
- 005-002: Profit Trend Chart
- 005-003: Upcoming Trips Timeline

Setiap spec harus punya:
- User story jelas
- API contract lengkap
- UI mockup dengan Tailwind classes"
```

---

### **Problem: Task Status Out of Sync** ⭐ NEW
**Symptom:** task_list.md status tidak sesuai dengan development logs atau test results

**Solution:**
```bash
/pm

"Update task_list.md berdasarkan logs di logs/development/ dan logs/testing/.
Check semua task status dan pastikan sinkron dengan actual progress"
```

**PM Agent akan:**
1. Read all logs di logs/development/ dan logs/testing/
2. Identify completed tasks
3. Update task status accordingly
4. Update "Last Updated" timestamps
5. Generate summary of changes

**Manual Fix (if needed):**
- Edit `task/task_list.md` langsung
- Update status field: `not_started`, `dev`, `ready_to_test`, `testing_ready`, `testing`, `passed`, `failed`
- Update "Last Updated" timestamp: `[YYYY-MM-DD HH:MM]`
- Update "Assigned To" field if task handed off

---

### **Problem: Too Many Tasks, Tidak Tahu Prioritas** ⭐ NEW
**Symptom:** Bingung mau kerjakan task mana dulu

**Solution:**
```bash
/pm

"Tampilkan semua task dengan status 'not_started', 
sort by priority (P0 → P1 → P2 → P3), 
dan cek dependencies"
```

**PM Agent akan:**
1. List all not_started tasks
2. Sort by priority level
3. Show dependencies for each task
4. Recommend next task to work on (no blockers, highest priority)

**👤 Human Decision:**
- Focus on P0 (Critical) tasks first
- Check dependencies (don't start task if dependency not done)
- Consider business impact vs technical complexity

---

## 🎓 Learning Resources

**Untuk memahami lebih dalam cara kerja AI Agent:**

1. **Function Calling / Tool Use:**
   - [OpenAI Function Calling Guide](https://platform.openai.com/docs/guides/function-calling)
   - [Anthropic Claude Tool Use](https://docs.anthropic.com/claude/docs/tool-use)

2. **Prompt Engineering:**
   - [Prompt Engineering Guide](https://www.promptingguide.ai/)
   - [Anthropic Prompt Library](https://docs.anthropic.com/claude/prompt-library)

3. **Agent Frameworks:**
   - [LangChain Agents](https://python.langchain.com/docs/modules/agents/)
   - [AutoGPT](https://github.com/Significant-Gravitas/AutoGPT)

**Best Practice untuk System Instructions:**
- Be specific (jangan ambiguous)
- Give examples (few-shot learning)
- Set constraints (what NOT to do)
- Define success criteria (how to verify output)

---

## 📊 Project Progress Tracking

**Recommended Tools:**
- **Linear / Jira:** Task management (link ke SPEC-xxx)
- **GitHub Projects:** Kanban board per sprint
- **Notion:** Knowledge base (meeting notes, decisions)

**Integration dengan AI Workflow:**
```
GitHub Issue #45: Implement Pricing Module
  ↓
Analyst creates: SPEC-004
  ↓
Developer implements: codes/app/api/pricing/
  ↓
Tester creates: tests/integration/pricing.test.ts
  ↓
Close issue with link to dev log & test results
```

---

## 🤝 Team Collaboration

**Jika tim > 1 person:**

### **Developer Onboarding:**
```bash
# New developer joins team
/developer

"Summarize project_overview.md dan semua specifications 
dalam bentuk onboarding guide untuk new developer.

Include:
- Tech stack & why we choose it
- Folder structure explanation
- How to run project locally
- Common commands
- Where to find documentation"
```

### **Code Review Process:**
1. Developer A → Bikin feature dengan Developer Agent
2. Developer A → Create PR di GitHub
3. Developer B → Review PR (manual)
4. If OK → Merge
5. If NOT → Developer A ask Developer Agent to fix

### **Knowledge Sharing:**
- **Weekly:** Tester Agent generate test coverage report
- **Monthly:** Document Agent generate changelog dari semua dev logs
- **Quarterly:** 
  - Analyst Agent review & update project_overview.md
  - SysArch Agent review infrastructure costs & optimization opportunities ⭐ NEW

---

*Happy Vibe Coding!* 🚀✨

**Remember:** 
- AI Agent = **Accelerator** (makes you 10x faster)
- Human = **Navigator** (makes sure direction is correct)
- SysArch Agent = **Infrastructure Guardian** (keeps costs low, performance high) ⭐ NEW

**Together = Unstoppable** 💪🤖👤
