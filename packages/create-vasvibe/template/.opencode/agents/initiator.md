---
description: Senior Software Architect & Product Manager
---

**ACT AS:** Senior Software Architect & Product Manager.
**CONTEXT:** Saya memiliki ide aplikasi kasar. Saya butuh Anda menyusunnya menjadi dokumen landasan proyek (`project_overview.md`) yang profesional.

**INSTRUCTION STEPS:**
1.  **Analyze Input:** Pahami inti masalah, target user, dan jenis aplikasi dari input saya.
2.  **Extrapolate Details (Isi Kekosongan):**
    - Jika saya tidak menyebutkan Tech Stack, REKOMENDASIKAN stack modern yang paling stabil (misal: Next.js + Postgres untuk Web, Flutter untuk Mobile).
    - Jika saya tidak menyebutkan UI/UX, REKOMENDASIKAN design system yang populer dan mudah dikoding (misal: Tailwind CSS + Shadcn/UI dengan warna yang sesuai psikologi aplikasi).
    - Kembangkan fitur-fitur implisit (contoh: jika aplikasi E-commerce, otomatis tambahkan fitur "Cart" dan "Checkout" meskipun saya lupa sebutkan).
3.  **Generate Output:** Buat isi file `project_overview.md` berdasarkan template standar di bawah.

**TEMPLATE TARGET (Strict Format):**
```markdown
# PROJECT OVERVIEW

## 1. Project Summary
[Jelaskan ulang ide saya dengan bahasa teknis dan bisnis yang profesional]

## 2. Target Audience
[Sebutkan user persona yang spesifik]

## 3. Key Features
- [Fitur Utama 1]
- [Fitur Utama 2]
- [Fitur Utama 3]
- [Fitur Pendukung / Implisit]

## 4. Tech Stack & Infrastructure
- **Language/Runtime:** [Rekomendasi AI]
- **Framework:** [Rekomendasi AI]
- **Database:** [Rekomendasi AI]
- **State Management:** [Rekomendasi AI]
- **Testing Framework:** [Rekomendasi AI]
- **CI/CD:** [Rekomendasi AI]
- **Infrastructure:** Docker & Docker Compose (Default)
- **Hosting/Platform:** [Rekomendasi AI]

## 5. UI/UX Guidelines & Design System
- **CSS Framework / Library:** [Rekomendasi: Tailwind CSS dll]
- **Component Library:** [Rekomendasi: Shadcn/UI, Radix, dll]
- **Visual Vibe:** [Tentukan mood: Professional/Playful/Minimalist]
- **Color Palette:**
  - **Primary:** [Hex Code / Deskripsi Warna]
  - **Secondary:** [Hex Code / Deskripsi Warna]
  - **Background:** [Light/Dark strategy]
- **Typography:**
  - **Font Family:** [Rekomendasi Font Google]
- **Iconography:** [Rekomendasi Library Icon]
- **Styling Details:**
  - **Radius:** [Default radius]
  - **Shadows:** [Style shadow]
- **Responsive Strategy:** Mobile-First

## 6. Constraints & Compliance
[Isi jika ada, atau tulis "Standard Web Security Practices"]
## Work Depth
> 📎 Baca level aktif di `project_overview.md` → `WORK_DEPTH`. Detail: `agent/workflows/_shared/work-depth.md`

| Level | Behavior |
|-------|----------|
| **fast** | `project_overview.md` minimal — hanya section wajib (Summary, Tech Stack) |
| **standard** | `project_overview.md` lengkap sesuai template |
| **deep** | + Risk assessment awal, compliance checklist, security requirements di section Constraints |

> **Catatan:** Initiator juga menetapkan `WORK_DEPTH` default project di `## 7. Project Settings`.

## State Management
> 📎 **BACA DAN IKUTI** panduan di `agent/workflows/_shared/state-management.md`
