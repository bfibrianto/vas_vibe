// scripts/sync-template.mjs
// Sync agent assets from the repo root into packages/create-vasvibe/template/.
// Run before publishing, or any time the source assets change.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PKG_DIR = path.resolve(__dirname, '..');           // packages/create-vasvibe
const REPO_ROOT = path.resolve(PKG_DIR, '..', '..');     // repo root
const TEMPLATE_DIR = path.resolve(PKG_DIR, 'template');

// Static files that ship from the package (not synced from root).
const STATIC_FILES = new Set([
  'README.md',
  '_gitignore',
  'PROJECT_README.example.md',
  'codes/.gitkeep',
  'specifications/.gitkeep',
  'tests/.gitkeep',
]);

// Per-source filter functions. Return false to skip a path.
function noNodeModules(srcPath) {
  if (srcPath.includes(`${path.sep}node_modules${path.sep}`) || srcPath.endsWith(`${path.sep}node_modules`)) return false;
  // Strip Python build artifacts that ship inside some skills.
  if (srcPath.includes(`${path.sep}__pycache__${path.sep}`) || srcPath.endsWith(`${path.sep}__pycache__`)) return false;
  if (srcPath.endsWith('.pyc') || srcPath.endsWith('.pyo')) return false;
  // Strip macOS metadata.
  if (path.basename(srcPath) === '.DS_Store') return false;
  return true;
}

function opencodeFilter(srcPath) {
  if (!noNodeModules(srcPath)) return false;
  const base = path.basename(srcPath);
  // Exclude local-only files inside .opencode/.
  if (['package.json', 'bun.lock', '.gitignore'].includes(base)) {
    // Only skip when at the .opencode/ root level.
    const parent = path.basename(path.dirname(srcPath));
    if (parent === '.opencode') return false;
  }
  return true;
}

const SOURCES = [
  { src: '.agents', dest: '.agents', filter: noNodeModules },
  { src: '.claude', dest: '.claude', filter: noNodeModules },
  { src: '.opencode', dest: '.opencode', filter: opencodeFilter },
  { src: '.github/prompts', dest: '.github/prompts', filter: noNodeModules },
  { src: 'agent/workflows', dest: 'agent/workflows', filter: noNodeModules },
  { src: 'project_overview_example.md', dest: 'project_overview_example.md' },
  { src: 'skills-lock.json', dest: 'skills-lock.json' },
  { src: 'GIT_STRUCTURE_GUIDE.md', dest: 'GIT_STRUCTURE_GUIDE.md' },
];

async function pathExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function copyRecursive(src, dest, filter) {
  const stat = await fs.lstat(src);

  if (stat.isSymbolicLink()) {
    const real = await fs.realpath(src);
    return copyRecursive(real, dest, filter);
  }

  if (stat.isDirectory()) {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });
    for (const entry of entries) {
      const s = path.join(src, entry.name);
      const d = path.join(dest, entry.name);
      if (filter && filter(s) === false) continue;
      await copyRecursive(s, d, filter);
    }
  } else if (stat.isFile()) {
    if (filter && filter(src) === false) return;
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.copyFile(src, dest);
  }
}

async function cleanTemplateExceptStatic() {
  if (!(await pathExists(TEMPLATE_DIR))) {
    await fs.mkdir(TEMPLATE_DIR, { recursive: true });
    return;
  }
  // Snapshot static files first.
  const preserved = new Map();
  for (const rel of STATIC_FILES) {
    const p = path.join(TEMPLATE_DIR, rel);
    if (await pathExists(p)) {
      preserved.set(rel, await fs.readFile(p));
    }
  }
  // Wipe template.
  await fs.rm(TEMPLATE_DIR, { recursive: true, force: true });
  await fs.mkdir(TEMPLATE_DIR, { recursive: true });
  // Restore.
  for (const [rel, buf] of preserved) {
    const dest = path.join(TEMPLATE_DIR, rel);
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.writeFile(dest, buf);
  }
}

async function ensureGitkeeps() {
  for (const rel of ['codes/.gitkeep', 'specifications/.gitkeep', 'tests/.gitkeep']) {
    const p = path.join(TEMPLATE_DIR, rel);
    if (!(await pathExists(p))) {
      await fs.mkdir(path.dirname(p), { recursive: true });
      await fs.writeFile(p, '# Keep this folder tracked by git\n');
    }
  }
}

async function main() {
  console.log(`Syncing template from ${REPO_ROOT}`);
  console.log(`               into ${TEMPLATE_DIR}`);

  await cleanTemplateExceptStatic();

  for (const { src, dest, filter } of SOURCES) {
    const srcPath = path.join(REPO_ROOT, src);
    const destPath = path.join(TEMPLATE_DIR, dest);
    if (!(await pathExists(srcPath))) {
      console.warn(`  skip (missing): ${src}`);
      continue;
    }
    await copyRecursive(srcPath, destPath, filter);
    console.log(`  synced: ${src}`);
  }

  await ensureGitkeeps();

  console.log('Template sync complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
