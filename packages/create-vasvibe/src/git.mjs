// src/git.mjs
// Run git commands in the scaffolded project, gracefully ignoring failures.

import { spawn } from 'node:child_process';

function run(cmd, args, opts = {}) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      ...opts,
    });
    let stderr = '';
    child.stderr.on('data', (d) => (stderr += d.toString()));
    child.on('error', () => resolve({ ok: false, code: -1, stderr }));
    child.on('close', (code) => resolve({ ok: code === 0, code, stderr }));
  });
}

export async function gitAvailable() {
  const r = await run('git', ['--version']);
  return r.ok;
}

export async function initRepo(cwd) {
  if (!(await gitAvailable())) return { ok: false, reason: 'git not available' };

  const init = await run('git', ['init', '-b', 'main'], { cwd });
  if (!init.ok) {
    // Fallback for git <2.28 without -b flag.
    const initFallback = await run('git', ['init'], { cwd });
    if (!initFallback.ok) return { ok: false, reason: initFallback.stderr || 'git init failed' };
  }

  const add = await run('git', ['add', '.'], { cwd });
  if (!add.ok) return { ok: false, reason: add.stderr || 'git add failed' };

  const commit = await run(
    'git',
    ['commit', '-m', 'chore: initial scaffold from create-vasvibe', '--no-gpg-sign'],
    { cwd },
  );
  if (!commit.ok) {
    // Likely user.email / user.name not configured. Don't hard-fail.
    return { ok: true, warning: commit.stderr || 'commit skipped' };
  }
  return { ok: true };
}
