// src/upgrade.mjs
// Upgrade an existing vasvibe project: re-copy framework files (agents, schemas,
// workflows) without touching user-generated content (codes/, specifications/,
// task/, state/, project_overview.md, etc.).

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { copyDir, pathExists, log } from './utils.mjs';
import pc from 'picocolors';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_DIR = path.resolve(__dirname, '..', 'template');
const VERSION_FILE = '.vasvibe-version';

// Only these paths are safe to overwrite on upgrade.
// User content (codes/, specifications/, task/, state/, project_overview.md) is never touched.
const FRAMEWORK_PATHS = [
  { src: '.opencode', dest: '.opencode' },
  { src: '.claude', dest: '.claude' },
  { src: '.agents', dest: '.agents' },
  { src: '.github/prompts', dest: '.github/prompts' },
  { src: 'agent', dest: 'agent' },
  { src: 'schemas', dest: 'schemas' },
];

export async function readVersionFile(projectDir) {
  const versionPath = path.join(projectDir, VERSION_FILE);
  try {
    const content = await fs.readFile(versionPath, 'utf8');
    return content.trim();
  } catch {
    return null;
  }
}

export async function writeVersionFile(projectDir, version) {
  await fs.writeFile(path.join(projectDir, VERSION_FILE), version + '\n', 'utf8');
}

export async function isVasvibeProject(projectDir) {
  // A vasvibe project has either .vasvibe-version or at least one agent directory.
  if (await pathExists(path.join(projectDir, VERSION_FILE))) return true;
  if (await pathExists(path.join(projectDir, 'agent/workflows'))) return true;
  if (await pathExists(path.join(projectDir, '.opencode/agents'))) return true;
  return false;
}

export async function upgrade({ targetDir, currentVersion, newVersion, dryRun = false }) {
  if (!(await pathExists(TEMPLATE_DIR))) {
    throw new Error(`Template directory not found at ${TEMPLATE_DIR}.`);
  }

  const updated = [];
  const skipped = [];

  for (const { src, dest } of FRAMEWORK_PATHS) {
    const srcPath = path.join(TEMPLATE_DIR, src);
    const destPath = path.join(targetDir, dest);

    if (!(await pathExists(srcPath))) {
      skipped.push(src);
      continue;
    }
    // Only update if the destination already exists in the project
    // (respect the user's original toolchain choices).
    if (!(await pathExists(destPath))) {
      skipped.push(dest + ' (not in project)');
      continue;
    }

    if (!dryRun) {
      await copyDir(srcPath, destPath);
    }
    updated.push(dest);
  }

  if (!dryRun) {
    await writeVersionFile(targetDir, newVersion);
  }

  return { updated, skipped };
}

export async function runUpgrade({ targetDir, newVersion, dryRun }) {
  const currentVersion = await readVersionFile(targetDir);

  log.blank();
  if (currentVersion) {
    log.info(`Current version: ${pc.yellow(currentVersion)}`);
  } else {
    log.warn('No .vasvibe-version file found — project may have been created before version tracking was added.');
  }
  log.info(`Upgrading to:    ${pc.green(newVersion)}`);
  log.blank();

  if (dryRun) {
    log.step('Dry run — no files will be changed.');
    log.blank();
  }

  const { updated, skipped } = await upgrade({ targetDir, currentVersion, newVersion, dryRun });

  for (const p of updated) {
    log.success(`Updated: ${pc.cyan(p)}`);
  }
  for (const p of skipped) {
    log.step(`Skipped: ${pc.dim(p)}`);
  }

  log.blank();
  if (dryRun) {
    log.info('Run without --dry-run to apply the upgrade.');
  } else {
    log.success(`Upgraded to ${pc.green(newVersion)}`);
    log.blank();
    log.step('Review the changes with ' + pc.cyan('git diff') + ' before committing.');
    log.step('Your codes/, specifications/, task/, and state/ directories were not touched.');
  }
  log.blank();
}
