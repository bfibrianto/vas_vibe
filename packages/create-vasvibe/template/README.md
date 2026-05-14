# {{projectName}}

Project ini di-scaffold dengan [`create-vasvibe`](https://www.npmjs.com/package/create-vasvibe), starter base yang sudah disiapkan dengan agent prompts (Claude, OpenCode, GitHub Copilot) dan struktur folder kerja standar tim.

## Struktur folder

```
{{projectName}}/
├── .agents/                # Skills bersama (developer, pm, find-skills, dll)
├── .claude/                # Claude Code agents & skills
├── .opencode/              # OpenCode commands & skills
├── .github/prompts/        # GitHub Copilot prompt files
├── agent/workflows/        # Workflow markdown agnostik tooling
├── codes/                  # Source code (di-gitignore by default)
├── specifications/         # Dokumen spek teknis (di-gitignore by default)
├── tests/                  # Test files (di-gitignore by default)
├── project_overview_example.md
├── skills-lock.json
├── GIT_STRUCTURE_GUIDE.md
└── PROJECT_README.example.md
```

## Mulai

1. **Konfigurasi AI provider untuk OpenCode** (opsional)

   Buat `opencode.json` di root project sesuai panduan di https://opencode.ai/docs.

2. **Mulai develop**

   - Tulis `project_overview.md` di root (contoh tersedia di `project_overview_example.md`).
   - Letakkan source code di `codes/`.
   - Letakkan dokumen spek di `specifications/`.
   - Letakkan test di `tests/`.

3. **Pakai agent**

   - Claude Code: agent tersedia di `.claude/agents/`.
   - OpenCode: command tersedia di `.opencode/commands/`.
   - GitHub Copilot: prompt files di `.github/prompts/`.

## Catatan tracking git

Folder `codes/`, `specifications/`, dan `tests/` di-track secara struktur (lewat `.gitkeep`) tetapi isinya di-`gitignore` by default. Lihat `GIT_STRUCTURE_GUIDE.md` untuk detailnya, atau ubah `.gitignore` sesuai kebutuhan project.

## Contoh project nyata

Lihat `PROJECT_README.example.md` untuk contoh README project nyata yang dibangun dengan starter ini (VasVibe).

---

Generated {{year}}.
