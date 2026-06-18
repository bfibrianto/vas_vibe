// src/prompts.mjs
// Interactive prompts. Skipped when --yes is passed.

import prompts from 'prompts';
import { isValidProjectName } from './utils.mjs';

export async function runPrompts({ argName, flags }) {
  if (flags.yes) {
    return {
      projectName: argName || 'my-vasvibe-project',
      includeOpencode: flags.opencode !== false,
      includeClaude: flags.claude !== false,
      includeGithub: flags.github !== false,
      includeWorkflows: flags.workflows !== false,
      initGit: flags.git !== false,
      workDepth: flags.depth || 'standard',
    };
  }

  const onCancel = () => {
    console.log('\nAborted.');
    process.exit(1);
  };

  const answers = await prompts(
    [
      {
        type: argName ? null : 'text',
        name: 'projectName',
        message: 'Project name:',
        initial: 'my-vasvibe-project',
        validate: (v) =>
          isValidProjectName(v) ||
          'Use letters, numbers, dot, underscore, or dash. Cannot start with a dot.',
      },
      {
        type: flags.opencode === false ? null : 'toggle',
        name: 'includeOpencode',
        message: 'Include OpenCode commands & skills (.opencode/)?',
        initial: true,
        active: 'yes',
        inactive: 'no',
      },
      {
        type: flags.claude === false ? null : 'toggle',
        name: 'includeClaude',
        message: 'Include Claude agents & skills (.claude/, .agents/)?',
        initial: true,
        active: 'yes',
        inactive: 'no',
      },
      {
        type: flags.github === false ? null : 'toggle',
        name: 'includeGithub',
        message: 'Include GitHub Copilot prompts (.github/prompts/)?',
        initial: true,
        active: 'yes',
        inactive: 'no',
      },
      {
        type: flags.workflows === false ? null : 'toggle',
        name: 'includeWorkflows',
        message: 'Include generic agent workflows (agent/workflows/)?',
        initial: true,
        active: 'yes',
        inactive: 'no',
      },
      {
        type: flags.git === false ? null : 'toggle',
        name: 'initGit',
        message: 'Initialize a git repository?',
        initial: true,
        active: 'yes',
        inactive: 'no',
      },
      {
        type: flags.depth ? null : 'select',
        name: 'workDepth',
        message: 'Default work depth for all agents?',
        hint: 'Can be changed anytime in project_overview.md → ## 7. Project Settings',
        choices: [
          {
            title: 'standard (recommended)',
            description: 'Full spec, unit tests, code review — the default for everyday production development.',
            value: 'standard',
          },
          {
            title: 'fast',
            description: 'Core feature only, skip optional steps (unit tests, full docs, edge cases) — good for prototypes and MVPs.',
            value: 'fast',
          },
          {
            title: 'deep',
            description: 'Maximum thoroughness — full security review, all edge cases, strict validation — for critical systems.',
            value: 'deep',
          },
        ],
        initial: 0,
      },
    ],
    { onCancel },
  );

  return {
    projectName: argName || answers.projectName,
    includeOpencode: flags.opencode === false ? false : answers.includeOpencode ?? true,
    includeClaude: flags.claude === false ? false : answers.includeClaude ?? true,
    includeGithub: flags.github === false ? false : answers.includeGithub ?? true,
    includeWorkflows: flags.workflows === false ? false : answers.includeWorkflows ?? true,
    initGit: flags.git === false ? false : answers.initGit ?? true,
    workDepth: flags.depth || answers.workDepth || 'standard',
  };
}
