// src/scaffold.mjs
// Copy the bundled template into the target directory, applying selective
// includes and small file transforms (rename, placeholder replacement).

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { copyDir, removePath, replaceInFile, pathExists } from './utils.mjs';
import { writeVersionFile } from './upgrade.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// packages/create-vasvibe/src → packages/create-vasvibe/template
const TEMPLATE_DIR = path.resolve(__dirname, '..', 'template');

const TOOLCHAIN_PATHS = {
  opencode: ['.opencode'],
  claude: ['.claude', '.agents'],
  github: ['.github'],
  workflows: ['agent'],
};

export async function scaffold({
  targetDir,
  projectName,
  version,
  workDepth = 'standard',
  includeOpencode,
  includeClaude,
  includeGithub,
  includeWorkflows,
}) {
  if (!(await pathExists(TEMPLATE_DIR))) {
    throw new Error(
      `Template directory not found at ${TEMPLATE_DIR}. ` +
        `If you are running from source, run "npm run sync-template" first.`,
    );
  }

  await fs.mkdir(targetDir, { recursive: true });

  // 1. Copy entire template tree.
  await copyDir(TEMPLATE_DIR, targetDir);

  // 2. Apply toolchain filters (delete excluded folders).
  if (!includeOpencode) await removeAll(targetDir, TOOLCHAIN_PATHS.opencode);
  if (!includeClaude) await removeAll(targetDir, TOOLCHAIN_PATHS.claude);
  if (!includeGithub) await removeAll(targetDir, TOOLCHAIN_PATHS.github);
  if (!includeWorkflows) await removeAll(targetDir, TOOLCHAIN_PATHS.workflows);

  // 3. Rename _gitignore -> .gitignore (npm strips real .gitignore from packages).
  const gi = path.join(targetDir, '_gitignore');
  if (await pathExists(gi)) {
    await fs.rename(gi, path.join(targetDir, '.gitignore'));
  }

  // 4. Replace placeholders in well-known files.
  const year = String(new Date().getFullYear());
  const replacements = { projectName, year, workDepth };
  for (const rel of ['README.md', 'PROJECT_README.example.md', '.gitignore', 'AGENT_PERSONAS.md', 'GIT_STRUCTURE_GUIDE.md', 'project_overview_example.md']) {
    const f = path.join(targetDir, rel);
    if (await pathExists(f)) await replaceInFile(f, replacements);
  }

  // 5. Write version tracking file.
  if (version) {
    await writeVersionFile(targetDir, version);
  }
}

async function removeAll(targetDir, relPaths) {
  for (const rel of relPaths) {
    await removePath(path.join(targetDir, rel));
  }
}
