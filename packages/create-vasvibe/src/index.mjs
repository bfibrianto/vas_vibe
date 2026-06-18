// src/index.mjs
// Main orchestrator: parse args, prompt, scaffold, git init, print next steps.

import path from 'node:path';
import { promises as fs } from 'node:fs';
import { runPrompts } from './prompts.mjs';
import { scaffold } from './scaffold.mjs';
import { initRepo } from './git.mjs';
import { log, pathExists, isDirEmpty, isValidProjectName } from './utils.mjs';
import { isVasvibeProject, runUpgrade } from './upgrade.mjs';
import pc from 'picocolors';

const HELP = `
${pc.bold('create-vasvibe')} — scaffold a project with VasVibe agents preconfigured

${pc.bold('Usage:')}
  npx create-vasvibe <project-name> [options]
  npx create-vasvibe upgrade [path]         Upgrade agent files in an existing project

${pc.bold('Options:')}
  -y, --yes          Skip prompts and use defaults
      --no-git       Do not initialize a git repository
      --no-opencode  Exclude .opencode/ (commands, skills)
      --no-claude    Exclude .claude/ and .agents/
      --no-github    Exclude .github/prompts/
      --no-workflows Exclude agent/workflows/
      --dry-run      (upgrade only) Show what would change without writing files
  -h, --help         Show this help
  -v, --version      Print version

${pc.bold('Examples:')}
  npx create-vasvibe my-app
  npx create-vasvibe my-app --yes --no-claude --no-github
  npx create-vasvibe upgrade              Upgrade current directory
  npx create-vasvibe upgrade ./my-app     Upgrade specific project
  npx create-vasvibe upgrade --dry-run    Preview upgrade without writing
`;

function parseArgs(argv) {
  const args = argv.slice(2);
  const flags = {
    yes: false,
    git: true,
    opencode: true,
    claude: true,
    github: true,
    workflows: true,
    help: false,
    version: false,
    dryRun: false,
  };
  const positional = [];

  for (const a of args) {
    switch (a) {
      case '-y':
      case '--yes':
        flags.yes = true;
        break;
      case '--dry-run':
        flags.dryRun = true;
        break;
      case '--no-git':
        flags.git = false;
        break;
      case '--no-opencode':
        flags.opencode = false;
        break;
      case '--no-claude':
        flags.claude = false;
        break;
      case '--no-github':
        flags.github = false;
        break;
      case '--no-workflows':
        flags.workflows = false;
        break;
      case '-h':
      case '--help':
        flags.help = true;
        break;
      case '-v':
      case '--version':
        flags.version = true;
        break;
      default:
        if (a.startsWith('-')) {
          log.error(`Unknown flag: ${a}`);
          console.log(HELP);
          process.exit(1);
        }
        positional.push(a);
    }
  }

  return { positional, flags };
}

async function readPkg() {
  const url = new URL('../package.json', import.meta.url);
  const raw = await fs.readFile(url, 'utf8');
  return JSON.parse(raw);
}

export async function main(argv) {
  const { positional, flags } = parseArgs(argv);

  if (flags.help) {
    console.log(HELP);
    return;
  }
  if (flags.version) {
    const pkg = await readPkg();
    console.log(pkg.version);
    return;
  }

  // --- Upgrade subcommand ---
  if (positional[0] === 'upgrade') {
    const pkg = await readPkg();
    const targetDir = positional[1]
      ? path.resolve(process.cwd(), positional[1])
      : process.cwd();

    if (!(await isVasvibeProject(targetDir))) {
      log.error(`No vasvibe project found at ${targetDir}`);
      log.step('Run this command from inside a vasvibe project directory.');
      process.exit(1);
    }

    log.title('\n  create-vasvibe upgrade\n');
    try {
      await runUpgrade({ targetDir, newVersion: pkg.version, dryRun: flags.dryRun });
    } catch (err) {
      log.error(`Upgrade failed: ${err.message}`);
      process.exit(1);
    }
    return;
  }

  // --- Scaffold subcommand (default) ---
  const argInput = positional[0];
  // The arg may be a path (e.g. /tmp/foo or ./foo); use its basename as the
  // logical project name, and resolve the full path as the target directory.
  const argName = argInput ? path.basename(argInput) : undefined;
  if (argName && !isValidProjectName(argName)) {
    log.error(
      `Invalid project name "${argName}". Use letters, numbers, dot, underscore, or dash, and do not start with a dot.`,
    );
    process.exit(1);
  }

  log.title('\n  create-vasvibe\n');

  const answers = await runPrompts({ argName, flags });
  const projectName = answers.projectName;
  const targetDir = argInput
    ? path.resolve(process.cwd(), argInput)
    : path.resolve(process.cwd(), projectName);

  // Safety: target must not exist or must be empty.
  if (await pathExists(targetDir)) {
    if (!(await isDirEmpty(targetDir))) {
      log.error(`Target directory "${projectName}" already exists and is not empty.`);
      log.step(`To update agent files in an existing project, use: ${pc.cyan('npx create-vasvibe upgrade')}`);
      process.exit(1);
    }
  }

  const pkg = await readPkg();

  log.blank();
  log.step(`Scaffolding into ${pc.cyan(targetDir)}`);

  try {
    await scaffold({
      targetDir,
      projectName,
      version: pkg.version,
      includeOpencode: answers.includeOpencode,
      includeClaude: answers.includeClaude,
      includeGithub: answers.includeGithub,
      includeWorkflows: answers.includeWorkflows,
    });
    log.success('Template files copied');
  } catch (err) {
    log.error(`Scaffold failed: ${err.message}`);
    process.exit(1);
  }

  if (answers.initGit) {
    const r = await initRepo(targetDir);
    if (r.ok) {
      log.success(r.warning ? `git initialized (${r.warning.trim().split('\n')[0]})` : 'Git repository initialized');
    } else {
      log.warn(`Skipped git init: ${r.reason}`);
    }
  }

  printNextSteps({ projectName, includeOpencode: answers.includeOpencode });
}

function printNextSteps({ projectName, includeOpencode }) {
  log.blank();
  log.title('  Done! Next steps:\n');
  console.log(`  ${pc.cyan(`cd ${projectName}`)}`);
  if (includeOpencode) {
    console.log(`  ${pc.dim('# Create opencode.json with your AI provider config')}`);
    console.log(`  ${pc.dim('# (see https://opencode.ai/docs for details)')}`);
  }
  console.log(`  ${pc.dim('# Add code under codes/, specs under specifications/, tests under tests/')}`);
  log.blank();
  console.log(pc.dim('  Happy building.'));
  log.blank();
}
