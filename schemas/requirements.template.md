# REQUIREMENTS — [Project Name]

**Owner Agent:** Discovery
**Date:** [YYYY-MM-DD HH:MM]
**Phase:** Planning (hulu)
**Mode:** `greenfield` / `brownfield`
**Status:** `Gathering` / `Approved`
**Interview round:** [n] — progres disimpan tiap ronde agar bisa dilanjutkan

> Hasil requirement gathering dengan human. Acuan paling hulu — menjadi input Initiator untuk `project_overview.md`. Perubahan lewat `_shared/change-management.md`.
> Setiap kebutuhan punya ID stabil (`FR-001`, `NFR-001`) yang dirujuk oleh overview, spesifikasi, dan task. ID tidak pernah dipakai ulang — kebutuhan yang dibatalkan ditandai `Dropped`.

---

## 0. Sources
| Sumber | Jenis | Catatan |
|--------|-------|---------|
| Wawancara human | interview | ronde 1–n |
| [state/knowledge_base/codebase/inventory.md] | codebase (brownfield) | |
| [path/link dokumen] | PRD / notulen / brief | |

## 1. Problem & Goals
- **Masalah:** [masalah yang diselesaikan]
- **Kenapa sekarang:** [urgensi/konteks]
- **Definisi sukses (metrik):** [bagaimana tahu ini berhasil — angka bila bisa]

## 2. Stakeholders & Users
| Persona / Stakeholder | Peran | Konteks / Pain | Kebutuhan utama |
|-----------------------|-------|----------------|-----------------|
| [Admin] | user | | |
| [End user] | user | | |
| [Product owner] | decision maker | | |

## 3. Current State (As-Is) — *brownfield only*
> Ringkasan dari codebase yang sudah dikonfirmasi human. Detail teknis di `state/knowledge_base/codebase/inventory.md`.

| ID | Kapabilitas existing | Status | Bukti | Catatan human |
|----|----------------------|--------|-------|---------------|
| FR-001 | [Login email/password] | Implemented / Partial / Broken | [path] | |

- **Pain point sistem sekarang:** [apa yang menyakitkan bagi user/tim]
- **Yang TIDAK boleh berubah:** [kontrak/perilaku yang dipakai pihak lain]

## 4. Scope (To-Be)
| ID | Kebutuhan | Prioritas (MoSCoW) | Acceptance criteria singkat |
|----|-----------|--------------------|-----------------------------|
| FR-0xx | | Must | |
| FR-0xx | | Should | |
| FR-0xx | | Could | |

- **Out of scope (eksplisit / Won't):** [yang TIDAK dikerjakan]

## 5. Key Flows
- [Alur utama 1 — aktor → langkah → hasil] (FR-xxx)
- [Alur utama 2]

## 6. Non-Functional Requirements
| ID | Kategori | Target | Catatan |
|----|----------|--------|---------|
| NFR-001 | Skala/Beban | [user, concurrent, transaksi] | |
| NFR-002 | Performa | [p95 response time] | |
| NFR-003 | Security & Compliance | [UU PDP / GDPR / PCI-DSS] | |
| NFR-004 | Availability | [uptime target] | |
| NFR-005 | Budget | | |

## 7. Constraints
- **Tech preferences:** [stack yang diinginkan/dihindari; brownfield: stack existing dipertahankan?]
- **Sistem existing / integrasi wajib:**
- **Timeline & tim:**

## 8. Data & Integrations
- **Data sensitif:** [PII, finansial, dll]
- **Integrasi pihak ketiga:** [payment, auth, notifikasi, dll]

## 9. Glossary
| Istilah | Arti di domain ini |
|---------|--------------------|
| | |

## 10. Assumptions
- [A-1] [Asumsi — cara verifikasi]

## 11. Open Questions
- [ ] [Q-1] [Pertanyaan] — *blocking?* ya/tidak

## 12. Risks
| Risiko | Dampak | Mitigasi awal |
|--------|--------|---------------|
| | | |

## 13. Definition of Ready (cek sebelum sign-off)
- [ ] Problem, goals & metrik sukses terisi
- [ ] Setiap persona punya kebutuhan utama
- [ ] Setiap `Must` punya acceptance criteria singkat
- [ ] Out of scope eksplisit
- [ ] NFR skala, performa, security terisi (atau ditandai N/A dengan alasan)
- [ ] Brownfield: semua `[unknown]` dari Explorer sudah dijawab atau dicatat di Open Questions
- [ ] Tidak ada Open Question yang *blocking*

## Revision History
| Timestamp | Agen | Perubahan |
|-----------|------|-----------|
| [YYYY-MM-DD HH:MM] | Discovery | Initial requirements gathered |
