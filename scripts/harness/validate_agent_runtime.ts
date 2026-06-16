import { readdir, readFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { parse } from 'yaml';

type Registry = {
  runtime?: {
    defaultClaudeAgent?: string;
    activeAgents?: string[];
    deferredAgents?: string[];
    sharedDocAgents?: string[];
  };
  agents?: Record<string, unknown>;
};

async function namesInDir(dir: string, extension: string): Promise<string[]> {
  try {
    const files = await readdir(dir);
    return files
      .filter((file) => file.endsWith(extension))
      .map((file) => basename(file, extension))
      .sort();
  } catch {
    return [];
  }
}

function missing(expected: string[], actual: string[]): string[] {
  const actualSet = new Set(actual);
  return expected.filter((item) => !actualSet.has(item));
}

function parseTomlName(text: string): string | undefined {
  return text.match(/^name\s*=\s*"([^"]+)"/m)?.[1];
}

function parseClaudeFrontmatter(text: string): Record<string, string> | undefined {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return undefined;
  return Object.fromEntries(
    match[1]
      .split('\n')
      .map((line) => line.match(/^([A-Za-z][A-Za-z0-9_-]*):\s*(.*)$/))
      .filter((item): item is RegExpMatchArray => Boolean(item))
      .map((item) => [item[1], item[2].trim()])
  );
}

function parseClaudeAgentTargets(text: string): string[] {
  return [...text.matchAll(/Agent\(([^)]*)\)/g)]
    .flatMap((match) => match[1].split(','))
    .map((item) => item.trim())
    .filter((item) => /^[a-z0-9-]+$/.test(item));
}

export async function validateAgentRuntime(): Promise<string[]> {
  const errors: string[] = [];
  const registry = parse(await readFile('harness/agents/registry.yaml', 'utf8')) as Registry;
  const activeAgents = registry.runtime?.activeAgents ?? [];
  const deferredAgents = registry.runtime?.deferredAgents ?? [];
  const sharedDocAgents = registry.runtime?.sharedDocAgents ?? [];
  const defaultClaudeAgent = registry.runtime?.defaultClaudeAgent;
  const registryAgents = Object.keys(registry.agents ?? {});
  const knownRuntimeAgents = [...new Set([...activeAgents, ...deferredAgents, ...sharedDocAgents])].sort();

  if (!defaultClaudeAgent) {
    errors.push('agent runtime 缺少 defaultClaudeAgent');
  }

  for (const agent of knownRuntimeAgents) {
    if (!registryAgents.includes(agent)) {
      errors.push(`runtime agent 未在 registry.agents 中定义：${agent}`);
    }
  }

  const claudeAgents = await namesInDir('.claude/agents', '.md');
  const codexAgents = await namesInDir('.codex/agents', '.toml');
  const sharedAgents = await namesInDir('agents', '.md');

  for (const agent of missing(activeAgents, claudeAgents)) {
    errors.push(`缺少 Claude active agent 文件：.claude/agents/${agent}.md`);
  }
  for (const agent of missing(activeAgents, codexAgents)) {
    errors.push(`缺少 Codex active agent 文件：.codex/agents/${agent}.toml`);
  }
  for (const agent of missing(sharedDocAgents, sharedAgents)) {
    errors.push(`缺少共享 agent 文档：agents/${agent}.md`);
  }

  const settings = JSON.parse(await readFile('.claude/settings.json', 'utf8')) as { agent?: string };
  if (defaultClaudeAgent && settings.agent !== defaultClaudeAgent) {
    errors.push(`Claude 默认 agent 不一致：settings=${settings.agent ?? '未设置'} registry=${defaultClaudeAgent}`);
  }

  for (const agent of codexAgents) {
    const text = await readFile(join('.codex/agents', `${agent}.toml`), 'utf8');
    const name = parseTomlName(text);
    if (name !== agent) {
      errors.push(`Codex agent name 与文件名不一致：${agent}.toml name=${name ?? '未设置'}`);
    }
    if (/\bGlob\b|\bGrep\b/.test(text)) {
      errors.push(`Codex agent 仍残留 Glob/Grep 工具策略：${agent}.toml`);
    }
  }

  for (const agent of claudeAgents) {
    const path = join('.claude/agents', `${agent}.md`);
    const text = await readFile(path, 'utf8');
    const frontmatter = parseClaudeFrontmatter(text);
    if (!frontmatter) {
      errors.push(`Claude agent 缺少标准 frontmatter：${path}`);
      continue;
    }
    if (frontmatter.name !== agent) {
      errors.push(`Claude agent name 与文件名不一致：${agent}.md name=${frontmatter.name ?? '未设置'}`);
    }
    for (const requiredKey of ['description', 'tools', 'model', 'permissionMode', 'maxTurns']) {
      if (!frontmatter[requiredKey]) errors.push(`Claude agent frontmatter 缺少 ${requiredKey}：${path}`);
    }
    if (/\bGlob\b|\bGrep\b/.test(frontmatter.tools ?? '')) {
      errors.push(`Claude agent tools 仍包含 Glob/Grep：${path}`);
    }
  }

  for (const agent of activeAgents) {
    const path = join('.claude/agents', `${agent}.md`);
    try {
      const text = await readFile(path, 'utf8');
      for (const target of parseClaudeAgentTargets(text)) {
        if (!activeAgents.includes(target)) {
          errors.push(`Claude agent ${agent} 引用了不存在或非 active 的 subagent：${target}`);
        }
      }
    } catch {
      // Missing file already reported above.
    }
  }

  return errors;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const errors = await validateAgentRuntime();
  if (errors.length > 0) {
    for (const error of errors) console.error(`FAIL ${error}`);
    process.exitCode = 1;
  } else {
    console.log('PASS agent runtime 运行面有效');
  }
}
