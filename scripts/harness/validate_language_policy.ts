import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const requiredChineseFiles = [
  'README.md',
  'AGENTS.md',
  'CLAUDE.md',
  'harness/README.md',
  'openspec/README.md'
];

const requiredChineseDirs = ['agents', 'skills', '.claude/agents', '.claude/skills', '.codex/agents', 'harness'];
const checkedExtensions = new Set(['.md', '.toml']);

function hasChinese(text: string): boolean {
  return /[\u4e00-\u9fff]/.test(text);
}

function hasCheckedExtension(path: string): boolean {
  return [...checkedExtensions].some((extension) => path.endsWith(extension));
}

async function collectDocFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  const files: string[] = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectDocFiles(path)));
    } else if (entry.isFile() && hasCheckedExtension(path)) {
      files.push(path);
    }
  }
  return files.sort();
}

export async function validateLanguagePolicy(): Promise<string[]> {
  const errors: string[] = [];
  const docFiles = [
    ...requiredChineseFiles,
    ...(await Promise.all(requiredChineseDirs.map((dir) => collectDocFiles(dir)))).flat()
  ];
  for (const path of [...new Set(docFiles)]) {
    try {
      const text = await readFile(path, 'utf8');
      if (!hasChinese(text)) errors.push(`缺少中文内容：${path}`);
    } catch {
      errors.push(`无法读取中文规约文件：${path}`);
    }
  }
  return errors;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const errors = await validateLanguagePolicy();
  if (errors.length > 0) {
    for (const error of errors) console.error(`FAIL ${error}`);
    process.exitCode = 1;
  } else {
    console.log('PASS 中文规约快速检查通过');
  }
}
