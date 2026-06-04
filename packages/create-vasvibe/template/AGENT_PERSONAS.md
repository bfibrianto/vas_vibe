## 🤖 AI Agent Personas & Capabilities

Setiap Agent memiliki **system instruction** yang tersimpan di `.github/prompts/` dan dapat dipanggil via slash command.

**Total: 8 Specialized Agents**

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

### 2. **PM Agent** (`/pm`) ⭐ NEW
**Role:** Project Manager & Task Coordinator

**Capabilities:**
- ✅ Membuat dan mengelola task list di `task/task_list.md`
- ✅ Memecah specifications menjadi actionable tasks dengan priority (P0-P3)
- ✅ Tracking status setiap task (not_started → dev → testing → passed)
- ✅ Mengelola dependencies antar task
- ✅ Generate project status reports
- ✅ Monitoring progress dari development logs
- ✅ Mengidentifikasi blockers dan bottlenecks

**When to Use:**
- Setelah Analyst membuat specifications (untuk create task list)
- Saat ingin cek project progress
- Saat perlu update task status setelah development/testing
- Saat planning sprint atau prioritization

**Input Example:**
```
/pm

"Buat task list berdasarkan semua specifications yang sudah ada"
```

**Output:**
- `task/task_list.md` dengan struktur:
  - Priority sections (P0: Critical → P3: Low)
  - Task format: TASK-XXX dengan spec reference, status, dependencies
  - Summary: Total tasks, completed, in progress, blocked
- `task/PROJECT_STATUS_REPORT.md` (jika diminta generate report)

**Task Status Flow:**
```
not_started → dev (Developer working) → ready_to_test (Dev complete)
           → testing_ready (Test scenarios created) → testing (Tester running)
           → passed/failed → human_validated
```

**Priority Levels:**
- **P0 (Critical):** Blockers, production bugs, foundational features
- **P1 (High):** Core features, important bugs
- - **P2 (Medium):** Enhancement, minor features
- **P3 (Low):** Nice-to-have, future improvements

**👤 Human Task:**
- Review task priorities (sesuai bisnis priority?)
- Validate task breakdown (granularity OK?)
- Approve task assignments
- Manual validation setelah task passed (human_validated status)

**Workflow Integration:**
```
[Analyst] Create specs → [PM] Generate task list
  ↓
[Developer] Pick task → Update status: dev → ready_to_test
  ↓
[Tester] Create tests → Update status: testing_ready → testing → passed
  ↓
[PM] Monitor progress → Generate status reports
```

---

### 3. **Analyst Agent** (`/analyst`)
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

**Workflow Integration:**
```
[Analyst] Create specification
  ↓
[PM] Create task from spec → Add to task/task_list.md
  ↓
[Developer] Pick task and implement
```

---

### 4. **Developer Agent** (`/developer`)
**Role:** Senior Full-Stack Developer

**Capabilities:**
- ✅ Membaca spesifikasi dari Analyst
- ✅ Menulis kode (frontend, backend, database migration)
- ✅ Mengikuti coding standards & best practices
- ✅ Membuat development log otomatis (`logs/development/dev_*.md`)
- ✅ Menjalankan build & check errors
- ✅ Fixing bugs berdasarkan error feedback
- ✅ **Update task status** di `task/task_list.md` (not_started → dev → ready_to_test)

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

**Task Management Workflow:**
```
[Developer] Read task/task_list.md → Find task with status "not_started"
  ↓
[Developer] Update status: not_started → dev (set "Assigned To: Developer Agent")
  ↓
[Developer] Implement feature → Create development log
  ↓
[Developer] Update status: dev → ready_to_test (with timestamp)
```

---

### 5. **Tester Agent** (`/tester`)
**Role:** QA Engineer & Test Automation Specialist

**Capabilities:**
- ✅ Membuat unit tests, integration tests, E2E tests
- ✅ Menjalankan tests di terminal
- ✅ Menganalisis test failures & memberikan fixing recommendation
- ✅ Membuat testing log (`logs/testing/test_*.md`)
- ✅ Self-healing: Memperbaiki tests yang broken karena code changes
- ✅ **Update task status** di `task/task_list.md` (ready_to_test → testing_ready → testing → passed/failed)

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

**Task Management Workflow:**
```
[Tester] Read task/task_list.md → Find task with status "ready_to_test"
  ↓
[Tester] Create test scenarios → Update status: ready_to_test → testing_ready
  ↓
[Tester] Run tests → Update status: testing_ready → testing
  ↓
[Tester] Check results → Update status: testing → passed (or failed)
```

---

### 6. **Fixer Agent** (`/fixer`)
**Role:** Bug Hunter & Debugging Specialist

**Capabilities:**
- ✅ Menganalisis error messages (compile errors, runtime errors, test failures)
- ✅ Membaca stack trace dan pinpoint root cause
- ✅ Memperbaiki bugs dengan minimal side effects
- ✅ Membuat fixing log (`logs/fixing/fixing_*.md`)
- ✅ Validasi fix dengan menjalankan tests
- ✅ Regression testing (pastikan fix tidak break fitur lain)
- ✅ **Update task status** di `task/task_list.md` (failed → fixing → ready_to_test)

**When to Use:**
- Setelah Developer bikin code tapi ada errors
- Setelah Tester report bugs
- Production bugs yang perlu hotfix
- Build failures di CI/CD

**Input Example:**
```
/fixer

"Ada bug di create booking: DP amount tidak ter-kalkulasi.
Error: Cannot read property 'totalPrice' of undefined
File: app/api/backoffice/bookings/route.ts:45

Error terjadi saat user submit booking form dengan pax > 10"
```

**Output:**
- Fixed code di `codes/`
- `logs/fixing/fixing_003_booking_dp_calculation.md` (detailed analysis + solution)
- Test execution result (verify fix works)

**👤 Human Task:**
- Verify fix logic (apakah benar-benar solve root cause?)
- Check for side effects (fitur lain masih jalan?)
- Manual testing dengan scenario yang sama
- Approve atau minta alternative solution

**Workflow Integration:**
```
Developer creates code → Error found
  ↓
Fixer analyzes → Fix bug → Run tests
  ↓
All green? → Done ✅
Not green? → Iterate fix
```

**Task Management Workflow:**
```
[Tester] Find bugs → Update task status: passed → failed
  ↓
[Fixer] Read task/task_list.md → Find task with status "failed"
  ↓
[Fixer] Update status: failed → fixing (set "Assigned To: Fixer Agent")
  ↓
[Fixer] Fix bugs → Create fixing log
  ↓
[Fixer] Update status: fixing → ready_to_test (back to Tester)
```

---

### 7. **SysArch Agent** (`/sysarch`)
**Role:** System Architecture & Operations Specialist

**Capabilities:**
- ✅ Menganalisis application requirements dari codebase dan specifications
- ✅ Mendesain server specifications (CPU, RAM, Storage, Bandwidth)
- ✅ Merencanakan infrastructure architecture (dev, staging, production)
- ✅ Mengestimasi resource requirements & costs
- ✅ Merekomendasikan deployment strategies (VPS, cloud, containerized)
- ✅ Membuat operational guidelines (monitoring, backup, scaling, disaster recovery)
- ✅ Mengoptimasi biaya infrastruktur

**When to Use:**
- Sebelum deployment ke production (infrastructure planning)
- Saat aplikasi mulai lambat (performance analysis & scaling recommendation)
- Saat budget review (cost optimization analysis)
- Saat planning capacity untuk high season

**Input Example:**
```
/sysarch

"Analyze current codebase and design server specifications 
for production deployment. Target: 100 concurrent users, 
50 bookings/day, 99.9% uptime."
```

**Output:**
- `architecture/current_state.md` - Application analysis
- `architecture/server_specifications.md` - Detailed server specs
- `architecture/deployment_plan.md` - Step-by-step deployment guide
- `architecture/cost_analysis.md` - Infrastructure cost breakdown
- `architecture/monitoring_plan.md` - Observability & alerting setup

**👤 Human Task:**
- Jawab questions tentang load requirements (concurrent users, transactions, etc.)
- Review server specifications (sesuai budget?)
- Approve deployment plan
- Check cost estimates (sustainable?)
- Decide cloud provider preference

**Critical Questions SysArch Will Ask:**
1. **User Load:** Concurrent users, growth rate, peak season multiplier
2. **Transaction Volume:** Bookings/day, payments/day, API requests/min
3. **Data & Storage:** File uploads, data retention, backup requirements
4. **Performance:** API response time, page load time, CDN needs
5. **Availability:** Uptime target (99%, 99.9%, 99.99%), HA requirements
6. **Budget:** Monthly infrastructure budget, cloud provider preference
7. **Security:** SSL, WAF, DDoS protection, compliance (PCI-DSS, GDPR, UU PDP)

**Example Workflow:**
```
[SysArch] Ask requirements → [👤 Human] Answer questions
  ↓
[SysArch] Analyze codebase → Design architecture
  ↓
[SysArch] Create specs & deployment plan → [👤 Human] Review & Approve
  ↓
[Developer/SysArch] Deploy to production
  ↓
[SysArch] Setup monitoring → [👤 Human] Monitor metrics
```

---

### 8. **Document Agent** (`/document`)
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
| **PM** | `/pm` | Task management & coordination | `task/task_list.md`, `task/PROJECT_STATUS_REPORT.md` | ✅ **MEDIUM** |
| **Analyst** | `/analyst` | Technical specifications | `specifications/*.md` | ⚠️ **HIGH** |
| **Developer** | `/developer` | Code implementation | `codes/*`, `logs/development/` | ⚠️ **HIGH** |
| **Tester** | `/tester` | Test automation & QA | `tests/*`, `logs/testing/` | ✅ **MEDIUM** |
| **Fixer** | `/fixer` | Bug fixing & debugging | `codes/*`, `logs/fixing/` | ⚠️ **HIGH** |
| **SysArch** | `/sysarch` | Infrastructure & deployment planning | `architecture/*` | ⚠️ **CRITICAL** |
| **Document** | `/document` | Final documentation | `documentation/*.md` | ✅ **LOW** |

---
