import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Command } from 'commander';

const files = ['proposal.md', 'design.md', 'tasks.md', 'qa-report.md'] as const;

async function readTemplate(file: string): Promise<string> {
  return readFile(join('openspec/templates/change', file), 'utf8');
}

export function changeCommand(): Command {
  return new Command('change')
    .description('创建 OpenSpec-style change 骨架')
    .argument('<change-id>', '变更 id')
    .option('--area <area>', '规格域', 'harness')
    .action(async (changeId: string, options: { area: string }) => {
      const root = join('openspec/changes', changeId);
      await mkdir(join(root, 'specs', options.area), { recursive: true });
      for (const file of files) {
        await writeFile(join(root, file), await readTemplate(file));
      }
      await writeFile(join(root, 'specs', options.area, 'spec.md'), await readTemplate('delta-spec.md'));
      console.log(`已创建 change：${root}`);
    });
}
