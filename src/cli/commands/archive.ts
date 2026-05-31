import { access } from 'node:fs/promises';
import { Command } from 'commander';

export function archiveCommand(): Command {
  return new Command('archive')
    .description('归档 OpenSpec change；第一版仅检查 change 存在并提示人工合并')
    .argument('<change-id>', '变更 id')
    .action(async (changeId: string) => {
      const path = `openspec/changes/${changeId}`;
      await access(path);
      console.log(`BLOCKED ${path} 存在；第一版 archive 保留人工合并 TODO，未移动目录`);
    });
}
