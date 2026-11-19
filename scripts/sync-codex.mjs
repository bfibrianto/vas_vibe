// Generate Codex subagents and explicitly invokable workflow skills from the
// canonical VasVibe workflow files.
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workflowsDir = path.join(root, 'agent', 'workflows');
const codexAgentsDir = path.join(root, '.codex', 'agents');
const skillsDir = path.join(root, '.agents', 'skills');
const commandDir = path.join(root, '.agents', 'workflows');

const names = (await fs.readdir(workflowsDir))
  .filter((name) => name.endsWith('.md'))
  .map((name) => name.slice(0, -3));

await fs.mkdir(codexAgentsDir, { recursive: true });
for (const name of names) {
  const instructions = `You are the VasVibe ${name} specialist. Read and follow the canonical instructions in agent/workflows/${name}.md. Follow shared rules in agent/workflows/_shared/ when relevant. Keep the parent agent informed with a concise report of decisions, changed files, and validation.`;
  const toml = `name = ${JSON.stringify(`vasvibe_${name.replaceAll('-', '_')}`)}\n` +
    `description = ${JSON.stringify(`VasVibe ${name} specialist. Use for tasks assigned to this workflow persona.`)}\n` +
    `developer_instructions = ${JSON.stringify(instructions)}\n`;
  await fs.writeFile(path.join(codexAgentsDir, `${name}.toml`), toml, 'utf8');
}

const commandNames = new Set([
  'build-feature', 'build-prototype', 'daily-standup', 'deliver-feature', 'discover-project',
  'harden-release', 'load-test', 'manual-test-vascomm', 'plan-feature', 'plan-project', 'release',
  'security-audit', 'setup-workspace', 'start-fix', 'test-feature',
]);

for (const command of commandNames) {
  let source;
  const skillSourcePath = path.join(skillsDir, command, 'SKILL.md');
  const legacyWorkflowPath = path.join(commandDir, `${command}.md`);
  const bakWorkflowPath = path.join(commandDir, `${command}.md.bak`);

  try {
    source = await fs.readFile(skillSourcePath, 'utf8');
  } catch {
    try {
      source = await fs.readFile(legacyWorkflowPath, 'utf8');
    } catch {
      source = await fs.readFile(bakWorkflowPath, 'utf8');
    }
  }
  source = source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
  source = source.replace(/using Task tool \(Claude Code\) \/ agent invocation \(OpenCode\)/gi,
    'by invoking the configured Codex custom subagent named vasvibe_<persona> (for example, PM → vasvibe_pm)');
  source = source.replace(/Task tool \(Claude Code\) \/ agent invocation \(OpenCode\)/gi,
    'the configured Codex custom subagent named vasvibe_<persona>');

  const skillName = `vasvibe-${command}`;
  const description = `Run the VasVibe ${command.replaceAll('-', ' ')} workflow with its approval gates.`;
  const skillBody = `---\nname: ${skillName}\ndescription: ${description}\n---\n\n${source.trim()}\n\nFor delegation, invoke the configured Codex custom subagent named vasvibe_<persona> (for example, PM → vasvibe_pm). Keep interactive discovery and every human approval gate in the main conversation.\n`;
  const destDir = path.join(skillsDir, skillName);
  await fs.mkdir(destDir, { recursive: true });
  await fs.writeFile(path.join(destDir, 'SKILL.md'), skillBody, 'utf8');
}

// Each canonical persona can also be activated as a skill in the current
// conversation, while the TOML files above make the same personas delegatable.
for (const name of names) {
  const skillName = `vasvibe-agent-${name}`;
  const description = `Apply the VasVibe ${name} persona instructions to the current task.`;
  const body = `---\nname: ${skillName}\ndescription: ${description}\n---\n\nAct as the VasVibe ${name} specialist. Read and follow agent/workflows/${name}.md and relevant shared rules in agent/workflows/_shared/. Keep the user informed at workflow gates and report concrete outputs, changed files, and unresolved blockers.\n`;
  const destDir = path.join(skillsDir, skillName);
  await fs.mkdir(destDir, { recursive: true });
  await fs.writeFile(path.join(destDir, 'SKILL.md'), body, 'utf8');
}

console.log(`Generated ${names.length} Codex custom agents and ${commandNames.size + names.length} Codex skills.`);
