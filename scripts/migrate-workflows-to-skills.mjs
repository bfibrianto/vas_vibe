import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workflowsDir = path.join(root, '.agents', 'workflows');
const skillsDir = path.join(root, '.agents', 'skills');

// Mapping of workflow name -> { title, description }
const metadata = {
  'build-feature': {
    title: 'Build Feature',
    description: 'Jalankan Fase 2 (Pengerjaan) — implementasi satu fitur dari spec yang sudah ada.',
  },
  'build-prototype': {
    title: 'Build Prototype',
    description: 'Bangun prototipe UI/UX cepat (frontend-only, data mock) untuk presentasi/menyepakati desain dengan klien — tanpa backend.',
  },
  'daily-standup': {
    title: 'Daily Standup',
    description: 'Ringkasan progres harian per fase + blockers + next actions.',
  },
  'deliver-feature': {
    title: 'Deliver Feature',
    description: 'Meta: jalankan Fase 2 lalu Fase 3 untuk satu fitur (build + test) dengan gate.',
  },
  'explorer': {
    title: 'Explorer Agent — Workflow Detail',
    description: 'Senior Software Architect & Code Analyst untuk eksplorasi dan inventarisasi codebase existing. Gunakan saat bergabung ke project berjalan, handover codebase, atau verifikasi state sebelum build-feature/start-fix.',
  },
  'harden-release': {
    title: 'Harden Release',
    description: 'Jalankan Fase 4 (Hardening) — security + reliability sebelum produksi. Per-release.',
  },
  'load-test': {
    title: 'Load Test',
    description: 'Performance & load testing as code (k6 default, JMeter opsional) — workload model, SLA thresholds, baseline & laporan bottleneck.',
  },
  'logger': {
    title: 'Logger Agent — Workflow Detail',
    description: 'Technical Change Recorder & Analyst untuk mencatat perubahan teknis, bug fix, enhancement, refactor, atau chore ke dalam dev log dan task log.',
  },
  'plan-feature': {
    title: 'Plan Feature',
    description: 'Perencanaan terfokus untuk SATU fitur — hasilkan spesifikasi lengkap (low-entropy) tanpa merencanakan ulang seluruh proyek.',
  },
  'plan-project': {
    title: 'Plan Project',
    description: 'Jalankan Fase 1 (Perencanaan) — hasilkan semua blueprint/acuan dengan human gate.',
  },
  'release': {
    title: 'Release',
    description: 'Rangkaian akhir ke produksi: hardening → changelog → version tag.',
  },
  'security-audit': {
    title: 'Security Audit',
    description: 'Audit keamanan ad-hoc di luar siklus release.',
  },
  'setup-workspace': {
    title: 'Setup Workspace',
    description: 'Setup/optimasi workspace agentik — install skills & konfigurasi MCP untuk tool AI yang dipakai. Re-callable saat pindah tool.',
  },
  'start-fix': {
    title: 'Start Fix',
    description: 'Perbaikan bug terarah: fix → review → regression.',
  },
  'test-feature': {
    title: 'Test Feature',
    description: 'Jalankan Fase 3 (Testing) — E2E test fungsional terhadap spesifikasi.',
  },
};

async function migrate() {
  const files = await fs.readdir(workflowsDir);
  const mdFiles = files.filter((f) => f.endsWith('.md'));

  console.log(`Found ${mdFiles.length} workflow files to migrate in .agents/workflows`);

  for (const file of mdFiles) {
    const name = file.slice(0, -3);
    const srcPath = path.join(workflowsDir, file);
    const content = await fs.readFile(srcPath, 'utf8');

    // Strip existing frontmatter if present
    const bodyWithoutFrontmatter = content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '').trim();

    const info = metadata[name] || {
      title: name.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
      description: `Run the ${name.replace(/-/g, ' ')} workflow in Antigravity.`
    };

    // If body already starts with # Title, don't duplicate title
    let formattedBody = bodyWithoutFrontmatter;
    if (!formattedBody.startsWith('# ')) {
      formattedBody = `# ${info.title}\n\n${formattedBody}`;
    }

    const skillContent = `---
name: ${name}
description: ${info.description}
---

${formattedBody}
`;

    const destDir = path.join(skillsDir, name);
    const destPath = path.join(destDir, 'SKILL.md');

    await fs.mkdir(destDir, { recursive: true });
    await fs.writeFile(destPath, skillContent, 'utf8');
    console.log(`  [created skill] .agents/skills/${name}/SKILL.md`);

    // Safely archive legacy workflow file to .md.bak
    const bakPath = path.join(workflowsDir, `${file}.bak`);
    await fs.rename(srcPath, bakPath);
    console.log(`  [archived]      .agents/workflows/${file} -> ${file}.bak`);
  }

  console.log('\nMigration to Antigravity skills complete.');
}

migrate().catch(console.error);
