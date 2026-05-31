import { readFile } from 'node:fs/promises';

const requiredChineseFiles = [
  'README.md',
  'AGENTS.md',
  'CLAUDE.md',
  'harness/README.md',
  'openspec/README.md'
];

function hasChinese(text: string): boolean {
  return /[\u4e00-\u9fff]/.test(text);
}

export async function validateLanguagePolicy(): Promise<string[]> {
  const errors: string[] = [];
  for (const path of requiredChineseFiles) {
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
