# 🌊 Vibe Coding Workflow

Selamat datang di ekosistem **Vibe Coding**.
Ini adalah standar alur kerja pengembangan software berbasis **AI Agent** (GitHub Copilot + Claude Sonnet) yang mengutamakan struktur, dokumentasi otomatis, dan validasi berjenjang.

## 🤖 Tentang AI Agent

**AI Agent** adalah sistem cerdas berbasis Large Language Model (LLM) yang dapat mengeksekusi tugas-tugas kompleks secara mandiri dengan menggunakan **tools** (function calling). Berbeda dengan chatbot biasa yang hanya menjawab pertanyaan, AI Agent dapat:

- 🔍 **Membaca & menganalisis** file di workspace
- ✍️ **Menulis & mengedit** kode berdasarkan spesifikasi
- 🔧 **Menjalankan command** di terminal (build, test, deploy)
- 🧠 **Mengambil keputusan** berdasarkan context dan error feedback
- 📝 **Membuat dokumentasi** otomatis dari perubahan yang dilakukan

Dalam workflow ini, kita menggunakan **5 AI Agent persona** yang bekerja secara terspesialisasi (mirip tim development sesungguhnya).

---

## 🚀 Filosofi
1.  **Context is King:** AI tidak bisa bekerja tanpa konteks. `project_overview.md` adalah otak proyek ini.
2.  **Infrastructure First:** Jangan menulis kode fitur sebelum environment (Docker) siap.
3.  **Role Segregation:** Analis, Developer, dan QA adalah persona berbeda dengan tanggung jawab spesifik.
4.  **Log Everything:** Setiap sesi coding dan testing dicatat untuk menjaga kontinuitas memori AI.
5.  **Human-in-the-Loop:** Manusia sebagai Decision Maker, AI sebagai Executor.

---

## 📂 Struktur Direktori Otomatis
Workflow ini akan secara otomatis mengelola struktur folder berikut:

```text
root/
├── .github/
│   └── prompts/              # [BRAIN] System Instructions untuk AI Agent
│       ├── initiator.prompt.md      # Agent: Project Initiator
│       ├── analyst.prompt.md        # Agent: System Analyst
│       ├── developer.prompt.md      # Agent: Software Developer
│       ├── tester.prompt.md         # Agent: QA Tester
│       └── document.prompt.md       # Agent: Technical Writer
│
├── project_overview.md       # [MASTER] Definisi produk, tech stack, & UI/UX
│                             # 👤 HUMAN: Review & approve setelah Initiator Agent buat
│
├── specifications/           # [DOCS] Output dari Analyst Agent
│   ├── README.md            # Index semua spesifikasi
│   ├── 000_spec_environment_setup.md # Infrastruktur (Wajib pertama)
│   ├── 001_spec_database_schema.md
│   ├── 002_spec_authentication.md
│   ├── 003_spec_booking_management.md
│   └── ...                  # 👤 HUMAN: Review setiap spec sebelum dev
│
├── codes/                    # [SRC] Output dari Developer Agent
│   ├── docker-compose.yml
│   ├── package.json
│   ├── prisma/
│   ├── app/                 # Next.js App Router
│   ├── components/
│   └── ...                  # 👤 HUMAN: Code review & testing manual
│
├── tests/                    # [TEST] Output dari Tester Agent
│   ├── unit/
│   ├── integration/
│   └── e2e/                 # 👤 HUMAN: Verify test results
│
├── logs/                     # [TRACKING] Auto-generated logs
│   ├── development/         # Developer Agent logs
│   │   ├── dev_001_database_schema.md
│   │   ├── dev_002_auth_system.md
│   │   └── ...
│   ├── testing/             # Tester Agent logs
│   │   └── test_*.md
│   └── fixing/              # Bug fixing logs
│       └── fixing_*.md
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

Setiap Agent memiliki **system instruction** yang tersimpan di `.github/prompts/` dan dapat dipanggil via slash command.

### 1. **Initiator Agent** (`/initiator`)
**Role:** Project Initiator & Product Manager

**Capabilities:**
- ✅ Mengubah ide kasar menjadi `project_overview.md` yang terstruktur
- ✅ Menentukan tech stack berdasarkan kebutuhan
- ✅ Mendefinisikan UI/UX guidelines (color palette, typography, component library)
- ✅ Membuat development roadmap & timeline

**Input Example:**
```
/initiator

"Aplikasi manajemen booking kapal wisata Labuan Bajo, 
pakai Next.js, harus ada payment gateway dan backoffice 
untuk admin."
```

**Output:**
- `project_overview.md` (complete dengan target audience, tech stack, roadmap)

**👤 Human Task:**
- Review `project_overview.md`
- Approve atau minta revisi (tech stack, UI guidelines, timeline)

---

### 2. **Analyst Agent** (`/analyst`)
**Role:** Lead System Analyst & DevOps Architect

**Capabilities:**
- ✅ Membaca `project_overview.md` untuk context
- ✅ Membuat spesifikasi infrastruktur (Docker, database schema)
- ✅ Membuat spesifikasi fitur (user stories, API contracts, UI mockups)
- ✅ Memecah fitur besar menjadi atomic specifications (1 file = 1 user story)
- ✅ Validasi tech stack sudah terisi sebelum lanjut

**Critical Rule:**
- **WAJIB** membuat `000_spec_environment_setup.md` terlebih dahulu sebelum spec fitur

**Input Example:**
```
/analyst

"Buat spesifikasi untuk fitur Booking Management"
```

**Output:**
- `specifications/004_spec_booking_management.md`
- Atau breakdown menjadi multiple atomic specs jika fitur terlalu besar

**👤 Human Task:**
- Review spesifikasi (apakah sesuai kebutuhan bisnis?)
- Check API contracts & database schema
- Approve sebelum Developer mulai coding

---

### 3. **Developer Agent** (`/developer`)
**Role:** Senior Full-Stack Developer

**Capabilities:**
- ✅ Membaca spesifikasi dari Analyst
- ✅ Menulis kode (frontend, backend, database migration)
- ✅ Mengikuti coding standards & best practices
- ✅ Membuat development log otomatis (`logs/development/dev_*.md`)
- ✅ Menjalankan build & check errors
- ✅ Fixing bugs berdasarkan error feedback

**Input Example:**
```
/developer

"Implementasikan SPEC-004 (Pricing Configuration Module)"
```

**Output:**
- Kode di `codes/` (API routes, components, database schema)
- `logs/development/dev_004_pricing_module.md` (log perubahan)

**👤 Human Task:**
- Code review (check logic, security, performance)
- Manual testing di browser/Postman
- Approve atau minta fixing

---

### 4. **Tester Agent** (`/tester`)
**Role:** QA Engineer & Test Automation Specialist

**Capabilities:**
- ✅ Membuat unit tests, integration tests, E2E tests
- ✅ Menjalankan tests di terminal
- ✅ Menganalisis test failures & memberikan fixing recommendation
- ✅ Membuat testing log (`logs/testing/test_*.md`)
- ✅ Self-healing: Memperbaiki tests yang broken karena code changes

**Input Example:**
```
/tester

"Buat dan jalankan test untuk Pricing Configuration API"
```

**Output:**
- Test files di `tests/`
- Terminal execution results
- `logs/testing/test_004_pricing.md`

**👤 Human Task:**
- Verify test coverage (apakah sudah lengkap?)
- Check test results (all green?)
- Manual exploratory testing untuk edge cases

---

### 5. **Document Agent** (`/document`)
**Role:** Technical Writer

**Capabilities:**
- ✅ Menggabungkan semua specifications menjadi FSD (Functional Specification Document)
- ✅ Generate API documentation
- ✅ Membuat user manual / deployment guide
- ✅ Format markdown yang professional & readable

**Input Example:**
```
/document

"Generate FSD lengkap dari semua specifications"
```

**Output:**
- `documentation/FSD_VasVibe.md`
- `documentation/API_Documentation.md`

**👤 Human Task:**
- Final review dokumentasi
- Share ke stakeholder (investor, klien)

---

## 🤖 Peran & Perintah (Slash Commands)

| Agent | Command | Primary Function | Output | Human Review |
| --- | --- | --- | --- | --- |
| **Initiator** | `/initiator` | Project kickoff & overview | `project_overview.md` | ⚠️ **CRITICAL** |
| **Analyst** | `/analyst` | Technical specifications | `specifications/*.md` | ⚠️ **HIGH** |
| **Developer** | `/developer` | Code implementation | `codes/*`, `logs/development/` | ⚠️ **HIGH** |
| **Tester** | `/tester` | Test automation & QA | `tests/*`, `logs/testing/` | ✅ **MEDIUM** |
| **Document** | `/document` | Final documentation | `documentation/*.md` | ✅ **LOW** |

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

#### **Step 3.2: Implementation (Developer)**

```bash
/developer

"Implementasikan SPEC-003 (Booking Management)"
```

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
/developer

"Ada bug di create booking: DP amount tidak ter-kalkulasi.
Error: totalPrice is undefined di line 45"
```

Agent akan fix dan update log di `logs/fixing/`

#### **Step 3.3: Testing (Tester)**

```bash
/tester

"Buat dan jalankan test untuk Booking Management API"
```

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

### **Phase 4: Documentation** 👤🤖

**Step 6: Generate Final Documentation**

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
# 1. Sync context dengan Agent
/developer

"Baca logs/development/dev_*.md, apa progres terakhir?"
```

**👤 Human:**
- [ ] Review semua changes semalam (git diff)
- [ ] Check error logs (jika ada background process)
- [ ] Prioritize tasks hari ini

---

### **Development Cycle** 🔄

```
[Analyst] → [👤 Review] → [Developer] → [👤 Test] → [Tester] → [👤 Approve]
```

**Per Feature (2-4 hours):**
1. **Analyst:** Create spec (30 min)
2. **👤 Human:** Review & approve spec (15 min)
3. **Developer:** Implement code (1-2 hours)
4. **👤 Human:** Code review + manual test (30 min)
5. **Tester:** Create & run tests (30 min)
6. **👤 Human:** Verify test results (15 min)

**Repeat** untuk fitur berikutnya

---

### **Evening Routine** 🌙

**👤 Human:**
- [ ] Review semua development logs hari ini
- [ ] Commit & push changes ke Git
- [ ] Update project board (Trello/Jira/Linear)
- [ ] Note blocker untuk besok

```bash
# Optional: Minta Agent summarize hari ini
/developer

"Summarize semua development logs hari ini, 
apa saja yang sudah selesai dan apa yang masih pending?"
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

### **4. Test Coverage Rendah** 🧪
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

---

## 🎯 Success Metrics

**Project dianggap berhasil jika:**
- ✅ Semua spesifikasi di-review & approve manusia
- ✅ Test coverage > 80%
- ✅ Zero critical bugs di production
- ✅ Development logs lengkap (easy onboarding developer baru)
- ✅ Documentation up-to-date

**AI Agent membantu achieve ini dengan:**
- 🤖 Konsistensi code quality (follow standards)
- 🤖 Dokumentasi otomatis (never outdated)
- 🤖 Fast iteration (spec → code → test dalam 1 hari)

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

---

## ⚙️ Customizing Agent Behavior

Jika ingin mengubah cara kerja Agent (misal: Developer pakai TDD strict, atau Analyst harus bikin ERD diagram), edit file di `.github/prompts/`:

### **File Structure:**
```
.github/prompts/
├── initiator.prompt.md      # Aturan buat project_overview.md
├── analyst.prompt.md        # Aturan buat specifications
├── developer.prompt.md      # Coding standards & logging format
├── tester.prompt.md         # Testing strategy & coverage requirements
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

### **Problem: Test Gagal Setelah Code Change**
**Symptom:** Tests yang tadinya pass, jadi fail setelah Developer change code

**Solution:**
```bash
/tester

"Tests di test_003_booking.test.ts gagal setelah perubahan API.
Error: 'bookingNumber' field not found.

Analyze code changes di logs/development/dev_003_*.md,
lalu fix tests agar sesuai dengan API schema terbaru"
```

Agent akan self-heal tests

---

### **Problem: Docker Container Tidak Jalan**
**Symptom:** `docker-compose up` error

**👤 Human Debug Steps:**
```bash
# Check logs
docker-compose logs

# Check ports
lsof -i :3000  # Port sudah dipakai app lain?
lsof -i :5432  # PostgreSQL port conflict?

# Rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

**Ask Agent for Help:**
```bash
/developer

"Docker container 'vas_vibe_app' exit dengan code 1.
Logs menunjukkan error: 'Cannot find module prisma/client'.

Analyze docker-compose.yml dan Dockerfile, 
fix missing build steps"
```

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
- **Quarterly:** Analyst Agent review & update project_overview.md

---

*Happy Vibe Coding!* 🚀✨

**Remember:** 
- AI Agent = **Accelerator** (makes you 10x faster)
- Human = **Navigator** (makes sure direction is correct)

**Together = Unstoppable** 💪🤖👤

```
