import { access } from 'node:fs/promises';
import { getChangedFiles } from './changed_files.js';

const protectedPrefixes = [
  '.claude/',
  '.codex/',
  'openspec/',
  'harness/',
  'scripts/',
  'src/foundation/',
  'src/registry/',
  'src/renderer/',
  'src/components/',
  'src/patterns/',
  'tests/'
];

const protectedFiles = new Set(['CLAUDE.md', 'AGENTS.md']);

function normalizePath(value: string): string {
  return value.replace(/^\.\//, '').replace(/\\/g, '/');
}

export function isProtectedPath(path: string): boolean {
  const normalized = normalizePath(path);
  return protectedFiles.has(normalized) || protectedPrefixes.some((prefix) => normalized.startsWith(prefix));
}

function changeIdsFromPaths(paths: string[]): string[] {
  return [
    ...new Set(
      paths
        .map((path) => normalizePath(path).match(/^openspec\/changes\/([^/]+)\//)?.[1])
        .filter((value): value is string => Boolean(value))
    )
  ];
}

function changeIdFromArgs(args: string[]): string | undefined {
  const index = args.indexOf('--change-id');
  if (index >= 0) return args[index + 1];
  return process.env.CHANGE_ID || process.env.OPENSPEC_CHANGE_ID;
}

async function changeExists(changeId: string): Promise<boolean> {
  try {
    await access(`openspec/changes/${changeId}`);
    return true;
  } catch {
    return false;
  }
}

export async function validateProtectedPathAccess(args = process.argv.slice(2)): Promise<string[]> {
  const changed = await getChangedFiles().catch(() => []);
  const paths = [...args.filter((arg) => !arg.startsWith('--')), ...changed.map((item) => item.path)].map(normalizePath);
  const protectedPaths = [...new Set(paths.filter(isProtectedPath))];
  if (protectedPaths.length === 0) return [];

  const explicitChangeId = changeIdFromArgs(args);
  const inferredChangeIds = changeIdsFromPaths(paths);
  const activeChangeIds = [...new Set([explicitChangeId, ...inferredChangeIds].filter(Boolean) as string[])];
  for (const changeId of activeChangeIds) {
    if (await changeExists(changeId)) return [];
  }

  return protectedPaths;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const blocked = await validateProtectedPathAccess();
  if (blocked.length > 0) {
    for (const path of blocked) {
      console.error(`BLOCKED 受保护路径需要活跃 OpenSpec change：${path}`);
    }
    console.error('下一步：先创建 openspec/changes/<change-id>/ 并传入 --change-id <change-id>');
    process.exitCode = 1;
  } else {
    console.log('PASS 受保护路径检查通过');
  }
}
