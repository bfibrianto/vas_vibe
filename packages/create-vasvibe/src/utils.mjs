// src/utils.mjs
// Small utility helpers: logger, fs ops, placeholder substitution.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import pc from 'picocolors';

export const log = {
  info: (msg) => console.log(pc.cyan('ℹ'), msg),
  success: (msg) => console.log(pc.green('✔'), msg),
  warn: (msg) => console.log(pc.yellow('⚠'), msg),
  error: (msg) => console.error(pc.red('✖'), msg),
  step: (msg) => console.log(pc.dim('›'), msg),
  blank: () => console.log(''),
  raw: (msg) => console.log(msg),
  title: (msg) => console.log(pc.bold(pc.magenta(msg))),
};

export async function pathExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

export async function isDirEmpty(dir) {
  try {
    const entries = await fs.readdir(dir);
    return entries.length === 0;
  } catch {
    return true;
  }
}

/**
 * Recursively copy `src` directory into `dest`.
 * Optional `filter(srcPath, relPath)` returns false to skip an entry.
 */
export async function copyDir(src, dest, filter) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    const rel = path.relative(src, srcPath);
    if (filter && filter(srcPath, rel) === false) continue;

    if (entry.isSymbolicLink()) {
      // Resolve symlink target and copy the resolved file/dir.
      const real = await fs.realpath(srcPath);
      const stat = await fs.stat(real);
      if (stat.isDirectory()) {
        await copyDir(real, destPath, filter);
      } else {
        await fs.copyFile(real, destPath);
      }
    } else if (entry.isDirectory()) {
      await copyDir(srcPath, destPath, filter);
    } else if (entry.isFile()) {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

export async function removePath(p) {
  await fs.rm(p, { recursive: true, force: true });
}

/**
 * Replace {{placeholder}} occurrences in a file in-place.
 */
export async function replaceInFile(filePath, replacements) {
  let content = await fs.readFile(filePath, 'utf8');
  for (const [key, value] of Object.entries(replacements)) {
    const re = new RegExp(`{{\\s*${escapeRegExp(key)}\\s*}}`, 'g');
    content = content.replace(re, value);
  }
  await fs.writeFile(filePath, content, 'utf8');
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function isValidProjectName(name) {
  if (!name) return false;
  // Allow simple folder names; npm-style restrictions where helpful.
  return /^[a-zA-Z0-9._-]+$/.test(name) && !name.startsWith('.');
}
