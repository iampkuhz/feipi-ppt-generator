import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const config = {
  forbiddenTerms: [] as string[],
  allowedGenericTerms: ['template', 'template pack', 'default', 'sample']
};

const roots = ['src', 'docs', 'examples', 'tests', 'openspec', 'skills', 'agents'];
const hits: string[] = [];

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(path)));
    } else {
      files.push(path);
    }
  }
  return files;
}

for (const root of roots) {
  for (const file of await walk(root)) {
    const content = await readFile(file, 'utf8');
    for (const term of config.forbiddenTerms) {
      if (content.includes(term) && !config.allowedGenericTerms.includes(term)) {
        hits.push(`${file}: ${term}`);
      }
    }
  }
}

if (hits.length > 0) {
  console.error(hits.join('\n'));
  process.exit(1);
}

console.log('No template identity leaks found.');
