import { getChangedFiles } from './changed_files.js';

const localOnlyPatterns = [
  /^\.env(?:\.|$)/,
  /^\.mcp\.json$/,
  /^\.claude\/settings\.local\.json$/,
  /^\.codex\/local\.json$/,
  /^tmp\/agent_logs\//,
  /^tmp\/quality\//,
  /^node_modules\//,
  /^\.venv\//
];

function normalizePath(value: string): string {
  return value.replace(/^\.\//, '').replace(/\\/g, '/');
}

export function isLocalOnlyPath(path: string): boolean {
  const normalized = normalizePath(path);
  return localOnlyPatterns.some((pattern) => pattern.test(normalized));
}

async function readStdin(): Promise<string> {
  if (process.stdin.isTTY) return '';
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf8');
}

function pathsFromText(text: string): string[] {
  return [...text.matchAll(/(?:^|[\s"'])((?:\.\/)?(?:\.env[\w.-]*|\.mcp\.json|\.claude\/settings\.local\.json|\.codex\/local\.json|tmp\/agent_logs\/[^\s"']+|tmp\/quality\/[^\s"']+|node_modules\/[^\s"']+|\.venv\/[^\s"']+))/g)]
    .map((match) => match[1])
    .filter(Boolean);
}

export async function collectLocalOnlyCandidates(args: string[]): Promise<string[]> {
  const stdin = await readStdin();
  const changed = await getChangedFiles().catch(() => []);
  return [...args, ...pathsFromText(stdin), ...changed.map((item) => item.path)];
}

export async function validateLocalOnlyAccess(args = process.argv.slice(2)): Promise<string[]> {
  const candidates = await collectLocalOnlyCandidates(args);
  return [...new Set(candidates.map(normalizePath).filter(isLocalOnlyPath))];
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const blocked = await validateLocalOnlyAccess();
  if (blocked.length > 0) {
    for (const path of blocked) console.error(`BLOCKED local-only 路径禁止读取、输出或提交：${path}`);
    process.exitCode = 1;
  } else {
    console.log('PASS local-only 检查通过');
  }
}
